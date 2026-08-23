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
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';
import { UtilisateursService } from './utilisateurs.service';

@Controller('admin/utilisateurs')
@UseGuards(RolesGuard, PermissionsGuard)
@Roles('super_admin', 'admin')
export class UtilisateursController {
  constructor(private readonly utilisateursService: UtilisateursService) {}

  @Get('roles')
  @Permissions('roles:read')
  listRoles() {
    return this.utilisateursService.listRoles();
  }

  @Get()
  @Permissions('users:read')
  findAll(@Query('search') search?: string, @Query('roleId') roleId?: string) {
    return this.utilisateursService.findAll({
      search,
      roleId,
    });
  }

  @Get(':id')
  @Permissions('users:read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.utilisateursService.findOne(id);
  }

  @Post()
  @Permissions('users:create')
  create(@Body() dto: CreateUtilisateurDto) {
    return this.utilisateursService.create(dto);
  }

  @Patch(':id')
  @Permissions('users:update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUtilisateurDto,
  ) {
    return this.utilisateursService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('users:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.utilisateursService.remove(id);
  }
}
