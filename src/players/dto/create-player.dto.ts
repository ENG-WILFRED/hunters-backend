import { ApiProperty } from '@nestjs/swagger';

export class CreatePlayerDto {
  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ example: 'john@example.com', required: false })
  email?: string;

  @ApiProperty({ example: '+254712345678', required: false })
  phone?: string;

  @ApiProperty({ example: 'MID', description: 'GK, DEF, MID, FWD', default: 'MID', enum: ['GK', 'DEF', 'MID', 'FWD'] })
  position?: 'GK' | 'DEF' | 'MID' | 'FWD';
}
