import { Body, Controller, Get, Post } from '@nestjs/common';
import { StudentService } from './student.service';
import { UserRole } from 'generated/prisma/enums';

@Controller({ path: 'student', version: '1' })
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  async createStudent(
    @Body()
    data: {
      name: string;
      email: string;
      phone: string;
      password_hash: string;
      role: UserRole;
      //   age: number;
    },
  ) {
    return this.studentService.createStudent(data);
  }

  @Get()
  getAllStudents() {
    return this.studentService.getAllStudents();
  }
}
