import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

        let students;
        if (user.role === 'MAIN_MANAGER') {
            students = await prisma.student.findMany({
                include: {
                    manager: { select: { id: true, fullName: true, username: true } },
                    testResults: { orderBy: { createdAt: 'desc' }, take: 1 },
                    speakingSessions: { orderBy: { createdAt: 'desc' }, take: 1 },
                },
                orderBy: { createdAt: 'desc' },
            });
        } else {
            students = await prisma.student.findMany({
                where: { managerId: user.userId },
                include: {
                    manager: { select: { id: true, fullName: true, username: true } },
                    testResults: { orderBy: { createdAt: 'desc' }, take: 1 },
                    speakingSessions: { orderBy: { createdAt: 'desc' }, take: 1 },
                },
                orderBy: { createdAt: 'desc' },
            });
        }

        return NextResponse.json({ students });
    } catch (error) {
        console.error('Students fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

        const { fullName, phone } = await request.json();
        if (!fullName) return NextResponse.json({ error: 'Student name is required' }, { status: 400 });

        const student = await prisma.student.create({
            data: { fullName, phone: phone || '', managerId: user.userId },
        });

        return NextResponse.json({ student });
    } catch (error) {
        console.error('Student create error:', error);
        return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
    }
}
