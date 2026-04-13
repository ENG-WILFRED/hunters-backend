import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDateString, IsOptional, IsInt } from 'class-validator';

export class CreateMatchDto {
  @ApiProperty({ example: 'Hunters FC' })
  @IsNotEmpty()
  @IsString()
  homeTeam: string;

  @ApiProperty({ example: 'Rugongo' })
  @IsNotEmpty()
  @IsString()
  awayTeam: string;

  @ApiProperty({ example: '2026-04-20T15:00:00.000Z' })
  @IsNotEmpty()
  @IsDateString()
  kickOff: Date;

  @ApiProperty({ example: 'Weru Stadium' })
  @IsNotEmpty()
  @IsString()
  venue: string;

  @ApiProperty({ example: 'Friendly', required: false })
  @IsOptional()
  @IsString()
  status?: string;
}

export class UpdateMatchDto {
  @ApiProperty({ example: 3, nullable: true, required: false })
  @IsOptional()
  @IsInt()
  homeScore?: number | null;

  @ApiProperty({ example: 0, nullable: true, required: false })
  @IsOptional()
  @IsInt()
  awayScore?: number | null;

  @ApiProperty({ example: 'Friendly', required: false })
  @IsOptional()
  @IsString()
  status?: string;
}

export class MatchDto {
  @ApiProperty({ example: 'b1e95c1d-1c7a-4be9-9f2a-9f4fa9a42f9a' })
  id: string;

  @ApiProperty({ example: 'Hunters FC' })
  homeTeam: string;

  @ApiProperty({ example: 'Rugongo' })
  awayTeam: string;

  @ApiProperty({ example: 3, nullable: true })
  homeScore?: number | null;

  @ApiProperty({ example: 0, nullable: true })
  awayScore?: number | null;

  @ApiProperty({ example: '2026-04-12T15:00:00.000Z' })
  kickOff: Date;

  @ApiProperty({ example: 'Weru Stadium' })
  venue: string;

  @ApiProperty({ example: 'Friendly' })
  status: string;
}

export class LeagueTableRowDto {
  @ApiProperty({ example: 1 })
  position: number;

  @ApiProperty({ example: 'Hunters FC' })
  team: string;

  @ApiProperty({ example: 15 })
  played: number;

  @ApiProperty({ example: 11 })
  wins: number;

  @ApiProperty({ example: 3 })
  draws: number;

  @ApiProperty({ example: 1 })
  losses: number;

  @ApiProperty({ example: 23 })
  goalDifference: number;

  @ApiProperty({ example: 36 })
  points: number;
}

export class StatisticsDto {
  @ApiProperty({ example: 10 })
  wins: number;

  @ApiProperty({ example: 32 })
  goalsScored: number;

  @ApiProperty({ example: 10 })
  goalsConceded: number;

  @ApiProperty({ example: 8 })
  homeWins: number;
}
