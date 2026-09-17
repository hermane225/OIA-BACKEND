import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { normalizeRequiredString } from '../../common/utils/normalize.util';
import {
  CreateOrganigrammeDto,
  UpdateOrganigrammeDto,
} from './dto/organigramme.dto';

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
export class OrganigrammeService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.organigramme.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findActive() {
    return this.prisma.organigramme.findFirst({
      where: { actif: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const organigramme = await this.prisma.organigramme.findUnique({
      where: { id },
    });

    if (!organigramme) {
      throw new NotFoundException(`Organigramme ${id} not found.`);
    }

    return organigramme;
  }

  async create(dto: CreateOrganigrammeDto) {
    const image = normalizeRequiredString(dto.image, 'image');
    const actif = normalizeOptionalBoolean(dto.actif, 'actif') ?? true;

    if (actif) {
      await this.prisma.organigramme.updateMany({
        where: { actif: true },
        data: { actif: false },
      });
    }

    return this.prisma.organigramme.create({
      data: { image, actif },
    });
  }

  async update(id: number, dto: UpdateOrganigrammeDto) {
    await this.findOne(id);

    const data: Record<string, unknown> = {};

    if (dto.image !== undefined) {
      data.image = normalizeRequiredString(dto.image, 'image');
    }

    if (dto.actif !== undefined) {
      data.actif = normalizeOptionalBoolean(dto.actif, 'actif');
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields were provided for update.');
    }

    if (data.actif === true) {
      await this.prisma.organigramme.updateMany({
        where: { actif: true, NOT: { id } },
        data: { actif: false },
      });
    }

    return this.prisma.organigramme.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.organigramme.delete({ where: { id } });
  }
}
