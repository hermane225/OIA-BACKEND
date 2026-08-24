import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Permissions } from '../common/decorators/permissions.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ContactService } from './contact.service';
import { UpdateContactMessageDto } from './dto/update-contact-message.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Contact (Admin)')
@ApiBearerAuth()
@Controller('admin/contact-messages')
@UseGuards(RolesGuard, PermissionsGuard)
@Roles('super_admin', 'admin', 'manager')
export class ContactAdminController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  @Permissions('contact:read')
  findAll(@Query('statut') statut?: string) {
    return this.contactService.findAll({ statut });
  }

  @Get(':id')
  @Permissions('contact:read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contactService.findOne(id);
  }

  @Patch(':id')
  @Permissions('contact:update')
  updateStatut(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateContactMessageDto,
  ) {
    return this.contactService.updateStatut(id, dto);
  }

  @Delete(':id')
  @Permissions('contact:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contactService.remove(id);
  }
}
