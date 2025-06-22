import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSystemAdmin } from '../contexts/SystemAdminContext';

const SYSTEM_ADMIN_EMAIL = 'systemAdmin@gmail.com';
const SYSTEM_ADMIN_PASSWORD = 'SySADMIn@1122344';

export default function SystemAdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { isSystemAdmin, isSystemAdminChecked, checkSystemAdminStatus } = useSystemAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(location.state?.message || '');

  useEffect(() => {
    const checkAdmin = async () => {
      if (isSystemAdminChecked && isSystemAdmin) {
        navigate('/system-admin/dashboard');
      }
    };
    checkAdmin();
  }, [isSystemAdminChecked, isSystemAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (email !== SYSTEM_ADMIN_EMAIL || password !== SYSTEM_ADMIN_PASSWORD) {
        setError('بيانات الدخول غير صحيحة');
        setLoading(false);
        return;
      }

      await login(email, password);
      const isAdmin = await checkSystemAdminStatus();
      if (isAdmin) {
        navigate('/system-admin/dashboard');
      } else {
        setError('ليس لديك صلاحية الدخول كـ System Admin');
        await login.logout();
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('فشل تسجيل الدخول. تأكد من صحة بيانات الدخول.');
    } finally {
      setLoading(false);
    }
  };

  if (!isSystemAdminChecked) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4, color: '#1a1a2e' }}>
            تسجيل دخول System Admin
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="البريد الإلكتروني"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="كلمة المرور"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #16213e 0%, #1a1a2e 100%)'
                }
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'تسجيل الدخول'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
} 