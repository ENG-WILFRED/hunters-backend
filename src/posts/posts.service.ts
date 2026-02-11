import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectRepository(Post) private repo: Repository<Post>) {}

  create(data: CreatePostDto) {
    const post = this.repo.create(data);
    return this.repo.save(post);
  }

  findAll(
    limit?: number,
    offset?: number,
    orderBy: 'latest' | 'oldest' = 'latest',
  ) {
    const query = this.repo.createQueryBuilder('post');

    if (orderBy === 'latest') {
      query.orderBy('post.createdAt', 'DESC');
    } else {
      query.orderBy('post.createdAt', 'ASC');
    }

    if (limit) {
      query.take(limit);
    }

    if (offset) {
      query.skip(offset);
    }

    return query.getMany();
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  update(id: number, data: Partial<CreatePostDto>) {
    return this.repo.update(id, data);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
