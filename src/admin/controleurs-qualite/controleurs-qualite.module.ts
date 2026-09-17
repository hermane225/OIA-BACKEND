import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { ControleursQualiteController } from './controleurs-qualite.controller';
import { ControleursQualiteService } from './controleurs-qualite.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ControleursQualiteController],
  providers: [ControleursQualiteService],
  exports: [ControleursQualiteService],
})
export class ControleursQualiteModule {}
