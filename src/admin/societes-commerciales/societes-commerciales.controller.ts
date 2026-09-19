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
import { SocietesCommercialesService } from './societes-commerciales.service';
import {
  CreateSocieteCommercialeDto,
  UpdateSocieteCommercialeDto,
} from './dto/societe-commerciale.dto';

@ApiTags('Societes commerciales')
@ApiBearerAuth()
@Controller('admin/societes-commerciales')
@UseGuards(RolesGuard, PermissionsGuard)
@Roles('super_admin', 'admin', 'editor', 'manager')
export class SocietesCommercialesController {
  constructor(
    private readonly societesCommercialesService: SocietesCommercialesService,
  ) {}

  @Get()
  @Permissions('societescommerciales:read')
  findAll(
    @Query('search') search?: string,
    @Query('type') type?: string,
    @Query('campagneId') campagneId?: string,
    @Query('actif') actif?: string,
  ) {
    return this.societesCommercialesService.findAll({
      search,
      type,
      campagneId,
      actif,
    });
  }

  @Get(':id')
  @Permissions('societescommerciales:read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.societesCommercialesService.findOne(id);
  }

  @Post()
  @Permissions('societescommerciales:create')
  create(@Body() dto: CreateSocieteCommercialeDto) {
    return this.societesCommercialesService.create(dto);
  }

  @Patch(':id')
  @Permissions('societescommerciales:update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSocieteCommercialeDto,
  ) {
    return this.societesCommercialesService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('societescommerciales:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.societesCommercialesService.remove(id);
  }
}
