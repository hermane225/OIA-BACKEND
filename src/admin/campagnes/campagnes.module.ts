import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { CampagnesController } from './campagnes.controller';
import { CampagnesService } from './campagnes.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [CampagnesController],
  providers: [CampagnesService],
  exports: [CampagnesService],
})
export class CampagnesModule {}
