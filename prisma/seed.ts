import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create main manager
    const mainManagerPassword = await bcrypt.hash('admin123', 12);
    await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password: mainManagerPassword,
            fullName: 'Main Manager',
            role: 'MAIN_MANAGER',
        },
    });

    console.log('✅ Main Manager created: username=admin, password=admin123');
    console.log('🎉 Seed complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
