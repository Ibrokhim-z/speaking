'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Icons from '@/components/Icons';

export default function RegisterPage() {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, fullName }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Registration failed');

            router.push('/dashboard');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">
                    <Icons.Logo size={48} />
                </div>
                <h1 className="auth-title">Create Account</h1>
                <p className="auth-subtitle">Register as a manager to start assessing students</p>

                {error && (
                    <div className="error-message">
                        <Icons.XCircle size={16} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input type="text" className="form-input" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your full name" required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input type="text" className="form-input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Choose a username" required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Choose a password" required minLength={6} />
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                        {loading ? <span className="loading-spinner" /> : <><Icons.UserPlus size={18} /> Create Account</>}
                    </button>
                </form>

                <p className="auth-link">
                    Already have an account? <a href="/">Sign in here</a>
                </p>
            </div>
        </div>
    );
}
