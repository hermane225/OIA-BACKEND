import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  normalizeOptionalDecimal,
  normalizeOptionalInteger,
} from '../../common/utils/normalize.util';
import {
  CreatePrixTendanceHistoriqueDto,
  UpdatePrixTendanceHistoriqueDto,
} from './dto/prix-tendance-historique.dto';

const historiqueInclude = { campagne: true, prixTendance: true };

function normalizeRequiredDecimal(value: unknown, label: string): string {
  const normalized = normalizeOptionalDecimal(value, label);

  if (typeof normalized !== 'string') {
    throw new BadRequestException(`${label} is required.`);
  }

  return normalized;
}

function normalizeRequiredInteger(value: unknown, label: string): number {
  const normalized = normalizeOptionalInteger(value, label);

  if (typeof normalized !== 'number') {
    throw new BadRequestException(`${label} is required.`);
  }

  return normalized;
}

@Injectable()
export class PrixTendanceHistoriqueService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    filters: { prixTendanceId?: string; campagneId?: string } = {},
  ) {
    const prixTendanceId = normalizeOptionalInteger(
      filters.prixTendanceId,
      'prixTendanceId',
    );
    const campagneId = normalizeOptionalInteger(
      filters.campagneId,
      'campagneId',
    );

    return this.prisma.prixTendanceHistorique.findMany({
      where: {
        ...(prixTendanceId ? { prixTendanceId } : {}),
        ...(campagneId === undefined ? {} : { campagneId }),
      },
      include: historiqueInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const historique = await this.prisma.prixTendanceHistorique.findUnique({
      where: { id },
      include: historiqueInclude,
    });

    if (!historique) {
      throw new NotFoundException(`Prix tendance historique ${id} not found.`);
    }

    return historique;
  }

  async create(dto: CreatePrixTendanceHistoriqueDto) {
    const prixTendanceId = normalizeRequiredInteger(
      dto.prixTendanceId,
      'prixTendanceId',
    );
    await this.ensurePrixTendanceExists(prixTendanceId);

    const campagneId = normalizeOptionalInteger(dto.campagneId, 'campagneId');
    if (campagneId) {
      await this.ensureCampagneExists(campagneId);
    }

    return this.prisma.prixTendanceHistorique.create({
      data: {
        prixTendanceId,
        campagneId,
        prixNat: normalizeRequiredDecimal(dto.prixNat, 'prixNat'),
        prixInter: normalizeRequiredDecimal(dto.prixInter, 'prixInter'),
        pmgBordChamp: normalizeOptionalDecimal(
          dto.pmgBordChamp,
          'pmgBordChamp',
        ),
        differentielRamassage: normalizeOptionalDecimal(
          dto.differentielRamassage,
          'differentielRamassage',
        ),
        forfaitTransport: normalizeOptionalDecimal(
          dto.forfaitTransport,
          'forfaitTransport',
        ),
        entreeUsine: normalizeOptionalDecimal(dto.entreeUsine, 'entreeUsine'),
        locoMagasin: normalizeOptionalDecimal(dto.locoMagasin, 'locoMagasin'),
        fobGaranti: normalizeOptionalDecimal(dto.fobGaranti, 'fobGaranti'),
        cafGarantiEu: normalizeOptionalDecimal(
          dto.cafGarantiEu,
          'cafGarantiEu',
        ),
      },
      include: historiqueInclude,
    });
  }

  async update(id: number, dto: UpdatePrixTendanceHistoriqueDto) {
    await this.findOne(id);

    const data: Record<string, unknown> = {};

    if (dto.campagneId !== undefined) {
      const campagneId = normalizeOptionalInteger(dto.campagneId, 'campagneId');
      if (campagneId) {
        await this.ensureCampagneExists(campagneId);
      }
      data.campagneId = campagneId;
    }

    if (dto.prixNat !== undefined) {
      data.prixNat = normalizeRequiredDecimal(dto.prixNat, 'prixNat');
    }

    if (dto.prixInter !== undefined) {
      data.prixInter = normalizeRequiredDecimal(dto.prixInter, 'prixInter');
    }

    if (dto.pmgBordChamp !== undefined) {
      data.pmgBordChamp = normalizeOptionalDecimal(
        dto.pmgBordChamp,
        'pmgBordChamp',
      );
    }

    if (dto.differentielRamassage !== undefined) {
      data.differentielRamassage = normalizeOptionalDecimal(
        dto.differentielRamassage,
        'differentielRamassage',
      );
    }

    if (dto.forfaitTransport !== undefined) {
      data.forfaitTransport = normalizeOptionalDecimal(
        dto.forfaitTransport,
        'forfaitTransport',
      );
    }

    if (dto.entreeUsine !== undefined) {
      data.entreeUsine = normalizeOptionalDecimal(
        dto.entreeUsine,
        'entreeUsine',
      );
    }

    if (dto.locoMagasin !== undefined) {
      data.locoMagasin = normalizeOptionalDecimal(
        dto.locoMagasin,
        'locoMagasin',
      );
    }

    if (dto.fobGaranti !== undefined) {
      data.fobGaranti = normalizeOptionalDecimal(dto.fobGaranti, 'fobGaranti');
    }

    if (dto.cafGarantiEu !== undefined) {
      data.cafGarantiEu = normalizeOptionalDecimal(
        dto.cafGarantiEu,
        'cafGarantiEu',
      );
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields were provided for update.');
    }

    return this.prisma.prixTendanceHistorique.update({
      where: { id },
      data,
      include: historiqueInclude,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.prixTendanceHistorique.delete({ where: { id } });
  }

  private async ensurePrixTendanceExists(id: number): Promise<void> {
    const exists = await this.prisma.prixTendance.findUnique({ where: { id } });

    if (!exists) {
      throw new BadRequestException(`PrixTendance ${id} does not exist.`);
    }
  }

  private async ensureCampagneExists(id: number): Promise<void> {
    const exists = await this.prisma.campagne.findUnique({ where: { id } });

    if (!exists) {
      throw new BadRequestException(`Campagne ${id} does not exist.`);
    }
  }
}
