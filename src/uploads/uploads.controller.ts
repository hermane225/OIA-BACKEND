import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { memoryStorage } from 'multer';
import { Permissions } from '../common/decorators/permissions.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import {
  MAX_UPLOAD_SIZE_BYTES,
  UPLOAD_FOLDERS,
  UploadFolder,
} from './upload-folders';
import { UploadsService } from './uploads.service';

const fileInterceptor = () =>
  FileInterceptor('file', {
    storage: memoryStorage(),
    limits: { fileSize: MAX_UPLOAD_SIZE_BYTES },
  });

@ApiTags('Uploads')
@ApiBearerAuth()
@Controller('admin/uploads')
@UseGuards(RolesGuard, PermissionsGuard)
@Roles('super_admin', 'admin', 'editor', 'manager')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('revue-presses')
  @Permissions('revuepresse:create')
  @UseInterceptors(fileInterceptor())
  uploadRevuePresse(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.save('revue-presses', file);
  }

  @Post('agendas')
  @Permissions('agenda:create')
  @UseInterceptors(fileInterceptor())
  uploadAgenda(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.save('agendas', file);
  }

  @Post('acte-oia')
  @Permissions('actes:create')
  @UseInterceptors(fileInterceptor())
  uploadActeOia(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.save('acte-oia', file);
  }

  @Post('presse-books')
  @Permissions('pressbook:create')
  @UseInterceptors(fileInterceptor())
  uploadPresseBook(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.save('presse-books', file);
  }

  @Post('documents')
  @Permissions('documents:create')
  @UseInterceptors(fileInterceptor())
  uploadDocument(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.save('documents', file);
  }

  @Post('photos')
  @Permissions('photos:create')
  @UseInterceptors(fileInterceptor())
  uploadPhoto(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.save('photos', file);
  }

  @Post('projets')
  @Permissions('projets:create')
  @UseInterceptors(fileInterceptor())
  uploadProjet(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.save('projets', file);
  }

  @Post('avatars')
  @Roles('super_admin', 'admin')
  @Permissions('users:update')
  @UseInterceptors(fileInterceptor())
  uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.save('avatars', file);
  }

  @Get(':folder/:filename')
  getFile(
    @Param('folder') folder: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    if (!UPLOAD_FOLDERS.includes(folder as UploadFolder)) {
      throw new BadRequestException(`Unknown upload folder: ${folder}.`);
    }

    const filePath = this.uploadsService.resolve(
      folder as UploadFolder,
      filename,
    );
    res.sendFile(filePath);
  }
}
