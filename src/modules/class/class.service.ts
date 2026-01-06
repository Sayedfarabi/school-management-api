import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClassDto } from './dto/create_class.dto';

@Injectable()
export class ClassService {
  constructor(private prisma: PrismaService) {}
  async createClass(data: CreateClassDto) {
    // Implementation here
    const result = await this.prisma.class.create({
      data: {
        name: data.name,
        section: data.section,
      },
    });
    return result;
  }

  async studentEnrollment(data: { studentId: string; classId: string }) {
    // Implementation here
    const result = await this.prisma.student.update({
      where: { id: data.studentId },
      data: {
        classId: data.classId,
      },
    });
    return result;
  }

  async getStudentsByClass(classId: string) {
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
  }
}
