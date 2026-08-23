import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { normalizeRequiredString } from '../../common/utils/normalize.util';
import { CreateTableOrgDto, UpdateTableOrgDto } from './dto/table-org.dto';

@Injectable()
export class TableOrgService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.tableOrg.findMany({ orderBy: { nom: 'asc' } });
  }

  async findOne(id: number) {
    const tableOrg = await this.prisma.tableOrg.findUnique({ where: { id } });

    if (!tableOrg) {
      throw new NotFoundException(`TableOrg ${id} not found.`);
    }

    return tableOrg;
  }

  async create(dto: CreateTableOrgDto) {
    return this.prisma.tableOrg.create({
      data: { nom: normalizeRequiredString(dto.nom, 'nom') },
    });
  }

  async update(id: number, dto: UpdateTableOrgDto) {
    await this.findOne(id);

    if (dto.nom === undefined) {
      throw new BadRequestException('No fields were provided for update.');
    }

    return this.prisma.tableOrg.update({
      where: { id },
      data: { nom: normalizeRequiredString(dto.nom, 'nom') },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.tableOrg.delete({ where: { id } });
  }
}
