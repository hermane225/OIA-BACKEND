import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { Permissions } from '../common/decorators/permissions.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SiteSettingsService } from './site-settings.service';
import { UpsertSiteSettingsDto } from './dto/upsert-site-settings.dto';

@Controller('site-settings')
export class SiteSettingsController {
  constructor(private readonly siteSettingsService: SiteSettingsService) {}

  @Public()
  @Get()
  findAllPublic() {
    return this.siteSettingsService.findAllAsMap();
  }
}

@Controller('admin/site-settings')
@UseGuards(RolesGuard, PermissionsGuard)
@Roles('super_admin', 'admin')
export class SiteSettingsAdminController {
  constructor(private readonly siteSettingsService: SiteSettingsService) {}

  @Get()
  @Permissions('settings:read')
  findAll() {
    return this.siteSettingsService.findAll();
  }

  @Patch()
  @Permissions('settings:update')
  upsert(@Body() dto: UpsertSiteSettingsDto) {
    return this.siteSettingsService.upsertMany(dto);
  }
}
