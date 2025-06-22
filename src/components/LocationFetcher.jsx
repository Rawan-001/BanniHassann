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
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <TextField
        label="رابط Google Maps"
        fullWidth
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="https://www.google.com/maps/place/..."
      />

      <Button variant="contained" sx={{ mt: 2 }} onClick={onSubmit}>
        احصل على التقييم والإحداثيات
      </Button>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {info && (
        <Box sx={{ mt: 2 }}>
          <Typography>⭐ التقييم: {info.rating}</Typography>
          <Typography>
            📍 الإحداثيات: {info.coordinates.lat}, {info.coordinates.lng}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
