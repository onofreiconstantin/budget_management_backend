import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/users.entity';
import { AdminPermission } from './utils/enums.utils';
import { Document } from '../documents/documents.entity';

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid', unique: true })
  userId: string;

  @OneToOne(() => User, (user) => user.admin)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'granted_by_id', type: 'uuid', nullable: true })
  grantedById: string | null;

  @ManyToOne(() => Admin, (admin) => admin.grantedAdmins, { nullable: true })
  @JoinColumn({ name: 'granted_by_id' })
  grantedBy: Admin | null;

  @Column({ name: 'is_owner', type: 'boolean', default: false })
  isOwner: boolean;

  @Column({ type: 'enum', enum: AdminPermission, array: true })
  permissions: AdminPermission[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @Column({ name: 'archived_at', type: 'timestamptz', nullable: true })
  archivedAt: Date | null;

  @Column({ name: 'archived_by_id', type: 'uuid', nullable: true })
  archivedById: string | null;

  @ManyToOne(() => Admin, (admin) => admin.archivedAdmins, { nullable: true })
  @JoinColumn({ name: 'archived_by_id' })
  archivedBy: Admin | null;

  @OneToMany(() => Admin, (admin) => admin.grantedBy)
  grantedAdmins: Admin[];

  @OneToMany(() => Admin, (admin) => admin.archivedBy)
  archivedAdmins: Admin[];

  @OneToMany(() => Document, (document) => document.admin)
  documents: Document[];
}
