import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

        const { id } = await params;
        const student = await prisma.student.findUnique({
            where: { id },
            include: {
                manager: { select: { id: true, fullName: true, username: true } },
                testResults: { orderBy: { createdAt: 'desc' } },
                speakingSessions: {
                    orderBy: { createdAt: 'desc' },
                    include: { answers: { orderBy: { questionIndex: 'asc' } } }
                },
            },
        });

        if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 });

        if (user.role !== 'MAIN_MANAGER' && student.managerId !== user.userId) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }

        return NextResponse.json({ student });
    } catch (error) {
        console.error('Student fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch student' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

        const { id } = await params;
        const student = await prisma.student.findUnique({ where: { id } });
        if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 });

        if (user.role !== 'MAIN_MANAGER' && student.managerId !== user.userId) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }

        await prisma.student.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Student delete error:', error);
        return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
    }
}
