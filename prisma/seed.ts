import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting database seeding...');
    
    // Create roles
    const adminRole = await prisma.role.upsert({
      where: { name: "ADMIN" },
      update: {},
      create: {
        name: "ADMIN",
        description: "Administrator role with full access",
      },
    });
    console.log('Created admin role:', adminRole);

    const userRole = await prisma.role.upsert({
      where: { name: "USER" },
      update: {},
      create: {
        name: "USER",
        description: "Regular user role",
      },
    });
    console.log('Created user role:', userRole);

    // Create test admin user
    const hashedPassword = crypto
      .createHash("sha256")
      .update("admin123")
      .digest("hex");

    const adminUser = await prisma.user.upsert({
      where: { email: "admin@example.com" },
      update: {},
      create: {
        email: "admin@example.com",
        password: hashedPassword,
        name: "Admin User",
        roleId: adminRole.id,
      },
    });
    console.log('Created admin user:', adminUser);

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
