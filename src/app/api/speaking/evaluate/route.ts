import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { levelDetails } from '@/lib/test-questions';
import OpenAI from 'openai';
import { readFile } from 'fs/promises';
import path from 'path';

const feedbackTemplates: Record<string, Record<string, string>> = {
    en: {
        header: 'Speaking Assessment Results',
        level: 'Detected Level',
        book: 'Recommended Book',
        unit: 'Start from',
        grammar: 'Grammar',
        vocabulary: 'Vocabulary',
        fluency: 'Fluency',
        pronunciation: 'Pronunciation',
        overall: 'Overall Assessment',
        recommendation: 'Recommendation',
    },
    ru: {
        header: 'Результаты оценки разговорной речи',
        level: 'Определённый уровень',
        book: 'Рекомендуемая книга',
        unit: 'Начать с',
        grammar: 'Грамматика',
        vocabulary: 'Словарный запас',
        fluency: 'Беглость речи',
        pronunciation: 'Произношение',
        overall: 'Общая оценка',
        recommendation: 'Рекомендация',
    },
    kz: {
        header: 'Ауызша сөйлеу бағалау нәтижелері',
        level: 'Анықталған деңгей',
        book: 'Ұсынылатын кітап',
        unit: 'Бастау',
        grammar: 'Грамматика',
        vocabulary: 'Сөздік қор',
        fluency: 'Сөйлеу еркіндігі',
        pronunciation: 'Айтылым',
        overall: 'Жалпы баға',
        recommendation: 'Ұсыныс',
    },
};

async function transcribeAndEvaluateWithAI(
    sessionId: string,
    level: string,
    lang: string
): Promise<{ feedback: string; overallScore: number; answerFeedbacks: { answerId: string; transcription: string; score: number; feedback: string }[] }> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return generateFallbackFeedback(sessionId, level, lang);
    }

    const openai = new OpenAI({ apiKey });
    const answers = await prisma.speakingAnswer.findMany({
        where: { sessionId },
        orderBy: { questionIndex: 'asc' },
    });

    const answerFeedbacks: { answerId: string; transcription: string; score: number; feedback: string }[] = [];
    let totalScore = 0;

    for (const answer of answers) {
        let transcription = '';

        if (answer.audioPath) {
            try {
                const filePath = path.join(process.cwd(), 'public', answer.audioPath);
                const audioBuffer = await readFile(filePath);
                const audioFile = new File([audioBuffer], 'audio.webm', { type: 'audio/webm' });

                const transcriptionResult = await openai.audio.transcriptions.create({
                    file: audioFile,
                    model: 'whisper-1',
                });
                transcription = transcriptionResult.text;
            } catch (e) {
                console.error('Transcription error:', e);
                transcription = '[Audio could not be transcribed]';
            }
        }

        const langInstructions: Record<string, string> = {
            en: 'Provide feedback in English.',
            ru: 'Предоставьте отзыв на русском языке.',
            kz: 'Кері байланысты қазақ тілінде беріңіз.',
        };

        try {
            const evalResponse = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: `You are an English language assessment expert. Evaluate the student's spoken response.
The student's detected grammar test level is ${level}.
Question asked: "${answer.questionText}"
Student's transcribed response: "${transcription}"

Rate the response on a scale of 1-10 considering:
- Grammar accuracy
- Vocabulary range
- Fluency and coherence
- Relevance to the question

${langInstructions[lang] || langInstructions.en}

Respond in JSON format:
{"score": <1-10>, "feedback": "<2-3 sentences of feedback>"}`,
                    },
                ],
                response_format: { type: 'json_object' },
            });

            const evalResult = JSON.parse(evalResponse.choices[0].message.content || '{"score": 5, "feedback": "N/A"}');
            answerFeedbacks.push({
                answerId: answer.id,
                transcription,
                score: evalResult.score,
                feedback: evalResult.feedback,
            });
            totalScore += evalResult.score;
        } catch {
            answerFeedbacks.push({
                answerId: answer.id,
                transcription,
                score: 5,
                feedback: 'Evaluation unavailable',
            });
            totalScore += 5;
        }
    }

    const overallScore = Math.round(totalScore / Math.max(answers.length, 1));
    const t = feedbackTemplates[lang] || feedbackTemplates.en;
    const levelInfo = levelDetails[level] || levelDetails['A1'];

    let confirmedLevel = level;
    if (overallScore <= 3) {
        const levels = Object.keys(levelDetails);
        const idx = levels.indexOf(level);
        if (idx > 0) confirmedLevel = levels[idx - 1];
    } else if (overallScore >= 8) {
        const levels = Object.keys(levelDetails);
        const idx = levels.indexOf(level);
        if (idx < levels.length - 1) confirmedLevel = levels[idx + 1];
    }

    const confirmedLevelInfo = levelDetails[confirmedLevel] || levelInfo;
    let startUnit = 'Unit 1';
    if (overallScore >= 7) startUnit = 'Unit 4-5';
    if (overallScore >= 9) startUnit = 'Unit 6-7';

    const langPrompt: Record<string, string> = {
        en: `Generate a comprehensive speaking assessment summary in English.`,
        ru: `Сгенерируйте подробное резюме оценки разговорной речи на русском языке.`,
        kz: `Ауызша сөйлеу бағалаудың толық қорытындысын қазақ тілінде жасаңыз.`,
    };

    try {
        const summaryResponse = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `${langPrompt[lang] || langPrompt.en}

Student was tested at ${level} level. Overall speaking score: ${overallScore}/10.
Confirmed level: ${confirmedLevel}
Recommended book: ${confirmedLevelInfo.book}
Start from: ${startUnit}

Individual question results:
${answerFeedbacks.map((a, i) => `Q${i + 1}: Score ${a.score}/10`).join('\n')}

Write a 3-5 sentence summary with the level recommendation as a professional language assessor. Include the recommended book and starting unit.`,
                },
            ],
        });

        const feedback = `${t.header}\n\n${t.level}: ${confirmedLevel} (${confirmedLevelInfo.description})\n${t.book}: ${confirmedLevelInfo.book}\n${t.unit}: ${startUnit}\n\n${summaryResponse.choices[0].message.content}`;

        return { feedback, overallScore, answerFeedbacks };
    } catch {
        const feedback = `${t.header}\n\n${t.level}: ${confirmedLevel} (${confirmedLevelInfo.description})\n${t.book}: ${confirmedLevelInfo.book}\n${t.unit}: ${startUnit}\n\n${t.overall}: ${overallScore}/10`;
        return { feedback, overallScore, answerFeedbacks };
    }
}

