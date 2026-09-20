import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Document } from '../documents/documents.entity';
import { Subscription } from '../subscriptions/subscriptions.entity';
import { OrganizationUser } from '../organization-users/organization-users.entity';
import { Admin } from '../admins/admins.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'first_name',
  })
  firstName: string;

  @Column({
    name: 'last_name',
  })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    name: 'stripe_customer_id',
    type: 'varchar',
    nullable: true,
    unique: true,
  })
  stripeCustomerId: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @Column({ name: 'archived_at', type: 'timestamptz', nullable: true })
  archivedAt: Date | null;

  @Column({ name: 'archived_by_id', type: 'uuid', nullable: true })
  archivedById: string | null;

  @ManyToOne(() => User, (user) => user.archivedUsers, { nullable: true })
  @JoinColumn({ name: 'archived_by_id' })
  archivedBy: User | null;

  @OneToMany(() => User, (user) => user.archivedBy)
  archivedUsers: User[];

  @OneToOne(() => Document, (document) => document.avatarUser, {
    nullable: true,
  })
  avatar: Document | null;

  @OneToMany(() => Document, (document) => document.user)
  documents: Document[];

  @OneToOne(() => Subscription, (subscription) => subscription.user, {
    nullable: true,
  })
  subscription: Subscription | null;

  @OneToMany(
    () => OrganizationUser,
    (organizationUser) => organizationUser.user,
  )
  organizationUsers: OrganizationUser[];

  @OneToOne(() => Admin, (admin) => admin.user, { nullable: true })
  admin: Admin | null;
}
