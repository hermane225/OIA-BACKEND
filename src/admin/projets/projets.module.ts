import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { ProjetsController } from './projets.controller';
import { ProjetsService } from './projets.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ProjetsController],
  providers: [ProjetsService],
  exports: [ProjetsService],
})
export class ProjetsModule {}
