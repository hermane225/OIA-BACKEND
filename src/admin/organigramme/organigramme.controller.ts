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
import { OrganigrammeService } from './organigramme.service';
import {
  CreateOrganigrammeDto,
  UpdateOrganigrammeDto,
} from './dto/organigramme.dto';

@ApiTags('Organigramme')
@ApiBearerAuth()
@Controller('admin/organigramme')
@UseGuards(RolesGuard, PermissionsGuard)
@Roles('super_admin', 'admin', 'editor', 'manager')
export class OrganigrammeController {
  constructor(private readonly organigrammeService: OrganigrammeService) {}

  @Get()
  @Permissions('organigramme:read')
  findAll() {
    return this.organigrammeService.findAll();
  }

  @Get(':id')
  @Permissions('organigramme:read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.organigrammeService.findOne(id);
  }

  @Post()
  @Permissions('organigramme:create')
  create(@Body() dto: CreateOrganigrammeDto) {
    return this.organigrammeService.create(dto);
  }

  @Patch(':id')
  @Permissions('organigramme:update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrganigrammeDto,
  ) {
    return this.organigrammeService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('organigramme:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.organigrammeService.remove(id);
  }
}
