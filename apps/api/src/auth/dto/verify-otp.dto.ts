import { IsString, Matches, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({ example: '01712345678' })
  @IsString()
  @Matches(/^01[3-9]\d{8}$/, { message: 'Invalid Bangladeshi phone number' })
  phone: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @Length(6, 6, { message: 'OTP must be 6 digits' })
  otp: string;

  @ApiProperty({ example: 'Rafiq Islam', required: false })
  @IsOptional()
  @IsString()
  name?: string;
}
