import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { PartenairesController } from './partenaires.controller';
import { PartenairesService } from './partenaires.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [PartenairesController],
  providers: [PartenairesService],
  exports: [PartenairesService],
})
export class PartenairesModule {}
