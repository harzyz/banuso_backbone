/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsUrl,
  IsNotEmpty,
} from 'class-validator';
import { PostStatus } from '../../../entities/post.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'Post title',
    example: 'Post Title',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Post body',
    example: 'Post Body',
  })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiProperty({
    description: 'Post description',
    example: 'Post Description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Post image URL',
    example: 'https://example.com/image.jpg',
  })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    description: 'Post slug',
    example: 'post-slug',
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    description: 'Post status',
    examples: [PostStatus.DRAFT, PostStatus.PUBLISHED, PostStatus.ARCHIVED],
  })
  @IsEnum(PostStatus)
  @IsNotEmpty()
  status: PostStatus;

  @ApiProperty({
    description: 'Post is public',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}
