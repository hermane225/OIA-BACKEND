import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SocieteType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  normalizeOptionalInteger as normalizeOptionalIntegerBase,
  normalizeOptionalString,
  normalizeRequiredString,
} from '../../common/utils/normalize.util';
import {
  CreateSocieteCommercialeDto,
  UpdateSocieteCommercialeDto,
} from './dto/societe-commerciale.dto';

type SocieteTypeValue = (typeof SocieteType)[keyof typeof SocieteType];

type SocieteListFilters = {
  search?: string;
  type?: string;
  campagneId?: string;
  actif?: string;
};

function normalizeOptionalInteger(value: unknown): number | null | undefined {
  return normalizeOptionalIntegerBase(value, 'campagneId');
}

function normalizeSocieteType(value: unknown): SocieteTypeValue | undefined {
  const normalized = normalizeOptionalString(value);

  if (normalized === undefined || normalized === null) {
    return undefined;
  }

  const type = normalized as SocieteTypeValue;

  if (!Object.values(SocieteType).includes(type)) {
    throw new BadRequestException(`Invalid societe type: ${normalized}`);
  }

  return type;
}

function normalizeRequiredSocieteType(value: unknown): SocieteTypeValue {
  const type = normalizeSocieteType(value);

  if (type === undefined) {
    throw new BadRequestException('type is required.');
  }

  return type;
}

@Injectable()
export class SocietesCommercialesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: SocieteListFilters = {}) {
    const search = normalizeOptionalString(filters.search);
    const type = normalizeSocieteType(filters.type);
    const campagneId = normalizeOptionalInteger(filters.campagneId);
    const actif =
      filters.actif === undefined ? undefined : filters.actif === 'true';

    const where = {
      ...(type ? { type } : {}),
      ...(campagneId === undefined ? {} : { campagneId }),
      ...(actif === undefined ? {} : { actif }),
      ...(search
        ? {
            OR: [
              { nom: { contains: search, mode: 'insensitive' as const } },
              {
                numeroAgrement: {
                  contains: search,
                  mode: 'insensitive' as const,
                },
              },
              { ville: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };

    return this.prisma.societeCommerciale.findMany({
      where,
      include: { campagne: true },
      orderBy: [{ type: 'asc' }, { nom: 'asc' }],
    });
  }

  async findAllPublic(filters: { type?: string; search?: string } = {}) {
    return this.findAll({ ...filters, actif: 'true' });
  }

  async findOne(id: number) {
    const societe = await this.prisma.societeCommerciale.findUnique({
      where: { id },
      include: { campagne: true },
    });

    if (!societe) {
      throw new NotFoundException(`Societe commerciale ${id} not found.`);
    }

    return societe;
  }

  async create(dto: CreateSocieteCommercialeDto) {
    const nom = normalizeRequiredString(dto.nom, 'nom');
    const type = normalizeRequiredSocieteType(dto.type);
    const campagneId = normalizeOptionalInteger(dto.campagneId);
    const campagneIdValue = await this.resolveCampagneId(campagneId);

    return this.prisma.societeCommerciale.create({
      data: {
        nom,
        type,
        numeroAgrement: normalizeOptionalString(dto.numeroAgrement),
        adresse: normalizeOptionalString(dto.adresse),
        ville: normalizeOptionalString(dto.ville),
        telephone: normalizeOptionalString(dto.telephone),
        email: normalizeOptionalString(dto.email)?.toLowerCase() ?? null,
        campagneId: campagneIdValue,
        actif: dto.actif ?? true,
      },
      include: { campagne: true },
    });
  }

  async update(id: number, dto: UpdateSocieteCommercialeDto) {
    await this.findOne(id);

    const data: Record<string, unknown> = {};

    if (dto.nom !== undefined) {
      data.nom = normalizeRequiredString(dto.nom, 'nom');
    }

    if (dto.type !== undefined) {
      data.type = normalizeRequiredSocieteType(dto.type);
    }

    if (dto.numeroAgrement !== undefined) {
      data.numeroAgrement = normalizeOptionalString(dto.numeroAgrement);
    }

    if (dto.adresse !== undefined) {
      data.adresse = normalizeOptionalString(dto.adresse);
    }

    if (dto.ville !== undefined) {
      data.ville = normalizeOptionalString(dto.ville);
    }

    if (dto.telephone !== undefined) {
      data.telephone = normalizeOptionalString(dto.telephone);
    }

    if (dto.email !== undefined) {
      data.email = normalizeOptionalString(dto.email)?.toLowerCase() ?? null;
    }

    if (dto.campagneId !== undefined) {
      const campagneId = normalizeOptionalInteger(dto.campagneId);
      data.campagneId = await this.resolveCampagneId(campagneId);
    }

    if (dto.actif !== undefined) {
      data.actif = dto.actif;
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields were provided for update.');
    }

    return this.prisma.societeCommerciale.update({
      where: { id },
      data,
      include: { campagne: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.societeCommerciale.delete({ where: { id } });
  }

  private async resolveCampagneId(
    campagneId: number | null | undefined,
  ): Promise<number | null | undefined> {
    if (campagneId === undefined || campagneId === null) {
      return campagneId;
    }

    const campagne = await this.prisma.campagne.findUnique({
      where: { id: campagneId },
    });

    if (!campagne) {
      throw new BadRequestException(`campagne ${campagneId} does not exist.`);
    }

    return campagneId;
  }
}
