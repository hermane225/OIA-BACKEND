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
  CreateRevuePresseDto,
  UpdateRevuePresseDto,
} from './dto/revue-presse.dto';

@Injectable()
export class RevuePresseService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string) {
    const normalizedSearch = normalizeOptionalString(search);

    return this.prisma.revuePresse.findMany({
      where: normalizedSearch
        ? {
            titre: { contains: normalizedSearch, mode: 'insensitive' as const },
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllPublished() {
    return this.prisma.revuePresse.findMany({
      where: { datePub: { lte: new Date() } },
      orderBy: { datePub: 'desc' },
    });
  }

  async findOne(id: number) {
    const revue = await this.prisma.revuePresse.findUnique({ where: { id } });

    if (!revue) {
      throw new NotFoundException(`Revue de presse ${id} not found.`);
    }

    return revue;
  }

  async create(dto: CreateRevuePresseDto) {
    return this.prisma.revuePresse.create({
      data: {
        auteur: normalizeRequiredString(dto.auteur, 'auteur'),
        titre: normalizeRequiredString(dto.titre, 'titre'),
        description: normalizeOptionalString(dto.description),
        imageCouverture: normalizeOptionalString(dto.imageCouverture),
        datePub: normalizeOptionalDate(dto.datePub, 'datePub'),
      },
    });
  }

  async update(id: number, dto: UpdateRevuePresseDto) {
    await this.findOne(id);

    const data: Record<string, unknown> = {};

    if (dto.auteur !== undefined) {
      data.auteur = normalizeRequiredString(dto.auteur, 'auteur');
    }

    if (dto.titre !== undefined) {
      data.titre = normalizeRequiredString(dto.titre, 'titre');
    }

    if (dto.description !== undefined) {
      data.description = normalizeOptionalString(dto.description);
    }

    if (dto.imageCouverture !== undefined) {
      data.imageCouverture = normalizeOptionalString(dto.imageCouverture);
    }

    if (dto.datePub !== undefined) {
      data.datePub = normalizeOptionalDate(dto.datePub, 'datePub');
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields were provided for update.');
    }

    return this.prisma.revuePresse.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.revuePresse.delete({ where: { id } });
  }
}
