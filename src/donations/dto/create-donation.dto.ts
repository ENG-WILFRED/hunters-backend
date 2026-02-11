import { ApiProperty } from '@nestjs/swagger';

export class CreateDonationDto {
  @ApiProperty({ example: 1000, description: 'Amount in KES' })
  amount: number;

  @ApiProperty({ example: 'Alice Smith', required: false })
  donorName?: string;

  @ApiProperty({
    example: 1,
    required: false,
    description: 'Player ID (optional)',
  })
  playerId?: number;
}
