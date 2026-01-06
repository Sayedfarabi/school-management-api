import { Injectable } from '@nestjs/common';
import { UserRole } from 'generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStudentDto } from './dto/create_student.dto';
import { Prisma } from 'generated/prisma/client';
import { hashPassword } from 'src/utils/hash_password';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}
  async createStudent(data: CreateStudentDto) {
    try {
      const password = await hashPassword(data?.password_hash);
      const result = await this.prisma.$transaction(
        async (transactionClient) => {
          const user = await transactionClient.user.create({
            data: {
              name: data.name,
              email: data.email,
              phone: data.phone,
              password_hash: password,
              role: UserRole.Student,
            } as Prisma.UserCreateInput,
          });
          const student = await transactionClient.student.create({
            data: {
              userId: user.id,
              name: data.name,
              age: data.age,
            },
          });
          return { user, student };
        },
      );
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getAllStudents() {
    try {
      return await this.prisma.user.findMany({
        where: { role: UserRole.Student },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getStudentById(studentId: string) {
    try {
      return await this.prisma.student.findUniqueOrThrow({
        where: { id: studentId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              role: true,
              createdAt: true,
            },
          },
          class: {
            select: {
              id: true,
              name: true,
              section: true,
              createdAt: true,
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
