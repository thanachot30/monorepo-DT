import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext'

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('admin@example.com');
    const [password, setPassword] = useState('password');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation() as any;

    const from = location.state?.from?.pathname || '/user'; // default redirect

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // TODO: call your NestJS API here:
            // const res = await axios.post('/auth/login', { email, password });
            // const { accessToken, user } = res.data;

            // Demo-only:
            const accessToken = 'demo.jwt.token';
            const user = { id: '1', email, role: 'admin' };

            login(accessToken, user);
            navigate(from, { replace: true });
        } catch (err) {
            alert('Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 360, margin: '64px auto', padding: 24, border: '1px solid #eee', borderRadius: 12 }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
                <label>
                    Email
                    <input value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>

                <label>
                    Password
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>

                <button type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Login'}</button>
            </form>
        </div>
    );
};

export default LoginPage;
