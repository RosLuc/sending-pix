import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig = app.get(AppConfigService);
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();
  await app.listen(appConfig.port);
}

bootstrap();
