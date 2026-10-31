import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { testQuestions, calculateLevel } from '@/lib/test-questions';

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        return NextResponse.json({ questions: testQuestions });
    } catch {
        return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

        const { studentId, answers } = await request.json();
        if (!studentId || !answers) {
            return NextResponse.json({ error: 'Student ID and answers are required' }, { status: 400 });
        }

        const student = await prisma.student.findUnique({ where: { id: studentId } });
        if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 });

        const result = calculateLevel(answers);

        const testResult = await prisma.testResult.create({
            data: {
                studentId,
                score: result.score,
                totalQuestions: result.totalQuestions,
                level: result.level,
                answers: JSON.stringify(answers),
            },
        });

        return NextResponse.json({ testResult, level: result.level, score: result.score, totalQuestions: result.totalQuestions, levelScores: result.levelScores });
    } catch (error) {
        console.error('Test submit error:', error);
        return NextResponse.json({ error: 'Failed to submit test' }, { status: 500 });
    }
}
