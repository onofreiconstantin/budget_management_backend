import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getTypeOrmConfig } from './database/typeorm.config';
import { APP_PIPE } from '@nestjs/core';
import connectPgSimple = require('connect-pg-simple');
import session = require('express-session');
import { SESSION_MAX_AGE } from './common/constants.utils';

const PostgresSessionStore = connectPgSimple(session);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        getTypeOrmConfig(configService),
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  constructor(private readonly configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          store: new PostgresSessionStore({
            conObject: {
              host: this.configService.getOrThrow<string>('DB_HOST'),
              port: this.configService.getOrThrow<number>('DB_PORT'),
              user: this.configService.getOrThrow<string>('DB_USERNAME'),
              password: this.configService.getOrThrow<string>('DB_PASSWORD'),
              database: this.configService.getOrThrow<string>('DB_NAME'),
            },
            createTableIfMissing: false,
          }),
          secret: this.configService.getOrThrow('COOKIE_KEY'),
          resave: false,
          saveUninitialized: false,
          cookie: {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: SESSION_MAX_AGE,
            secure:
              this.configService.getOrThrow<string>('NODE_ENV') !==
              'development',
          },
        }),
      )
      .forRoutes('*');
  }
}
