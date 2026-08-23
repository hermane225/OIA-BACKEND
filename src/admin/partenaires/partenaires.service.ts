import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PartenaireType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  normalizeOptionalInteger as normalizeOptionalIntegerBase,
  normalizeOptionalString,
  normalizeRequiredString,
} from '../../common/utils/normalize.util';
import { CreatePartenaireDto } from './dto/create-partenaire.dto';
import { UpdatePartenaireDto } from './dto/update-partenaire.dto';

type PartenaireTypeValue = (typeof PartenaireType)[keyof typeof PartenaireType];

type PartenaireListFilters = {
  search?: string;
  type?: string;
  typeOrgId?: string;
};

function normalizeOptionalInteger(value: unknown): number | null | undefined {
  return normalizeOptionalIntegerBase(value, 'typeOrgId');
}

function normalizePartenaireType(
  value: unknown,
): PartenaireTypeValue | undefined {
  const normalized = normalizeOptionalString(value);

  if (normalized === undefined || normalized === null) {
    return undefined;
  }

  const type = normalized as PartenaireTypeValue;

  if (!Object.values(PartenaireType).includes(type)) {
    throw new BadRequestException(`Invalid partenaire type: ${normalized}`);
  }

  return type;
}

@Injectable()
export class PartenairesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: PartenaireListFilters = {}) {
    const search = normalizeOptionalString(filters.search);
    const type = normalizePartenaireType(filters.type);
    const typeOrgId = normalizeOptionalInteger(filters.typeOrgId);

    const where = {
      ...(type ? { type } : {}),
      ...(typeOrgId === undefined ? {} : { typeOrgId }),
      ...(search
        ? {
            OR: [
              {
                nom: { contains: search, mode: 'insensitive' as const },
              },
              {
                description: { contains: search, mode: 'insensitive' as const },
              },
              {
                contactName: { contains: search, mode: 'insensitive' as const },
              },
              {
                site: { contains: search, mode: 'insensitive' as const },
              },
            ],
          }
        : {}),
    };

    return this.prisma.partenaire.findMany({
      where,
      include: {
        typeOrg: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const partenaire = await this.prisma.partenaire.findUnique({
      where: { id },
      include: {
        typeOrg: true,
      },
    });

    if (!partenaire) {
      throw new NotFoundException(`Partenaire ${id} not found.`);
    }

    return partenaire;
  }

  async create(dto: CreatePartenaireDto) {
    const nom = normalizeRequiredString(dto.nom, 'nom');
    const type =
      normalizePartenaireType(dto.type) ?? PartenaireType.institutionnels;
    const typeOrgId = normalizeOptionalInteger(dto.typeOrgId);
    const typeOrgIdValue = await this.resolveTypeOrgId(typeOrgId);

    return this.prisma.partenaire.create({
      data: {
        nom,
        type,
        typeOrgId: typeOrgIdValue,
        description: normalizeOptionalString(dto.description),
        logo: normalizeOptionalString(dto.logo),
        contactName: normalizeOptionalString(dto.contactName),
        contactEmail:
          normalizeOptionalString(dto.contactEmail)?.toLowerCase() ?? null,
        contactPhone: normalizeOptionalString(dto.contactPhone),
        site: normalizeOptionalString(dto.site),
      },
      include: {
        typeOrg: true,
      },
    });
  }

  async update(id: number, dto: UpdatePartenaireDto) {
    await this.findOne(id);

    const data: Record<string, unknown> = {};

    if (dto.nom !== undefined) {
      data.nom = normalizeRequiredString(dto.nom, 'nom');
    }

    const type = normalizePartenaireType(dto.type);
    if (type !== undefined) {
      data.type = type;
    }

    if (dto.typeOrgId !== undefined) {
      const typeOrgId = normalizeOptionalInteger(dto.typeOrgId);
      data.typeOrgId = await this.resolveTypeOrgId(typeOrgId);
    }

    if (dto.description !== undefined) {
      data.description = normalizeOptionalString(dto.description);
    }

    if (dto.logo !== undefined) {
      data.logo = normalizeOptionalString(dto.logo);
    }

    if (dto.contactName !== undefined) {
      data.contactName = normalizeOptionalString(dto.contactName);
    }

    if (dto.contactEmail !== undefined) {
      data.contactEmail =
        normalizeOptionalString(dto.contactEmail)?.toLowerCase() ?? null;
    }

    if (dto.contactPhone !== undefined) {
      data.contactPhone = normalizeOptionalString(dto.contactPhone);
    }

    if (dto.site !== undefined) {
      data.site = normalizeOptionalString(dto.site);
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields were provided for update.');
    }

    return this.prisma.partenaire.update({
      where: { id },
      data,
      include: {
        typeOrg: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.partenaire.delete({
      where: { id },
    });
  }

  private async resolveTypeOrgId(
    typeOrgId: number | null | undefined,
  ): Promise<number | null | undefined> {
    if (typeOrgId === undefined || typeOrgId === null) {
      return typeOrgId;
    }

    const typeOrg = await this.prisma.tableOrg.findUnique({
      where: { id: typeOrgId },
    });

    if (!typeOrg) {
      throw new BadRequestException(`table_org ${typeOrgId} does not exist.`);
    }

    return typeOrgId;
  }
}
