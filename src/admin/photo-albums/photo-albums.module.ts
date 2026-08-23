import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { PhotoAlbumsController } from './photo-albums.controller';
import { PhotoAlbumsService } from './photo-albums.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [PhotoAlbumsController],
  providers: [PhotoAlbumsService],
  exports: [PhotoAlbumsService],
})
export class PhotoAlbumsModule {}
