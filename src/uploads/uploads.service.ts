import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { extname, join } from 'path';
import {
  FOLDER_ACCEPTED_MIME_TYPES,
  MAX_UPLOAD_SIZE_BYTES,
  UploadFolder,
} from './upload-folders';

const UPLOADS_ROOT = join(process.cwd(), 'uploads');

export interface UploadResult {
  url: string;
  path: string;
  filename: string;
}

@Injectable()
export class UploadsService {
  save(
    folder: UploadFolder,
    file: Express.Multer.File | undefined,
  ): UploadResult {
    if (!file) {
      throw new BadRequestException('file is required.');
    }

    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      throw new BadRequestException('File exceeds the 10MB size limit.');
    }

    const accepted = FOLDER_ACCEPTED_MIME_TYPES[folder];

    if (!accepted.includes(file.mimetype)) {
      throw new BadRequestException(
        `Unsupported file type: ${file.mimetype}. Allowed: ${accepted.join(', ')}.`,
      );
    }

    const dir = join(UPLOADS_ROOT, folder);

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    const filename = `${randomUUID()}${extname(file.originalname).toLowerCase()}`;
    writeFileSync(join(dir, filename), file.buffer);

    const baseUrl = (
      process.env.APP_URL ?? 'https://backend-oiacafecacao.com'
    ).replace(/\/+$/, '');
    const path = `/uploads/${folder}/${filename}`;

    return { url: `${baseUrl}${path}`, path, filename };
  }
}
