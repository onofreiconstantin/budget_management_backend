import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/users.entity';
import { Organization } from '../organizations/organizations.entity';
import { OrganizationInvitation } from '../organization-invitations/organization-invitations.entity';
import { OrganizationPermission } from '../common/enums';
import { Document } from '../documents/documents.entity';
import { TransactionEntity } from '../transaction-entities/transaction-entities.entity';
import { Estimation } from '../estimations/estimations.entity';
import { Transaction } from '../transactions/transactions.entity';

@Entity('organization_users')
@Unique(['userId', 'organizationId'])
export class OrganizationUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.organizationUsers)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ name: 'is_owner', type: 'boolean', default: false })
  isOwner: boolean;

  @Column({ type: 'enum', enum: OrganizationPermission, array: true })
  permissions: OrganizationPermission[];

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

  @OneToMany(() => Document, (document) => document.organizationUser)
  documents: Document[];

  @OneToMany(() => OrganizationInvitation, (invitation) => invitation.invitedBy)
  invitations: OrganizationInvitation[];

  @OneToMany(
    () => TransactionEntity,
    (transactionEntity) => transactionEntity.createdBy,
  )
  transactionEntities: TransactionEntity[];

  @OneToMany(() => Estimation, (estimation) => estimation.createdBy)
  estimations: Estimation[];

  @OneToMany(() => Transaction, (transaction) => transaction.createdBy)
  transactions: Transaction[];
}
