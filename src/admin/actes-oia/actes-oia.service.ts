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
import { CreateActeOiaDto, UpdateActeOiaDto } from './dto/acte-oia.dto';

@Injectable()
export class ActesOiaService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string) {
    const normalizedSearch = normalizeOptionalString(search);

    return this.prisma.acteOia.findMany({
      where: normalizedSearch
        ? {
            titre: { contains: normalizedSearch, mode: 'insensitive' as const },
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllPublished() {
    return this.prisma.acteOia.findMany({
      where: { datePub: { lte: new Date() } },
      orderBy: { datePub: 'desc' },
    });
  }

  async findOne(id: number) {
    const acte = await this.prisma.acteOia.findUnique({ where: { id } });

    if (!acte) {
      throw new NotFoundException(`Acte OIA ${id} not found.`);
    }

    return acte;
  }

  async create(dto: CreateActeOiaDto) {
    return this.prisma.acteOia.create({
      data: {
        titre: normalizeRequiredString(dto.titre, 'titre'),
        description: normalizeOptionalString(dto.description),
        pdfFile: normalizeRequiredString(dto.pdfFile, 'pdfFile'),
        datePub: normalizeOptionalDate(dto.datePub, 'datePub'),
      },
    });
  }

  async update(id: number, dto: UpdateActeOiaDto) {
    await this.findOne(id);

    const data: Record<string, unknown> = {};

    if (dto.titre !== undefined) {
      data.titre = normalizeRequiredString(dto.titre, 'titre');
    }

    if (dto.description !== undefined) {
      data.description = normalizeOptionalString(dto.description);
    }

    if (dto.pdfFile !== undefined) {
      data.pdfFile = normalizeRequiredString(dto.pdfFile, 'pdfFile');
    }

    if (dto.datePub !== undefined) {
      data.datePub = normalizeOptionalDate(dto.datePub, 'datePub');
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields were provided for update.');
    }

    return this.prisma.acteOia.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.acteOia.delete({ where: { id } });
  }
}
