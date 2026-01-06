import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ClassService } from './class.service';
import { ResponseMessage } from 'src/common/decorators/response_message.decorator';
import { CreateClassDto } from './dto/create_class.dto';
import { EnrollmentClassDto } from './dto/enrollment_class.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'generated/prisma/enums';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';

@Controller({ path: 'classes', version: '1' })
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post()
  @Roles(UserRole.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ResponseMessage('Class created successfully')
  async createClass(
    @Body()
    data: CreateClassDto,
  ) {
    return this.classService.createClass(data);
  }

  @Post(':id/enroll')
  @Roles(UserRole.Admin, UserRole.Teacher)
  @UseGuards(AuthGuard, RolesGuard)
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

  @Get(':id/students')
  @Roles(UserRole.Admin, UserRole.Teacher)
  @UseGuards(AuthGuard, RolesGuard)
  @ResponseMessage('Students fetched successfully')
  async getStudentsByClass(@Param('id') id: string) {
    return this.classService.getStudentsByClass(id);
  }
}
