import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SubscriptionTier } from './utils/enums.utils';
import { SubscriptionStatus } from './utils/types.utils';
import { User } from '../users/users.entity';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid', unique: true })
  userId: string;

  @OneToOne(() => User, (user) => user.subscription)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'stripe_subscription_id', type: 'varchar', unique: true })
  stripeSubscriptionId: string;

  @Column({ name: 'stripe_product_id', type: 'varchar' })
  stripeProductId: string;

  @Column({ type: 'enum', enum: SubscriptionTier })
  tier: SubscriptionTier;

  @Column()
  status: SubscriptionStatus;

  @Column({ name: 'current_period_start', type: 'timestamptz' })
  currentPeriodStart: Date;

  @Column({ name: 'current_period_end', type: 'timestamptz' })
  currentPeriodEnd: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
