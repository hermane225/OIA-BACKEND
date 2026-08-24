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
import { ActualitesService } from './actualites.service';
import { CreateActualiteDto } from './dto/create-actualite.dto';
import { UpdateActualiteDto } from './dto/update-actualite.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Actualites')
@ApiBearerAuth()
@Controller('admin/actualites')
@UseGuards(RolesGuard, PermissionsGuard)
@Roles('super_admin', 'admin', 'editor', 'manager')
export class ActualitesController {
  constructor(private readonly actualitesService: ActualitesService) {}

  @Get()
  @Permissions('actualites:read')
  findAll(
    @Query('search') search?: string,
    @Query('categorieId') categorieId?: string,
    @Query('statut') statut?: string,
  ) {
    return this.actualitesService.findAll({ search, categorieId, statut });
  }

  @Get(':id')
  @Permissions('actualites:read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.actualitesService.findOne(id);
  }

  @Post()
  @Permissions('actualites:create')
  create(@Body() dto: CreateActualiteDto) {
    return this.actualitesService.create(dto);
  }

  @Patch(':id')
  @Permissions('actualites:update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateActualiteDto,
  ) {
    return this.actualitesService.update(id, dto);
  }

  @Patch(':id/publish')
  @Permissions('actualites:publish')
  publish(@Param('id', ParseIntPipe) id: number) {
    return this.actualitesService.publish(id);
  }

  @Delete(':id')
  @Permissions('actualites:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.actualitesService.remove(id);
  }
}
