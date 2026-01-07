import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create_student.dto';
import { ResponseMessage } from 'src/common/decorators/response_message.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'generated/prisma/enums';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';

@Controller({ path: 'api/students', version: '1' })
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @Roles(UserRole.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ResponseMessage('Student created successfully')
  async createStudent(
    @Body()
    data: CreateStudentDto,
  ) {
    return this.studentService.createStudent(data);
  }

  @Get()
  @Roles(UserRole.Admin, UserRole.Teacher)
  @UseGuards(AuthGuard, RolesGuard)
  @ResponseMessage('Students are fetched successfully')
  async getAllStudents() {
    return this.studentService.getAllStudents();
  }

  @Get(':id')
  @Roles(UserRole.Admin, UserRole.Teacher)
  @UseGuards(AuthGuard, RolesGuard)
  @ResponseMessage('Student is fetched successfully')
  async getStudentById(@Param('id') id: string) {
    return this.studentService.getStudentById(id);
  }
}
