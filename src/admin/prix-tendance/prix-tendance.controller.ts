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
import { PrixTendanceService } from './prix-tendance.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CreatePrixTendanceDto,
  UpdatePrixTendanceDto,
} from './dto/prix-tendance.dto';

@ApiTags('Prix tendance')
@ApiBearerAuth()
@Controller('admin/prix-tendance')
@UseGuards(RolesGuard, PermissionsGuard)
@Roles('super_admin', 'admin', 'editor', 'manager')
export class PrixTendanceController {
  constructor(private readonly prixTendanceService: PrixTendanceService) {}

  @Get()
  @Permissions('prixtendance:read')
  findAll(@Query('search') search?: string) {
    return this.prixTendanceService.findAll(search);
  }

  @Get(':id')
  @Permissions('prixtendance:read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.prixTendanceService.findOne(id);
  }

  @Post()
  @Permissions('prixtendance:create')
  create(@Body() dto: CreatePrixTendanceDto) {
    return this.prixTendanceService.create(dto);
  }

  @Patch(':id')
  @Permissions('prixtendance:update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePrixTendanceDto,
  ) {
    return this.prixTendanceService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('prixtendance:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.prixTendanceService.remove(id);
  }
}
