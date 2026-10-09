import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import connectPgSimple from 'connect-pg-simple';
import session from 'express-session';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SESSION_MAX_AGE } from './common/constants.utils';

const PostgresSessionStore = connectPgSimple(session);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: configService.getOrThrow<string>('CORS_ORIGINS').split(','),
    credentials: true,
  });

  const isDevelopment =
    configService.getOrThrow<string>('NODE_ENV') === 'development';

  if (!isDevelopment) {
    app.set('trust proxy', 1);
  }

  app.use(
    session({
      store: new PostgresSessionStore({
        conObject: {
          host: configService.getOrThrow<string>('DB_HOST'),
          port: configService.getOrThrow<number>('DB_PORT'),
          user: configService.getOrThrow<string>('DB_USERNAME'),
          password: configService.getOrThrow<string>('DB_PASSWORD'),
          database: configService.getOrThrow<string>('DB_NAME'),
        },
        createTableIfMissing: false,
      }),
      secret: configService.getOrThrow<string>('COOKIE_KEY'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: SESSION_MAX_AGE,
        secure: !isDevelopment,
      },
    }),
  );

  await app.listen(configService.getOrThrow<number>('PORT'));
}
void bootstrap();
