import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { ControleursQualiteService } from './controleurs-qualite.service';
import {
  CreateControleurQualiteDto,
  UpdateControleurQualiteDto,
} from './dto/controleur-qualite.dto';

@ApiTags('Controleurs qualite')
@ApiBearerAuth()
@Controller('admin/controleurs-qualite')
@UseGuards(RolesGuard, PermissionsGuard)
@Roles('super_admin', 'admin', 'editor', 'manager')
export class ControleursQualiteController {
  constructor(
    private readonly controleursQualiteService: ControleursQualiteService,
  ) {}

  @Get()
  @Permissions('controleursqualite:read')
  findAll() {
    return this.controleursQualiteService.findAll();
  }

  @Get(':id')
  @Permissions('controleursqualite:read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.controleursQualiteService.findOne(id);
  }

  @Post()
  @Permissions('controleursqualite:create')
  create(@Body() dto: CreateControleurQualiteDto) {
    return this.controleursQualiteService.create(dto);
  }

  @Patch(':id')
  @Permissions('controleursqualite:update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateControleurQualiteDto,
  ) {
    return this.controleursQualiteService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('controleursqualite:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.controleursQualiteService.remove(id);
  }
}
