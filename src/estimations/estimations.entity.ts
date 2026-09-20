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
import { Document } from '../documents/documents.entity';
import { Transaction } from '../transactions/transactions.entity';
import { TransactionType } from '../common/enums';

@Entity('estimations')
export class Estimation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('idx_estimations_organization_id')
  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ name: 'created_by_id', type: 'uuid' })
  createdById: string;

  @ManyToOne(
    () => OrganizationUser,
    (organizationUser) => organizationUser.estimations,
  )
  @JoinColumn({ name: 'created_by_id' })
  createdBy: OrganizationUser;

  @Column({ name: 'transaction_entity_id', type: 'uuid' })
  transactionEntityId: string;

  @ManyToOne(() => TransactionEntity)
  @JoinColumn({ name: 'transaction_entity_id' })
  transactionEntity: TransactionEntity;

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

  @OneToMany(() => Transaction, (transaction) => transaction.estimation)
  transactions: Transaction[];

  @OneToMany(() => Document, (document) => document.estimation)
  documents: Document[];
}
