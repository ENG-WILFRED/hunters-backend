import { ApiProperty } from '@nestjs/swagger';

export class UpdateStatsDto {
  @ApiProperty({ example: 10, required: false })
  matchesPlayed?: number;

  @ApiProperty({ example: 5, required: false })
  goals?: number;

  @ApiProperty({ example: 3, required: false })
  assists?: number;
}
