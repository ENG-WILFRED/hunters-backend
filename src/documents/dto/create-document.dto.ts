import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty({ example: 'passport.pdf' })
  filename: string;

  @ApiProperty({ example: 'data:application/pdf;base64,...' })
  base64: string;

  @ApiProperty({ example: 'application/pdf', required: false })
  mime?: string;

  @ApiProperty({ example: 1, required: false, description: 'Player ID' })
  playerId?: number;
}
