import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { getSpeakingQuestionsForLevel } from '@/lib/speaking-questions';

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

        const { studentId, level } = await request.json();
        if (!studentId || !level) {
            return NextResponse.json({ error: 'Student ID and level required' }, { status: 400 });
        }

        const session = await prisma.speakingSession.create({
            data: { studentId, level, feedbackLang: 'en' },
        });

        const questions = getSpeakingQuestionsForLevel(level);

        return NextResponse.json({ session, questions });
    } catch (error) {
        console.error('Speaking session error:', error);
        return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
    }
}
