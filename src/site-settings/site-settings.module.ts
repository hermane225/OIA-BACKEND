import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import {
  SiteSettingsAdminController,
  SiteSettingsController,
} from './site-settings.controller';
import { SiteSettingsService } from './site-settings.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [SiteSettingsController, SiteSettingsAdminController],
  providers: [SiteSettingsService],
})
export class SiteSettingsModule {}
