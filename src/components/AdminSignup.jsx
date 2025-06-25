import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Alert, Link, CircularProgress } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { serverTimestamp } from 'firebase/firestore';

export default function AdminSignup() {
  const navigate = useNavigate();
  const { signup, currentUser, isLoading: authLoading, resendVerificationEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    console.log('🔍 AdminSignup: Auth state check...', { 
      authLoading, 
      hasUser: !!currentUser,
      userEmail: currentUser?.email 
    });
    
    if (!authLoading && currentUser) {
      console.log('✅ AdminSignup: User is authenticated, navigating to admin panel...');
      navigate('/admin', { replace: true });
    }
  }, [authLoading, currentUser, navigate]);

  const handleResendVerification = async () => {
    setIsResending(true);
    setError(null);
    try {
      await resendVerificationEmail(email, password);
      setSuccess('تم إعادة إرسال رابط التفعيل إلى بريدك الإلكتروني');
    } catch (err) {
      setError('فشل في إعادة إرسال رابط التفعيل. تأكد من صحة بيانات الدخول.');
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('رجاءً أدخل البريد الإلكتروني.');
      return;
    }
    if (password.length < 6) {
      setError('كلمة المرور ضعيفة، يجب أن تكون 6 أحرف على الأقل.');
      return;
    }
    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين.');
      return;
    }

    setIsSubmitting(true);
    console.log('🚀 AdminSignup: Attempting signup for:', trimmedEmail);
    
    try {
      const result = await signup(trimmedEmail, password);
      console.log('✅ AdminSignup: Signup successful, verification email sent.');
      
      setSuccess('تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب ثم تسجيل الدخول.');
      
      setTimeout(() => {
        navigate('/admin-login', { 
          state: { 
            message: 'تم إرسال رابط التفعيل إلى بريدك الإلكتروني. قم بالتفعيل ثم سجل الدخول.',
            type: 'success',
          }
        });
      }, 3000);

    } catch (err) {
      console.error('❌ AdminSignup: Signup failed:', err.code, err.message);
      let msg = 'فشل في إنشاء الحساب. حاول مرة أخرى.';
      
      switch (err.code) {
        case 'auth/email-already-in-use':
          msg = 'هذا البريد الإلكتروني مستخدم سابقاً.';
          break;
        case 'auth/invalid-email':
          msg = 'صيغة البريد الإلكتروني غير صحيحة.';
          break;
        case 'auth/weak-password':
          msg = 'كلمة المرور ضعيفة (6 أحرف على الأقل).';
          break;
        case 'auth/network-request-failed':
          msg = 'مشكلة في الاتصال. تحقق من الإنترنت.';
          break;
        default:
          msg = `خطأ في إنشاء الحساب: ${err.message}`;
      }
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          gap: 2
        }}
      >
        <CircularProgress sx={{ color: '#fff' }} />
        <Typography sx={{ color: '#fff', fontFamily: 'Tajawal, sans-serif' }}>
          جاري التحقق من الجلسة...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        padding: 2
      }}
    >
      <Box
        sx={{
          maxWidth: 400,
          width: '100%',
          padding: '2rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          borderRadius: 3,
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}
      >
        <Typography 
          variant="h4" 
          mb={3} 
          align="center"
          sx={{
            color: '#fff',
            fontFamily: 'Amiri, serif',
            fontWeight: 'bold'
          }}
        >
          إنشاء حساب جديد
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

        <form onSubmit={handleSubmit} noValidate>
          <TextField
            label="البريد الإلكتروني"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                background: 'rgba(255,255,255,0.1)',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                '&.Mui-focused fieldset': { borderColor: '#2196f3' }
              },
              '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
            }}
          />
          
          <TextField
            label="كلمة المرور"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                background: 'rgba(255,255,255,0.1)',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                '&.Mui-focused fieldset': { borderColor: '#2196f3' }
              },
              '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
            }}
          />
          
          <TextField
            label="تأكيد كلمة المرور"
            type="password"
            fullWidth
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                background: 'rgba(255,255,255,0.1)',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                '&.Mui-focused fieldset': { borderColor: '#2196f3' }
              },
              '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
            }}
          />

          <Button
            variant="contained"
            type="submit"
            fullWidth
            disabled={isSubmitting}
            sx={{ 
              py: 1.5,
              background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)',
              fontFamily: 'Tajawal, sans-serif',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              '&:hover': {
                background: 'linear-gradient(135deg, #388e3c 0%, #689f38 100%)'
              }
            }}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={20} sx={{ color: '#fff', mr: 1 }} />
                جاري التسجيل...
              </>
            ) : (
              'أنشئ الحساب'
            )}
          </Button>

          {error?.includes('يجب تفعيل البريد الإلكتروني') && (
            <Button
              variant="outlined"
              fullWidth
              onClick={handleResendVerification}
              disabled={isResending}
              sx={{ 
                mt: 2,
                py: 1,
                borderColor: '#2196f3',
                color: '#2196f3',
                '&:hover': {
                  borderColor: '#1976d2',
                  backgroundColor: 'rgba(33, 150, 243, 0.1)'
                }
              }}
            >
              {isResending ? (
                <>
                  <CircularProgress size={20} sx={{ color: '#2196f3', mr: 1 }} />
                  جاري إعادة الإرسال...
                </>
              ) : (
                'إعادة إرسال رابط التفعيل'
              )}
            </Button>
          )}
        </form>

        <Typography variant="body2" align="center" sx={{ mt: 3, color: 'rgba(255,255,255,0.7)' }}>
          لديك حساب؟{' '}
          <Link 
            component={RouterLink} 
            to="/admin-login"
            sx={{ 
              color: '#2196f3',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            تسجيل الدخول
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}