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
import { CreateProjetDto, UpdateProjetDto } from './dto/projet.dto';

@Injectable()
export class ProjetsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string) {
    const normalizedSearch = normalizeOptionalString(search);

    return this.prisma.projet.findMany({
      where: normalizedSearch
        ? {
            titre: { contains: normalizedSearch, mode: 'insensitive' as const },
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllPublished() {
    return this.prisma.projet.findMany({
      where: { datePub: { lte: new Date() } },
      orderBy: { datePub: 'desc' },
    });
  }

  async findOne(id: number) {
    const projet = await this.prisma.projet.findUnique({ where: { id } });

    if (!projet) {
      throw new NotFoundException(`Projet ${id} not found.`);
    }

    return projet;
  }

  async create(dto: CreateProjetDto) {
    return this.prisma.projet.create({
      data: {
        titre: normalizeRequiredString(dto.titre, 'titre'),
        description: normalizeOptionalString(dto.description),
        dateDeb: normalizeOptionalDate(dto.dateDeb, 'dateDeb'),
        dateFin: normalizeOptionalDate(dto.dateFin, 'dateFin'),
        imageCouverture: normalizeOptionalString(dto.imageCouverture),
        pdfFile: normalizeOptionalString(dto.pdfFile),
        datePub: normalizeOptionalDate(dto.datePub, 'datePub'),
      },
    });
  }

  async update(id: number, dto: UpdateProjetDto) {
    await this.findOne(id);

    const data: Record<string, unknown> = {};

    if (dto.titre !== undefined) {
      data.titre = normalizeRequiredString(dto.titre, 'titre');
    }

    if (dto.description !== undefined) {
      data.description = normalizeOptionalString(dto.description);
    }

    if (dto.dateDeb !== undefined) {
      data.dateDeb = normalizeOptionalDate(dto.dateDeb, 'dateDeb');
    }

    if (dto.dateFin !== undefined) {
      data.dateFin = normalizeOptionalDate(dto.dateFin, 'dateFin');
    }

    if (dto.imageCouverture !== undefined) {
      data.imageCouverture = normalizeOptionalString(dto.imageCouverture);
    }

    if (dto.pdfFile !== undefined) {
      data.pdfFile = normalizeOptionalString(dto.pdfFile);
    }

    if (dto.datePub !== undefined) {
      data.datePub = normalizeOptionalDate(dto.datePub, 'datePub');
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields were provided for update.');
    }

    return this.prisma.projet.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.projet.delete({ where: { id } });
  }
}
