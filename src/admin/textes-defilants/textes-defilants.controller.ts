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
import { TextesDefilantsService } from './textes-defilants.service';
import {
  CreateTexteDefilantDto,
  UpdateTexteDefilantDto,
} from './dto/texte-defilant.dto';

@ApiTags('Textes defilants')
@ApiBearerAuth()
@Controller('admin/textes-defilants')
@UseGuards(RolesGuard, PermissionsGuard)
@Roles('super_admin', 'admin', 'editor', 'manager')
export class TextesDefilantsController {
  constructor(
    private readonly textesDefilantsService: TextesDefilantsService,
  ) {}

  @Get()
  @Permissions('textesdefilants:read')
  findAll() {
    return this.textesDefilantsService.findAll();
  }

  @Get(':id')
  @Permissions('textesdefilants:read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.textesDefilantsService.findOne(id);
  }

  @Post()
  @Permissions('textesdefilants:create')
  create(@Body() dto: CreateTexteDefilantDto) {
    return this.textesDefilantsService.create(dto);
  }

  @Patch(':id')
  @Permissions('textesdefilants:update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTexteDefilantDto,
  ) {
    return this.textesDefilantsService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('textesdefilants:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.textesDefilantsService.remove(id);
  }
}
