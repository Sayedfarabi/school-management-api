import seedAdmin from './seed_admin';
import seedTeacher from './seed_teacher';
import prisma from 'src/lib/prisma';

async function main() {
  await seedAdmin();
  await seedTeacher();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
