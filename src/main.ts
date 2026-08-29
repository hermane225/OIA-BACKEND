import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { UPLOAD_FOLDERS } from './uploads/upload-folders';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(helmet({ contentSecurityPolicy: false }));

  const uploadsRoot = join(process.cwd(), 'uploads');
  for (const folder of UPLOAD_FOLDERS) {
    const dir = join(uploadsRoot, folder);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }
  app.useStaticAssets(uploadsRoot, { prefix: '/uploads' });

  const allowedOrigins = (
    process.env.CORS_ORIGINS ??
    'https://backend-oiacafecacao.com,https://www.backend-oiacafecacao.com'
  )
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });
  app.set('trust proxy', 1);
  app.get(PrismaService).enableShutdownHooks(app);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('OIA Cafe-Cacao API')
    .setDescription(
      "API du backend d'administration du site OIA Cafe-Cacao. Les routes /admin/* necessitent un token Bearer obtenu via POST /auth/login.",
    )
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'token' })
    .addServer('https://backend-oiacafecacao.com')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, swaggerDocument);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
