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
import { ActesOiaService } from './actes-oia.service';
import { CreateActeOiaDto, UpdateActeOiaDto } from './dto/acte-oia.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Actes OIA')
@ApiBearerAuth()
@Controller('admin/actes-oia')
@UseGuards(RolesGuard, PermissionsGuard)
@Roles('super_admin', 'admin', 'editor', 'manager')
export class ActesOiaController {
  constructor(private readonly actesOiaService: ActesOiaService) {}

  @Get()
  @Permissions('actes:read')
  findAll(@Query('search') search?: string) {
    return this.actesOiaService.findAll(search);
  }

  @Get(':id')
  @Permissions('actes:read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.actesOiaService.findOne(id);
  }

  @Post()
  @Permissions('actes:create')
  create(@Body() dto: CreateActeOiaDto) {
    return this.actesOiaService.create(dto);
  }

  @Patch(':id')
  @Permissions('actes:update')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateActeOiaDto) {
    return this.actesOiaService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('actes:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.actesOiaService.remove(id);
  }
}
