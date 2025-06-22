import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Container,
} from '@mui/material';
import './components.css';
import pattern from '../assets/pattern-purple.svg';
import logoMunicipality from '../assets/AlBaha-Municipality-White.png';
import logoHealthCity from '../assets/Banni-Hassan-Health-city-White.png';
import logoEmirate from '../assets/Emirate2.svg';
import summerLogo from '../assets/SummerLogo.svg';
import whitePattern from '../assets/WhitePatterns.svg';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, rgba(0,0,0,1) 0%, #3B2B76 40%, #6B4B8A 70%, #B8916C 100%)',
        minHeight: '320px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        p: 0,
      }}
    >
      <Box
        sx={{
          width: { xs: '350px', md: '520px' },
          height: { xs: '80px', md: '120px' },
          margin: '0 auto',
          position: 'relative',
          top: { xs: '24px', md: '32px' },
          zIndex: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img src={whitePattern} alt="White Pattern" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
      </Box>
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 3, py: { xs: 6, md: 8 }, height: '100%' }}>
        <Grid container alignItems="center" justifyContent="space-between" direction="row-reverse" spacing={2} sx={{ height: '100%' }}>
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' }, alignItems: 'center', height: '100%' }}>
            <Box sx={{ maxWidth: { xs: 120, md: 180 }, width: '100%' }}>
              <img src={summerLogo} alt="شعار صيف السعودية 2025" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </Box>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'center', md: 'left' }, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' }, justifyContent: 'center', height: '100%' }}>
            <Typography variant="h2" className="footer-main-heading" sx={{ fontWeight: 'bold', fontSize: { xs: '2.2rem', md: '2.8rem' }, mb: 2, color: '#fff' }}>
              تواصل معنا
            </Typography>
            <Typography className="footer-contact-text" sx={{ fontSize: { xs: '1.1rem', md: '1.3rem' }, mb: 1, color: '#fff', fontWeight: 500 }}>
              لأي استفسارات او فرص للتعاون
            </Typography>
            <Typography className="footer-contact-text" sx={{ fontSize: { xs: '1.1rem', md: '1.3rem' }, color: '#fff', fontWeight: 500 }}>
              نرحب بتواصلكم عبر القنوات التالية
            </Typography>
          </Grid>
        </Grid>
        <Box className="footer-bottom-section" sx={{ mt: 4 }}>
          <Typography className="footer-copyright-text" sx={{ color: '#fff', fontWeight: 500 }}>
            جميع الحقوق محفوظة لبلدية محافظة بني حسن ٢٠٢٥
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}