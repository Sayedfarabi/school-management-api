import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({ description: 'Name of the student' })
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiProperty({ description: 'Email address of the student' })
  @ApiProperty({ description: 'Email address of the student' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @ApiProperty({ description: 'Phone number of the student' })
  @IsPhoneNumber()
  @IsOptional()
  phone: string;
  @ApiProperty({ description: 'Password hash for the student account' })
  @IsString()
  @IsNotEmpty()
  password_hash: string;
  @ApiProperty({ description: 'Age of the student' })
  @IsNumber()
  @IsNotEmpty()
  age: number;
}
