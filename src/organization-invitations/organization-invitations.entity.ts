import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/users.entity';
import { Organization } from '../organizations/organizations.entity';
import { OrganizationPermission } from '../organization-users/utils/enums';
import { InvitationStatus } from './utils/enums';

@Entity('organization_invitations')
export class OrganizationInvitation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column()
  email: string;

  @Column({ name: 'token_hash', unique: true })
  tokenHash: string;

  @Column({
    type: 'enum',
    enum: InvitationStatus,
    default: InvitationStatus.PENDING,
  })
  status: InvitationStatus;

  @Column({ type: 'enum', enum: OrganizationPermission, array: true })
  permissions: OrganizationPermission[];

  @Column({ name: 'accepted_at', type: 'timestamptz', nullable: true })
  acceptedAt: Date | null;

  @Column({
    name: 'expires_at',
    type: 'timestamptz',
    default: () => "now() + interval '7 days'",
  })
  expiresAt: Date;

  @Column({ name: 'invited_by_id', type: 'uuid' })
  invitedById: string;

  @ManyToOne(() => User, (user) => user.invitations)
  @JoinColumn({ name: 'invited_by_id' })
  invitedBy: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
