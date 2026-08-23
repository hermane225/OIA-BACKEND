import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(helmet());
  app.enableCors();
  app.set('trust proxy', 1);
  app.get(PrismaService).enableShutdownHooks(app);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
