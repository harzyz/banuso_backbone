import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Admin } from './admin.entity';

export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

@Entity('posts')
@Index(['status'])
@Index(['isPublic'])
@Index(['publishedAt'])
@Index(['createdAt'])
@Index(['slug'], { unique: true })
@Index(['authorId'])
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({
    type: 'enum',
    enum: PostStatus,
    default: PostStatus.DRAFT,
  })
  status: PostStatus;

  @Column({ type: 'boolean', default: false })
  isPublic: boolean; // Toggle visibility on public website

  @Column({ type: 'int', nullable: true })
  readTime: number; // Minutes to read

  @Column({ type: 'uuid' })
  authorId: string;

  // Many-to-One relationship: Many posts belong to one admin
  @ManyToOne(() => Admin, (admin) => admin.posts, {
    onDelete: 'CASCADE', // Delete posts when admin is deleted
  })
  @JoinColumn({ name: 'authorId' })
  author: Admin;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
