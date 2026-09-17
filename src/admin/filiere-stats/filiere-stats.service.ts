import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Filiere } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  normalizeOptionalInteger,
  normalizeOptionalString,
  normalizeRequiredString,
} from '../../common/utils/normalize.util';
import {
  CreateFiliereStatDto,
  UpdateFiliereStatDto,
} from './dto/filiere-stat.dto';

type FiliereValue = (typeof Filiere)[keyof typeof Filiere];

function normalizeFiliere(value: unknown): FiliereValue | undefined {
  const normalized = normalizeOptionalString(value);

  if (normalized === undefined || normalized === null) {
    return undefined;
  }

  const filiere = normalized as FiliereValue;

  if (!Object.values(Filiere).includes(filiere)) {
    throw new BadRequestException(`Invalid filiere: ${normalized}`);
  }

  return filiere;
}

function normalizeRequiredFiliere(value: unknown): FiliereValue {
  const filiere = normalizeFiliere(value);

  if (filiere === undefined) {
    throw new BadRequestException('filiere is required.');
  }

  return filiere;
}

@Injectable()
export class FiliereStatsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filiere?: string) {
    const filiereValue = normalizeFiliere(filiere);

    return this.prisma.filiereStat.findMany({
      where: filiereValue ? { filiere: filiereValue } : undefined,
      orderBy: [{ filiere: 'asc' }, { ordre: 'asc' }, { id: 'asc' }],
    });
  }

  async findOne(id: number) {
    const filiereStat = await this.prisma.filiereStat.findUnique({
      where: { id },
    });

    if (!filiereStat) {
      throw new NotFoundException(`Filiere stat ${id} not found.`);
    }

    return filiereStat;
  }

  async create(dto: CreateFiliereStatDto) {
    return this.prisma.filiereStat.create({
      data: {
        filiere: normalizeRequiredFiliere(dto.filiere),
        ordre: normalizeOptionalInteger(dto.ordre, 'ordre') ?? 0,
        valeur: normalizeRequiredString(dto.valeur, 'valeur'),
        libelle: normalizeRequiredString(dto.libelle, 'libelle'),
        description: normalizeOptionalString(dto.description),
      },
    });
  }

  async update(id: number, dto: UpdateFiliereStatDto) {
    await this.findOne(id);

    const data: Record<string, unknown> = {};

    if (dto.filiere !== undefined) {
      data.filiere = normalizeRequiredFiliere(dto.filiere);
    }

    if (dto.ordre !== undefined) {
      data.ordre = normalizeOptionalInteger(dto.ordre, 'ordre') ?? 0;
    }

    if (dto.valeur !== undefined) {
      data.valeur = normalizeRequiredString(dto.valeur, 'valeur');
    }

    if (dto.libelle !== undefined) {
      data.libelle = normalizeRequiredString(dto.libelle, 'libelle');
    }

    if (dto.description !== undefined) {
      data.description = normalizeOptionalString(dto.description);
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields were provided for update.');
    }

    return this.prisma.filiereStat.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.filiereStat.delete({ where: { id } });
  }
}
