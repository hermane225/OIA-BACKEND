import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryProvider } from './cloudinary.provider';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [MediaController],
  providers: [CloudinaryProvider, MediaService],
})
export class MediaModule {}
