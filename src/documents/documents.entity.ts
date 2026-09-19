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

@Entity('documents')
@Check('num_nonnulls("avatar_user_id", "user_id") = 1')
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

  @Column({ name: 'avatar_user_id', type: 'uuid', nullable: true, unique: true })
  avatarUserId: string | null;

  @OneToOne(() => User, (user) => user.avatar, { nullable: true })
  @JoinColumn({ name: 'avatar_user_id' })
  avatarUser: User | null;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string | null;

  @ManyToOne(() => User, (user) => user.documents, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @Column({ name: 'archived_at', type: 'timestamptz', nullable: true })
  archivedAt: Date | null;

  @Column({ name: 'archived_by_id', type: 'uuid', nullable: true })
  archivedById: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'archived_by_id' })
  archivedBy: User | null;
}
