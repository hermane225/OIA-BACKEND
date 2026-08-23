import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertSiteSettingsDto } from './dto/upsert-site-settings.dto';

@Injectable()
export class SiteSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.siteSetting.findMany({ orderBy: { cle: 'asc' } });
  }

  async findAllAsMap(): Promise<Record<string, string | null>> {
    const settings = await this.findAll();

    return settings.reduce<Record<string, string | null>>((acc, setting) => {
      acc[setting.cle] = setting.valeur;
      return acc;
    }, {});
  }

  async upsertMany(dto: UpsertSiteSettingsDto) {
    if (!Array.isArray(dto.settings) || dto.settings.length === 0) {
      throw new BadRequestException('settings must be a non-empty array.');
    }

    const entries = dto.settings.map((entry) => {
      const cle = String(entry.cle ?? '').trim();

      if (!cle) {
        throw new BadRequestException('Each setting requires a non-empty cle.');
      }

      const valeur =
        entry.valeur === undefined || entry.valeur === null
          ? null
          : String(entry.valeur);

      return { cle, valeur };
    });

    return Promise.all(
      entries.map(({ cle, valeur }) =>
        this.prisma.siteSetting.upsert({
          where: { cle },
          create: { cle, valeur },
          update: { valeur },
        }),
      ),
    );
  }
}
