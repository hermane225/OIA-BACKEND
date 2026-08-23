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
import { CreateVideoDto, UpdateVideoDto } from './dto/video.dto';

@Injectable()
export class VideosService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string) {
    const normalizedSearch = normalizeOptionalString(search);

    return this.prisma.video.findMany({
      where: normalizedSearch
        ? {
            titre: { contains: normalizedSearch, mode: 'insensitive' as const },
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllPublished() {
    return this.prisma.video.findMany({
      where: { datePub: { lte: new Date() } },
      orderBy: { datePub: 'desc' },
    });
  }

  async findOne(id: number) {
    const video = await this.prisma.video.findUnique({ where: { id } });

    if (!video) {
      throw new NotFoundException(`Video ${id} not found.`);
    }

    return video;
  }

  async create(dto: CreateVideoDto) {
    return this.prisma.video.create({
      data: {
        auteur: normalizeRequiredString(dto.auteur, 'auteur'),
        titre: normalizeRequiredString(dto.titre, 'titre'),
        youtubeUrl: normalizeOptionalString(dto.youtubeUrl),
        datePub: normalizeOptionalDate(dto.datePub, 'datePub'),
      },
    });
  }

  async update(id: number, dto: UpdateVideoDto) {
    await this.findOne(id);

    const data: Record<string, unknown> = {};

    if (dto.auteur !== undefined) {
      data.auteur = normalizeRequiredString(dto.auteur, 'auteur');
    }

    if (dto.titre !== undefined) {
      data.titre = normalizeRequiredString(dto.titre, 'titre');
    }

    if (dto.youtubeUrl !== undefined) {
      data.youtubeUrl = normalizeOptionalString(dto.youtubeUrl);
    }

    if (dto.datePub !== undefined) {
      data.datePub = normalizeOptionalDate(dto.datePub, 'datePub');
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields were provided for update.');
    }

    return this.prisma.video.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.video.delete({ where: { id } });
  }
}
