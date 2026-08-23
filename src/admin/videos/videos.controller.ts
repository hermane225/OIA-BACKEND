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
import { VideosService } from './videos.service';
import { CreateVideoDto, UpdateVideoDto } from './dto/video.dto';

@Controller('admin/videos')
@UseGuards(RolesGuard, PermissionsGuard)
@Roles('super_admin', 'admin', 'editor', 'manager')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get()
  @Permissions('videos:read')
  findAll(@Query('search') search?: string) {
    return this.videosService.findAll(search);
  }

  @Get(':id')
  @Permissions('videos:read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.videosService.findOne(id);
  }

  @Post()
  @Permissions('videos:create')
  create(@Body() dto: CreateVideoDto) {
    return this.videosService.create(dto);
  }

  @Patch(':id')
  @Permissions('videos:update')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateVideoDto) {
    return this.videosService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('videos:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.videosService.remove(id);
  }
}
