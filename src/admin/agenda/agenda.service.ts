import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StatutPublication } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  normalizeOptionalDate,
  normalizeOptionalString,
  normalizeRequiredString,
} from '../../common/utils/normalize.util';
import { AgendaDocumentInput, CreateAgendaDto } from './dto/create-agenda.dto';
import { UpdateAgendaDto } from './dto/update-agenda.dto';

type StatutValue = (typeof StatutPublication)[keyof typeof StatutPublication];

type AgendaListFilters = {
  search?: string;
  statut?: string;
};

const agendaInclude = {
  images: { orderBy: { createdAt: 'asc' as const } },
  documents: { orderBy: { createdAt: 'asc' as const } },
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

function normalizeRequiredDate(value: unknown, label: string): Date {
  const date = normalizeOptionalDate(value, label);

  if (!date) {
    throw new BadRequestException(`${label} is required.`);
  }

  return date;
}

function normalizeImages(images: unknown): string[] | undefined {
  if (images === undefined) {
    return undefined;
  }

  if (!Array.isArray(images)) {
    throw new BadRequestException('images must be an array of URLs.');
  }

  return images.map((url) => normalizeRequiredString(url, 'images[].url'));
}

function normalizeDocuments(
  documents: unknown,
): { titre: string; url: string }[] | undefined {
  if (documents === undefined) {
    return undefined;
  }

  if (!Array.isArray(documents)) {
    throw new BadRequestException('documents must be an array.');
  }

  return (documents as AgendaDocumentInput[]).map((doc) => ({
    titre: normalizeRequiredString(doc.titre, 'documents[].titre'),
    url: normalizeRequiredString(doc.url, 'documents[].url'),
  }));
}

@Injectable()
export class AgendaService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: AgendaListFilters = {}) {
    const search = normalizeOptionalString(filters.search);
    const statut = normalizeStatut(filters.statut);

    return this.prisma.agenda.findMany({
      where: {
        ...(statut ? { statut } : {}),
        ...(search
          ? {
              OR: [
                { titre: { contains: search, mode: 'insensitive' as const } },
                {
                  description: {
                    contains: search,
                    mode: 'insensitive' as const,
                  },
                },
                { ville: { contains: search, mode: 'insensitive' as const } },
              ],
            }
          : {}),
      },
      include: agendaInclude,
      orderBy: { dateDeb: 'desc' },
    });
  }

  async findOne(id: number) {
    const agenda = await this.prisma.agenda.findUnique({
      where: { id },
      include: agendaInclude,
    });

    if (!agenda) {
      throw new NotFoundException(`Agenda ${id} not found.`);
    }

    return agenda;
  }

  async create(dto: CreateAgendaDto) {
    const titre = normalizeRequiredString(dto.titre, 'titre');
    const dateDeb = normalizeRequiredDate(dto.dateDeb, 'dateDeb');
    const statut = normalizeStatut(dto.statut) ?? StatutPublication.brouillon;
    const datePub = this.resolveDatePub(
      normalizeOptionalDate(dto.datePub, 'datePub'),
      statut,
    );
    const images = normalizeImages(dto.images) ?? [];
    const documents = normalizeDocuments(dto.documents) ?? [];

    return this.prisma.agenda.create({
      data: {
        titre,
        description: normalizeOptionalString(dto.description),
        dateDeb,
        dateFin: normalizeOptionalDate(dto.dateFin, 'dateFin'),
        heureDeb: normalizeOptionalString(dto.heureDeb),
        heureFin: normalizeOptionalString(dto.heureFin),
        ville: normalizeOptionalString(dto.ville),
        adresse: normalizeOptionalString(dto.adresse),
        infosPratiques: normalizeOptionalString(dto.infosPratiques),
        imageCouverture: normalizeOptionalString(dto.imageCouverture),
        statut,
        datePub,
        images: { create: images.map((url) => ({ url })) },
        documents: { create: documents },
      },
      include: agendaInclude,
    });
  }

  async update(id: number, dto: UpdateAgendaDto) {
    await this.findOne(id);

    const data: Record<string, unknown> = {};

    if (dto.titre !== undefined) {
      data.titre = normalizeRequiredString(dto.titre, 'titre');
    }

    if (dto.description !== undefined) {
      data.description = normalizeOptionalString(dto.description);
    }

    if (dto.dateDeb !== undefined) {
      data.dateDeb = normalizeRequiredDate(dto.dateDeb, 'dateDeb');
    }

    if (dto.dateFin !== undefined) {
      data.dateFin = normalizeOptionalDate(dto.dateFin, 'dateFin');
    }

    if (dto.heureDeb !== undefined) {
      data.heureDeb = normalizeOptionalString(dto.heureDeb);
    }

    if (dto.heureFin !== undefined) {
      data.heureFin = normalizeOptionalString(dto.heureFin);
    }

    if (dto.ville !== undefined) {
      data.ville = normalizeOptionalString(dto.ville);
    }

    if (dto.adresse !== undefined) {
      data.adresse = normalizeOptionalString(dto.adresse);
    }

    if (dto.infosPratiques !== undefined) {
      data.infosPratiques = normalizeOptionalString(dto.infosPratiques);
    }

    if (dto.imageCouverture !== undefined) {
      data.imageCouverture = normalizeOptionalString(dto.imageCouverture);
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

    const images = normalizeImages(dto.images);
    const documents = normalizeDocuments(dto.documents);

    if (
      Object.keys(data).length === 0 &&
      images === undefined &&
      documents === undefined
    ) {
      throw new BadRequestException('No fields were provided for update.');
    }

    await this.prisma.$transaction(async (tx) => {
      if (Object.keys(data).length > 0) {
        await tx.agenda.update({ where: { id }, data });
      }

      if (images !== undefined) {
        await tx.agendaImage.deleteMany({ where: { agendaId: id } });
        if (images.length > 0) {
          await tx.agendaImage.createMany({
            data: images.map((url) => ({ agendaId: id, url })),
          });
        }
      }

      if (documents !== undefined) {
        await tx.agendaDocument.deleteMany({ where: { agendaId: id } });
        if (documents.length > 0) {
          await tx.agendaDocument.createMany({
            data: documents.map((doc) => ({ agendaId: id, ...doc })),
          });
        }
      }
    });

    return this.findOne(id);
  }

  async findPublishedOne(id: number) {
    const agenda = await this.prisma.agenda.findUnique({
      where: { id },
      include: agendaInclude,
    });

    if (!agenda || agenda.statut !== StatutPublication.publie) {
      throw new NotFoundException(`Agenda ${id} not found.`);
    }

    return agenda;
  }

  async publish(id: number) {
    await this.findOne(id);

    return this.prisma.agenda.update({
      where: { id },
      data: { statut: StatutPublication.publie, datePub: new Date() },
      include: agendaInclude,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.agenda.delete({ where: { id } });
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
}
