import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Divider,
  Chip,
  Button
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos, Info } from '@mui/icons-material';

export default function DetailsDialog({ open, onClose, park }) {
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  if (!park) {
    return null;
  }

  const handlePrev = (detailId, totalImages) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [detailId]: ((prev[detailId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  const handleNext = (detailId, totalImages) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [detailId]: ((prev[detailId] || 0) + 1) % totalImages
    }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      PaperProps={{
        sx: {
          background: 'rgba(26,26,46,0.98)',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 3,
          boxShadow: 'none',
          p: { xs: 1, md: 2 },
          maxHeight: '85vh',
          overflowY: 'auto',
          width: { xs: '95vw', md: 900 },
        }
      }}
    >
      <DialogTitle
        sx={{
          color: '#fff',
          fontFamily: "'RH-Zak Reg', Arial, sans-serif",
          fontWeight: 'bold',
          textAlign: 'center',
          borderBottom: '2px solid rgba(255,255,255,0.1)',
          pb: 1.5,
          fontSize: { xs: '1.2rem', md: '1.5rem' },
          letterSpacing: 1,
          background: 'rgba(26,26,46,0.98)',
          m: -2,
          mb: 0,
          p: 2
        }}
      >
        {park.title}
      </DialogTitle>
      
      <DialogContent sx={{ mt: 2, px: { xs: 0.5, md: 2 } }}>
        {park.details && park.details.length > 0 ? (
          <Grid container spacing={2} display="flex" justifyContent="center" direction="column">
            {park.details.map((detail, index) => (
              <Grid xs={12} key={detail.id || index}>
                <Card
                  sx={{
                    width: '100%',
                    mx: 0,
                    p: 0,
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                    background: 'linear-gradient(135deg, #23243a 0%, #1a1a2e 100%)',
                    mb: 4,
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  {detail.images && detail.images.length > 0 ?
                    <Box
                      sx={{
                        width: '100%',
                        height: { xs: 220, sm: 320, md: 400 },
                        borderRadius: '18px 18px 0 0',
                        overflow: 'hidden',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.10)'
                      }}
                    >
                      <img
                        src={typeof detail.images[currentImageIndex[detail.id || index] || 0] === 'string'
                          ? detail.images[currentImageIndex[detail.id || index] || 0]
                          : detail.images[currentImageIndex[detail.id || index] || 0]?.url}
                        alt={detail.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        loading="lazy"
                      />
                      {detail.images.length > 1 && (
                        <>
                          <IconButton
                            onClick={() => handlePrev(detail.id || index, detail.images.length)}
                            sx={{
                              position: 'absolute',
                              top: '50%',
                              left: 8,
                              color: '#fff',
                              background: 'rgba(0,0,0,0.5)',
                              transform: 'translateY(-50%)',
                              zIndex: 1,
                              '&:hover': { background: 'rgba(0,0,0,0.7)' }
                            }}
                          >
                            <ArrowBackIos />
                          </IconButton>
                          <IconButton
                            onClick={() => handleNext(detail.id || index, detail.images.length)}
                            sx={{
                              position: 'absolute',
                              top: '50%',
                              right: 8,
                              color: '#fff',
                              background: 'rgba(0,0,0,0.5)',
                              transform: 'translateY(-50%)',
                              zIndex: 1,
                              '&:hover': { background: 'rgba(0,0,0,0.7)' }
                            }}
                          >
                            <ArrowForwardIos />
                          </IconButton>
                        </>
                      )}
                    </Box>
                    : null
                  }
                  <CardContent sx={{ p: { xs: 1.5, md: 3 } }}>
                    <Typography
                      variant="h5"
                      sx={{
                        color: '#fff',
                        fontWeight: 'bold',
                        mb: 0.5,
                        letterSpacing: 1
                      }}
                    >
                      {detail.title}
                    </Typography>
                    <Divider sx={{ bgcolor: '#fff', opacity: 0.15, my: 1 }} />
                    <Typography
                      sx={{
                        color: 'rgba(255,255,255,0.85)',
                        mb: 1,
                        fontSize: '1rem',
                        lineHeight: 1.7
                      }}
                    >
                      {detail.description}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                      {detail.features?.map((feature, i) => (
                        <Chip key={i} label={feature} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: '#fff' }} />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Info sx={{ fontSize: 36, color: 'rgba(255,255,255,0.3)', mb: 1.5 }} />
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.7)',
                fontFamily: "'RH-Zak Reg', Arial, sans-serif",
                fontSize: '0.9rem'
              }}
            >
              لا توجد تفاصيل إضافية متاحة لهذا الموقع
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Button 
          onClick={onClose} 
          sx={{ 
            color: '#fff',
            fontFamily: "'RH-Zak Reg', Arial, sans-serif",
            borderColor: "rgba(255,255,255,0.3)",
            '&:hover': {
              borderColor: "rgba(255,255,255,0.5)",
              background: "rgba(255,255,255,0.1)"
            }
          }}
        >
          إغلاق
        </Button>
      </DialogActions>
    </Dialog>
  );
} 