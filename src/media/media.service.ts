import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MediaType } from '@prisma/client';
import { UploadApiResponse, v2 as CloudinaryClient } from 'cloudinary';
import { CLOUDINARY } from './cloudinary.provider';
import { PrismaService } from '../prisma/prisma.service';

const ACCEPTED_MIME_TYPES: Record<string, MediaType> = {
  'image/jpeg': MediaType.image,
  'image/png': MediaType.image,
  'image/webp': MediaType.image,
  'image/gif': MediaType.image,
  'application/pdf': MediaType.document,
};

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

@Injectable()
export class MediaService {
  constructor(
    @Inject(CLOUDINARY) private readonly cloudinary: typeof CloudinaryClient,
    private readonly prisma: PrismaService,
  ) {}

  async upload(file: Express.Multer.File | undefined, uploadedById?: number) {
    if (!file) {
      throw new BadRequestException('file is required.');
    }

    const type = ACCEPTED_MIME_TYPES[file.mimetype];

    if (!type) {
      throw new BadRequestException(
        `Unsupported file type: ${file.mimetype}. Allowed: JPEG, PNG, WEBP, GIF, PDF.`,
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException('File exceeds the 10MB size limit.');
    }

    const uploadResult = await this.uploadBuffer(file.buffer, type);

    return this.prisma.media.create({
      data: {
        type,
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        uploadedById: uploadedById ?? null,
      },
    });
  }

  async findAll(filters: { type?: string } = {}) {
    const type = filters.type as MediaType | undefined;

    return this.prisma.media.findMany({
      where: type ? { type } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: number) {
    const media = await this.prisma.media.findUnique({ where: { id } });

    if (!media) {
      throw new NotFoundException(`Media ${id} not found.`);
    }

    await this.cloudinary.uploader.destroy(media.publicId, {
      resource_type: media.type === MediaType.document ? 'raw' : 'image',
    });

    return this.prisma.media.delete({ where: { id } });
  }

  private uploadBuffer(
    buffer: Buffer,
    type: MediaType,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const stream = this.cloudinary.uploader.upload_stream(
        {
          folder: 'oia-cafecacao',
          resource_type: type === MediaType.document ? 'raw' : 'image',
        },
        (error, result) => {
          if (error || !result) {
            reject(
              error instanceof Error
                ? error
                : new Error(error?.message ?? 'Cloudinary upload failed.'),
            );
            return;
          }

          resolve(result);
        },
      );

      stream.end(buffer);
    });
  }
}
