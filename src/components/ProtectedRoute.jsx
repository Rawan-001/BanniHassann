import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, currentUser } = useAuth();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
        }}
      >
        <CircularProgress sx={{ color: '#fff' }} />
        <Typography sx={{ color: '#fff', fontFamily: 'Tajawal, sans-serif' }}>
          جاري التحقق من الجلسة...
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }

  if (!currentUser?.emailVerified) {
    return (
      <Navigate 
        to="/admin-login" 
        replace 
        state={{ 
          message: 'يجب تفعيل البريد الإلكتروني أولاً. تم إرسال رابط التفعيل إلى بريدك الإلكتروني.',
          type: 'warning',
          email: currentUser.email
        }} 
      />
    );
  }

  return children;
}