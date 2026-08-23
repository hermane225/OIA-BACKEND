import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CampagneStatut, CampagneType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  normalizeOptionalDate,
  normalizeOptionalString,
  normalizeRequiredString,
} from '../../common/utils/normalize.util';
import { CreateCampagneDto, UpdateCampagneDto } from './dto/campagne.dto';

type CampagneTypeValue = (typeof CampagneType)[keyof typeof CampagneType];
type CampagneStatutValue = (typeof CampagneStatut)[keyof typeof CampagneStatut];

function normalizeCampagneType(value: unknown): CampagneTypeValue | undefined {
  const normalized = normalizeOptionalString(value);

  if (normalized === undefined || normalized === null) {
    return undefined;
  }

  const type = normalized as CampagneTypeValue;

  if (!Object.values(CampagneType).includes(type)) {
    throw new BadRequestException(`Invalid typeCampagne: ${normalized}`);
  }

  return type;
}

function normalizeCampagneStatut(
  value: unknown,
): CampagneStatutValue | undefined {
  const normalized = normalizeOptionalString(value);

  if (normalized === undefined || normalized === null) {
    return undefined;
  }

  const statut = normalized as CampagneStatutValue;

  if (!Object.values(CampagneStatut).includes(statut)) {
    throw new BadRequestException(`Invalid statut: ${normalized}`);
  }

  return statut;
}

function normalizeRequiredDate(value: unknown, label: string): Date {
  const date = normalizeOptionalDate(value, label);

  if (!date) {
    throw new BadRequestException(`${label} is required.`);
  }

  return date;
}

@Injectable()
export class CampagnesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string) {
    const normalizedSearch = normalizeOptionalString(search);

    return this.prisma.campagne.findMany({
      where: normalizedSearch
        ? { nom: { contains: normalizedSearch, mode: 'insensitive' as const } }
        : undefined,
      orderBy: { dateDebut: 'desc' },
    });
  }

  async findOne(id: number) {
    const campagne = await this.prisma.campagne.findUnique({ where: { id } });

    if (!campagne) {
      throw new NotFoundException(`Campagne ${id} not found.`);
    }

    return campagne;
  }

  async create(dto: CreateCampagneDto) {
    return this.prisma.campagne.create({
      data: {
        nom: normalizeRequiredString(dto.nom, 'nom'),
        typeCampagne:
          normalizeCampagneType(dto.typeCampagne) ?? CampagneType.principale,
        dateDebut: normalizeRequiredDate(dto.dateDebut, 'dateDebut'),
        dateFin: normalizeRequiredDate(dto.dateFin, 'dateFin'),
        statut: normalizeCampagneStatut(dto.statut) ?? CampagneStatut.active,
      },
    });
  }

  async update(id: number, dto: UpdateCampagneDto) {
    await this.findOne(id);

    const data: Record<string, unknown> = {};

    if (dto.nom !== undefined) {
      data.nom = normalizeRequiredString(dto.nom, 'nom');
    }

    if (dto.typeCampagne !== undefined) {
      data.typeCampagne = normalizeCampagneType(dto.typeCampagne);
    }

    if (dto.dateDebut !== undefined) {
      data.dateDebut = normalizeRequiredDate(dto.dateDebut, 'dateDebut');
    }

    if (dto.dateFin !== undefined) {
      data.dateFin = normalizeRequiredDate(dto.dateFin, 'dateFin');
    }

    if (dto.statut !== undefined) {
      data.statut = normalizeCampagneStatut(dto.statut);
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields were provided for update.');
    }

    return this.prisma.campagne.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.campagne.delete({ where: { id } });
  }
}
