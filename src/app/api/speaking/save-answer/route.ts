import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

        const formData = await request.formData();
        const sessionId = formData.get('sessionId') as string;
        const questionIndex = parseInt(formData.get('questionIndex') as string);
        const questionText = formData.get('questionText') as string;
        const audioFile = formData.get('audio') as File;

        if (!sessionId || questionIndex === undefined || !questionText) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        let audioPath = '';
        if (audioFile && audioFile.size > 0) {
            const buffer = Buffer.from(await audioFile.arrayBuffer());
            const uploadsDir = path.join(process.cwd(), 'public', 'recordings', sessionId);
            await mkdir(uploadsDir, { recursive: true });

            const filename = `q${questionIndex}_${Date.now()}.webm`;
            audioPath = `/recordings/${sessionId}/${filename}`;
            await writeFile(path.join(uploadsDir, filename), buffer);
        }

        const answer = await prisma.speakingAnswer.create({
            data: {
                sessionId,
                questionIndex,
                questionText,
                audioPath,
            },
        });

        return NextResponse.json({ answer });
    } catch (error) {
        console.error('Save answer error:', error);
        return NextResponse.json({ error: 'Failed to save answer' }, { status: 500 });
    }
}
