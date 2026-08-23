import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  normalizeOptionalString,
  normalizeRequiredString,
} from '../../common/utils/normalize.util';
import {
  CreatePrixTendanceDto,
  UpdatePrixTendanceDto,
} from './dto/prix-tendance.dto';

const prixTendanceInclude = {
  historiques: {
    include: { campagne: true },
    orderBy: { createdAt: 'desc' as const },
  },
};

@Injectable()
export class PrixTendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string) {
    const normalizedSearch = normalizeOptionalString(search);

    return this.prisma.prixTendance.findMany({
      where: normalizedSearch
        ? { name: { contains: normalizedSearch, mode: 'insensitive' as const } }
        : undefined,
      include: prixTendanceInclude,
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const prixTendance = await this.prisma.prixTendance.findUnique({
      where: { id },
      include: prixTendanceInclude,
    });

    if (!prixTendance) {
      throw new NotFoundException(`PrixTendance ${id} not found.`);
    }

    return prixTendance;
  }

  async create(dto: CreatePrixTendanceDto) {
    return this.prisma.prixTendance.create({
      data: {
        name: normalizeRequiredString(dto.name, 'name'),
        description: normalizeOptionalString(dto.description),
      },
      include: prixTendanceInclude,
    });
  }

  async update(id: number, dto: UpdatePrixTendanceDto) {
    await this.findOne(id);

    const data: Record<string, unknown> = {};

    if (dto.name !== undefined) {
      data.name = normalizeRequiredString(dto.name, 'name');
    }

    if (dto.description !== undefined) {
      data.description = normalizeOptionalString(dto.description);
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields were provided for update.');
    }

    return this.prisma.prixTendance.update({
      where: { id },
      data,
      include: prixTendanceInclude,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.prixTendance.delete({ where: { id } });
  }
}
