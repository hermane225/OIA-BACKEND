import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StatutPublication } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { slugify } from '../../common/utils/slug.util';
import {
  normalizeOptionalDate,
  normalizeOptionalInteger,
  normalizeOptionalString,
  normalizeRequiredString,
} from '../../common/utils/normalize.util';
import { CreateActualiteDto } from './dto/create-actualite.dto';
import { UpdateActualiteDto } from './dto/update-actualite.dto';

type StatutValue = (typeof StatutPublication)[keyof typeof StatutPublication];

type ActualiteListFilters = {
  search?: string;
  categorieId?: string;
  statut?: string;
};

function normalizeStatut(value: unknown): StatutValue | undefined {
  const normalized = normalizeOptionalString(value);

  if (normalized === undefined || normalized === null) {
    return undefined;
  }

  const statut = normalized as StatutValue;

  if (!Object.values(StatutPublication).includes(statut)) {
    throw new BadRequestException(`Invalid statut: ${normalized}`);
  }

  return statut;
}

@Injectable()
export class ActualitesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: ActualiteListFilters = {}) {
    const search = normalizeOptionalString(filters.search);
    const categorieId = normalizeOptionalInteger(
      filters.categorieId,
      'categorieId',
    );
    const statut = normalizeStatut(filters.statut);

    return this.prisma.actualite.findMany({
      where: {
        ...(statut ? { statut } : {}),
        ...(categorieId === undefined ? {} : { categorieId }),
        ...(search
          ? {
              OR: [
                { titre: { contains: search, mode: 'insensitive' as const } },
                { contenu: { contains: search, mode: 'insensitive' as const } },
                { auteur: { contains: search, mode: 'insensitive' as const } },
              ],
            }
          : {}),
      },
      include: { categorie: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const actualite = await this.prisma.actualite.findUnique({
      where: { id },
      include: { categorie: true },
    });

    if (!actualite) {
      throw new NotFoundException(`Actualite ${id} not found.`);
    }

    return actualite;
  }

  async create(dto: CreateActualiteDto) {
    const titre = normalizeRequiredString(dto.titre, 'titre');
    const contenu = normalizeRequiredString(dto.contenu, 'contenu');
    const auteur = normalizeRequiredString(dto.auteur, 'auteur');
    const categorieId = await this.resolveCategorieId(
      normalizeOptionalInteger(dto.categorieId, 'categorieId'),
    );
    const statut = normalizeStatut(dto.statut) ?? StatutPublication.brouillon;
    const datePub = this.resolveDatePub(
      normalizeOptionalDate(dto.datePub, 'datePub'),
      statut,
    );
    const slug = await this.resolveUniqueSlug(
      normalizeOptionalString(dto.slug) ?? titre,
    );

    return this.prisma.actualite.create({
      data: {
        titre,
        slug,
        contenu,
        extrait: normalizeOptionalString(dto.extrait),
        auteur,
        categorieId,
        imagePrincipale: normalizeOptionalString(dto.imagePrincipale),
        statut,
        datePub,
      },
      include: { categorie: true },
    });
  }

  async update(id: number, dto: UpdateActualiteDto) {
    await this.findOne(id);

    const data: Record<string, unknown> = {};

    if (dto.titre !== undefined) {
      data.titre = normalizeRequiredString(dto.titre, 'titre');
    }

    if (dto.slug !== undefined) {
      const requestedSlug =
        normalizeOptionalString(dto.slug) ?? (data.titre as string);
      data.slug = await this.resolveUniqueSlug(requestedSlug, id);
    }

    if (dto.contenu !== undefined) {
      data.contenu = normalizeRequiredString(dto.contenu, 'contenu');
    }

    if (dto.extrait !== undefined) {
      data.extrait = normalizeOptionalString(dto.extrait);
    }

    if (dto.auteur !== undefined) {
      data.auteur = normalizeRequiredString(dto.auteur, 'auteur');
    }

    if (dto.categorieId !== undefined) {
      data.categorieId = await this.resolveCategorieId(
        normalizeOptionalInteger(dto.categorieId, 'categorieId'),
      );
    }

    if (dto.imagePrincipale !== undefined) {
      data.imagePrincipale = normalizeOptionalString(dto.imagePrincipale);
    }

    let statut: StatutValue | undefined;
    if (dto.statut !== undefined) {
      statut = normalizeStatut(dto.statut);
      data.statut = statut;
    }

    if (dto.datePub !== undefined) {
      data.datePub = normalizeOptionalDate(dto.datePub, 'datePub');
    } else if (statut) {
      data.datePub = this.resolveDatePub(undefined, statut);
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields were provided for update.');
    }

    return this.prisma.actualite.update({
      where: { id },
      data,
      include: { categorie: true },
    });
  }

  async findPublishedBySlug(slug: string) {
    const actualite = await this.prisma.actualite.findUnique({
      where: { slug },
      include: { categorie: true },
    });

    if (!actualite || actualite.statut !== StatutPublication.publie) {
      throw new NotFoundException(`Actualite ${slug} not found.`);
    }

    return actualite;
  }

  async publish(id: number) {
    await this.findOne(id);

    return this.prisma.actualite.update({
      where: { id },
      data: { statut: StatutPublication.publie, datePub: new Date() },
      include: { categorie: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.actualite.delete({ where: { id } });
  }

  private resolveDatePub(
    explicit: Date | null | undefined,
    statut: StatutValue,
  ): Date | null | undefined {
    if (explicit !== undefined) {
      return explicit;
    }

    return statut === StatutPublication.publie ? new Date() : undefined;
  }

  private async resolveCategorieId(
    categorieId: number | null | undefined,
  ): Promise<number | null | undefined> {
    if (categorieId === undefined || categorieId === null) {
      return categorieId;
    }

    const categorie = await this.prisma.categorie.findUnique({
      where: { id: categorieId },
    });

    if (!categorie) {
      throw new BadRequestException(`Categorie ${categorieId} does not exist.`);
    }

    return categorieId;
  }

  private async resolveUniqueSlug(
    source: string,
    excludeId?: number,
  ): Promise<string> {
    const base = slugify(source) || `actualite-${Date.now()}`;
    let candidate = base;
    let suffix = 1;

    while (true) {
      const existing = await this.prisma.actualite.findUnique({
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
