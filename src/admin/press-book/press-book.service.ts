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
  CreatePressBookDto,
  PressBookPhotoInput,
  PressBookVideoInput,
  UpdatePressBookDto,
} from './dto/press-book.dto';

const pressBookInclude = {
  photos: { orderBy: { createdAt: 'asc' as const } },
  videos: { orderBy: { createdAt: 'asc' as const } },
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

  return (photos as PressBookPhotoInput[]).map((photo) => ({
    titre: normalizeRequiredString(photo.titre, 'photos[].titre'),
    photoFile: normalizeRequiredString(photo.photoFile, 'photos[].photoFile'),
  }));
}

function normalizeVideos(
  videos: unknown,
): { titre: string | null; youtubeUrl: string }[] | undefined {
  if (videos === undefined) {
    return undefined;
  }

  if (!Array.isArray(videos)) {
    throw new BadRequestException('videos must be an array.');
  }

  return (videos as PressBookVideoInput[]).map((video) => ({
    titre: normalizeOptionalString(video.titre) ?? null,
    youtubeUrl: normalizeRequiredString(
      video.youtubeUrl,
      'videos[].youtubeUrl',
    ),
  }));
}

@Injectable()
export class PressBookService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string) {
    const normalizedSearch = normalizeOptionalString(search);

    return this.prisma.pressBook.findMany({
      where: normalizedSearch
        ? {
            titre: { contains: normalizedSearch, mode: 'insensitive' as const },
          }
        : undefined,
      include: pressBookInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllPublished() {
    return this.prisma.pressBook.findMany({
      where: { datePub: { lte: new Date() } },
      include: pressBookInclude,
      orderBy: { datePub: 'desc' },
    });
  }

  async findOne(id: number) {
    const pressBook = await this.prisma.pressBook.findUnique({
      where: { id },
      include: pressBookInclude,
    });

    if (!pressBook) {
      throw new NotFoundException(`Press book ${id} not found.`);
    }

    return pressBook;
  }

  async create(dto: CreatePressBookDto) {
    const photos = normalizePhotos(dto.photos) ?? [];
    const videos = normalizeVideos(dto.videos) ?? [];

    return this.prisma.pressBook.create({
      data: {
        titre: normalizeRequiredString(dto.titre, 'titre'),
        description: normalizeOptionalString(dto.description),
        datePub: normalizeOptionalDate(dto.datePub, 'datePub'),
        photos: { create: photos },
        videos: { create: videos },
      },
      include: pressBookInclude,
    });
  }

  async update(id: number, dto: UpdatePressBookDto) {
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
    const videos = normalizeVideos(dto.videos);

    if (
      Object.keys(data).length === 0 &&
      photos === undefined &&
      videos === undefined
    ) {
      throw new BadRequestException('No fields were provided for update.');
    }

    await this.prisma.$transaction(async (tx) => {
      if (Object.keys(data).length > 0) {
        await tx.pressBook.update({ where: { id }, data });
      }

      if (photos !== undefined) {
        await tx.pressBookPhoto.deleteMany({ where: { pressBookId: id } });
        if (photos.length > 0) {
          await tx.pressBookPhoto.createMany({
            data: photos.map((photo) => ({ pressBookId: id, ...photo })),
          });
        }
      }

      if (videos !== undefined) {
        await tx.pressBookVideo.deleteMany({ where: { pressBookId: id } });
        if (videos.length > 0) {
          await tx.pressBookVideo.createMany({
            data: videos.map((video) => ({ pressBookId: id, ...video })),
          });
        }
      }
    });

    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.pressBook.delete({ where: { id } });
  }
}
