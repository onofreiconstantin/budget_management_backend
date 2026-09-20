import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/users.entity';
import { OrganizationUser } from '../organization-users/organization-users.entity';
import { Admin } from '../admins/admins.entity';
import { TransactionEntity } from '../transaction-entities/transaction-entities.entity';
import { Estimation } from '../estimations/estimations.entity';
import { Transaction } from '../transactions/transactions.entity';

@Entity('documents')
@Check(
  'num_nonnulls("avatar_user_id", "user_id", "organization_user_id", "admin_id", "transaction_entity_id", "estimation_id", "transaction_id") = 1',
)
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'original_name',
  })
  originalName: string;

  @Column({ name: 'object_key', unique: true })
  objectKey: string;

  @Column({ name: 'mime_type' })
  mimeType: string;

  @Column({ name: 'size_bytes', type: 'bigint' })
  sizeBytes: string;

  @Column({ name: 'checksum' })
  checksum: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @Column({
    name: 'avatar_user_id',
    type: 'uuid',
    nullable: true,
    unique: true,
  })
  avatarUserId: string | null;

  @OneToOne(() => User, (user) => user.avatar, { nullable: true })
  @JoinColumn({ name: 'avatar_user_id' })
  avatarUser: User | null;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string | null;

  @ManyToOne(() => User, (user) => user.documents, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @Column({ name: 'organization_user_id', type: 'uuid', nullable: true })
  organizationUserId: string | null;

  @ManyToOne(
    () => OrganizationUser,
    (organizationUser) => organizationUser.documents,
    { nullable: true },
  )
  @JoinColumn({ name: 'organization_user_id' })
  organizationUser: OrganizationUser | null;

  @Column({ name: 'admin_id', type: 'uuid', nullable: true })
  adminId: string | null;

  @ManyToOne(() => Admin, (admin) => admin.documents, { nullable: true })
  @JoinColumn({ name: 'admin_id' })
  admin: Admin | null;

  @Column({
    name: 'transaction_entity_id',
    type: 'uuid',
    nullable: true,
    unique: true,
  })
  transactionEntityId: string | null;

  @OneToOne(
    () => TransactionEntity,
    (transactionEntity) => transactionEntity.logo,
    { nullable: true },
  )
  @JoinColumn({ name: 'transaction_entity_id' })
  transactionEntity: TransactionEntity | null;

  @Column({ name: 'estimation_id', type: 'uuid', nullable: true })
  estimationId: string | null;

  @ManyToOne(() => Estimation, (estimation) => estimation.documents, {
    nullable: true,
  })
  @JoinColumn({ name: 'estimation_id' })
  estimation: Estimation | null;

  @Column({ name: 'transaction_id', type: 'uuid', nullable: true })
  transactionId: string | null;

  @ManyToOne(() => Transaction, (transaction) => transaction.documents, {
    nullable: true,
  })
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction | null;
}
