import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { TableOrgController } from './table-org.controller';
import { TableOrgService } from './table-org.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [TableOrgController],
  providers: [TableOrgService],
  exports: [TableOrgService],
})
export class TableOrgModule {}
