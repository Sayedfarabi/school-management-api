import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create_student.dto';
import { ResponseMessage } from 'src/common/decorators/response_message.decorator';

@Controller({ path: 'student', version: '1' })
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ResponseMessage('Student created successfully')
  async createStudent(
    @Body()
    data: CreateStudentDto,
  ) {
    return this.studentService.createStudent(data);
  }

  @Get()
  async getAllStudents() {
    return this.studentService.getAllStudents();
  }
}
