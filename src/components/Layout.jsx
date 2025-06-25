import React, { useState, useEffect, useRef } from 'react';
import { Box, Fade, CircularProgress, Typography, useScrollTrigger } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import './components.css';
import logoSvg from '../assets/LOGO.svg'; 

const logoStyles = {
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '2rem',
    marginBottom: '1rem'
  },
  logoImage: {
    maxWidth: '200px',
    maxHeight: '80px',
    width: 'auto',
    height: 'auto',
    objectFit: 'contain',
    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))',
    animation: 'logoFadeIn 0.8s ease-in-out'
  }
};

const logoKeyframes = `
  @keyframes logoFadeIn {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = logoKeyframes;
document.head.appendChild(styleSheet);

function PremiumLoader() {
  return (
    <Box className="layout-premium-loader">
      <Box className="layout-loader-content">
        <CircularProgress
          size={80}
          thickness={3}
          className="layout-loading-spinner"
        />
        <Box className="layout-dashed-circle" />
      </Box>
      <Box sx={logoStyles.logoContainer}>
        <img 
          src={logoSvg} 
          alt="Logo" 
          style={logoStyles.logoImage}
        />
      </Box>
      <Typography className="layout-loader-subtitle">
      </Typography>
    </Box>
  );
}

export default function Layout() {
  const [loading, setLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);
  const scrollProgressRef = useRef(null);
  const location = useLocation();
 
  const showScrollTop = useScrollTrigger({
    threshold: 300,
    disableHysteresis: true
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setFadeIn(true), 50);
    }, 800);

    const handleScroll = () => {
      if (scrollProgressRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        const progress = scrollTop / (scrollHeight - clientHeight);
        scrollProgressRef.current.style.setProperty('--scroll-progress', progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
   
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (loading) {
    return <PremiumLoader />;
  }

  return (
    <Fade in={fadeIn} timeout={800}>
      <Box className="layout-container">
        <Box ref={scrollProgressRef} className="layout-scroll-progress" />
       
        <Box component="main" className="layout-main-content">
          <Outlet />
        </Box>

        <Fade in={showScrollTop}>
          <Box
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="layout-scroll-to-top"
          />
        </Fade>
      </Box>
    </Fade>
  );
}