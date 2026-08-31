import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { normalizeRequiredString } from '../../common/utils/normalize.util';
import {
  CreateTexteDefilantDto,
  UpdateTexteDefilantDto,
} from './dto/texte-defilant.dto';

function normalizeOptionalBoolean(
  value: unknown,
  label: string,
): boolean | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  throw new BadRequestException(`${label} must be a boolean.`);
}

@Injectable()
export class TextesDefilantsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.texteDefilant.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllActive() {
    return this.prisma.texteDefilant.findMany({
      where: { actif: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const texteDefilant = await this.prisma.texteDefilant.findUnique({
      where: { id },
    });

    if (!texteDefilant) {
      throw new NotFoundException(`Texte defilant ${id} not found.`);
    }

    return texteDefilant;
  }

  async create(dto: CreateTexteDefilantDto) {
    return this.prisma.texteDefilant.create({
      data: {
        texte: normalizeRequiredString(dto.texte, 'texte'),
        actif: normalizeOptionalBoolean(dto.actif, 'actif') ?? true,
      },
    });
  }

  async update(id: number, dto: UpdateTexteDefilantDto) {
    await this.findOne(id);

    const data: Record<string, unknown> = {};

    if (dto.texte !== undefined) {
      data.texte = normalizeRequiredString(dto.texte, 'texte');
    }

    if (dto.actif !== undefined) {
      data.actif = normalizeOptionalBoolean(dto.actif, 'actif');
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields were provided for update.');
    }

    return this.prisma.texteDefilant.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.texteDefilant.delete({ where: { id } });
  }
}
