import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateStatsDto {
  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  matchesPlayed?: number;

  @ApiProperty({ example: 5, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  goals?: number;

  @ApiProperty({ example: 3, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  assists?: number;
}
