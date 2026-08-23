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
import { AgendaService } from './agenda.service';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { UpdateAgendaDto } from './dto/update-agenda.dto';

@Controller('admin/agenda')
@UseGuards(RolesGuard, PermissionsGuard)
@Roles('super_admin', 'admin', 'editor', 'manager')
export class AgendaController {
  constructor(private readonly agendaService: AgendaService) {}

  @Get()
  @Permissions('agenda:read')
  findAll(@Query('search') search?: string, @Query('statut') statut?: string) {
    return this.agendaService.findAll({ search, statut });
  }

  @Get(':id')
  @Permissions('agenda:read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.agendaService.findOne(id);
  }

  @Post()
  @Permissions('agenda:create')
  create(@Body() dto: CreateAgendaDto) {
    return this.agendaService.create(dto);
  }

  @Patch(':id')
  @Permissions('agenda:update')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAgendaDto) {
    return this.agendaService.update(id, dto);
  }

  @Patch(':id/publish')
  @Permissions('agenda:publish')
  publish(@Param('id', ParseIntPipe) id: number) {
    return this.agendaService.publish(id);
  }

  @Delete(':id')
  @Permissions('agenda:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.agendaService.remove(id);
  }
}
