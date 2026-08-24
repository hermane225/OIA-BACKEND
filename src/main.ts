import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(helmet({ contentSecurityPolicy: false }));
  app.enableCors();
  app.set('trust proxy', 1);
  app.get(PrismaService).enableShutdownHooks(app);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('OIA Cafe-Cacao API')
    .setDescription(
      "API du backend d'administration du site OIA Cafe-Cacao. Les routes /admin/* necessitent un token Bearer obtenu via POST /auth/login.",
    )
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'token' })
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, swaggerDocument);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
