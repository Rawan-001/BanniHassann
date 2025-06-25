import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const FastLoadingSpinner = ({ message }) => {
  return (
    <Box
      className="fast-loading-spinner"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#000',
        gap: 2,
        willChange: 'auto',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
      }}
    >
      <CircularProgress
        size={40}
        thickness={2}
        sx={{
          color: '#da943c',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
            willChange: 'auto',
          },
        }}
      />
      {message && (
        <Typography
          sx={{
            color: '#fff',
            fontFamily: '"RH-Zak Reg", Arial, sans-serif',
            fontSize: '0.9rem',
            textAlign: 'center',
            willChange: 'auto',
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default FastLoadingSpinner; 