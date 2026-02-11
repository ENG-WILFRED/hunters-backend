import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private svc: PostsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  create(@Body() body: CreatePostDto) {
    return this.svc.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'List all posts' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of posts to return',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Number of posts to skip',
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    enum: ['latest', 'oldest'],
    description: 'Sort order',
  })
  findAll(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('orderBy') orderBy?: 'latest' | 'oldest',
  ) {
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    const offsetNum = offset ? parseInt(offset, 10) : undefined;
    return this.svc.findAll(limitNum, offsetNum, orderBy || 'latest');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a post by ID' })
  findById(@Param('id') id: number) {
    return this.svc.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a post' })
  update(@Param('id') id: number, @Body() body: Partial<CreatePostDto>) {
    return this.svc.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post' })
  remove(@Param('id') id: number) {
    return this.svc.remove(id);
  }
}
