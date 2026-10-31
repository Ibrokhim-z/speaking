'use client';

import { useState, useEffect, useRef, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface SpeakingQuestion {
    id: number;
    level: string;
    question: string;
}

export default function SpeakingPage({ params }: { params: Promise<{ studentId: string }> }) {
    const { studentId } = use(params);
    const [questions, setQuestions] = useState<SpeakingQuestion[]>([]);
    const [sessionId, setSessionId] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [recordedBlobs, setRecordedBlobs] = useState<Record<number, Blob>>({});
    const [savedAnswers, setSavedAnswers] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(true);
    const [evaluating, setEvaluating] = useState(false);
    const [feedbackResult, setFeedbackResult] = useState<{ feedback: string; overallScore: number } | null>(null);
    const [level, setLevel] = useState('');
    const [feedbackLang, setFeedbackLang] = useState('en');
    const [studentName, setStudentName] = useState('');

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const router = useRouter();

    const startSession = useCallback(async () => {
        try {
            // Get student info to find their level
            const studentRes = await fetch(`/api/students/${studentId}`);
            if (!studentRes.ok) { router.push('/dashboard'); return; }
            const studentData = await studentRes.json();
            const student = studentData.student;
            setStudentName(student.fullName);

            const testLevel = student.testResults?.[0]?.level || 'A1';
            setLevel(testLevel);

            const res = await fetch('/api/speaking/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId, level: testLevel }),
            });
            const data = await res.json();
            setSessionId(data.session.id);
            setQuestions(data.questions);
        } catch {
            router.push('/dashboard');
        } finally {
            setLoading(false);
        }
    }, [studentId, router]);

    useEffect(() => { startSession(); }, [startSession]);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop();
            }
        };
    }, []);

    const speakQuestion = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 0.85;
            utterance.pitch = 1;
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setRecordedBlobs(prev => ({ ...prev, [currentIndex]: blob }));
                stream.getTracks().forEach(track => track.stop());
                if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
            };

            mediaRecorder.start(1000);
            setIsRecording(true);
            setRecordingTime(0);
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } catch (err) {
            console.error('Microphone error:', err);
            alert('Please allow microphone access to record your answer.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
        }
    };

    const saveCurrentAnswer = async () => {
        const blob = recordedBlobs[currentIndex];
        if (!blob || !sessionId) return;

        const formData = new FormData();
        formData.append('sessionId', sessionId);
        formData.append('questionIndex', String(currentIndex));
        formData.append('questionText', questions[currentIndex].question);
        formData.append('audio', blob, `q${currentIndex}.webm`);

        try {
            await fetch('/api/speaking/save-answer', { method: 'POST', body: formData });
            setSavedAnswers(prev => new Set(prev).add(currentIndex));
        } catch (err) {
            console.error('Save error:', err);
        }
    };

    const handleNext = async () => {
        if (recordedBlobs[currentIndex] && !savedAnswers.has(currentIndex)) {
            await saveCurrentAnswer();
        }
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handleFinish = async () => {
        if (recordedBlobs[currentIndex] && !savedAnswers.has(currentIndex)) {
            await saveCurrentAnswer();
        }
        setEvaluating(true);
        try {
            const res = await fetch('/api/speaking/evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId, lang: feedbackLang }),
            });
            const data = await res.json();
            setFeedbackResult(data);
        } catch {
            setFeedbackResult({ feedback: 'Evaluation complete. Check student details for results.', overallScore: 0 });
        } finally {
            setEvaluating(false);
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (loading) return <div className="loading-page"><div className="loading-spinner lg" /><p className="loading-text">Preparing speaking assessment...</p></div>;

    if (evaluating) {
        return (
            <div className="loading-page">
                <div className="loading-spinner lg" />
                <p className="loading-text">🤖 AI is evaluating the responses...</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>This may take a minute</p>
            </div>
        );
    }

    if (feedbackResult) {
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
                        <div className="results-card" style={{ textAlign: 'center' }}>
                            <h2 style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>Speaking Assessment Complete</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>{studentName}</p>
                            {feedbackResult.overallScore > 0 && (
                                <div className="results-level">
                                    <div className="results-level-value">{feedbackResult.overallScore}/10</div>
                                    <div className="results-level-desc">Overall Score</div>
                                </div>
                            )}
                        </div>
                        <div className="results-card">
                            <h3 className="card-title" style={{ marginBottom: '16px' }}>📝 Feedback</h3>
                            <div className="feedback-text">{feedbackResult.feedback}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
                            <a href={`/students/${studentId}`} className="btn btn-primary btn-lg">View Full Results</a>
                            <a href="/dashboard" className="btn btn-secondary">Back to Dashboard</a>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;
    const hasRecording = !!recordedBlobs[currentIndex];

    return (
        <>
            <nav className="navbar">
                <a href="/dashboard" className="navbar-brand">
                    <div className="navbar-logo">S</div>
                    <span className="navbar-title">SpeakLevel</span>
                </a>
                <div className="navbar-actions">
                    <div className="lang-selector">
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginRight: '4px' }}>Feedback:</span>
                        {['en', 'ru', 'kz'].map(lang => (
                            <button
                                key={lang}
                                className={`lang-btn ${feedbackLang === lang ? 'active' : ''}`}
                                onClick={() => setFeedbackLang(lang)}
                            >
                                {lang.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            <div className="page-wrapper">
                <div className="speaking-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{studentName}</span>
                        <span className={`level-badge ${level.toLowerCase().replace('+', 'plus')}`}>{level}</span>
                    </div>

                    <div className="progress-bar-container">
                        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                    </div>

                    <div className="speaking-card">
                        <span className="question-number">Question {currentIndex + 1} of {questions.length}</span>

                        <p className="speaking-question-text">{currentQuestion.question}</p>

                        <button
                            className={`tts-btn ${isSpeaking ? 'speaking' : ''}`}
                            onClick={() => speakQuestion(currentQuestion.question)}
                            disabled={isSpeaking}
                        >
                            🔊 {isSpeaking ? 'Speaking...' : 'Listen to Question'}
                        </button>

                        <div style={{ margin: '32px 0' }}>
                            <button
                                className={`record-btn ${isRecording ? 'recording' : ''}`}
                                onClick={isRecording ? stopRecording : startRecording}
                            />
                            <div className="record-label">
                                {isRecording ? 'Recording... Tap to stop' : hasRecording ? '✓ Recorded — Tap to re-record' : 'Tap to start recording'}
                            </div>
                            {isRecording && <div className="record-timer">{formatTime(recordingTime)}</div>}
                        </div>

                        {hasRecording && !isRecording && (
                            <div style={{ marginBottom: '20px' }}>
                                <audio controls src={URL.createObjectURL(recordedBlobs[currentIndex])} style={{ width: '100%' }} />
                            </div>
                        )}

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
                                    className="btn btn-primary btn-lg"
                                    onClick={handleFinish}
                                    disabled={!hasRecording}
                                >
                                    Finish & Evaluate
                                </button>
                            ) : (
                                <button
                                    className="btn btn-primary"
                                    onClick={handleNext}
                                    disabled={!hasRecording}
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
