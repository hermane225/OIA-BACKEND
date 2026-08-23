import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { RevuePresseController } from './revue-presse.controller';
import { RevuePresseService } from './revue-presse.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [RevuePresseController],
  providers: [RevuePresseService],
  exports: [RevuePresseService],
})
export class RevuePresseModule {}
