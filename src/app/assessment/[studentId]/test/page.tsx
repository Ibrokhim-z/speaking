'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

interface TestQuestion {
    id: number;
    level: string;
    question: string;
    options: string[];
    correctAnswer: number;
}

export default function TestPage({ params }: { params: Promise<{ studentId: string }> }) {
    const { studentId } = use(params);
    const [questions, setQuestions] = useState<TestQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<{ level: string; score: number; totalQuestions: number } | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await fetch('/api/test');
                if (!res.ok) { router.push('/dashboard'); return; }
                const data = await res.json();
                setQuestions(data.questions);
            } catch {
                router.push('/dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [router]);

    const handleSelect = (questionId: number, optionIndex: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const res = await fetch('/api/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId, answers }),
            });
            const data = await res.json();
            setResult(data);
        } catch (err) {
            console.error('Submit error:', err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="loading-page"><div className="loading-spinner lg" /><p className="loading-text">Loading test...</p></div>;

    if (result) {
        return (
            <>
                <nav className="navbar">
                    <a href="/dashboard" className="navbar-brand">
                        <div className="navbar-logo">S</div>
                        <span className="navbar-title">SpeakLevel</span>
                    </a>
                </nav>
                <div className="page-wrapper">
                    <div className="test-container">
                        <div className="question-card" style={{ textAlign: 'center' }}>
                            <h2 style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>Test Complete!</h2>
                            <div className="results-level">
                                <div className="results-level-value">{result.level}</div>
                                <div className="results-level-desc">Detected Level</div>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', margin: '16px 0' }}>
                                Score: {result.score}/{result.totalQuestions}
                            </p>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
                                <a href={`/assessment/${studentId}/speaking`} className="btn btn-primary btn-lg">
                                    🎤 Start Speaking Assessment
                                </a>
                                <a href={`/students/${studentId}`} className="btn btn-secondary">
                                    View Details
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
        <>
            <nav className="navbar">
                <a href="/dashboard" className="navbar-brand">
                    <div className="navbar-logo">S</div>
                    <span className="navbar-title">SpeakLevel</span>
                </a>
                <div className="navbar-actions">
                    <a href={`/students/${studentId}`} className="btn btn-secondary btn-sm">Cancel</a>
                </div>
            </nav>

            <div className="page-wrapper">
                <div className="test-container">
                    <div className="progress-bar-container">
                        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                    </div>

                    <div className="question-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="question-number">Question {currentIndex + 1} of {questions.length}</span>
                            <span className="question-level">{currentQuestion.level}</span>
                        </div>
                        <p className="question-text">{currentQuestion.question}</p>

                        <div className="options-list">
                            {currentQuestion.options.map((option, idx) => (
                                <div
                                    key={idx}
                                    className={`option-item ${answers[currentQuestion.id] === idx ? 'selected' : ''}`}
                                    onClick={() => handleSelect(currentQuestion.id, idx)}
                                >
                                    <div className="option-marker">{String.fromCharCode(65 + idx)}</div>
                                    <span>{option}</span>
                                </div>
                            ))}
                        </div>

                        <div className="question-nav">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentIndex === 0}
                            >
                                ← Previous
                            </button>

                            {currentIndex === questions.length - 1 ? (
                                <button
                                    className="btn btn-primary"
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                >
                                    {submitting ? <span className="loading-spinner" /> : 'Submit Test'}
                                </button>
                            ) : (
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                                >
                                    Next →
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
