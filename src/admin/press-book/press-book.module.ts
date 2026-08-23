import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { PressBookController } from './press-book.controller';
import { PressBookService } from './press-book.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [PressBookController],
  providers: [PressBookService],
  exports: [PressBookService],
})
export class PressBookModule {}
