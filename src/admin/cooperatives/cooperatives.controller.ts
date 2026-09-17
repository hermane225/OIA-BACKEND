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
import { CooperativesService } from './cooperatives.service';
import {
  CreateCooperativeDto,
  UpdateCooperativeDto,
} from './dto/cooperative.dto';

@ApiTags('Cooperatives')
@ApiBearerAuth()
@Controller('admin/cooperatives')
@UseGuards(RolesGuard, PermissionsGuard)
@Roles('super_admin', 'admin', 'editor', 'manager')
export class CooperativesController {
  constructor(private readonly cooperativesService: CooperativesService) {}

  @Get()
  @Permissions('cooperatives:read')
  findAll() {
    return this.cooperativesService.findAll();
  }

  @Get(':id')
  @Permissions('cooperatives:read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cooperativesService.findOne(id);
  }

  @Post()
  @Permissions('cooperatives:create')
  create(@Body() dto: CreateCooperativeDto) {
    return this.cooperativesService.create(dto);
  }

  @Patch(':id')
  @Permissions('cooperatives:update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCooperativeDto,
  ) {
    return this.cooperativesService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('cooperatives:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cooperativesService.remove(id);
  }
}
