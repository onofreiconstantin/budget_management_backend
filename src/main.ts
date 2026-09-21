import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);

  if (configService.getOrThrow<string>('NODE_ENV') !== 'development') {
    app.getHttpAdapter().getInstance().set('trust proxy', 1);
  }

  await app.listen(configService.getOrThrow<number>('PORT'));
}
bootstrap();
