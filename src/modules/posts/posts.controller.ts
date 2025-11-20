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
} from '@nestjs/swagger';

@ApiTags('Posts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('admin/create')
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
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({
    status: 200,
    description: 'Posts fetched successfully',
  })
  getAllPosts() {
    return this.postsService.findAll();
  }

  @Patch('admin/:id')
  @ApiOperation({ summary: 'Update a post' })
  @ApiResponse({
    status: 200,
    description: 'Post updated successfully',
  })
  updatePost(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete('admin/:id')
  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({
    status: 200,
    description: 'Post deleted successfully',
  })
  deletePost(@Param('id') id: string) {
    return this.postsService.delete(id);
  }

  @Get('public')
  @ApiOperation({ summary: 'Get all public posts' })
  @ApiResponse({
    status: 200,
    description: 'Public posts fetched successfully',
  })
  getPublicPosts() {
    return this.postsService.findPublicPosts();
  }
}
