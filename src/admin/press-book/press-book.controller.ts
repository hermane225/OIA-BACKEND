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
import { PressBookService } from './press-book.service';
import { CreatePressBookDto, UpdatePressBookDto } from './dto/press-book.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Press book')
@ApiBearerAuth()
@Controller('admin/press-book')
@UseGuards(RolesGuard, PermissionsGuard)
@Roles('super_admin', 'admin', 'editor', 'manager')
export class PressBookController {
  constructor(private readonly pressBookService: PressBookService) {}

  @Get()
  @Permissions('pressbook:read')
  findAll(@Query('search') search?: string) {
    return this.pressBookService.findAll(search);
  }

  @Get(':id')
  @Permissions('pressbook:read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pressBookService.findOne(id);
  }

  @Post()
  @Permissions('pressbook:create')
  create(@Body() dto: CreatePressBookDto) {
    return this.pressBookService.create(dto);
  }

  @Patch(':id')
  @Permissions('pressbook:update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePressBookDto,
  ) {
    return this.pressBookService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('pressbook:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pressBookService.remove(id);
  }
}
