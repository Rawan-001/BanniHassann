import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ message = "جاري تحميل التفاصيل..." }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#000',
        color: '#fff',
        gap: 3,
      }}
    >
      <CircularProgress
        size={60}
        thickness={4}
        sx={{
          color: '#da943c',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          },
        }}
      />
      <Typography
        variant="h6"
        sx={{
          fontFamily: '"RH-Zak Reg", Arial, sans-serif',
          color: '#fff',
          textAlign: 'center',
          fontSize: { xs: '1rem', sm: '1.25rem' },
          fontWeight: 500,
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner; 