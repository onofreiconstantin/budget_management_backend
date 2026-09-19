import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StripeWebhookEventStatus } from './utils/enums';
import { StripeWebhookEventAttempt } from './utils/types';

@Entity('stripe_webhook_events')
export class StripeWebhookEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'stripe_event_id', unique: true })
  stripeEventId: string;

  @Index('idx_stripe_webhook_events_customer')
  @Column({ name: 'stripe_customer_id', type: 'varchar', nullable: true })
  stripeCustomerId: string | null;

  @Index('idx_stripe_webhook_events_subscription')
  @Column({ name: 'stripe_subscription_id', type: 'varchar', nullable: true })
  stripeSubscriptionId: string | null;

  @Column({ name: 'event_type' })
  eventType: string;

  @Column({
    type: 'enum',
    enum: StripeWebhookEventStatus,
    default: StripeWebhookEventStatus.PROCESSING,
  })
  status: StripeWebhookEventStatus;

  @Column({
    type: 'jsonb',
    default: () => "'[]'",
  })
  attempts: StripeWebhookEventAttempt[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
