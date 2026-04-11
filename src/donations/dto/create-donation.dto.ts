import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDonationDto {
  @ApiProperty({ example: 1000, description: 'Amount in KES' })
  @Type(() => Number)
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'Alice Smith', required: false })
  @IsOptional()
  @IsString()
  donorName?: string;

  @ApiProperty({
    example: 1,
    required: false,
    description: 'Player ID (optional)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  playerId?: number;
}
