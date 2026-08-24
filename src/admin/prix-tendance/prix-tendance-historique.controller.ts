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
import { PrixTendanceHistoriqueService } from './prix-tendance-historique.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CreatePrixTendanceHistoriqueDto,
  UpdatePrixTendanceHistoriqueDto,
} from './dto/prix-tendance-historique.dto';

@ApiTags('Prix tendance historiques')
@ApiBearerAuth()
@Controller('admin/prix-tendance-historiques')
@UseGuards(RolesGuard, PermissionsGuard)
@Roles('super_admin', 'admin', 'editor', 'manager')
export class PrixTendanceHistoriqueController {
  constructor(
    private readonly historiqueService: PrixTendanceHistoriqueService,
  ) {}

  @Get()
  @Permissions('prixtendance:read')
  findAll(
    @Query('prixTendanceId') prixTendanceId?: string,
    @Query('campagneId') campagneId?: string,
  ) {
    return this.historiqueService.findAll({ prixTendanceId, campagneId });
  }

  @Get(':id')
  @Permissions('prixtendance:read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.historiqueService.findOne(id);
  }

  @Post()
  @Permissions('prixtendance:create')
  create(@Body() dto: CreatePrixTendanceHistoriqueDto) {
    return this.historiqueService.create(dto);
  }

  @Patch(':id')
  @Permissions('prixtendance:update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePrixTendanceHistoriqueDto,
  ) {
    return this.historiqueService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('prixtendance:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.historiqueService.remove(id);
  }
}
