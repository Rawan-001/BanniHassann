import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, Container } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import './components.css';
import { motion } from "framer-motion";

import logoMain from "../assets/LOGO.svg";
import headerVideo from "../assets/header_video.mp4";
import logoMunicipality from "../assets/AlBaha-Municipality-White.png";
import logoHealthCity from "../assets/Banni-Hassan-Health-city-White.png";
import logoEmirate from "../assets/Emirate2.svg";
import SummerLogo from "../assets/SummerLogo.svg";
import pattern from "../assets/pattern-purple.svg";
import NewPattern from "../assets/NewPattern.svg";
import NewPatterns2 from "../assets/NewPatterns2.svg";
import NewPatternsSigngle from "../assets/NewPatternsSigngle.svg";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 641);
      setIsTablet(width >= 641 && width < 768);
      
      console.log('Screen width:', width, 'isMobile:', width < 641, 'isTablet:', width >= 641 && width < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const scrollToNextSection = () => {
    const nextSection = document.getElementById('bani-hassan-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const MobileNavigation = () => (
    <Box className="hero-navigation-base hero-navigation-mobile">
      <Box
        component="img"
        src={logoEmirate}
        alt="إمارة الباحة"
        className="hero-nav-logo hero-nav-logo-mobile"
        loading="eager"
        decoding="async"
        width={60}
        height={60}
      />
      
      <Box
        component="img"
        src={logoMain}
        alt="شعار بني حسن"
        className="hero-nav-logo hero-nav-logo-mobile"
        loading="eager"
        decoding="async"
        width={60}
        height={60}
      />
      
      <Box
        component="img"
        src={logoMunicipality}
        alt="بلدية الباحة"
        className="hero-nav-logo hero-nav-logo-mobile"
        loading="eager"
        decoding="async"
        width={60}
        height={60}
      />
      
      <Box
        component="img"
        src={logoHealthCity}
        alt="مدينة بني حسن الصحية"
        className="hero-nav-logo hero-nav-logo-mobile"
        loading="eager"
        decoding="async"
        width={60}
        height={60}
      />
    </Box>
  );

  const TabletNavigation = () => (
    <Box className="hero-navigation-base hero-navigation-tablet">
      <Box
        component="img"
        src={logoEmirate}
        alt="إمارة الباحة"
        className="hero-nav-logo hero-nav-logo-tablet"
        loading="eager"
        decoding="async"
        width={60}
        height={60}
      />
      
      <Box
        component="img"
        src={logoMain}
        alt="شعار بني حسن"
        className="hero-nav-logo hero-nav-logo-tablet"
        loading="eager"
        decoding="async"
        width={60}
        height={60}
      />
      
      <Box
        component="img"
        src={logoMunicipality}
        alt="بلدية الباحة"
        className="hero-nav-logo hero-nav-logo-tablet"
        loading="eager"
        decoding="async"
        width={60}
        height={60}
      />
      
      <Box
        component="img"
        src={logoHealthCity}
        alt="مدينة بني حسن الصحية"
        className="hero-nav-logo hero-nav-logo-tablet"
        loading="eager"
        decoding="async"
        width={60}
        height={60}
      />
    </Box>
  );

  const DesktopNavigation = () => (
    <Box className="hero-navigation-base hero-navigation-desktop">
      <Box className="hero-nav-logos-left">
        <Box
          component="img"
          src={logoEmirate}
          alt="إمارة الباحة"
          className="hero-nav-logo hero-nav-logo-desktop"
          loading="eager"
          decoding="async"
          width={60}
          height={60}
        />
      </Box>

      <Box className="hero-nav-logos-right">
        <Box
          component="img"
          src={logoMunicipality}
          alt="بلدية الباحة"
          className="hero-nav-logo hero-nav-logo-desktop"
          loading="eager"
          decoding="async"
          width={60}
          height={60}
        />
        <Box
          component="img"
          src={logoHealthCity}
          alt="مدينة بني حسن الصحية"
          className="hero-nav-logo hero-nav-logo-desktop"
          loading="eager"
          decoding="async"
          width={60}
          height={60}
        />
      </Box>

      <Box
        component="img"
        src={logoMain}
        alt="شعار بني حسن الرئيسي"
        className="hero-nav-main-logo hero-nav-main-logo-desktop"
        loading="eager"
        decoding="async"
        width={60}
        height={60}
      />
    </Box>
  );

  return (
    <Box component="section" className="hero-section">
      <Box className="hero-black-gradient" />
      <Box className="hero-corner-pattern">
        <motion.img
          src={NewPatterns2}
          alt="زخرفة موحدة"
          className="hero-corner-pattern-img"
        />
      </Box>
      <Box className="hero-video-box">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="hero-background-video"
        >
          <source src={headerVideo} type="video/mp4" />
        </video>
      </Box>
      <Box className="hero-logos-left">
        <img src={logoMunicipality} alt="بلدية الباحة" className="hero-logo-img" />
        <img src={logoHealthCity} alt="مدينة بني حسن الصحية" className="hero-logo-img" />
      </Box>
      <Box className="hero-logos-right">
        <img src={logoEmirate} alt="إمارة الباحة" className="hero-logo-img hero-logo-emirate" />
        <img src={SummerLogo} alt="شعار صيف بني حسن" className="hero-logo-img hero-logo-summer" />
      </Box>
      <Box className="hero-main-logo-box">
        <img src={logoMain} alt="شعار بني حسن" className="hero-main-logo-img" />
      </Box>
      <Box className="hero-main-texts">
        <Typography 
          variant="h4" 
          className="hero-welcome-text"
        >
          يهلّون بك و يرحبون
        </Typography>
        <Typography 
          variant="h2" 
          className="hero-title-text"
        >
          أهلها و جبالها
        </Typography>
        <Typography 
          variant="h6"
          className="hero-guide-text"
        >
          الدليل السياحي لمحافظة بني حسن
        </Typography>
      </Box>

      {/* أيقونة اليد للجوال فقط */}
      {isMobile && (
        <div 
          className="hero-mobile-hand-icon" 
          onClick={scrollToNextSection} 
        />
      )}
      
      {!isMobile && (
        <Box 
          className="hero-scroll-indicator-box"
          onClick={scrollToNextSection}
        >
           <svg width="24" height="44" viewBox="0 0 24 44" fill="none" xmlns="http://www.w3.org/2000/svg">
             <rect x="1.5" y="1.5" width="21" height="31" rx="10" stroke="#fff" strokeWidth="2" fill="none"/>
             <rect x="11" y="8" width="2" height="8" rx="1" fill="#fff"/>
             <g>
               <animateTransform attributeName="transform" type="translate" values="0 0; 0 6; 0 0" dur="1.5s" repeatCount="indefinite"/>
               <path d="M12 36 V42" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
               <path d="M9 40 L12 43 L15 40" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
             </g>
           </svg>
        </Box>
      )}
    </Box>
  );
}