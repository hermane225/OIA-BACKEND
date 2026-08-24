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
import { CreatePartenaireDto } from './dto/create-partenaire.dto';
import { UpdatePartenaireDto } from './dto/update-partenaire.dto';
import { PartenairesService } from './partenaires.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Partenaires')
@ApiBearerAuth()
@Controller('admin/partenaires')
@UseGuards(RolesGuard, PermissionsGuard)
@Roles('super_admin', 'admin')
export class PartenairesController {
  constructor(private readonly partenairesService: PartenairesService) {}

  @Get()
  @Permissions('partenaires:read')
  findAll(
    @Query('search') search?: string,
    @Query('type') type?: string,
    @Query('typeOrgId') typeOrgId?: string,
  ) {
    return this.partenairesService.findAll({
      search,
      type,
      typeOrgId,
    });
  }

  @Get(':id')
  @Permissions('partenaires:read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.partenairesService.findOne(id);
  }

  @Post()
  @Permissions('partenaires:create')
  create(@Body() dto: CreatePartenaireDto) {
    return this.partenairesService.create(dto);
  }

  @Patch(':id')
  @Permissions('partenaires:update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePartenaireDto,
  ) {
    return this.partenairesService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('partenaires:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.partenairesService.remove(id);
  }
}
