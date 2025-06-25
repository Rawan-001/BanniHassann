import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { handleGooglePlaceInfo, validateGoogleMapsUrl } from '../services/googleService';

export default function LocationFetcher() {
  const [url, setUrl] = useState('');
  const [info, setInfo] = useState(null);
  const [error, setError] = useState('');

  const onSubmit = async () => {
    setError('');
    setInfo(null);

    if (!validateGoogleMapsUrl(url)) {
      setError('رابط Google Maps غير صالح');
      return;
    }

    try {
      const data = await handleGooglePlaceInfo(url);
      setInfo(data);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Box 
      sx={{ 
        maxWidth: 600, 
        mx: 'auto', 
        mt: 4,
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        p: 3,
        borderRadius: 2
      }}
    >
      <Typography variant="h4" sx={{ color: '#ffffff', mb: 3, textAlign: 'center' }}>
        جلب معلومات الموقع
      </Typography>
      
      <TextField
        label="رابط Google Maps"
        fullWidth
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="https://www.google.com/maps/place/..."
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

      <Button 
        variant="contained" 
        sx={{ 
          mt: 2,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
          }
        }} 
        onClick={onSubmit}
      >
        احصل على التقييم والإحداثيات
      </Button>

      {error && (
        <Typography color="error" sx={{ mt: 2, color: '#ff6b6b' }}>
          {error}
        </Typography>
      )}

      {info && (
        <Box sx={{ mt: 2, p: 2, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
          <Typography sx={{ color: '#ffffff', mb: 1 }}>⭐ التقييم: {info.rating}</Typography>
          <Typography sx={{ color: '#ffffff' }}>
            📍 الإحداثيات: {info.coordinates.lat}, {info.coordinates.lng}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
