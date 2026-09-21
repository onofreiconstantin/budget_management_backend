import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Organization } from '../organizations/organizations.entity';
import { OrganizationUser } from '../organization-users/organization-users.entity';
import { Document } from '../documents/documents.entity';
import { Estimation } from '../estimations/estimations.entity';
import { Transaction } from '../transactions/transactions.entity';
import { TransactionEntityType } from './utils/enums.utils';

@Entity('transaction_entities')
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('idx_transaction_entities_organization_id')
  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ name: 'created_by_id', type: 'uuid' })
  createdById: string;

  @ManyToOne(
    () => OrganizationUser,
    (organizationUser) => organizationUser.transactionEntities,
  )
  @JoinColumn({ name: 'created_by_id' })
  createdBy: OrganizationUser;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: TransactionEntityType, array: true })
  types: TransactionEntityType[];

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

  @OneToOne(() => Document, (document) => document.transactionEntity, {
    nullable: true,
  })
  logo: Document | null;

  @OneToMany(() => Estimation, (estimation) => estimation.transactionEntity)
  estimations: Estimation[];

  @OneToMany(() => Transaction, (transaction) => transaction.transactionEntity)
  transactions: Transaction[];
}
