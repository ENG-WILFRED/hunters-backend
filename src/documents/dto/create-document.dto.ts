import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDocumentDto {
  @ApiProperty({ example: 'passport.pdf' })
  @IsString()
  filename: string;

  @ApiProperty({ example: 'data:application/pdf;base64,...' })
  @IsString()
  base64: string;

  @ApiProperty({ example: 'application/pdf', required: false })
  @IsOptional()
  @IsString()
  mime?: string;

  @ApiProperty({ example: 1, required: false, description: 'Player ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  playerId?: number;
}
