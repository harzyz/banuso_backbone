import { Injectable } from '@nestjs/common';
import { PostsRepository } from './repositories/posts.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostStatus } from '../../entities/post.entity';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async create(createPostDto: CreatePostDto, authorId: string): Promise<Post> {
    if (!authorId) {
      throw new Error('Author ID is required');
    }

    // Generate slug from title if not provided
    const slug = createPostDto.slug || this.generateSlug(createPostDto.title);

    // Check if slug already exists
    const slugExists = await this.postsRepository.existsBySlug(slug);
    if (slugExists) {
      throw new Error('Post with this slug already exists');
    }

    // Calculate read time (average 200 words per minute)
    const readTime = this.calculateReadTime(createPostDto.body);

    // Set publishedAt if status is PUBLISHED
    const publishedAt: Date | null =
      createPostDto.status === PostStatus.PUBLISHED ? new Date() : null;

    const postData: Partial<Post> = {
      ...createPostDto,
      slug,
      readTime,
      authorId,
      publishedAt,
    };

    return await this.postsRepository.create(postData);
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    status?: PostStatus;
    authorId?: string;
  }) {
    return await this.postsRepository.findAll(options);
  }

  async findPublicPosts(options?: { page?: number; limit?: number }) {
    return await this.postsRepository.findPublicPosts(options);
  }

  async findById(id: string): Promise<Post | null> {
    return await this.postsRepository.findById(id);
  }

  async findBySlug(slug: string): Promise<Post | null> {
    return await this.postsRepository.findBySlug(slug);
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const updateData: Partial<Post> = { ...updatePostDto };

    // Recalculate read time if body is updated
    if (updatePostDto.body) {
      updateData.readTime = this.calculateReadTime(updatePostDto.body);
    }

    // Update publishedAt if status changes to PUBLISHED
    if (updatePostDto.status === PostStatus.PUBLISHED) {
      const existingPost = await this.findById(id);
      if (existingPost && !existingPost.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    // Generate new slug if title is updated
    if (updatePostDto.title && !updatePostDto.slug) {
      updateData.slug = this.generateSlug(updatePostDto.title);
    }

    return await this.postsRepository.update(id, updateData);
  }

  async delete(id: string): Promise<void> {
    return await this.postsRepository.delete(id);
  }

  async togglePublic(id: string, isPublic: boolean): Promise<Post> {
    return await this.postsRepository.update(id, { isPublic });
  }

  // Helper: Generate URL-friendly slug from title
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .substring(0, 255); // Limit length
  }

  // Helper: Calculate read time in minutes
  private calculateReadTime(body: string): number {
    const wordsPerMinute = 200;
    const wordCount = body.trim().split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute) || 1; // Minimum 1 minute
  }
}