async function generateFallbackFeedback(sessionId: string, level: string, lang: string) {
    const answers = await prisma.speakingAnswer.findMany({
        where: { sessionId },
        orderBy: { questionIndex: 'asc' },
    });

    const t = feedbackTemplates[lang] || feedbackTemplates.en;
    const levelInfo = levelDetails[level] || levelDetails['A1'];

    const answerFeedbacks = answers.map((a) => ({
        answerId: a.id,
        transcription: '[AI evaluation not available - no API key configured]',
        score: 0,
        feedback: lang === 'ru'
            ? 'Для автоматической оценки необходим ключ OpenAI API'
            : lang === 'kz'
                ? 'Автоматты бағалау үшін OpenAI API кілті қажет'
                : 'OpenAI API key required for automatic evaluation',
    }));

    const noKeyMsg = lang === 'ru'
        ? 'Аудиозаписи сохранены. Для получения AI-оценки, пожалуйста, добавьте ключ OpenAI API в файл .env'
        : lang === 'kz'
            ? 'Аудио жазбалар сақталды. AI бағалау алу үшін .env файлына OpenAI API кілтін қосыңыз'
            : 'Audio recordings saved. For AI evaluation, please add your OpenAI API key to the .env file';

    const feedback = `${t.header}\n\n${t.level}: ${level} (${levelInfo.description})\n${t.book}: ${levelInfo.book}\n${t.unit}: Units 1-8\n\n${noKeyMsg}`;

    return { feedback, overallScore: 0, answerFeedbacks };
}

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

        const { sessionId, lang = 'en' } = await request.json();
        if (!sessionId) return NextResponse.json({ error: 'Session ID required' }, { status: 400 });

        const session = await prisma.speakingSession.findUnique({ where: { id: sessionId } });
        if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

        const { feedback, overallScore, answerFeedbacks } = await transcribeAndEvaluateWithAI(
            sessionId,
            session.level,
            lang
        );

        // Update session with results
        await prisma.speakingSession.update({
            where: { id: sessionId },
            data: { feedback, overallScore, feedbackLang: lang, status: 'completed' },
        });

        // Update individual answers
        for (const af of answerFeedbacks) {
            await prisma.speakingAnswer.update({
                where: { id: af.answerId },
                data: { transcription: af.transcription, score: af.score, feedback: af.feedback },
            });
        }

        return NextResponse.json({ feedback, overallScore, answerFeedbacks });
    } catch (error) {
        console.error('Evaluate error:', error);
        return NextResponse.json({ error: 'Evaluation failed' }, { status: 500 });
    }
}
