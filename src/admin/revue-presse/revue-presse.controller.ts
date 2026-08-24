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
import { RevuePresseService } from './revue-presse.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CreateRevuePresseDto,
  UpdateRevuePresseDto,
} from './dto/revue-presse.dto';

@ApiTags('Revue de presse')
@ApiBearerAuth()
@Controller('admin/revue-presse')
@UseGuards(RolesGuard, PermissionsGuard)
@Roles('super_admin', 'admin', 'editor', 'manager')
export class RevuePresseController {
  constructor(private readonly revuePresseService: RevuePresseService) {}

  @Get()
  @Permissions('revuepresse:read')
  findAll(@Query('search') search?: string) {
    return this.revuePresseService.findAll(search);
  }

  @Get(':id')
  @Permissions('revuepresse:read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.revuePresseService.findOne(id);
  }

  @Post()
  @Permissions('revuepresse:create')
  create(@Body() dto: CreateRevuePresseDto) {
    return this.revuePresseService.create(dto);
  }

  @Patch(':id')
  @Permissions('revuepresse:update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRevuePresseDto,
  ) {
    return this.revuePresseService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('revuepresse:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.revuePresseService.remove(id);
  }
}
