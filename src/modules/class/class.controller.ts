import {
  Body,
  Controller,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { ResponseMessage } from 'src/common/decorators/response_message.decorator';
import { CreateClassDto } from './dto/create_class.dto';
import { EnrollmentClassDto } from './dto/enrollment_class.dto';

@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ResponseMessage('Class created successfully')
  async createClass(
    @Body()
    data: CreateClassDto,
  ) {
    return this.classService.createClass(data);
  }

  @Post(':id/enroll')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ResponseMessage('Student enrolled successfully')
  async studentEnrollment(
    @Param('id') id: string,
    @Body() data: EnrollmentClassDto,
  ) {
    const enrollmentData = {
      studentId: data.studentId,
      classId: id,
    };
    return this.classService.studentEnrollment(enrollmentData);
  }
}
