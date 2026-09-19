import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/users.entity';
import { DataSourceOptions } from 'typeorm';
import { Document } from '../documents/documents.entity';
import { StripeWebhookEvent } from '../stripe-webhook-events/stripe-webhook.events.entity';
import { Subscription } from '../subscriptions/subscriptions.entity';

export const getTypeOrmConfig = (
  configService: ConfigService,
): DataSourceOptions => ({
  type: 'postgres',
  host: configService.getOrThrow<string>('DB_HOST'),
  port: configService.getOrThrow<number>('DB_PORT'),
  username: configService.getOrThrow<string>('DB_USERNAME'),
  password: configService.getOrThrow<string>('DB_PASSWORD'),
  database: configService.getOrThrow<string>('DB_NAME'),
  entities: [User, Document, Subscription, StripeWebhookEvent],
  migrations: [join(__dirname, '..', 'migrations', '*{.ts,.js}')],
  synchronize: false,
});
