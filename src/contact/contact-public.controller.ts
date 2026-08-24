import { Body, Controller, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { ContactService } from './contact.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';

@ApiTags('Public')
@Controller('contact')
export class ContactPublicController {
  constructor(private readonly contactService: ContactService) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post()
  async submit(@Body() dto: CreateContactMessageDto) {
    await this.contactService.submit(dto);

    return { message: 'Message received successfully.' };
  }
}
