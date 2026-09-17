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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { FiliereStatsService } from './filiere-stats.service';
import {
  CreateFiliereStatDto,
  UpdateFiliereStatDto,
} from './dto/filiere-stat.dto';

@ApiTags('Filiere stats')
@ApiBearerAuth()
@Controller('admin/filiere-stats')
@UseGuards(RolesGuard, PermissionsGuard)
@Roles('super_admin', 'admin', 'editor', 'manager')
export class FiliereStatsController {
  constructor(private readonly filiereStatsService: FiliereStatsService) {}

  @Get()
  @Permissions('filierestats:read')
  findAll(@Query('filiere') filiere?: string) {
    return this.filiereStatsService.findAll(filiere);
  }

  @Get(':id')
  @Permissions('filierestats:read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.filiereStatsService.findOne(id);
  }

  @Post()
  @Permissions('filierestats:create')
  create(@Body() dto: CreateFiliereStatDto) {
    return this.filiereStatsService.create(dto);
  }

  @Patch(':id')
  @Permissions('filierestats:update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFiliereStatDto,
  ) {
    return this.filiereStatsService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('filierestats:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.filiereStatsService.remove(id);
  }
}
