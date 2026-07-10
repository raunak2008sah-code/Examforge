import { hashPassword } from 'better-auth/crypto';
import { prisma } from '@examforge/db';

async function main() {
  const adminEmail = 'admin@examforge.com';
  const adminUser = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!adminUser) {
    throw new Error('Admin user not found. Run db:seed first.');
  }

  const password = await hashPassword('password123');

  // We need to use prisma.account directly to create credential account for better-auth
  // But wait, providerId_accountId is not necessarily unique, let's just use create or delete+create
  await prisma.account.deleteMany({
    where: {
      userId: adminUser.id,
      providerId: 'credential',
    },
  });

  await prisma.account.create({
    data: {
      userId: adminUser.id,
      accountId: adminEmail,
      providerId: 'credential',
      password,
    },
  });
  console.log('✔ Admin password seeded successfully (password: password123)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
