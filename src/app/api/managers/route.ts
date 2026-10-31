import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

        if (user.role !== 'MAIN_MANAGER') {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }

        const managers = await prisma.user.findMany({
            where: { role: 'MANAGER' },
            select: {
                id: true,
                fullName: true,
                username: true,
                createdAt: true,
                students: {
                    select: {
                        id: true,
                        fullName: true,
                        phone: true,
                        createdAt: true,
                        testResults: { orderBy: { createdAt: 'desc' }, take: 1 },
                        speakingSessions: { orderBy: { createdAt: 'desc' }, take: 1 },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ managers });
    } catch (error) {
        console.error('Managers fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch managers' }, { status: 500 });
    }
}
