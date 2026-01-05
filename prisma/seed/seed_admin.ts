/* eslint-disable no-extra-boolean-cast */
import { Prisma } from 'generated/prisma/client';
import { UserRole } from 'generated/prisma/enums';
import { adminData } from 'prisma/default_data/admin_data';
import prisma from 'src/lib/prisma';
import { hashPassword } from 'src/utils/hash_password';

const seedAdmin = async () => {
  // Check if admin already exists
  const isExistSuperAdmin = await prisma.user.findFirst({
    where: {
      email: 'admin@example.com',
      role: UserRole.Admin,
    },
  });

  if (!!isExistSuperAdmin) {
    console.log('Admin already exists!');
    return;
  }

  // Hash password
  const password = await hashPassword('admin1234');

  // Create admin
  const data = {
    ...adminData,
    password_hash: password,
    role: UserRole.Admin,
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

export default seedAdmin;
