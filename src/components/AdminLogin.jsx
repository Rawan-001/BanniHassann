import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Alert, Link } from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { serverTimestamp } from 'firebase/firestore';

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, currentUser, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(location.state?.message || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log('🔍 AdminLogin: Auth state check...', { 
      authLoading, 
      hasUser: !!currentUser,
      userEmail: currentUser?.email,
      isEmailVerified: currentUser?.emailVerified
    });
    
    if (!authLoading && currentUser?.emailVerified) {
      console.log('✅ AdminLogin: User is authenticated and verified, navigating to admin panel...');
      navigate('/admin', { replace: true });
    } else if (!authLoading && currentUser && !currentUser.emailVerified) {
      console.log('⚠️ AdminLogin: User is not verified');
      setError('يجب تفعيل البريد الإلكتروني أولاً. يرجى التحقق من بريدك الإلكتروني والضغط على رابط التفعيل.');
    }
  }, [authLoading, currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('رجاءً أدخل البريد الإلكتروني.');
      return;
    }
    if (!password) {
      setError('رجاءً أدخل كلمة المرور.');
      return;
    }

    setIsSubmitting(true);
    console.log('🚀 AdminLogin: Attempting login for:', trimmedEmail);
    
    try {
      const result = await login(trimmedEmail, password);
      console.log('✅ AdminLogin: Login successful');
      
      if (result.user.emailVerified) {
        console.log('📬 AdminLogin: Email is verified.');
        
        const { doc, getDoc, setDoc, updateDoc } = await import('firebase/firestore');
        const { db } = await import('../firebaseConfig');
        
        const adminDocRef = doc(db, 'admins', result.user.uid);
        const adminDoc = await getDoc(adminDocRef);

        if (!adminDoc.exists()) {
            console.log('📝 AdminLogin: Admin document does not exist. Creating now...');
            const adminData = {
              email: result.user.email,
              role: 'super_admin',
              permissions: ['read', 'write', 'delete', 'manage_sites', 'manage_media'],
              isActive: true,
              status: 'active',
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              createdBy: 'self_registration_on_verification',
              emailVerified: true,
              lastLoginAt: serverTimestamp(),
              userId: result.user.uid
            };
            await setDoc(adminDocRef, adminData);
            console.log('✅ AdminLogin: Admin document created successfully.');
        } else {
            console.log('👍 AdminLogin: Admin document already exists. Updating last login time.');
            await updateDoc(adminDocRef, {
                lastLoginAt: serverTimestamp(),
                emailVerified: true 
            });
        }

        navigate('/admin', { replace: true });

      } else {
        console.log('📪 AdminLogin: Email is NOT verified.');
        setError('يجب تفعيل حسابك عبر الرابط المرسل إلى بريدك الإلكتروني أولاً.');
        const { getAuth, signOut } = await import('firebase/auth');
        await signOut(getAuth());
      }
      
    } catch (err) {
      console.error('AdminLogin: Login failed:', err.code, err.message);
      let msg = 'فشل في تسجيل الدخول. تأكد من البيانات وحاول مجددًا.';
      
      switch (err.code) {
        case 'auth/email-not-verified':
          msg = 'يجب تفعيل البريد الإلكتروني أولاً. يرجى التحقق من بريدك الإلكتروني والضغط على رابط التفعيل.';
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          msg = 'بيانات الدخول غير صحيحة.';
          break;
        case 'auth/invalid-email':
          msg = 'صيغة البريد الإلكتروني غير صحيحة.';
          break;
        case 'auth/too-many-requests':
          msg = 'محاولات كثيرة. حاول مرة أخرى لاحقاً.';
          break;
        case 'auth/network-request-failed':
          msg = 'مشكلة في الاتصال. تحقق من الإنترنت.';
          break;
        default:
          msg = `خطأ في تسجيل الدخول: ${err.message}`;
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
          تسجيل الدخول 
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
              background: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)',
              fontFamily: 'Tajawal, sans-serif',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              '&:hover': {
                background: 'linear-gradient(135deg, #1976d2 0%, #1cb5e0 100%)'
              }
            }}
          >
            {isSubmitting ? 'جاري الدخول...' : 'دخول'}
          </Button>
        </form>

        <Typography variant="body2" align="center" sx={{ mt: 3, color: 'rgba(255,255,255,0.7)' }}>
          ليس لديك حساب؟{' '}
          <Link 
            component={RouterLink} 
            to="/admin-signup"
            sx={{ 
              color: '#2196f3',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            إنشاء حساب جديد
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}