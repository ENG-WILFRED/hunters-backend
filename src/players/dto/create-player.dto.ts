import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, IsIn } from 'class-validator';

export class CreatePlayerDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'john@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '+254712345678', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    example: 'MID',
    description: 'GK, DEF, MID, FWD',
    default: 'MID',
    enum: ['GK', 'DEF', 'MID', 'FWD'],
  })
  @IsOptional()
  @IsIn(['GK', 'DEF', 'MID', 'FWD'])
  position?: 'GK' | 'DEF' | 'MID' | 'FWD';
}
