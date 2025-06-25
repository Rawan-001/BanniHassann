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
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSystemAdmin } from '../contexts/SystemAdminContext';

export default function SystemAdminSignup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signup } = useAuth();
  const { isSystemAdmin } = useSystemAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [invitationData, setInvitationData] = useState(null);

  useEffect(() => {
    const checkInvitation = async () => {
      try {
        const token = searchParams.get('token');
        if (!token) {
          setError('رابط الدعوة غير صالح');
          setIsChecking(false);
          return;
        }

        const invitation = await validateAdminInvitation(token);
        if (invitation.valid) {
          setInvitationData(invitation);
          setEmail(invitation.email);
        } else {
          setError('رابط الدعوة غير صالح أو منتهي الصلاحية');
        }
      } catch (error) {
        console.error('Error checking invitation:', error);
        setError('فشل في التحقق من صلاحية الدعوة');
      } finally {
        setIsChecking(false);
      }
    };

    checkInvitation();
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }

    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    setLoading(true);

    try {
      await signup(email, password);
      navigate('/system-admin/login', {
        state: { message: 'تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.' }
      });
    } catch (error) {
      console.error('Signup error:', error);
      setError('فشل في إنشاء الحساب. تأكد من صحة البيانات.');
    } finally {
      setLoading(false);
    }
  };

  if (isChecking) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!invitationData) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">
            {error || 'رابط الدعوة غير صالح'}
          </Alert>
        </Box>
      </Container>
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
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4, color: '#ffffff' }}>
            إنشاء حساب System Admin
          </Typography>

          <Typography variant="body1" align="center" sx={{ mb: 3, color: '#cccccc' }}>
            تمت دعوتك للانضمام كـ {invitationData.role}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="البريد الإلكتروني"
              type="email"
              value={email}
              disabled
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="كلمة المرور"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="تأكيد كلمة المرور"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? <CircularProgress size={24} /> : 'إنشاء الحساب'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
} 