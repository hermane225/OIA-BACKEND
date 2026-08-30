import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, randomUUID } from 'crypto';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { basename, extname, join } from 'path';
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

    const filename = this.buildFilename(dir, file.originalname);
    writeFileSync(join(dir, filename), file.buffer);

    const baseUrl = (
      process.env.APP_URL ?? 'https://backend-oiacafecacao.com'
    ).replace(/\/+$/, '');
    const path = `/uploads/${folder}/${filename}`;

    return { url: `${baseUrl}${path}`, path, filename };
  }

  resolve(folder: UploadFolder, filename: string): string {
    const safeName = basename(filename);
    const filePath = join(UPLOADS_ROOT, folder, safeName);

    if (!existsSync(filePath)) {
      throw new NotFoundException(`File ${safeName} not found in ${folder}.`);
    }

    return filePath;
  }

  private buildFilename(dir: string, originalname: string): string {
    const ext = extname(originalname).toLowerCase();
    const nameWithoutExt = basename(originalname, extname(originalname));
    const sanitized = nameWithoutExt
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80);

    const base = sanitized || randomUUID();
    let filename = `${base}${ext}`;

    while (existsSync(join(dir, filename))) {
      filename = `${base}-${randomBytes(3).toString('hex')}${ext}`;
    }

    return filename;
  }
}
