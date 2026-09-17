import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { OrganigrammeController } from './organigramme.controller';
import { OrganigrammeService } from './organigramme.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [OrganigrammeController],
  providers: [OrganigrammeService],
  exports: [OrganigrammeService],
})
export class OrganigrammeModule {}
