import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'John Doe', description: 'Name of the poster' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'This is my message',
    description: 'Post message content',
  })
  @IsString()
  message: string;
}
