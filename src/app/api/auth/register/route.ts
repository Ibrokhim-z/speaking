import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, createToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const { username, password, fullName } = await request.json();

        if (!username || !password || !fullName) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const existing = await prisma.user.findUnique({ where: { username } });
        if (existing) {
            return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);
        const user = await prisma.user.create({
            data: { username, password: hashedPassword, fullName },
        });

        const token = createToken({ userId: user.id, username: user.username, role: user.role });

        const response = NextResponse.json({
            user: { id: user.id, username: user.username, fullName: user.fullName, role: user.role }
        });

        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    }
}
