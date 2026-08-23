import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { AuditAction, Permission, Prisma } from '@prisma/client';
import {
  CORE_PERMISSIONS,
  CORE_ROLES,
  DEFAULT_SUPER_ADMIN_ROLE,
} from './access-control.seed';
import {
  ACCOUNT_LOCKOUT_MINUTES,
  DEFAULT_SESSION_TTL_DAYS,
  MAX_FAILED_LOGIN_ATTEMPTS,
} from './auth.constants';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {
  generateSessionToken,
  hashPassword,
  hashSessionToken,
  normalizeEmail,
  verifyPassword,
} from './utils/auth-crypto.util';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedUser } from './interfaces/authenticated-user.interface';
import { AuditLogService } from '../audit-log/audit-log.service';

const userWithAccessInclude = {
  role: {
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
    },
  },
} as const;

type UserWithAccess = Prisma.UtilisateurGetPayload<{
  include: typeof userWithAccessInclude;
}>;

type SessionWithUser = Prisma.AuthSessionGetPayload<{
  include: {
    user: {
      include: typeof userWithAccessInclude;
    };
  };
}>;

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async onModuleInit(): Promise<void> {
    if (!this.shouldBootstrapAccessControl()) {
      return;
    }

    await this.seedAccessControl();
    await this.seedDefaultAdmin();
  }

  async login(
    dto: LoginDto,
    ipAddress?: string | null,
  ): Promise<{
    accessToken: string;
    tokenType: 'Bearer';
    expiresAt: string;
    user: AuthenticatedUser;
  }> {
    const email = typeof dto.mail === 'string' ? normalizeEmail(dto.mail) : '';
    const password = typeof dto.password === 'string' ? dto.password : '';

    if (!email || !password.trim()) {
      throw new BadRequestException('Mail and password are required.');
    }

    const user = await this.prisma.utilisateur.findUnique({
      where: { mail: email },
      include: userWithAccessInclude,
    });

    if (user && this.isAccountLocked(user)) {
      await this.recordLoginAttempt(null, ipAddress, 401, {
        reason: 'account_locked',
        mail: email,
      });

      throw new ForbiddenException(
        'Account temporarily locked after too many failed attempts. Try again later.',
      );
    }

    if (!user || !verifyPassword(password, user.password)) {
      if (user) {
        await this.registerFailedAttempt(user.id, user.failedLoginAttempts);
      }

      await this.recordLoginAttempt(user?.id ?? null, ipAddress, 401, {
        reason: 'invalid_credentials',
        mail: email,
      });

      throw new UnauthorizedException('Invalid credentials.');
    }

    if (user.failedLoginAttempts > 0 || user.lockedUntil) {
      await this.prisma.utilisateur.update({
        where: { id: user.id },
        data: { failedLoginAttempts: 0, lockedUntil: null },
      });
    }

    const session = await this.createSession(user.id);
    await this.recordLoginAttempt(user.id, ipAddress, 201, {
      action: 'login',
    });

    return {
      accessToken: session.accessToken,
      tokenType: 'Bearer',
      expiresAt: session.expiresAt.toISOString(),
      user: this.toAuthenticatedUser(user),
    };
  }

  private isAccountLocked(user: UserWithAccess): boolean {
    return Boolean(user.lockedUntil && user.lockedUntil.getTime() > Date.now());
  }

  private async registerFailedAttempt(
    userId: number,
    currentAttempts: number,
  ): Promise<void> {
    const attempts = currentAttempts + 1;
    const shouldLock = attempts >= MAX_FAILED_LOGIN_ATTEMPTS;

    await this.prisma.utilisateur.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: shouldLock ? 0 : attempts,
        lockedUntil: shouldLock
          ? new Date(Date.now() + ACCOUNT_LOCKOUT_MINUTES * 60 * 1000)
          : null,
      },
    });
  }

  private async recordLoginAttempt(
    userId: number | null,
    ipAddress: string | null | undefined,
    statusCode: number,
    metadata: Record<string, unknown>,
  ): Promise<void> {
    await this.auditLogService.log({
      userId,
      action:
        statusCode >= 200 && statusCode < 300
          ? AuditAction.login
          : AuditAction.login_failed,
      entity: 'auth',
      method: 'POST',
      path: '/auth/login',
      statusCode,
      ipAddress,
      metadata: metadata as Prisma.InputJsonValue,
    });
  }

  async authenticateSessionToken(token: string): Promise<AuthenticatedUser> {
    if (!token?.trim()) {
      throw new UnauthorizedException('Session token is required.');
    }

    const tokenHash = hashSessionToken(token);
    const session = await this.prisma.authSession.findUnique({
      where: { tokenHash },
      include: {
        user: {
          include: userWithAccessInclude,
        },
      },
    });

    if (!session || !this.isSessionActive(session)) {
      throw new UnauthorizedException('Session is invalid or expired.');
    }

    await this.prisma.authSession.update({
      where: { id: session.id },
      data: { lastUsedAt: new Date() },
    });

    return this.toAuthenticatedUser(session.user);
  }

  async logout(token: string): Promise<void> {
    if (!token?.trim()) {
      throw new BadRequestException('Session token is required.');
    }

    const tokenHash = hashSessionToken(token);
    const session = await this.prisma.authSession.findUnique({
      where: { tokenHash },
    });

    if (!session) {
      return;
    }

    if (session.revokedAt) {
      return;
    }

    await this.prisma.authSession.update({
      where: { id: session.id },
      data: { revokedAt: new Date() },
    });

    await this.auditLogService.log({
      userId: session.userId,
      action: AuditAction.logout,
      entity: 'auth',
      method: 'POST',
      path: '/auth/logout',
      statusCode: 200,
    });
  }

  async updateProfile(
    userId: number,
    dto: UpdateProfileDto,
  ): Promise<AuthenticatedUser> {
    const user = await this.prisma.utilisateur.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    const data: Prisma.UtilisateurUpdateInput = {};

    if (dto.nom !== undefined) {
      const nom = dto.nom.trim();
      if (!nom) {
        throw new BadRequestException('nom cannot be empty.');
      }
      data.nom = nom;
    }

    if (dto.prenom !== undefined) {
      const prenom = dto.prenom.trim();
      if (!prenom) {
        throw new BadRequestException('prenom cannot be empty.');
      }
      data.prenom = prenom;
    }

    if (dto.phone !== undefined) {
      data.phone = dto.phone?.trim() || null;
    }

    if (dto.avatar !== undefined) {
      data.avatar = dto.avatar?.trim() || null;
    }

    if (dto.newPassword !== undefined) {
      if (
        !dto.currentPassword ||
        !verifyPassword(dto.currentPassword, user.password)
      ) {
        throw new UnauthorizedException('Current password is incorrect.');
      }

      if (dto.newPassword.trim().length < 8) {
        throw new BadRequestException(
          'newPassword must be at least 8 characters long.',
        );
      }

      data.password = hashPassword(dto.newPassword.trim());
      data.mustChangePassword = false;
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields were provided for update.');
    }

    const updated = await this.prisma.utilisateur.update({
      where: { id: userId },
      data,
      include: userWithAccessInclude,
    });

    await this.auditLogService.log({
      userId,
      action: AuditAction.update,
      entity: 'auth',
      entityId: String(userId),
      method: 'PATCH',
      path: '/auth/me',
      statusCode: 200,
    });

    return this.toAuthenticatedUser(updated);
  }

  private shouldBootstrapAccessControl(): boolean {
    return process.env.SEED_ACCESS_CONTROL !== 'false';
  }

  private async seedAccessControl(): Promise<void> {
    const permissionByCode = new Map<string, Permission>();

    for (const permissionSeed of CORE_PERMISSIONS) {
      const permission = await this.prisma.permission.upsert({
        where: { code: permissionSeed.code },
        create: permissionSeed,
        update: {
          label: permissionSeed.label,
          description: permissionSeed.description,
        },
      });

      permissionByCode.set(permission.code, permission);
    }

    for (const roleSeed of CORE_ROLES) {
      const missingPermissions = roleSeed.permissionCodes.filter(
        (permissionCode) => !permissionByCode.has(permissionCode),
      );

      if (missingPermissions.length > 0) {
        throw new BadRequestException(
          `Unknown permissions in seed for role ${roleSeed.name}: ${missingPermissions.join(', ')}`,
        );
      }

      const role = await this.prisma.role.upsert({
        where: { name: roleSeed.name },
        create: {
          name: roleSeed.name,
          label: roleSeed.label,
          description: roleSeed.description,
        },
        update: {
          label: roleSeed.label,
          description: roleSeed.description,
        },
      });

      await this.prisma.rolePermission.deleteMany({
        where: { roleId: role.id },
      });

      await this.prisma.rolePermission.createMany({
        data: roleSeed.permissionCodes.map((permissionCode) => {
          const permission = permissionByCode.get(permissionCode);

          if (!permission) {
            throw new BadRequestException(
              `Permission ${permissionCode} is missing from seed data.`,
            );
          }

          return {
            roleId: role.id,
            permissionId: permission.id,
          };
        }),
      });
    }
  }

  private async seedDefaultAdmin(): Promise<void> {
    const email = normalizeEmail(process.env.DEFAULT_ADMIN_EMAIL ?? '');
    const password = process.env.DEFAULT_ADMIN_PASSWORD?.trim();

    if (!email || !password) {
      return;
    }

    const roleName =
      process.env.DEFAULT_ADMIN_ROLE?.trim() || DEFAULT_SUPER_ADMIN_ROLE;
    const role =
      (await this.prisma.role.findUnique({
        where: { name: roleName },
      })) ??
      (await this.prisma.role.findUnique({
        where: { name: DEFAULT_SUPER_ADMIN_ROLE },
      }));

    if (!role) {
      throw new BadRequestException('Default admin role is not available.');
    }

    const existingUser = await this.prisma.utilisateur.findUnique({
      where: { mail: email },
    });

    if (existingUser) {
      return;
    }

    await this.prisma.utilisateur.create({
      data: {
        nom: process.env.DEFAULT_ADMIN_NOM?.trim() || 'Admin',
        prenom: process.env.DEFAULT_ADMIN_PRENOM?.trim() || 'Super',
        mail: email,
        phone: process.env.DEFAULT_ADMIN_PHONE?.trim() || null,
        avatar: process.env.DEFAULT_ADMIN_AVATAR?.trim() || null,
        password: hashPassword(password),
        roleId: role.id,
      },
    });
  }

  private async createSession(userId: number): Promise<{
    accessToken: string;
    expiresAt: Date;
  }> {
    const ttlDays = this.getSessionTtlDays();
    const accessToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);

    await this.prisma.authSession.create({
      data: {
        userId,
        tokenHash: hashSessionToken(accessToken),
        expiresAt,
      },
    });

    return {
      accessToken,
      expiresAt,
    };
  }

  private getSessionTtlDays(): number {
    const configured = Number(
      process.env.AUTH_SESSION_TTL_DAYS ?? DEFAULT_SESSION_TTL_DAYS,
    );

    if (!Number.isFinite(configured) || configured <= 0) {
      return DEFAULT_SESSION_TTL_DAYS;
    }

    return configured;
  }

  private isSessionActive(session: SessionWithUser): boolean {
    if (session.revokedAt) {
      return false;
    }

    return session.expiresAt.getTime() > Date.now();
  }

  private toAuthenticatedUser(user: UserWithAccess): AuthenticatedUser {
    const permissions =
      user.role?.permissions
        .map((rolePermission) => rolePermission.permission.code)
        .filter((permissionCode): permissionCode is string =>
          Boolean(permissionCode),
        ) ?? [];

    return {
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      mail: user.mail,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role
        ? {
            id: user.role.id,
            name: user.role.name,
            label: user.role.label,
            description: user.role.description ?? null,
          }
        : null,
      permissions,
    };
  }
}
