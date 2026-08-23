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
import { CategoriesService } from './categories.service';
import { CreateCategorieDto } from './dto/create-categorie.dto';
import { UpdateCategorieDto } from './dto/update-categorie.dto';

@Controller('admin/categories')
@UseGuards(RolesGuard, PermissionsGuard)
@Roles('super_admin', 'admin', 'editor', 'manager')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @Permissions('categories:read')
  findAll(@Query('search') search?: string) {
    return this.categoriesService.findAll(search);
  }

  @Get(':id')
  @Permissions('categories:read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  @Post()
  @Permissions('categories:create')
  create(@Body() dto: CreateCategorieDto) {
    return this.categoriesService.create(dto);
  }

  @Patch(':id')
  @Permissions('categories:update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategorieDto,
  ) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('categories:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}
