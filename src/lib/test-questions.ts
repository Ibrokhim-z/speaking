export interface TestQuestion {
    id: number;
    level: string;
    question: string;
    options: string[];
    correctAnswer: number;
}

export const testQuestions: TestQuestion[] = [
    // ===== A1 (Starter) - Units 1-8 =====
    { id: 1, level: 'A1', question: 'My name _____ Anna.', options: ['am', 'is', 'are', 'be'], correctAnswer: 1 },
    { id: 2, level: 'A1', question: 'I _____ from Kazakhstan.', options: ['is', 'am', 'are', 'be'], correctAnswer: 1 },
    { id: 3, level: 'A1', question: 'She _____ a student.', options: ['am', 'are', 'is', 'be'], correctAnswer: 2 },
    { id: 4, level: 'A1', question: '_____ you a teacher?', options: ['Is', 'Am', 'Are', 'Do'], correctAnswer: 2 },
    { id: 5, level: 'A1', question: 'This is _____ book.', options: ['a', 'an', 'the', 'my'], correctAnswer: 3 },
    { id: 6, level: 'A1', question: 'They _____ happy.', options: ['is', 'am', 'are', 'be'], correctAnswer: 2 },
    { id: 7, level: 'A1', question: 'I have two _____.', options: ['child', 'childs', 'children', 'childrens'], correctAnswer: 2 },

    // ===== A2 (Elementary) - Units 1-8 =====
    { id: 8, level: 'A2', question: 'She _____ to work every day.', options: ['go', 'goes', 'going', 'gone'], correctAnswer: 1 },
    { id: 9, level: 'A2', question: 'I _____ coffee in the morning.', options: ['drink', 'drinks', 'drinking', 'drank'], correctAnswer: 0 },
    { id: 10, level: 'A2', question: 'There _____ a book on the table.', options: ['is', 'are', 'am', 'be'], correctAnswer: 0 },
    { id: 11, level: 'A2', question: 'He _____ TV last night.', options: ['watch', 'watches', 'watched', 'watching'], correctAnswer: 2 },
    { id: 12, level: 'A2', question: 'My house is _____ than yours.', options: ['big', 'bigger', 'biggest', 'more big'], correctAnswer: 1 },
    { id: 13, level: 'A2', question: 'I can _____ English.', options: ['speak', 'speaks', 'speaking', 'spoke'], correctAnswer: 0 },
    { id: 14, level: 'A2', question: 'We _____ to the cinema yesterday.', options: ['go', 'goes', 'went', 'gone'], correctAnswer: 2 },

    // ===== A2+ (Pre-Intermediate) - Units 1-8 =====
    { id: 15, level: 'A2+', question: 'I have _____ been to London.', options: ['ever', 'never', 'yet', 'already'], correctAnswer: 1 },
    { id: 16, level: 'A2+', question: 'She _____ dinner when I called.', options: ['cooked', 'was cooking', 'cooks', 'has cooked'], correctAnswer: 1 },
    { id: 17, level: 'A2+', question: 'You _____ wear a uniform at school.', options: ['must', 'can', 'should', 'have to'], correctAnswer: 3 },
    { id: 18, level: 'A2+', question: 'I\'m going _____ a new car next year.', options: ['buy', 'buying', 'to buy', 'bought'], correctAnswer: 2 },
    { id: 19, level: 'A2+', question: 'He\'s the _____ person I know.', options: ['funnier', 'funniest', 'more funny', 'most funny'], correctAnswer: 1 },
    { id: 20, level: 'A2+', question: 'Have you _____ finished your homework?', options: ['yet', 'already', 'just', 'ever'], correctAnswer: 1 },
    { id: 21, level: 'A2+', question: 'If it rains, I _____ stay home.', options: ['will', 'would', 'can', 'am'], correctAnswer: 0 },

    // ===== B1 (Intermediate) - Units 1-8 =====
    { id: 22, level: 'B1', question: 'If I _____ you, I would study harder.', options: ['am', 'was', 'were', 'be'], correctAnswer: 2 },
    { id: 23, level: 'B1', question: 'The letter _____ yesterday.', options: ['sent', 'was sent', 'is sent', 'sends'], correctAnswer: 1 },
    { id: 24, level: 'B1', question: 'She said she _____ tired.', options: ['is', 'was', 'were', 'be'], correctAnswer: 1 },
    { id: 25, level: 'B1', question: 'I wish I _____ more free time.', options: ['have', 'has', 'had', 'having'], correctAnswer: 2 },
    { id: 26, level: 'B1', question: 'He _____ English for five years.', options: ['studies', 'studied', 'has studied', 'is studying'], correctAnswer: 2 },
    { id: 27, level: 'B1', question: 'The movie was _____ interesting than the book.', options: ['more', 'most', 'much', 'very'], correctAnswer: 0 },
    { id: 28, level: 'B1', question: 'I\'d rather _____ at home tonight.', options: ['stay', 'staying', 'to stay', 'stayed'], correctAnswer: 0 },

    // ===== B1+ (Intermediate Plus) - Units 1-8 =====
    { id: 29, level: 'B1+', question: 'If I had studied harder, I _____ the exam.', options: ['passed', 'would pass', 'would have passed', 'had passed'], correctAnswer: 2 },
    { id: 30, level: 'B1+', question: 'I wish I _____ go to the party last night.', options: ['can', 'could', 'could have', 'would'], correctAnswer: 1 },
    { id: 31, level: 'B1+', question: 'She must _____ left already.', options: ['have', 'has', 'had', 'having'], correctAnswer: 0 },
    { id: 32, level: 'B1+', question: 'Not only _____ she intelligent, but she is also kind.', options: ['is', 'was', 'does', 'has'], correctAnswer: 0 },
    { id: 33, level: 'B1+', question: 'He\'s used to _____ in a big city.', options: ['live', 'living', 'lived', 'lives'], correctAnswer: 1 },
    { id: 34, level: 'B1+', question: 'The report needs _____.', options: ['to finish', 'finishing', 'finished', 'finish'], correctAnswer: 1 },
    { id: 35, level: 'B1+', question: 'By the time we arrived, the film _____.', options: ['started', 'has started', 'had started', 'starts'], correctAnswer: 2 },

    // ===== B2 (Upper-Intermediate) - Units 1-8 =====
    { id: 36, level: 'B2', question: 'Had I known about the problem, I _____ helped.', options: ['will have', 'would have', 'had', 'have'], correctAnswer: 1 },
    { id: 37, level: 'B2', question: 'The project is _____ completion.', options: ['near', 'nearing', 'nearly', 'neared'], correctAnswer: 1 },
    { id: 38, level: 'B2', question: 'She couldn\'t help _____ when she heard the joke.', options: ['laugh', 'laughing', 'to laugh', 'laughed'], correctAnswer: 1 },
    { id: 39, level: 'B2', question: 'It\'s high time we _____ a decision.', options: ['make', 'made', 'making', 'to make'], correctAnswer: 1 },
    { id: 40, level: 'B2', question: '_____ the circumstances, we did well.', options: ['Given', 'Giving', 'Gave', 'Give'], correctAnswer: 0 },
    { id: 41, level: 'B2', question: 'The more you practice, the _____ you become.', options: ['good', 'better', 'best', 'well'], correctAnswer: 1 },
    { id: 42, level: 'B2', question: 'He denied _____ the window.', options: ['break', 'to break', 'breaking', 'broke'], correctAnswer: 2 },

    // ===== C1 (Advanced) - Units 1-8 =====
    { id: 43, level: 'C1', question: 'Hardly _____ the door when the phone rang.', options: ['I had closed', 'had I closed', 'I closed', 'did I close'], correctAnswer: 1 },
    { id: 44, level: 'C1', question: 'The discovery was _____ to a breakthrough in medicine.', options: ['instrumental', 'fundamental', 'detrimental', 'incremental'], correctAnswer: 0 },
    { id: 45, level: 'C1', question: 'She _____ have been more helpful if she had tried.', options: ['can\'t', 'couldn\'t', 'wouldn\'t', 'shouldn\'t'], correctAnswer: 1 },
    { id: 46, level: 'C1', question: 'Were it not for his support, I _____ succeeded.', options: ['wouldn\'t have', 'hadn\'t', 'won\'t have', 'didn\'t'], correctAnswer: 0 },
    { id: 47, level: 'C1', question: 'The proposal was met with _____ opposition.', options: ['fierce', 'hard', 'strong', 'heavy'], correctAnswer: 0 },
    { id: 48, level: 'C1', question: 'No sooner _____ arrived than it started raining.', options: ['we had', 'had we', 'we have', 'have we'], correctAnswer: 1 },
    { id: 49, level: 'C1', question: 'The issue _____ further investigation.', options: ['warrants', 'guarantees', 'ensures', 'assures'], correctAnswer: 0 },
];

