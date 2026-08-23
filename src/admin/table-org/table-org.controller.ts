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
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { TableOrgService } from './table-org.service';
import { CreateTableOrgDto, UpdateTableOrgDto } from './dto/table-org.dto';

@Controller('admin/table-org')
@UseGuards(RolesGuard, PermissionsGuard)
@Roles('super_admin', 'admin')
export class TableOrgController {
  constructor(private readonly tableOrgService: TableOrgService) {}

  @Get()
  @Permissions('tableorg:read')
  findAll() {
    return this.tableOrgService.findAll();
  }

  @Get(':id')
  @Permissions('tableorg:read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tableOrgService.findOne(id);
  }

  @Post()
  @Permissions('tableorg:create')
  create(@Body() dto: CreateTableOrgDto) {
    return this.tableOrgService.create(dto);
  }

  @Patch(':id')
  @Permissions('tableorg:update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTableOrgDto,
  ) {
    return this.tableOrgService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('tableorg:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tableOrgService.remove(id);
  }
}
