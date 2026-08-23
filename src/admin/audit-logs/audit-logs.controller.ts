import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditAction } from '@prisma/client';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { AuditLogService } from '../../audit-log/audit-log.service';

@Controller('admin/audit-logs')
@UseGuards(RolesGuard, PermissionsGuard)
@Roles('super_admin')
export class AuditLogsController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  @Permissions('audit:read')
  findAll(
    @Query('entity') entity?: string,
    @Query('userId') userId?: string,
    @Query('action') action?: string,
    @Query('take') take?: string,
    @Query('skip') skip?: string,
  ) {
    return this.auditLogService.findAll({
      entity,
      userId: userId ? Number(userId) : undefined,
      action: action ? (action as AuditAction) : undefined,
      take: take ? Number(take) : undefined,
      skip: skip ? Number(skip) : undefined,
    });
  }
}
