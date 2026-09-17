import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { normalizeOptionalString } from '../../common/utils/normalize.util';
import {
  CreateControleurQualiteDto,
  UpdateControleurQualiteDto,
} from './dto/controleur-qualite.dto';

@Injectable()
export class ControleursQualiteService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.controleurQualite.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const controleurQualite = await this.prisma.controleurQualite.findUnique({
      where: { id },
    });

    if (!controleurQualite) {
      throw new NotFoundException(`Controleur qualite ${id} not found.`);
    }

    return controleurQualite;
  }

  async create(dto: CreateControleurQualiteDto) {
    return this.prisma.controleurQualite.create({
      data: {
        nom: normalizeOptionalString(dto.nom),
        info: normalizeOptionalString(dto.info),
        image: normalizeOptionalString(dto.image),
      },
    });
  }

  async update(id: number, dto: UpdateControleurQualiteDto) {
    await this.findOne(id);

    const data: Record<string, unknown> = {};

    if (dto.nom !== undefined) {
      data.nom = normalizeOptionalString(dto.nom);
    }

    if (dto.info !== undefined) {
      data.info = normalizeOptionalString(dto.info);
    }

    if (dto.image !== undefined) {
      data.image = normalizeOptionalString(dto.image);
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields were provided for update.');
    }

    return this.prisma.controleurQualite.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.controleurQualite.delete({ where: { id } });
  }
}
