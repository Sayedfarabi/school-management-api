import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ClassSection } from 'generated/prisma/enums';

export class CreateClassDto {
  @ApiProperty({ description: 'Name of the class' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Section of the class' })
  @IsEnum(ClassSection)
  @IsNotEmpty()
  section: ClassSection;
}