export const levelOrder = ['A1', 'A2', 'A2+', 'B1', 'B1+', 'B2', 'C1'];

export const levelDetails: Record<string, { book: string; description: string; units: string }> = {
    'A1': { book: 'Speakout 3rd Edition - Starter', description: 'Beginner', units: 'Units 1-8' },
    'A2': { book: 'Speakout 3rd Edition - Elementary', description: 'Elementary', units: 'Units 1-8' },
    'A2+': { book: 'Speakout 3rd Edition - Pre-Intermediate', description: 'Pre-Intermediate', units: 'Units 1-8' },
    'B1': { book: 'Speakout 3rd Edition - Intermediate', description: 'Intermediate', units: 'Units 1-8' },
    'B1+': { book: 'Speakout 3rd Edition - Intermediate Plus', description: 'Intermediate Plus', units: 'Units 1-8' },
    'B2': { book: 'Speakout 3rd Edition - Upper-Intermediate', description: 'Upper-Intermediate', units: 'Units 1-8' },
    'C1': { book: 'Speakout 3rd Edition - Advanced', description: 'Advanced', units: 'Units 1-8' },
};

export function calculateLevel(answers: Record<number, number>): { level: string; score: number; totalQuestions: number; levelScores: Record<string, { correct: number; total: number }> } {
    const levelScores: Record<string, { correct: number; total: number }> = {};

    for (const level of levelOrder) {
        levelScores[level] = { correct: 0, total: 0 };
    }

    for (const q of testQuestions) {
        levelScores[q.level].total++;
        if (answers[q.id] === q.correctAnswer) {
            levelScores[q.level].correct++;
        }
    }

    let detectedLevel = 'A1';
    let totalCorrect = 0;
    const totalQuestions = testQuestions.length;

    for (const level of levelOrder) {
        const { correct, total } = levelScores[level];
        totalCorrect += correct;
        const percentage = total > 0 ? (correct / total) * 100 : 0;
        if (percentage >= 60) {
            detectedLevel = level;
        } else {
            break;
        }
    }

    return { level: detectedLevel, score: totalCorrect, totalQuestions, levelScores };
}
