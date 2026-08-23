import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import {
  normalizeEmail,
  hashPassword,
} from '../../auth/utils/auth-crypto.util';
import { PrismaService } from '../../prisma/prisma.service';
import {
  normalizeOptionalInteger as normalizeOptionalIntegerBase,
  normalizeOptionalString,
  normalizeRequiredString,
} from '../../common/utils/normalize.util';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';

const userWithRoleInclude = {
  role: true,
} as const;

type UserWithRole = Prisma.UtilisateurGetPayload<{
  include: typeof userWithRoleInclude;
}>;

type UserListFilters = {
  search?: string;
  roleId?: string;
};

export interface UtilisateurRoleSummary {
  id: number;
  name: string;
  label: string;
  description: string | null;
}

export interface UtilisateurAdminView {
  id: number;
  nom: string;
  prenom: string;
  mail: string;
  phone: string | null;
  avatar: string | null;
  roleId: number | null;
  createdAt: Date;
  updatedAt: Date;
  role: UtilisateurRoleSummary | null;
}

function normalizeOptionalInteger(value: unknown): number | null | undefined {
  return normalizeOptionalIntegerBase(value, 'roleId');
}

function normalizeEmailValue(value: unknown): string {
  const email = normalizeRequiredString(value, 'mail');
  return normalizeEmail(email);
}

@Injectable()
export class UtilisateursService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    filters: UserListFilters = {},
  ): Promise<UtilisateurAdminView[]> {
    const search = normalizeOptionalString(filters.search);
    const roleId = normalizeOptionalInteger(filters.roleId);

    const users = await this.prisma.utilisateur.findMany({
      where: {
        ...(roleId === undefined ? {} : { roleId }),
        ...(search
          ? {
              OR: [
                { nom: { contains: search, mode: 'insensitive' as const } },
                { prenom: { contains: search, mode: 'insensitive' as const } },
                { mail: { contains: search, mode: 'insensitive' as const } },
                { phone: { contains: search, mode: 'insensitive' as const } },
              ],
            }
          : {}),
      },
      include: userWithRoleInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users.map((user) => this.toAdminView(user));
  }

  async listRoles(): Promise<UtilisateurRoleSummary[]> {
    const roles = await this.prisma.role.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return roles.map((role) => this.toRoleSummary(role));
  }

  async findOne(id: number): Promise<UtilisateurAdminView> {
    const user = await this.prisma.utilisateur.findUnique({
      where: { id },
      include: userWithRoleInclude,
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur ${id} not found.`);
    }

    return this.toAdminView(user);
  }

  async create(dto: CreateUtilisateurDto): Promise<UtilisateurAdminView> {
    const nom = normalizeRequiredString(dto.nom, 'nom');
    const prenom = normalizeRequiredString(dto.prenom, 'prenom');
    const mail = normalizeEmailValue(dto.mail);
    const password = normalizeRequiredString(dto.password, 'password');
    const phone = normalizeOptionalString(dto.phone);
    const avatar = normalizeOptionalString(dto.avatar);
    const roleId = await this.resolveRoleId(
      normalizeOptionalInteger(dto.roleId),
      true,
    );

    await this.ensureMailAvailable(mail);

    const created = await this.prisma.utilisateur.create({
      data: {
        nom,
        prenom,
        mail,
        password: hashPassword(password),
        phone,
        avatar,
        roleId,
      },
    });

    return this.findOne(created.id);
  }

  async update(
    id: number,
    dto: UpdateUtilisateurDto,
  ): Promise<UtilisateurAdminView> {
    await this.findOne(id);

    const data: Record<string, unknown> = {};

    if (dto.nom !== undefined) {
      data.nom = normalizeRequiredString(dto.nom, 'nom');
    }

    if (dto.prenom !== undefined) {
      data.prenom = normalizeRequiredString(dto.prenom, 'prenom');
    }

    if (dto.mail !== undefined) {
      const mail = normalizeEmailValue(dto.mail);
      await this.ensureMailAvailable(mail, id);
      data.mail = mail;
    }

    if (dto.password !== undefined) {
      const password = normalizeRequiredString(dto.password, 'password');
      data.password = hashPassword(password);
    }

    if (dto.phone !== undefined) {
      data.phone = normalizeOptionalString(dto.phone);
    }

    if (dto.avatar !== undefined) {
      data.avatar = normalizeOptionalString(dto.avatar);
    }

    if (dto.roleId !== undefined) {
      const roleId = normalizeOptionalInteger(dto.roleId);
      data.roleId = await this.resolveRoleId(roleId, false);
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields were provided for update.');
    }

    await this.prisma.utilisateur.update({
      where: { id },
      data,
    });

    return this.findOne(id);
  }

  async remove(id: number): Promise<UtilisateurAdminView> {
    const existing = await this.findOne(id);

    await this.prisma.utilisateur.delete({
      where: { id },
    });

    return existing;
  }

  private async ensureMailAvailable(
    mail: string,
    excludeId?: number,
  ): Promise<void> {
    const existing = await this.prisma.utilisateur.findUnique({
      where: { mail },
    });

    if (existing && existing.id !== excludeId) {
      throw new BadRequestException(`Mail ${mail} is already used.`);
    }
  }

  private async resolveRoleId(
    roleId: number | null | undefined,
    required: boolean,
  ): Promise<number | null | undefined> {
    if (roleId === undefined || roleId === null) {
      if (required) {
        throw new BadRequestException('roleId is required.');
      }

      return roleId;
    }

    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      throw new BadRequestException(`Role ${roleId} does not exist.`);
    }

    return roleId;
  }

  private toRoleSummary(role: Role): UtilisateurRoleSummary {
    return {
      id: role.id,
      name: role.name,
      label: role.label,
      description: role.description ?? null,
    };
  }

  private toAdminView(user: UserWithRole): UtilisateurAdminView {
    return {
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      mail: user.mail,
      phone: user.phone,
      avatar: user.avatar,
      roleId: user.roleId ?? null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      role: user.role ? this.toRoleSummary(user.role) : null,
    };
  }
}
