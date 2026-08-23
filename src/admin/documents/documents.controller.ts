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
import { DocumentsService } from './documents.service';
import { CreateDocumentDto, UpdateDocumentDto } from './dto/document.dto';

@Controller('admin/documents')
@UseGuards(RolesGuard, PermissionsGuard)
@Roles('super_admin', 'admin', 'editor', 'manager')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  @Permissions('documents:read')
  findAll(@Query('search') search?: string) {
    return this.documentsService.findAll(search);
  }

  @Get(':id')
  @Permissions('documents:read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.documentsService.findOne(id);
  }

  @Post()
  @Permissions('documents:create')
  create(@Body() dto: CreateDocumentDto) {
    return this.documentsService.create(dto);
  }

  @Patch(':id')
  @Permissions('documents:update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDocumentDto,
  ) {
    return this.documentsService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('documents:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.documentsService.remove(id);
  }
}
