import React, { useState, useEffect } from "react";
import { onTourismSitesByCategoryChange } from '../services/tourismService';

import {
  Box,
  Typography,
  Container,
  CircularProgress,
  IconButton,
  Alert,
  Fade
} from "@mui/material";
import {
  ArrowBackIos,
  ArrowForwardIos,
  Home
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import titleLeaf from '../assets/titleLeaf.svg';
import SignleYellwPattern from '../assets/SignleYellwPattern.svg';

const HousingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [housingData, setHousingData] = useState([]);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const handlePrev = (siteId, totalImages) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [siteId]: ((prev[siteId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  const handleNext = (siteId, totalImages) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [siteId]: ((prev[siteId] || 0) + 1) % totalImages
    }));
  };

  // دوال التعامل مع اللمس والماوس للتمرير السريع
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (housingId, totalImages) => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext(housingId, totalImages);
    }
    if (isRightSwipe) {
      handlePrev(housingId, totalImages);
    }
  };

  // دوال التعامل مع الماوس
  const handleMouseDown = (e) => {
    setTouchEnd(null);
    setTouchStart(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (touchStart !== null) {
      setTouchEnd(e.clientX);
    }
  };

  const handleMouseUp = (housingId, totalImages) => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext(housingId, totalImages);
    }
    if (isRightSwipe) {
      handlePrev(housingId, totalImages);
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onTourismSitesByCategoryChange('housing', (sites, error) => {
      if (error) {
        console.error("Failed to fetch housing in real-time:", error);
        setError("حدث خطأ في تحميل البيانات");
        setHousingData([]);
      } else {
        console.log("Housing data received:", sites);
        sites.forEach((housing, index) => {
          console.log(`Housing ${index + 1} (${housing.title}):`, {
            id: housing.id,
            images: housing.images,
            hasImages: housing.images && housing.images.length > 0
          });
        });
        setHousingData(sites);
        setError(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openInGoogleMaps = async (housing) => {
    try {
      let url;
      if (housing.googleMapsUrl) {
        url = housing.googleMapsUrl;
      } else if (housing.coordinates?.lat && housing.coordinates?.lon) {
        url = `https://www.google.com/maps/@${housing.coordinates.lat},${housing.coordinates.lon},15z`;
      } else {
        url = `https://www.google.com/maps/search/${encodeURIComponent(housing.title + ' ' + housing.address)}`;
      }
      
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error opening Google Maps:", error);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          backgroundColor: "#1a1a2e",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column"
        }}
      >
        <CircularProgress size={60} sx={{ color: "#228B22", mb: 2 }} />
        <Typography sx={{ color: "#fff", fontFamily: "'RH-Zak Reg', Arial, sans-serif", fontWeight: "bold" }}>
          جاري تحميل النزل...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: "#000",
        minHeight: "100vh",
        width: '100%',
      }}
    >
      {/* زر العودة للرئيسية أعلى يمين الصفحة */}
      <Box sx={{ position: 'fixed', top: 24, right: 24, zIndex: 1000 }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            background: 'rgba(255,255,255,0.15)',
            color: '#fff',
            borderRadius: '50%',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            backdropFilter: 'blur(8px)',
            transition: 'background 0.2s',
            '&:hover': { background: 'rgba(255,255,255,0.28)' },
            width: 48,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'scaleX(-1)',
          }}
          aria-label=""
        >
          <ArrowBackIos sx={{ fontSize: 26 }} />
        </IconButton>
      </Box>

      <Box
        sx={{
          width: '100%',
          minHeight: '40vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          pt: { xs: 8, md: 12 },
          pb: 2,
        }}
      >
        <Box sx={{ position: 'relative', width: { xs: 240, md: 340 }, height: { xs: 220, md: 260 } }}>
          <Box
            component="img"
            src={titleLeaf}
            alt="leaf"
            sx={{
              width: '100%',
              height: '100%',
              display: 'block',
            }}
          />
          <Typography
            variant="h1"
            sx={{
              fontFamily: 'RH-Zak Reg, Arial, sans-serif',
              fontWeight: 'bold',
              fontSize: { xs: '2.8rem', md: '4.2rem' },
              color: '#fff',
              textAlign: 'center',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 2,
              whiteSpace: 'nowrap',
              width: '100%',
              letterSpacing: 1
            }}
          >
            النزل
          </Typography>
        </Box>
      </Box>

      <Container sx={{ py: 8 }}>
        {error && (
          <Alert 
            severity="info" 
            sx={{ 
              mb: 4, 
              background: "rgba(33, 150, 243, 0.1)",
              color: "#2196f3",
              border: "1px solid rgba(33, 150, 243, 0.3)",
              "& .MuiAlert-icon": { color: "#2196f3" }
            }}
          >
            {error}
          </Alert>
        )}

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 4,
            justifyContent: 'center',
            mt: 2
          }}
        >
          {housingData.map((housing, idx) => {
            console.log(`Rendering housing ${idx + 1}:`, {
              title: housing.title,
              hasImages: housing.images && housing.images.length > 0,
              imagesCount: housing.images ? housing.images.length : 0,
              firstImage: housing.images && housing.images.length > 0 ? housing.images[0] : null
            });
            
            return (
            <Fade in timeout={300 + idx * 100} key={housing.id || idx}>
              {/* Stamp Container */}
              <Box
                sx={{
                  position: 'relative',
                  display: 'inline-block',
                  '--radius': '6px',
                  backgroundImage: 'radial-gradient(var(--radius), transparent 98%, white), linear-gradient(white 0 0)',
                  backgroundRepeat: 'round, no-repeat',
                  backgroundPosition: 'calc(var(--radius) * -1.5) calc(var(--radius) * -1.5), 50%',
                  backgroundSize: 'calc(var(--radius) * 3) calc(var(--radius) * 3), calc(100% - var(--radius) * 3) calc(100% - var(--radius) * 3)',
                  p: 2,
                  mb: 4,
                  fontFamily: 'ZaridSlab, RH-Zak Reg, Arial, sans-serif',
                }}
              >
                {/* Housing Card */}
                <Box
                  sx={{
                    width: 300,
                    background: 'white',
                    position: 'relative',
                    borderRadius: 0,
                    overflow: 'hidden',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                    }
                  }}
                  onClick={() => navigate(`/housing/${housing.id}`)}
                >
                  {/* Card image */}
                  <Box 
                    sx={{ 
                      position: 'relative', 
                      height: 200, 
                      borderRadius: 0, 
                      overflow: 'hidden',
                      background: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: housing.images && housing.images.length > 1 ? 'grab' : 'default',
                      '&:active': {
                        cursor: housing.images && housing.images.length > 1 ? 'grabbing' : 'default'
                      }
                    }}
                    onTouchStart={housing.images && housing.images.length > 1 ? handleTouchStart : undefined}
                    onTouchMove={housing.images && housing.images.length > 1 ? handleTouchMove : undefined}
                    onTouchEnd={housing.images && housing.images.length > 1 ? () => handleTouchEnd(housing.id, housing.images.length) : undefined}
                    onMouseDown={housing.images && housing.images.length > 1 ? handleMouseDown : undefined}
                    onMouseMove={housing.images && housing.images.length > 1 ? handleMouseMove : undefined}
                    onMouseUp={housing.images && housing.images.length > 1 ? () => handleMouseUp(housing.id, housing.images.length) : undefined}
                    onMouseLeave={housing.images && housing.images.length > 1 ? () => handleMouseUp(housing.id, housing.images.length) : undefined}
                  >
                    {/* الصورة الفعلية */}
                    {housing.images && housing.images.length > 0 && (() => {
                      const currentIndex = currentImageIndex[housing.id] || 0;
                      const currentImage = housing.images[currentIndex];
                      let imageUrl = null;
                      
                      if (typeof currentImage === 'string') {
                        imageUrl = currentImage;
                      } else if (currentImage && (currentImage.url || currentImage.base64)) {
                        imageUrl = currentImage.url || currentImage.base64;
                      }
                      
                      if (imageUrl) {
                        return (
                          <img
                            src={imageUrl}
                            alt={housing.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block',
                              transition: 'opacity 0.2s ease-in-out'
                            }}
                            onError={(e) => {
                              console.error('Image failed to load:', imageUrl);
                              e.target.style.display = 'none';
                            }}
                            onLoad={() => {
                              console.log('Image loaded successfully:', imageUrl.substring(0, 50) + '...');
                            }}
                          />
                        );
                      }
                      return null;
                    })()}

                    {/* أزرار التنقل بين الصور */}
                    {housing.images && housing.images.length > 1 && (
                      <>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePrev(housing.id, housing.images.length);
                          }}
                          sx={{
                            position: 'absolute',
                            left: 8,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'rgba(0,0,0,0.6)',
                            color: 'white',
                            width: 36,
                            height: 36,
                            '&:hover': { 
                              background: 'rgba(0,0,0,0.8)',
                              transform: 'translateY(-50%) scale(1.1)'
                            },
                            transition: 'all 0.15s ease-in-out',
                            zIndex: 2,
                            backdropFilter: 'blur(4px)'
                          }}
                        >
                          <ArrowBackIos sx={{ fontSize: 18 }} />
                        </IconButton>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNext(housing.id, housing.images.length);
                          }}
                          sx={{
                            position: 'absolute',
                            right: 8,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'rgba(0,0,0,0.6)',
                            color: 'white',
                            width: 36,
                            height: 36,
                            '&:hover': { 
                              background: 'rgba(0,0,0,0.8)',
                              transform: 'translateY(-50%) scale(1.1)'
                            },
                            transition: 'all 0.15s ease-in-out',
                            zIndex: 2,
                            backdropFilter: 'blur(4px)'
                          }}
                        >
                          <ArrowForwardIos sx={{ fontSize: 18 }} />
                        </IconButton>
                      </>
                    )}

                    {/* مؤشرات الصور (النقاط) */}
                    {housing.images && housing.images.length > 1 && (
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 12,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          display: 'flex',
                          gap: 1,
                          zIndex: 2
                        }}
                      >
                        {housing.images.map((_, index) => (
                          <Box
                            key={index}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndex(prev => ({
                                ...prev,
                                [housing.id]: index
                              }));
                            }}
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              background: (currentImageIndex[housing.id] || 0) === index 
                                ? 'rgba(255,255,255,0.9)' 
                                : 'rgba(255,255,255,0.4)',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease-in-out',
                              '&:hover': {
                                background: 'rgba(255,255,255,0.8)',
                                transform: 'scale(1.2)'
                              }
                            }}
                          />
                        ))}
                      </Box>
                    )}
                    
                    {/* مؤشر عدم وجود صورة */}
                    {(!housing.images || housing.images.length === 0) && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          color: 'rgba(0,0,0,0.4)',
                          zIndex: 1
                        }}
                      >
                        <Home sx={{ fontSize: 48, mb: 1 }} />
                        <Typography sx={{ fontSize: 14, fontFamily: 'ZaridSlab, RH-Zak Reg, Arial, sans-serif' }}>
                          لا توجد صورة
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  
                  {/* Card content */}
                  <Box sx={{ p: '25px 20px', background: 'white', position: 'relative', minHeight: '180px' }}>
                    {/* اكتشف button - fixed in corner */}
                    <Box 
                      sx={{ 
                        position: 'absolute',
                        bottom: '15px',
                        left: '15px',
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        gap: '5px', 
                        cursor: 'pointer',
                        zIndex: 2
                      }} 
                    >
                      <img 
                        src={SignleYellwPattern} 
                        alt="pattern" 
                        style={{
                          width: '40px',
                          height: '40px'
                        }}
                      />
                      <Typography 
                        sx={{ 
                          color: '#da943c', 
                          fontSize: 14, 
                          fontWeight: 'bold',
                          fontFamily: 'ZaridSlab, RH-Zak Reg, Arial, sans-serif'
                        }}
                      >
                        اكتشف
                      </Typography>
                    </Box>
                    
                    {/* Title section */}
                    <Box sx={{ textAlign: 'right', mb: '5px' }}>
                      <Typography 
                        sx={{ 
                          mt: '-10px',
                          fontSize: 20, 
                          fontWeight: 'bold', 
                          color: '#da943c', 
                          mb: 1, 
                          textAlign: 'right', 
                          fontFamily: 'ZaridSlab, RH-Zak Reg, Arial, sans-serif' 
                        }}
                      >
                        {housing.title}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Fade>
            );
          })}
        </Box>

        {housingData.length === 0 && !loading && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Home sx={{ fontSize: 80, color: "rgba(255,255,255,0.3)", mb: 2 }} />
            <Typography
              variant="h4"
              sx={{
                color: "#fff",
                fontFamily: "Tajawal, sans-serif",
                mb: 2
              }}
            >
              لا يوجد سكن متاح حالياً
            </Typography>
            <Typography
              sx={{
                color: "rgba(255,255,255,0.6)",
                fontFamily: "Tajawal, sans-serif",
                mb: 4
              }}
            >
              كن أول من يضيف سكناً جميلاً في بني حسن
            </Typography>
          </Box>
        )}
      </Container>
      
      {/* تدرج أسود شفاف رهيب أسفل الصفحة */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '300px',
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.9) 100%)',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.05) 0%, transparent 60%), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.03) 0%, transparent 50%)',
            animation: 'float 8s ease-in-out infinite',
            zIndex: 1
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '100px',
            background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,1) 100%)',
            zIndex: 2
          }
        }}
      >
        {/* زخرفة متحركة */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '80px',
            background: 'repeating-linear-gradient(90deg, transparent, transparent 15px, rgba(255,255,255,0.08) 15px, rgba(255,255,255,0.08) 30px)',
            animation: 'pattern-flow 12s linear infinite',
            zIndex: 3,
            opacity: 0.6
          }}
        />
      </Box>
    </Box>
  );
};

export default HousingPage;