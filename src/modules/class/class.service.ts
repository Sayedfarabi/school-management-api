/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClassDto } from './dto/create_class.dto';

@Injectable()
export class ClassService {
  constructor(private prisma: PrismaService) {}

  async createClass(data: CreateClassDto) {
    try {
      // Check if class with the same name and section already exists
      const isExist = await this.prisma.class.findFirst({
        where: { name: data?.name, section: data?.section },
      });

      if (isExist) {
        throw new HttpException(
          'Class with the same name and section already exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Implementation here
      const result = await this.prisma.class.create({
        data,
      });
      return result;
    } catch (error) {
      throw new HttpException('Failed to create class', HttpStatus.BAD_REQUEST);
    }
  }

  async studentEnrollment(data: { studentId: string; classId: string }) {
    try {
      const isExist = await this.prisma.student.findFirst({
        where: { id: data.studentId },
      });
      if (!isExist) {
        throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
      }

      // Implementation here
      const result = await this.prisma.student.update({
        where: { id: data.studentId },
        data: {
          classId: data.classId,
        },
      });
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to enroll student in class',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getStudentsByClass(classId: string) {
    try {
      const isExist = await this.prisma.class.findFirst({
        where: { id: classId },
      });

      if (!isExist) {
        throw new HttpException('Class not found', HttpStatus.NOT_FOUND);
      }

      // Implementation here
      const result = await this.prisma.class.findFirst({
        where: { id: classId },
        include: {
          students: {
            select: {
              id: true,
              name: true,
              age: true,
              createdAt: true,
            },
          },
        },
      });
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to get students by class',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
