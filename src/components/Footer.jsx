import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Container,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
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
        <img 
          src={whitePattern} 
          alt="White Pattern" 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'contain', 
            display: 'block' 
          }} 
        />
      </Box>
      
      <Container 
        maxWidth="xl" 
        sx={{ 
          position: 'relative', 
          zIndex: 3, 
          py: { xs: 4, md: 8 }, 
          height: '100%' 
        }}
      >
        <Grid 
          container 
          alignItems="center" 
          justifyContent="space-between" 
          spacing={2} 
          sx={{ 
            height: '100%',
            // للجوال: تخطيط عمودي مع الشعار في الأعلى والنصوص في الأسفل
            flexDirection: { xs: 'column', md: 'row' }
          }}
        >
          {/* النصوص - يسار في الديسكتوب، أسفل في الجوال */}
          <Grid 
            item 
            xs={12} 
            md={8} 
            sx={{ 
              textAlign: { xs: 'center', md: 'left' }, 
              color: '#fff', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: { xs: 'center', md: 'flex-start' }, 
              justifyContent: 'center',
              order: { xs: 2, md: 1 },
              px: { xs: 2, md: 0 }
            }}
          >
            <Typography 
              variant="h2" 
              className="footer-main-heading" 
              sx={{ 
                fontWeight: 'bold', 
                fontSize: { xs: '1.8rem', md: '2.8rem' }, 
                mb: { xs: 1.5, md: 2 }, 
                color: '#fff' 
              }}
            >
              تواصل معنا
            </Typography>
            
            <Typography 
              className="footer-contact-text" 
              sx={{ 
                fontSize: { xs: '1rem', md: '1.3rem' }, 
                mb: { xs: 0.8, md: 1 }, 
                color: '#fff', 
                fontWeight: 500,
                lineHeight: 1.4
              }}
            >
              لأي استفسارات او فرص للتعاون
            </Typography>
            
            <Typography 
              className="footer-contact-text" 
              sx={{ 
                fontSize: { xs: '1rem', md: '1.3rem' }, 
                mb: { xs: 1, md: 1.5 }, 
                color: '#fff', 
                fontWeight: 500,
                lineHeight: 1.4
              }}
            >
              نرحب بتواصلكم عبر القنوات التالية
            </Typography>
            
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontSize: { xs: '0.95rem', md: '1.2rem' },
                color: '#fff',
                fontWeight: 500,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: { xs: '8px 12px', md: '10px 16px' },
                borderRadius: '8px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                justifyContent: { xs: 'center', md: 'flex-start' },
                direction: 'ltr'
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontSize: 'inherit',
                  fontWeight: 'inherit',
                  wordBreak: 'break-all'
                }}
              >
                banihassan@amanatalbaha.gov.sa
              </Typography>
              <EmailIcon sx={{ fontSize: { xs: '1.3rem', md: '1.6rem' }, mr: 1 }} />
            </Box>
          </Grid>

          {/* الشعار - يمين في الديسكتوب، أعلى في الجوال */}
          <Grid 
            item 
            xs={12} 
            md={4} 
            sx={{ 
              display: 'flex', 
              justifyContent: { xs: 'center', md: 'flex-end' }, 
              alignItems: 'center',
              order: { xs: 1, md: 2 },
              mb: { xs: 3, md: 0 }
            }}
          >
            <Box sx={{ maxWidth: { xs: 140, md: 180 }, width: '100%' }}>
              <img 
                src={summerLogo} 
                alt="شعار صيف السعودية 2025" 
                style={{ 
                  width: '100%', 
                  height: 'auto', 
                  display: 'block' 
                }} 
              />
            </Box>
          </Grid>
        </Grid>
        
        <Box 
          className="footer-bottom-section" 
          sx={{ 
            mt: { xs: 3, md: 4 },
            pt: { xs: 2, md: 3 },
            textAlign: 'center'
          }}
        >
          <Typography 
            className="footer-copyright-text" 
            sx={{ 
              color: '#fff', 
              fontWeight: 500,
              fontSize: { xs: '0.85rem', md: '1rem' }
            }}
          >
            جميع الحقوق محفوظة لبلدية محافظة بني حسن ٢٠٢٥
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}