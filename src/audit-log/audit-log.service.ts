import { Injectable, Logger } from '@nestjs/common';
import { AuditAction, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface AuditLogEntry {
  userId?: number | null;
  action: AuditAction;
  entity: string;
  entityId?: string | null;
  method: string;
  path: string;
  statusCode: number;
  ipAddress?: string | null;
  metadata?: Prisma.InputJsonValue | null;
}

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  constructor(private readonly prisma: PrismaService) {}

  async log(entry: AuditLogEntry): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId: entry.userId ?? null,
          action: entry.action,
          entity: entry.entity,
          entityId: entry.entityId ?? null,
          method: entry.method,
          path: entry.path,
          statusCode: entry.statusCode,
          ipAddress: entry.ipAddress ?? null,
          metadata: entry.metadata ?? Prisma.JsonNull,
        },
      });
    } catch (error) {
      this.logger.warn(`Failed to write audit log entry: ${String(error)}`);
    }
  }

  async findAll(filters: {
    entity?: string;
    userId?: number;
    action?: AuditAction;
    take?: number;
    skip?: number;
  }) {
    const { entity, userId, action, take = 50, skip = 0 } = filters;

    return this.prisma.auditLog.findMany({
      where: {
        ...(entity ? { entity } : {}),
        ...(userId ? { userId } : {}),
        ...(action ? { action } : {}),
      },
      include: {
        user: {
          select: { id: true, nom: true, prenom: true, mail: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: Math.min(take, 200),
      skip,
    });
  }
}
