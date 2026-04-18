import { IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty({ example: '01712345678' })
  @IsString()
  @Matches(/^01[3-9]\d{8}$/, { message: 'Invalid Bangladeshi phone number' })
  phone: string;
}
