import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { SocietesCommercialesController } from './societes-commerciales.controller';
import { SocietesCommercialesService } from './societes-commerciales.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [SocietesCommercialesController],
  providers: [SocietesCommercialesService],
  exports: [SocietesCommercialesService],
})
export class SocietesCommercialesModule {}
