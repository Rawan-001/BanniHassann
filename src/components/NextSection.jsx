import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Box,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { 
  Visibility, 
  LocalCafe, 
  Water, 
  Park, 
  Business, 
  Terrain, 
  Agriculture, 
  Fence 
} from "@mui/icons-material";
import "./components.css"; 

import farmImage from "../assets/Hassan-Al-Shanteer-Farm.jpg";
import CardSVG from '../assets/Card.svg';
import LeafSVG from '../assets/Leaf.svg';
import YellowPatterns from '../assets/YellowPatterns.svg';

const FEATURES = [
  [
    {
      label: "المنتزهات",
      link: "/parks",
      icon: Park,
    },
    {
      label: "السدود",
      link: "/dams",
      icon: Water,
    },
    {
      label: "مقاهي",
      link: "/cafes",
      icon: LocalCafe,
    },
  ],
  [
    {
      label: "المزارع",
      link: "/farms",
      icon: Fence,
    },
    {
      label: "المطلات",
      link: "/viewpoints",
      icon: Terrain,
    },
    {
      label: "النزل",
      link: "/housing",
      icon: Business,
    },
  ],
];

const ALL_FEATURES = FEATURES.flat();

export default function BaniHassan() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isForcedStatic, setIsForcedStatic] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLaptop, setIsLaptop] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('down');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isStaticMode, setIsStaticMode] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [animationTriggered, setAnimationTriggered] = useState(false);
  const sectionRef = useRef();
  const cardRef = useRef();
  const descriptionRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 767);        // هنا للجوال
      setIsLaptop(width > 1440);        // لابتوب
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const featuresSection = document.querySelector('.bani-hassan-features-section');
      const textContent = document.querySelector('.bani-hassan-text-content');
      
      if (featuresSection && textContent) {
        const featuresRect = featuresSection.getBoundingClientRect();
        const textRect = textContent.getBoundingClientRect();
        
        if (featuresRect.top <= window.innerHeight * 0.8) {
          if (!isStaticMode) {
            setIsStaticMode(true);
            
            const elementsToStatic = [
              '.bani-hassan-text-content',
              '.bani-hassan-card-svg',
              '.bani-hassan-description',
              '.bani-hassan-card-container',
              '.bani-hassan-description-box'
            ];
            
            elementsToStatic.forEach(selector => {
              const elements = document.querySelectorAll(selector);
              elements.forEach(el => {
                el.classList.add('static-mode');
              });
            });
          }
        } else {
          if (isStaticMode) {
            setIsStaticMode(false);
            
            const elementsToStatic = [
              '.bani-hassan-text-content',
              '.bani-hassan-card-svg',
              '.bani-hassan-description',
              '.bani-hassan-card-container',
              '.bani-hassan-description-box'
            ];
            
            elementsToStatic.forEach(selector => {
              const elements = document.querySelectorAll(selector);
              elements.forEach(el => {
                el.classList.remove('static-mode');
              });
            });
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isStaticMode]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isStaticMode, hasAnimated]);

  useEffect(() => {
    const handleMouseDown = (e) => {
      if (window.innerWidth >= 900) setIsForcedStatic(true);
    };
    window.addEventListener('mousedown', handleMouseDown);
    return () => window.removeEventListener('mousedown', handleMouseDown);
  }, []);

  useEffect(() => {
    setIsFloating(false);
  }, [isStaticMode, hasAnimated]);

  const isCardInView = useInView(cardRef, { once: true, threshold: 0.3 });
  const isDescriptionInView = useInView(descriptionRef, { once: true, threshold: 0.3 });

  const handleCardClick = (link) => {
    if (navigate) {
      navigate(link);
    } else {
      console.log(`Navigate to: ${link}`);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="bani-hassan-section"
      className="bani-hassan-section"
    >
      <div className="bani-hassan-section-gradient1" />
      <div className="bani-hassan-section-gradient2" />
      <div className="bani-hassan-header">
        <Container maxWidth="xl" className="bani-hassan-header-container">
          <div className={`bani-hassan-text-content ${isVisible ? "visible" : ""} ${isStaticMode ? "static-mode" : ""}`}> 
            <motion.div 
              ref={descriptionRef}
              className="bani-hassan-description-box"
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={isDescriptionInView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 50, scale: 0.9 }}
              transition={{ 
                duration: 0.8, 
                ease: "easeOut",
                delay: 0.1
              }}
            >
              <Typography
                variant="body1"
                className="bani-hassan-description"
              >
                تُعد بني حسن من أجمل محافظات منطقة الباحة، تتميز بطبيعتها الجبلية، ومدرجاتها الخضراء، وأجوائها المعتدلة. تجمع بين التراث الأصيل وجمال الطبيعة، ما يجعلها وجهة مميزة لمحبي الهدوء والاسترخاء.
              </Typography>
            </motion.div>
            <div className="bani-hassan-card-container">
              <motion.img 
                ref={cardRef}
                src={CardSVG} 
                alt="كرت"
                loading="eager"
                decoding="async"
                width={60}
                height={60}
                className="bani-hassan-card-svg"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={isCardInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 20 }}
                transition={{ 
                  duration: 0.8, 
                  ease: "easeOut",
                  delay: 0.2
                }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                style={{
                  '@media (min-width: 900px)': {
                    width: '100%',
                    maxWidth: '300px',
                    height: 'auto'
                  }
                }}
              />
            </div>
          </div>
        </Container>
      </div>

      <div className="bani-hassan-features-section">
        <Container maxWidth="xl">
          <div className="bani-hassan-features-title-box">
            <img
              src={YellowPatterns}
              style={{ 
                width: '100px',
                height: 'auto' 
              }}
              className="bani-hassan-yellow-patterns"
            />    
            <Typography variant="h3" className="bani-hassan-features-title">
              وين الوجهة؟
            </Typography>
          </div>
          <div
            className={`bani-hassan-feature-row ${isVisible ? "visible" : ""}`}
          >
            {ALL_FEATURES.map(({ label, link, icon: IconComponent }, index) => (
              <motion.div
                key={label}
                className="bani-hassan-feature-grid-item"
                initial={{
                  y: 100,
                  opacity: 0,
                  scale: 0.8,
                  rotateX: 45,
                }}
                whileInView={{
                  y: 0,
                  opacity: 1,
                  scale: 1,
                  rotateX: 0,
                  transition: {
                    type: "spring",
                    stiffness: 50,
                    damping: 20,
                    duration: 1,
                    delay: index * 0.15,
                  },
                }}
                viewport={{ once: true }}
                onClick={() => handleCardClick(link)}
              >
                <img
                  src={LeafSVG}
                  alt="ورقة"
                  loading="eager"
                  decoding="async"
                  width={40}
                  height={40}
                  className="bani-hassan-leaf-bg"
                />
                <div className="bani-hassan-feature-content">
                  <IconComponent className="bani-hassan-icon" />
                  <Typography className="bani-hassan-feature-label">{label}</Typography>
                  <div className="bani-hassan-feature-spacer" />
                  <div className="bani-hassan-explore-box">
                    <span className="bani-hassan-explore-text">اكتشف</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}