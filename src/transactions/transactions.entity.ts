import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Organization } from '../organizations/organizations.entity';
import { OrganizationUser } from '../organization-users/organization-users.entity';
import { TransactionEntity } from '../transaction-entities/transaction-entities.entity';
import { Estimation } from '../estimations/estimations.entity';
import { Document } from '../documents/documents.entity';
import { TransactionType } from '../common/enums';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('idx_transactions_organization_id')
  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ name: 'created_by_id', type: 'uuid' })
  createdById: string;

  @ManyToOne(
    () => OrganizationUser,
    (organizationUser) => organizationUser.transactions,
  )
  @JoinColumn({ name: 'created_by_id' })
  createdBy: OrganizationUser;

  @Column({ name: 'transaction_entity_id', type: 'uuid' })
  transactionEntityId: string;

  @ManyToOne(
    () => TransactionEntity,
    (transactionEntity) => transactionEntity.transactions,
  )
  @JoinColumn({ name: 'transaction_entity_id' })
  transactionEntity: TransactionEntity;

  @Column({ name: 'estimation_id', type: 'uuid', nullable: true })
  estimationId: string | null;

  @ManyToOne(() => Estimation, (estimation) => estimation.transactions, {
    nullable: true,
  })
  @JoinColumn({ name: 'estimation_id' })
  estimation: Estimation | null;

  @Column({ type: 'numeric', precision: 19, scale: 4 })
  amount: string;

  @Column({ type: 'timestamptz' })
  date: Date;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @Column({ name: 'archived_at', type: 'timestamptz', nullable: true })
  archivedAt: Date | null;

  @Column({ name: 'archived_by_id', type: 'uuid', nullable: true })
  archivedById: string | null;

  @ManyToOne(() => OrganizationUser, { nullable: true })
  @JoinColumn({ name: 'archived_by_id' })
  archivedBy: OrganizationUser | null;

  @OneToMany(() => Document, (document) => document.transaction)
  documents: Document[];
}
