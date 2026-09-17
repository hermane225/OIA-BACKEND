import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { FiliereStatsController } from './filiere-stats.controller';
import { FiliereStatsService } from './filiere-stats.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [FiliereStatsController],
  providers: [FiliereStatsService],
  exports: [FiliereStatsService],
})
export class FiliereStatsModule {}
