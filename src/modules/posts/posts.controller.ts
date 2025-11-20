import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  JwtAuthGuard,
  RequestWithUser,
} from 'src/common/guards/jwt-auth.gaurd';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('admin/create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({
    status: 201,
    description: 'Post created successfully',
  })
  createPost(
    @Body() createPostDto: CreatePostDto,
    @Request() req: RequestWithUser,
  ) {
    return this.postsService.create(createPostDto, req.user.sub);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({
    status: 200,
    description: 'Posts fetched successfully',
  })
  getAllPosts() {
    return this.postsService.findAll();
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get a post by id' })
  @ApiResponse({
    status: 200,
    description: 'Post fetched successfully',
  })
  getPostById(@Param('id') id: string) {
    return this.postsService.findById(id);
  }

  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a post' })
  @ApiResponse({
    status: 200,
    description: 'Post updated successfully',
  })
  updatePost(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({
    status: 200,
    description: 'Post deleted successfully',
  })
  deletePost(@Param('id') id: string) {
    return this.postsService.delete(id);
  }

  // Public endpoints - no authentication required
  @Get('public')
  @ApiOperation({ summary: 'Get all public posts' })
  @ApiResponse({
    status: 200,
    description: 'Public posts fetched successfully',
  })
  getPublicPosts() {
    return this.postsService.findPublicPosts();
  }

  @Get('public/:slug')
  @ApiOperation({ summary: 'Get a public post by slug' })
  @ApiResponse({
    status: 200,
    description: 'Public post fetched successfully',
  })
  getPublicPostBySlug(@Param('slug') slug: string) {
    return this.postsService.findBySlug(slug);
  }

  @Post('admin/upload-image')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('image')) // 'image' is the form field name
  @ApiOperation({ summary: 'Upload an image to Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Image file to upload (jpg, png, jpeg)',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Image uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        secure_url: {
          type: 'string',
          example:
            'https://res.cloudinary.com/your-cloud/image/upload/v1234567890/posts/image.jpg',
        },
        public_id: {
          type: 'string',
          example: 'posts/image',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid file type or missing file',
  })
  async uploadImage(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @UploadedFile() file: any,
  ): Promise<{ imageUrl: string }> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!file || !file.buffer) {
      throw new Error('No file provided');
    }

    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
    if (!file.mimetype || !allowedMimeTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type. Only JPEG and PNG are allowed.');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (file.size > maxSize) {
      throw new Error('File size too large. Maximum size is 5MB.');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    const result = await this.cloudinaryService.uploadImage(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
      file.buffer,
      'posts',
    );
    return { imageUrl: result.secure_url };
  }
}
