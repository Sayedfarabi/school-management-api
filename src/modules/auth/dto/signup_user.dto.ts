import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { UserRole } from 'generated/prisma/enums';

export class SignUpDto {
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
  password: string;
  @ApiProperty({ description: 'Section of the class' })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}
