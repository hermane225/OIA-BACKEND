import { Injectable, Logger } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';

export interface ContactNotificationInput {
  nom: string;
  email: string;
  telephone?: string | null;
  sujet?: string | null;
  message: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: Transporter | null;
  private readonly recipient: string | undefined;

  constructor() {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      this.logger.warn(
        'SMTP is not configured (SMTP_HOST/SMTP_USER/SMTP_PASS missing) — contact notification emails will be skipped.',
      );
      this.transporter = null;
      return;
    }

    const port = Number(SMTP_PORT ?? 465);

    this.transporter = createTransport({
      host: SMTP_HOST,
      port,
      secure: process.env.SMTP_SECURE
        ? process.env.SMTP_SECURE === 'true'
        : port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    this.recipient = process.env.CONTACT_RECIPIENT_EMAIL ?? SMTP_USER;
  }

  async sendContactNotification(input: ContactNotificationInput) {
    if (!this.transporter) {
      return;
    }

    const lines = [
      `Nom: ${input.nom}`,
      `Email: ${input.email}`,
      `Téléphone: ${input.telephone ?? '-'}`,
      `Sujet: ${input.sujet ?? '-'}`,
      '',
      input.message,
    ];

    try {
      await this.transporter.sendMail({
        from: `"Site OIA Café-Cacao" <${process.env.SMTP_USER}>`,
        to: this.recipient,
        replyTo: input.email,
        subject: `Nouveau message de contact${input.sujet ? ` — ${input.sujet}` : ''}`,
        text: lines.join('\n'),
      });
    } catch (error) {
      this.logger.error('Failed to send contact notification email', error);
    }
  }
}
