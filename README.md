# SpeakLevel — English Speaking Assessment Platform

AI-powered English speaking assessment platform for language schools. Evaluates students using **Speakout 3rd Edition** curriculum levels (A1–C1).

## Features

- 🔐 **Manager Authentication** — Register/login system for managers
- 📊 **Main Manager Dashboard** — Overview of all managers and their students
- 📝 **Placement Test** — Grammar/vocabulary test to determine student level
- 🎤 **Speaking Assessment** — Audio questions with TTS, student answer recording
- 🤖 **AI Evaluation** — OpenAI Whisper transcription + GPT-4o-mini speaking evaluation
- 🌐 **Multi-language Feedback** — Results in English, Russian, or Kazakh
- 📚 **Speakout 3rd Edition Integration** — Level-to-book-to-unit recommendations

## Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Database**: SQLite via Prisma ORM
- **Auth**: Custom JWT + bcrypt
- **AI**: OpenAI API (Whisper + GPT-4o-mini)
- **Audio**: Web Speech API (TTS) + MediaRecorder API

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env
# Edit .env and add your OpenAI API key (optional)

# 3. Setup database
npx prisma db push
npx prisma generate

# 4. Seed default admin account
npx tsx prisma/seed.ts

# 5. Start development server
npm run dev
```

## Environment Variables

Create a `.env` file:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-here"
OPENAI_API_KEY="sk-..."  # Optional — needed for AI evaluation
```

## Default Accounts

After seeding:
- **Main Manager**: username `admin`, password `admin123`
- **Managers**: Register through the app

## Speakout 3rd Edition Levels

| Level | Book | Description |
|---|---|---|
| A1 | Starter | Beginner |
| A2 | Elementary | Elementary |
| A2+ | Pre-Intermediate | Pre-Intermediate |
| B1 | Intermediate | Intermediate |
| B1+ | Intermediate Plus | Intermediate Plus |
| B2 | Upper-Intermediate | Upper-Intermediate |
| C1 | Advanced | Advanced |

## How It Works

1. **Manager registers/logs in**
2. **Adds a new student**
3. **Student takes placement test** → System detects grammar level
4. **Student does speaking assessment** → Questions read aloud via TTS, answers recorded
5. **AI evaluates** → Transcribes audio, assesses speaking skills, recommends book/unit
6. **Results saved** → Visible to both manager and main manager
