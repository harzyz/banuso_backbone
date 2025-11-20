import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post, PostStatus } from '../../../entities/post.entity';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(postData: Partial<Post>): Promise<Post> {
    const post = this.postRepository.create(postData);
    return await this.postRepository.save(post);
  }

  async findById(id: string): Promise<Post | null> {
    return await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });
  }

  async findBySlug(slug: string): Promise<Post | null> {
    return await this.postRepository.findOne({
      where: { slug },
      relations: ['author'],
    });
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    status?: PostStatus;
    authorId?: string;
    isPublic?: boolean;
  }): Promise<{ posts: Post[]; total: number }> {
    const { page = 1, limit = 10, status, authorId, isPublic } = options || {};
    const skip = (page - 1) * limit;

    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author');

    if (status) {
      queryBuilder.where('post.status = :status', { status });
    }

    if (authorId) {
      queryBuilder.andWhere('post.authorId = :authorId', { authorId });
    }

    if (isPublic !== undefined) {
      queryBuilder.andWhere('post.isPublic = :isPublic', { isPublic });
    }

    const [posts, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('post.publishedAt', 'DESC')
      .addOrderBy('post.createdAt', 'DESC')
      .getManyAndCount();

    return { posts, total };
  }

  async findPublicPosts(options?: {
    page?: number;
    limit?: number;
  }): Promise<{ posts: Post[]; total: number }> {
    return this.findAll({
      ...options,
      status: PostStatus.PUBLISHED,
      isPublic: true,
    });
  }

  async update(id: string, updateData: Partial<Post>): Promise<Post> {
    await this.postRepository.update(id, updateData);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Post not found after update');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.postRepository.delete(id);
  }

  async existsBySlug(slug: string): Promise<boolean> {
    const count = await this.postRepository.count({
      where: { slug },
    });
    return count > 0;
  }

  async findByAuthorId(
    authorId: string,
    options?: {
      page?: number;
      limit?: number;
    },
  ): Promise<{ posts: Post[]; total: number }> {
    return this.findAll({
      ...options,
      authorId,
    });
  }
}
