import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty() firstName: string;
  @ApiProperty() lastName: string;
  @ApiProperty({ required: false }) email?: string;
  @ApiProperty({ required: false }) phone?: string;
  @ApiProperty() password: string;
  @ApiProperty({ required: false, enum: [true, false] }) isAdmin?: boolean;
}
