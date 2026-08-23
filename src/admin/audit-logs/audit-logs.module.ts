import { Module } from '@nestjs/common';
import { AuditLogModule } from '../../audit-log/audit-log.module';
import { AuthModule } from '../../auth/auth.module';
import { AuditLogsController } from './audit-logs.controller';

@Module({
  imports: [AuditLogModule, AuthModule],
  controllers: [AuditLogsController],
})
export class AuditLogsModule {}
