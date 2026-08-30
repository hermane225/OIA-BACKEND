import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { MailModule } from '../mail/mail.module';
import { ContactAdminController } from './contact-admin.controller';
import { ContactPublicController } from './contact-public.controller';
import { ContactService } from './contact.service';

@Module({
  imports: [PrismaModule, AuthModule, MailModule],
  controllers: [ContactPublicController, ContactAdminController],
  providers: [ContactService],
})
export class ContactModule {}
