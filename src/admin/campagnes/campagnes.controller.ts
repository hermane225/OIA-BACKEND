import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { CampagnesService } from './campagnes.service';
import { CreateCampagneDto, UpdateCampagneDto } from './dto/campagne.dto';

@Controller('admin/campagnes')
@UseGuards(RolesGuard, PermissionsGuard)
@Roles('super_admin', 'admin', 'editor', 'manager')
export class CampagnesController {
  constructor(private readonly campagnesService: CampagnesService) {}

  @Get()
  @Permissions('campagnes:read')
  findAll(@Query('search') search?: string) {
    return this.campagnesService.findAll(search);
  }

  @Get(':id')
  @Permissions('campagnes:read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.campagnesService.findOne(id);
  }

  @Post()
  @Permissions('campagnes:create')
  create(@Body() dto: CreateCampagneDto) {
    return this.campagnesService.create(dto);
  }

  @Patch(':id')
  @Permissions('campagnes:update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCampagneDto,
  ) {
    return this.campagnesService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('campagnes:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.campagnesService.remove(id);
  }
}
