import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { ActesOiaController } from './actes-oia.controller';
import { ActesOiaService } from './actes-oia.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ActesOiaController],
  providers: [ActesOiaService],
  exports: [ActesOiaService],
})
export class ActesOiaModule {}
