import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ContactAdminController } from './contact-admin.controller';
import { ContactPublicController } from './contact-public.controller';
import { ContactService } from './contact.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ContactPublicController, ContactAdminController],
  providers: [ContactService],
})
export class ContactModule {}
