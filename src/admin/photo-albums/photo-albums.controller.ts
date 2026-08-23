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
import { PhotoAlbumsService } from './photo-albums.service';
import {
  CreatePhotoAlbumDto,
  UpdatePhotoAlbumDto,
} from './dto/photo-album.dto';

@Controller('admin/photo-albums')
@UseGuards(RolesGuard, PermissionsGuard)
@Roles('super_admin', 'admin', 'editor', 'manager')
export class PhotoAlbumsController {
  constructor(private readonly photoAlbumsService: PhotoAlbumsService) {}

  @Get()
  @Permissions('photos:read')
  findAll(@Query('search') search?: string) {
    return this.photoAlbumsService.findAll(search);
  }

  @Get(':id')
  @Permissions('photos:read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.photoAlbumsService.findOne(id);
  }

  @Post()
  @Permissions('photos:create')
  create(@Body() dto: CreatePhotoAlbumDto) {
    return this.photoAlbumsService.create(dto);
  }

  @Patch(':id')
  @Permissions('photos:update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePhotoAlbumDto,
  ) {
    return this.photoAlbumsService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('photos:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.photoAlbumsService.remove(id);
  }
}
