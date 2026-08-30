import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ContactStatut } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { normalizeEmail } from '../auth/utils/auth-crypto.util';
import {
  normalizeOptionalString,
  normalizeRequiredString,
} from '../common/utils/normalize.util';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { UpdateContactMessageDto } from './dto/update-contact-message.dto';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeStatut(value: unknown): ContactStatut {
  const normalized = normalizeRequiredString(value, 'statut') as ContactStatut;

  if (!Object.values(ContactStatut).includes(normalized)) {
    throw new BadRequestException(`Invalid statut: ${normalized}`);
  }

  return normalized;
}

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async submit(dto: CreateContactMessageDto) {
    const nom = normalizeRequiredString(dto.nom, 'nom');
    const email = normalizeEmail(normalizeRequiredString(dto.email, 'email'));
    const message = normalizeRequiredString(dto.message, 'message');
    const telephone = normalizeOptionalString(dto.telephone);
    const sujet = normalizeOptionalString(dto.sujet);

    if (!EMAIL_REGEX.test(email)) {
      throw new BadRequestException('email is not a valid email address.');
    }

    const created = await this.prisma.contactMessage.create({
      data: { nom, email, telephone, sujet, message },
    });

    this.mailService
      .sendContactNotification({ nom, email, telephone, sujet, message })
      .catch((error) =>
        this.logger.error('Failed to send contact notification email', error),
      );

    return created;
  }

  async findAll(filters: { statut?: string } = {}) {
    const statut = filters.statut ? normalizeStatut(filters.statut) : undefined;

    return this.prisma.contactMessage.findMany({
      where: statut ? { statut } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const message = await this.prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!message) {
      throw new NotFoundException(`Contact message ${id} not found.`);
    }

    return message;
  }

  async updateStatut(id: number, dto: UpdateContactMessageDto) {
    await this.findOne(id);

    const statut = normalizeStatut(dto.statut);

    return this.prisma.contactMessage.update({
      where: { id },
      data: { statut },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.contactMessage.delete({ where: { id } });
  }
}
