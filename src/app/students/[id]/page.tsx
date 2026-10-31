'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { levelDetails } from '@/lib/test-questions';
import Icons from '@/components/Icons';

interface StudentDetail {
    id: string;
    fullName: string;
    phone: string;
    createdAt: string;
    manager: { id: string; fullName: string; username: string };
    testResults: {
        id: string; level: string; score: number; totalQuestions: number; createdAt: string;
    }[];
    speakingSessions: {
        id: string; level: string; overallScore: number; status: string; feedback: string; feedbackLang: string; createdAt: string;
        answers: { id: string; questionIndex: number; questionText: string; audioPath: string; transcription: string; score: number; feedback: string }[];
    }[];
}

function getLevelClass(level: string): string {
    const map: Record<string, string> = { 'A1': 'a1', 'A2': 'a2', 'A2+': 'a2plus', 'B1': 'b1', 'B1+': 'b1plus', 'B2': 'b2', 'C1': 'c1' };
    return map[level] || 'none';
}

export default function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [student, setStudent] = useState<StudentDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchStudent = useCallback(async () => {
        try {
            const res = await fetch(`/api/students/${id}`);
            if (!res.ok) { router.push('/dashboard'); return; }
            const data = await res.json();
            setStudent(data.student);
        } catch {
            router.push('/dashboard');
        } finally {
            setLoading(false);
        }
    }, [id, router]);

    useEffect(() => { fetchStudent(); }, [fetchStudent]);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this student and all their results?')) return;
        await fetch(`/api/students/${id}`, { method: 'DELETE' });
        router.push('/dashboard');
    };

    if (loading) return <div className="loading-page"><div className="loading-spinner lg" /><p className="loading-text">Loading student...</p></div>;
    if (!student) return null;

    const lastTest = student.testResults?.[0];
    const lastSpeaking = student.speakingSessions?.find(s => s.status === 'completed');
    const level = lastTest?.level;
    const info = level ? levelDetails[level] : null;

    return (
        <>
            <nav className="navbar">
                <a href="/dashboard" className="navbar-brand">
                    <div className="navbar-logo"><Icons.Logo size={22} /></div>
                    <span className="navbar-title">SpeakLevel</span>
                </a>
                <div className="navbar-actions">
                    <a href="/dashboard" className="btn btn-secondary btn-sm"><Icons.ArrowLeft size={16} /> Back</a>
                </div>
            </nav>

            <div className="page-wrapper">
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">{student.fullName}</h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Icons.Users size={14} /> {student.manager.fullName}</span>
                            {student.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Icons.Phone size={14} /> {student.phone}</span>}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {!lastTest && (
                            <a href={`/assessment/${student.id}/test`} className="btn btn-primary"><Icons.ClipboardCheck size={18} /> Start Test</a>
                        )}
                        {lastTest && !lastSpeaking && (
                            <a href={`/assessment/${student.id}/speaking`} className="btn btn-success"><Icons.Mic size={18} /> Start Speaking</a>
                        )}
                        {lastTest && lastSpeaking && (
                            <a href={`/assessment/${student.id}/speaking`} className="btn btn-secondary"><Icons.Mic size={16} /> Retake Speaking</a>
                        )}
                        <button className="btn btn-danger btn-sm" onClick={handleDelete}><Icons.Trash size={16} /></button>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-header"><div className="stat-icon blue"><Icons.Target size={20} /></div></div>
                        <div className="stat-value">{level || '—'}</div>
                        <div className="stat-label">Test Level</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-header"><div className="stat-icon purple"><Icons.BarChart size={20} /></div></div>
                        <div className="stat-value">{lastTest ? `${lastTest.score}/${lastTest.totalQuestions}` : '—'}</div>
                        <div className="stat-label">Test Score</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-header"><div className="stat-icon cyan"><Icons.Mic size={20} /></div></div>
                        <div className="stat-value">{lastSpeaking ? `${lastSpeaking.overallScore}/10` : '—'}</div>
                        <div className="stat-label">Speaking Score</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-header"><div className="stat-icon pink"><Icons.Award size={20} /></div></div>
                        <div className="stat-value">{info?.description || '—'}</div>
                        <div className="stat-label">Level Description</div>
                    </div>
                </div>

                {info && (
                    <div className="results-card">
                        <div className="card-header">
                            <h2 className="card-title"><div className="card-icon blue"><Icons.Book size={18} /></div> Recommended Book</h2>
                            <span className={`level-badge ${getLevelClass(level!)}`}>{level}</span>
                        </div>
                        <div className="results-book">
                            <div className="results-book-name">{info.book}</div>
                            <div className="results-book-units">{info.units}</div>
                        </div>
                    </div>
                )}

                {lastSpeaking && (
                    <div className="results-card">
                        <div className="card-header">
                            <h2 className="card-title"><div className="card-icon cyan"><Icons.Mic size={18} /></div> Speaking Assessment</h2>
                            <span className="status-badge completed"><span className="status-dot" /> Completed</span>
                        </div>
                        {lastSpeaking.feedback && (
                            <div className="feedback-text">{lastSpeaking.feedback}</div>
                        )}
                        <h3 style={{ marginTop: '28px', marginBottom: '16px', fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Icons.Speaker size={16} /> Recorded Answers
                        </h3>
                        {lastSpeaking.answers.map((answer, idx) => (
                            <div key={answer.id} className="answer-item">
                                <div className="answer-question">Q{idx + 1}: {answer.questionText}</div>
                                {answer.audioPath && <audio controls src={answer.audioPath} />}
                                {answer.transcription && (
                                    <div className="answer-transcription">{answer.transcription}</div>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px' }}>
                                    {answer.score > 0 && <span className="answer-score"><Icons.Star size={12} /> {answer.score}/10</span>}
                                    {answer.feedback && <span className="answer-feedback-text">{answer.feedback}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {student.testResults.length > 1 && (
                    <div className="results-card">
                        <h2 className="card-title" style={{ marginBottom: '16px' }}><div className="card-icon purple"><Icons.Clock size={18} /></div> Test History</h2>
                        {student.testResults.map((test) => (
                            <div key={test.id} className="answer-item">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span className={`level-badge ${getLevelClass(test.level)}`}>{test.level}</span>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>{test.score}/{test.totalQuestions}</span>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{new Date(test.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
