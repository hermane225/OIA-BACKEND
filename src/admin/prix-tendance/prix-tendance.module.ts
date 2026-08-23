import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { PrixTendanceController } from './prix-tendance.controller';
import { PrixTendanceHistoriqueController } from './prix-tendance-historique.controller';
import { PrixTendanceService } from './prix-tendance.service';
import { PrixTendanceHistoriqueService } from './prix-tendance-historique.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [PrixTendanceController, PrixTendanceHistoriqueController],
  providers: [PrixTendanceService, PrixTendanceHistoriqueService],
  exports: [PrixTendanceService, PrixTendanceHistoriqueService],
})
export class PrixTendanceModule {}
