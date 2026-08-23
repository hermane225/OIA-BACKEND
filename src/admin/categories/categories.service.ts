import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { slugify } from '../../common/utils/slug.util';
import {
  normalizeOptionalString,
  normalizeRequiredString,
} from '../../common/utils/normalize.util';
import { CreateCategorieDto } from './dto/create-categorie.dto';
import { UpdateCategorieDto } from './dto/update-categorie.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string) {
    const normalizedSearch = normalizeOptionalString(search);

    return this.prisma.categorie.findMany({
      where: normalizedSearch
        ? {
            OR: [
              {
                nom: {
                  contains: normalizedSearch,
                  mode: 'insensitive' as const,
                },
              },
              {
                description: {
                  contains: normalizedSearch,
                  mode: 'insensitive' as const,
                },
              },
            ],
          }
        : undefined,
      orderBy: { nom: 'asc' },
    });
  }

  async findOne(id: number) {
    const categorie = await this.prisma.categorie.findUnique({
      where: { id },
    });

    if (!categorie) {
      throw new NotFoundException(`Categorie ${id} not found.`);
    }

    return categorie;
  }

  async create(dto: CreateCategorieDto) {
    const nom = normalizeRequiredString(dto.nom, 'nom');
    const slug = await this.resolveUniqueSlug(
      normalizeOptionalString(dto.slug) ?? nom,
    );

    return this.prisma.categorie.create({
      data: {
        nom,
        slug,
        description: normalizeOptionalString(dto.description),
      },
    });
  }

  async update(id: number, dto: UpdateCategorieDto) {
    await this.findOne(id);

    const data: Record<string, unknown> = {};

    if (dto.nom !== undefined) {
      data.nom = normalizeRequiredString(dto.nom, 'nom');
    }

    if (dto.slug !== undefined) {
      const requestedSlug =
        normalizeOptionalString(dto.slug) ?? (data.nom as string);
      data.slug = await this.resolveUniqueSlug(requestedSlug, id);
    }

    if (dto.description !== undefined) {
      data.description = normalizeOptionalString(dto.description);
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields were provided for update.');
    }

    return this.prisma.categorie.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.categorie.delete({ where: { id } });
  }

  private async resolveUniqueSlug(
    source: string,
    excludeId?: number,
  ): Promise<string> {
    const base = slugify(source) || `categorie-${Date.now()}`;
    let candidate = base;
    let suffix = 1;

    while (true) {
      const existing = await this.prisma.categorie.findUnique({
        where: { slug: candidate },
      });

      if (!existing || existing.id === excludeId) {
        return candidate;
      }

      suffix += 1;
      candidate = `${base}-${suffix}`;
    }
  }
}
