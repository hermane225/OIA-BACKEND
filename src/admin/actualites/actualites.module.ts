import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { ActualitesController } from './actualites.controller';
import { ActualitesService } from './actualites.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ActualitesController],
  providers: [ActualitesService],
  exports: [ActualitesService],
})
export class ActualitesModule {}
