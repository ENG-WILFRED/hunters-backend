import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 'John Doe', description: 'Name of the poster' })
  name: string;

  @ApiProperty({
    example: 'This is my message',
    description: 'Post message content',
  })
  message: string;
}
