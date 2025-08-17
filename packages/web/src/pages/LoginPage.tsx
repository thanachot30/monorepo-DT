import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext';
import {
    Box,
    Paper,
    Stack,
    TextField,
    Button,
    Typography,
    Alert,
    IconButton,
    InputAdornment,
    CircularProgress,
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined } from '@mui/icons-material';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('admin@example.com');
    const [password, setPassword] = useState('password');
    const [loading, setLoading] = useState(false);
    const [showPwd, setShowPwd] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [remember, setRemember] = useState(true);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation() as any;

    const from = location.state?.from?.pathname || '/user';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // TODO: replace with your NestJS API call
            // const res = await axiosInstance.post('/auth/login', { email, password });
            // const { accessToken, user } = res.data;

            // Demo-only:
            const accessToken = 'demo.jwt.token';
            const user = { id: '1', email, role: 'admin' };

            // (Optional) persist token differently based on "remember me"
            // Your useAuth could handle this too—adjust as needed.
            if (!remember) {
                // Example: store in memory only (your AuthContext can support this)
                // For now we just proceed normally.
            }

            login(accessToken, user);
            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100dvh',
                display: 'grid',
                placeItems: 'center',
                bgcolor: (t) => t.palette.background.default,
                px: 2,
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    width: '100%',
                    maxWidth: 420,
                    p: 4,
                    borderRadius: 3,
                }}
            >
                <Stack spacing={3} component="form" onSubmit={handleSubmit}>
                    <Stack spacing={1} alignItems="center">
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: '50%',
                                display: 'grid',
                                placeItems: 'center',
                                bgcolor: (t) => t.palette.primary.main,
                                color: 'primary.contrastText',
                            }}
                        >
                            <LockOutlined />
                        </Box>
                        <Typography variant="h5" fontWeight={600}>
                            Sign in
                        </Typography>
                        <Typography variant="body2" color="text.secondary" textAlign="center">
                            Use your admin credentials to access the dashboard
                        </Typography>
                    </Stack>

                    {error && <Alert severity="error">{error}</Alert>}

                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        fullWidth
                        required
                    />

                    <TextField
                        label="Password"
                        type={showPwd ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        fullWidth
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        edge="end"
                                        onClick={() => setShowPwd((v) => !v)}
                                        aria-label={showPwd ? 'Hide password' : 'Show password'}
                                    >
                                        {showPwd ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={remember}
                                    onChange={(e) => setRemember(e.target.checked)}
                                    size="small"
                                />
                            }
                            label="Remember me"
                        />
                        {/* Optional: forgot password link */}
                        {/* <Button size="small">Forgot password?</Button> */}
                    </Stack>

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disableElevation
                        disabled={loading}
                        sx={{ py: 1.2 }}
                    >
                        {loading ? (
                            <Stack direction="row" spacing={1} alignItems="center">
                                <CircularProgress size={20} />
                                <span>Signing in…</span>
                            </Stack>
                        ) : (
                            'Login'
                        )}
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
};

export default LoginPage;
