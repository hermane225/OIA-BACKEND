import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  normalizeOptionalDate,
  normalizeOptionalString,
  normalizeRequiredString,
} from '../../common/utils/normalize.util';
import {
  CreatePhotoAlbumDto,
  PhotoInput,
  UpdatePhotoAlbumDto,
} from './dto/photo-album.dto';

const albumInclude = {
  photos: { orderBy: { createdAt: 'asc' as const } },
};

function normalizePhotos(
  photos: unknown,
): { titre: string; photoFile: string }[] | undefined {
  if (photos === undefined) {
    return undefined;
  }

  if (!Array.isArray(photos)) {
    throw new BadRequestException('photos must be an array.');
  }

  return (photos as PhotoInput[]).map((photo) => ({
    titre: normalizeRequiredString(photo.titre, 'photos[].titre'),
    photoFile: normalizeRequiredString(photo.photoFile, 'photos[].photoFile'),
  }));
}

@Injectable()
export class PhotoAlbumsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string) {
    const normalizedSearch = normalizeOptionalString(search);

    return this.prisma.photoAlbum.findMany({
      where: normalizedSearch
        ? {
            titre: { contains: normalizedSearch, mode: 'insensitive' as const },
          }
        : undefined,
      include: albumInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllPublished() {
    return this.prisma.photoAlbum.findMany({
      where: { datePub: { lte: new Date() } },
      include: albumInclude,
      orderBy: { datePub: 'desc' },
    });
  }

  async findOne(id: number) {
    const album = await this.prisma.photoAlbum.findUnique({
      where: { id },
      include: albumInclude,
    });

    if (!album) {
      throw new NotFoundException(`Photo album ${id} not found.`);
    }

    return album;
  }

  async create(dto: CreatePhotoAlbumDto) {
    const photos = normalizePhotos(dto.photos) ?? [];

    return this.prisma.photoAlbum.create({
      data: {
        titre: normalizeRequiredString(dto.titre, 'titre'),
        description: normalizeOptionalString(dto.description),
        datePub: normalizeOptionalDate(dto.datePub, 'datePub'),
        photos: { create: photos },
      },
      include: albumInclude,
    });
  }

  async update(id: number, dto: UpdatePhotoAlbumDto) {
    await this.findOne(id);

    const data: Record<string, unknown> = {};

    if (dto.titre !== undefined) {
      data.titre = normalizeRequiredString(dto.titre, 'titre');
    }

    if (dto.description !== undefined) {
      data.description = normalizeOptionalString(dto.description);
    }

    if (dto.datePub !== undefined) {
      data.datePub = normalizeOptionalDate(dto.datePub, 'datePub');
    }

    const photos = normalizePhotos(dto.photos);

    if (Object.keys(data).length === 0 && photos === undefined) {
      throw new BadRequestException('No fields were provided for update.');
    }

    await this.prisma.$transaction(async (tx) => {
      if (Object.keys(data).length > 0) {
        await tx.photoAlbum.update({ where: { id }, data });
      }

      if (photos !== undefined) {
        await tx.photo.deleteMany({ where: { albumId: id } });
        if (photos.length > 0) {
          await tx.photo.createMany({
            data: photos.map((photo) => ({ albumId: id, ...photo })),
          });
        }
      }
    });

    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.photoAlbum.delete({ where: { id } });
  }
}
