import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { TextesDefilantsController } from './textes-defilants.controller';
import { TextesDefilantsService } from './textes-defilants.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [TextesDefilantsController],
  providers: [TextesDefilantsService],
  exports: [TextesDefilantsService],
})
export class TextesDefilantsModule {}
