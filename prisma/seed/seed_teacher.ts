/* eslint-disable no-extra-boolean-cast */
import { Prisma } from 'generated/prisma/client';
import { UserRole } from 'generated/prisma/enums';
import { teacherData } from 'prisma/default_data/teacher_data';
import prisma from 'src/lib/prisma';
import { hashPassword } from 'src/utils/hash_password';

const seedTeacher = async () => {
  // Check if teacher already exists
  const isExistTeacher = await prisma.user.findFirst({
    where: {
      email: 'teacher@example.com',
      role: UserRole.Teacher,
    },
  });

  if (!!isExistTeacher) {
    console.log('Teacher already exists!');
    return;
  }

  // Hash password
  const password = await hashPassword('teacher1234');

  // Create teacher
  const data = {
    ...teacherData,
    password_hash: password,
    role: UserRole.Teacher,
  };

  try {
    const result = await prisma.user.create({
      data: data as Prisma.UserCreateInput,
    });
    console.log({ result });
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
};

export default seedTeacher;
