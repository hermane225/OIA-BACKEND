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
import { ProjetsService } from './projets.service';
import { CreateProjetDto, UpdateProjetDto } from './dto/projet.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Projets')
@ApiBearerAuth()
@Controller('admin/projets')
@UseGuards(RolesGuard, PermissionsGuard)
@Roles('super_admin', 'admin', 'editor', 'manager')
export class ProjetsController {
  constructor(private readonly projetsService: ProjetsService) {}

  @Get()
  @Permissions('projets:read')
  findAll(@Query('search') search?: string) {
    return this.projetsService.findAll(search);
  }

  @Get(':id')
  @Permissions('projets:read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projetsService.findOne(id);
  }

  @Post()
  @Permissions('projets:create')
  create(@Body() dto: CreateProjetDto) {
    return this.projetsService.create(dto);
  }

  @Patch(':id')
  @Permissions('projets:update')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProjetDto) {
    return this.projetsService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('projets:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projetsService.remove(id);
  }
}
