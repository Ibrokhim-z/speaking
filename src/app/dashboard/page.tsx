'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Icons from '@/components/Icons';

interface User {
    id: string;
    username: string;
    fullName: string;
    role: string;
}

interface Student {
    id: string;
    fullName: string;
    phone: string;
    createdAt: string;
    manager: { id: string; fullName: string; username: string };
    testResults: { id: string; level: string; score: number; totalQuestions: number; createdAt: string }[];
    speakingSessions: { id: string; level: string; overallScore: number; status: string; feedback: string; createdAt: string }[];
}

interface Manager {
    id: string;
    fullName: string;
    username: string;
    students: Student[];
}

function getLevelClass(level: string): string {
    const map: Record<string, string> = { 'A1': 'a1', 'A2': 'a2', 'A2+': 'a2plus', 'B1': 'b1', 'B1+': 'b1plus', 'B2': 'b2', 'C1': 'c1' };
    return map[level] || 'none';
}

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [managers, setManagers] = useState<Manager[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newStudentName, setNewStudentName] = useState('');
    const [newStudentPhone, setNewStudentPhone] = useState('');
    const [addingStudent, setAddingStudent] = useState(false);
    const router = useRouter();

    const fetchData = useCallback(async () => {
        try {
            const meRes = await fetch('/api/auth/me');
            if (!meRes.ok) { router.push('/'); return; }
            const meData = await meRes.json();
            setUser(meData.user);

            const studentsRes = await fetch('/api/students');
            const studentsData = await studentsRes.json();
            setStudents(studentsData.students || []);

            if (meData.user.role === 'MAIN_MANAGER') {
                const managersRes = await fetch('/api/managers');
                const managersData = await managersRes.json();
                setManagers(managersData.managers || []);
            }
        } catch {
            router.push('/');
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/');
    };

    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        setAddingStudent(true);
        try {
            const res = await fetch('/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName: newStudentName, phone: newStudentPhone }),
            });
            if (res.ok) {
                setShowAddModal(false);
                setNewStudentName('');
                setNewStudentPhone('');
                fetchData();
            }
        } finally {
            setAddingStudent(false);
        }
    };

    if (loading) {
        return <div className="loading-page"><div className="loading-spinner lg" /><p className="loading-text">Loading dashboard...</p></div>;
    }

    if (!user) return null;

    const totalStudents = user.role === 'MAIN_MANAGER'
        ? managers.reduce((sum, m) => sum + m.students.length, 0) + students.filter(s => !managers.some(m => m.students.some(ms => ms.id === s.id))).length
        : students.length;
    const testedStudents = students.filter(s => s.testResults.length > 0).length;
    const assessedStudents = students.filter(s => s.speakingSessions.some(ss => ss.status === 'completed')).length;

    return (
        <>
            <nav className="navbar">
                <a href="/dashboard" className="navbar-brand">
                    <div className="navbar-logo"><Icons.Logo size={22} /></div>
                    <span className="navbar-title">SpeakLevel</span>
                </a>
                <div className="navbar-actions">
                    <div className="navbar-user">
                        <div className="navbar-user-avatar">{user.fullName.charAt(0)}</div>
                        <div>
                            <div className="navbar-user-name">{user.fullName}</div>
                            <div className="navbar-user-role">{user.role === 'MAIN_MANAGER' ? 'Main Manager' : 'Manager'}</div>
                        </div>
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                        <Icons.LogOut size={16} /> Logout
                    </button>
                </div>
            </nav>

            <div className="page-wrapper">
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">
                            {user.role === 'MAIN_MANAGER' ? 'Main Manager Dashboard' : 'My Students'}
                        </h1>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                        <Icons.UserPlus size={18} /> Add Student
                    </button>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-header">
                            <div className="stat-icon blue"><Icons.Users size={20} /></div>
                        </div>
                        <div className="stat-value">{totalStudents}</div>
                        <div className="stat-label">Total Students</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-header">
                            <div className="stat-icon purple"><Icons.ClipboardCheck size={20} /></div>
                        </div>
                        <div className="stat-value">{testedStudents}</div>
                        <div className="stat-label">Tests Completed</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-header">
                            <div className="stat-icon cyan"><Icons.Mic size={20} /></div>
                        </div>
                        <div className="stat-value">{assessedStudents}</div>
                        <div className="stat-label">Speaking Assessed</div>
                    </div>
                    {user.role === 'MAIN_MANAGER' && (
                        <div className="stat-card">
                            <div className="stat-header">
                                <div className="stat-icon pink"><Icons.Award size={20} /></div>
                            </div>
                            <div className="stat-value">{managers.length}</div>
                            <div className="stat-label">Managers</div>
                        </div>
                    )}
                </div>

                {user.role === 'MAIN_MANAGER' && managers.length > 0 ? (
                    <>
                        {managers.map((manager) => (
                            <div key={manager.id} className="manager-section">
                                <div className="manager-header">
                                    <div className="manager-avatar">{manager.fullName.charAt(0)}</div>
                                    <div>
                                        <div className="manager-name">{manager.fullName}</div>
                                        <div className="manager-username">@{manager.username}</div>
                                    </div>
                                    <div className="manager-student-count">{manager.students.length} students</div>
                                </div>
                                <div className="manager-students">
                                    {manager.students.length === 0 ? (
                                        <div className="empty-state" style={{ padding: '32px' }}>
                                            <p className="empty-state-text">No students yet</p>
                                        </div>
                                    ) : (
                                        manager.students.map((student) => (
                                            <StudentItem key={student.id} student={student} showManager={false} />
                                        ))
                                    )}
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <div className="student-list">
                        {students.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon"><Icons.Inbox size={48} /></div>
                                <h3 className="empty-state-title">No students yet</h3>
                                <p className="empty-state-text">Click &ldquo;Add Student&rdquo; to register a new student for assessment</p>
                            </div>
                        ) : (
                            students.map((student) => (
                                <StudentItem key={student.id} student={student} showManager={user.role === 'MAIN_MANAGER'} />
                            ))
                        )}
                    </div>
                )}
            </div>

            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">Add New Student</h2>
                        <form onSubmit={handleAddStudent}>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input type="text" className="form-input" value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)} placeholder="Student's full name" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone (optional)</label>
                                <input type="text" className="form-input" value={newStudentPhone} onChange={(e) => setNewStudentPhone(e.target.value)} placeholder="+7 ..." />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={addingStudent}>
                                    {addingStudent ? <span className="loading-spinner" /> : <><Icons.UserPlus size={16} /> Add Student</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

function StudentItem({ student, showManager }: { student: Student; showManager: boolean }) {
    const lastTest = student.testResults?.[0];
    const lastSpeaking = student.speakingSessions?.[0];
    const level = lastTest?.level || lastSpeaking?.level;

    return (
        <a href={`/students/${student.id}`} className="student-item">
            <div className="student-info">
                <div className="student-avatar">{student.fullName.charAt(0)}</div>
                <div>
                    <div className="student-name">{student.fullName}</div>
                    {student.phone && <div className="student-phone"><Icons.Phone size={12} /> {student.phone}</div>}
                </div>
            </div>
            <div className="student-meta">
                {showManager && <span className="student-manager">{student.manager?.fullName}</span>}
                {level ? (
                    <span className={`level-badge ${getLevelClass(level)}`}>{level}</span>
                ) : (
                    <span className="level-badge none">Not tested</span>
                )}
                {lastSpeaking?.status === 'completed' ? (
                    <span className="status-badge completed"><span className="status-dot" /> Done</span>
                ) : lastSpeaking?.status === 'in_progress' ? (
                    <span className="status-badge in-progress"><span className="status-dot" /> In Progress</span>
                ) : (
                    <span className="status-badge pending"><span className="status-dot" /> Pending</span>
                )}
            </div>
        </a>
    );
}
