import { Injectable } from '@nestjs/common';
import { UserRole } from 'generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}
  async createStudent(data: {
    name: string;
    email: string;
    phone: string;
    password_hash: string;
    role: UserRole;
  }) {
    return this.prisma.user.create({ data });
  }
  async getAllStudents() {
    try {
      return await this.prisma.user.findMany({
        where: { role: UserRole.Student },
      });
    } catch (error) {
      console.log(error);
    }
  }
}
