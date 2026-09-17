import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { normalizeOptionalString } from '../../common/utils/normalize.util';
import {
  CreateCooperativeDto,
  UpdateCooperativeDto,
} from './dto/cooperative.dto';

@Injectable()
export class CooperativesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.cooperative.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const cooperative = await this.prisma.cooperative.findUnique({
      where: { id },
    });

    if (!cooperative) {
      throw new NotFoundException(`Cooperative ${id} not found.`);
    }

    return cooperative;
  }

  async create(dto: CreateCooperativeDto) {
    return this.prisma.cooperative.create({
      data: {
        nom: normalizeOptionalString(dto.nom),
        info: normalizeOptionalString(dto.info),
        image: normalizeOptionalString(dto.image),
      },
    });
  }

  async update(id: number, dto: UpdateCooperativeDto) {
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

    return this.prisma.cooperative.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.cooperative.delete({ where: { id } });
  }
}
