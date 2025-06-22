import React, { useState, useEffect } from "react";
import { handleGooglePlaceInfo } from "../services/googleService"; 
import { onTourismSitesByCategoryChange, updateTourismSite } from '../services/tourismService';

import {
  Box,
  Typography,
  Container,
  Card,
  Button,
  CardContent,
  Rating,
  CircularProgress,
  Divider,
  IconButton,
  Alert,
  Chip,
  Fade,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Paper
} from "@mui/material";
import {
  Home,
  Thermostat,
  Star,
  Place,
  ArrowBackIos,
  ArrowForwardIos,
  AccessTime,
  Phone,
  AttachMoney,
  Visibility,
  Favorite,
  Share,
  Navigation,
  Park,
  RateReview,
  Info,
  WbSunny
} from "@mui/icons-material";

import { useNavigate, useParams } from "react-router-dom";
import parkBg from "../assets/Park.webp";
import titleLeaf from '../assets/titleLeaf.svg';
import leafIcon from '../assets/Leaf.svg';
import SignleYellwPattern from '../assets/SignleYellwPattern.svg';

const API_KEY = "64ed344bced9f674d5e508b40104fdf9";

const incrementViews = async (category, id) => {
};

const ParksPage = () => {
  const { id: routeParkId } = useParams();
  const navigate = useNavigate();
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [parksData, setParksData] = useState([]);
  const [error, setError] = useState(null);
  const [ratingsLoading, setRatingsLoading] = useState(false);
  const [selectedPark, setSelectedPark] = useState(null);
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

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (parkId, totalImages) => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext(parkId, totalImages);
    }
    if (isRightSwipe) {
      handlePrev(parkId, totalImages);
    }
  };

  const handleMouseDown = (e) => {
    setTouchEnd(null);
    setTouchStart(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (touchStart !== null) {
      setTouchEnd(e.clientX);
    }
  };

  const handleMouseUp = (parkId, totalImages) => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext(parkId, totalImages);
    }
    if (isRightSwipe) {
      handlePrev(parkId, totalImages);
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  useEffect(() => {
    if (selectedPark) {
      const updatedPark = parksData.find(p => p.id === selectedPark.id);
      if (updatedPark && JSON.stringify(updatedPark) !== JSON.stringify(selectedPark)) {
        setSelectedPark(updatedPark);
      }
    }
  }, [parksData, selectedPark]);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onTourismSitesByCategoryChange('parks', (sites, error) => {
      if (error) {
        console.error("Failed to fetch parks in real-time:", error);
        setError("لا توجد منتزهات متاحة حالياً");
        setParksData([]);
      } else {
        console.log("Parks data received:", sites);
        sites.forEach((park, index) => {
          console.log(`Park ${index + 1} (${park.title}):`, {
            id: park.id,
            images: park.images,
            hasImages: park.images && park.images.length > 0
          });
        });
        setParksData(sites);
        setError(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (parksData.length === 0) return;
    setWeatherLoading(true);
    const fetchAll = async () => {
      const map = {};
      await Promise.all(
        parksData.map(async (park) => {
          if (park.coordinates?.lat && park.coordinates?.lon) {
            try {
              const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${park.coordinates.lat}&lon=${park.coordinates.lon}&units=metric&appid=${API_KEY}&lang=ar`
              );
              const d = await res.json();
              map[park.title] = {
                temp: Math.round(d.main.temp),
                icon: d.weather?.[0]?.icon,
              };
            } catch {
              map[park.title] = { temp: "--", icon: "01d" };
            }
          } else {
            map[park.title] = { temp: "--", icon: "01d" };
          }
        })
      );
      setWeather(map);
      setWeatherLoading(false);
    };
    fetchAll();
  }, [parksData]);

  useEffect(() => {
    const fetchRatingsFromGoogle = async () => {
      if (parksData.length === 0) return;

      setRatingsLoading(true);

      try {
        const updatedParks = await Promise.all(
          parksData.map(async (park) => {
            if (park.rating || !park.googleMapsUrl) {
              return park;
            }

            try {
              
              const googleInfo = await handleGooglePlaceInfo(park.googleMapsUrl);
              
              if (googleInfo.success && (googleInfo.rating || googleInfo.reviewsCount)) {

                const updateData = {};
                if (googleInfo.rating) updateData.rating = googleInfo.rating;
                if (googleInfo.reviewsCount) updateData.reviewsCount = googleInfo.reviewsCount;
                
                if (Object.keys(updateData).length > 0) {
                  await updateTourismSite(park.id, updateData);
                  
                  return {
                    ...park,
                    ...updateData
                  };
                }
              } else {
              }
              
            } catch (error) {
            }

            return park;
          })
        );

        setParksData(updatedParks);
        
      } catch (error) {
      } finally {
        setRatingsLoading(false);
      }
    };

    fetchRatingsFromGoogle();
  }, [parksData.length]);

  const openInGoogleMaps = async (park) => {
    try {
      if (park.id) {
        await incrementViews('parks', park.id);
      }
      
      let url;
      if (park.googleMapsUrl) {
        url = park.googleMapsUrl;
      } else if (park.coordinates?.lat && park.coordinates?.lon) {
        url = `https://www.google.com/maps/@${park.coordinates.lat},${park.coordinates.lon},15z`;
      } else {
        url = `https://www.google.com/maps/search/${encodeURIComponent(park.title + ' ' + park.address)}`;
      }
      
      window.open(url, "_blank");
    } catch (error) {
    }
  };

  const handleShare = async (park) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: park.title,
          text: park.description,
          url: window.location.href
        });
      } else {
        const shareText = `${park.title}\n${park.description}\n${window.location.href}`;
        await navigator.clipboard.writeText(shareText);
      }
    } catch (error) {
    }
  };

  const getRatingValue = (rating) => {
    const numRating = parseFloat(rating);
    return isNaN(numRating) ? null : numRating;
  };

  const formatReviewsCount = (count) => {
    if (!count) return "لا توجد مراجعات";
    const numCount = parseInt(count);
    if (isNaN(numCount)) return "لا توجد مراجعات";
    
    if (numCount === 1) return "مراجعة واحدة";
    if (numCount === 2) return "مراجعتين";
    if (numCount < 11) return `${numCount} مراجعات`;
    return `${numCount} مراجعة`;
  };

  const handleOpenDetails = (park) => {
    setSelectedPark(park);
  };

  const handleCloseDetails = () => {
    setSelectedPark(null);
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
جاري تحميل المنتزهات...        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: "#000",
        minHeight: "100vh",
        width: '100%',
        position: 'relative',
        overflow: 'hidden', // To contain the glow effects
      }}
    >
      
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
            المنتزهات
          </Typography>
        </Box>
      </Box>

      <Container sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        {ratingsLoading && (
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CircularProgress size={20} sx={{ color: "#2196f3" }} />
              <Typography>لا توجد منتزهات متاحة حالياً</Typography>
            </Box>
          </Alert>
        )}

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
            mt: 2,
            py: 2,
          }}
        >
          {parksData.map((park, idx) => {
            console.log(`Rendering park ${idx + 1}:`, {
              title: park.title,
              hasImages: park.images && park.images.length > 0,
              imagesCount: park.images ? park.images.length : 0,
              firstImage: park.images && park.images.length > 0 ? park.images[0] : null
            });
            
            return (
            <Fade in timeout={300 + idx * 100} key={park.id || idx}>
              
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
                  onClick={() => navigate(`/parks/${park.id}`)}
                >
                  
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
                      cursor: park.images && park.images.length > 1 ? 'grab' : 'default',
                      '&:active': {
                        cursor: park.images && park.images.length > 1 ? 'grabbing' : 'default'
                      }
                    }}
                    onTouchStart={park.images && park.images.length > 1 ? handleTouchStart : undefined}
                    onTouchMove={park.images && park.images.length > 1 ? handleTouchMove : undefined}
                    onTouchEnd={park.images && park.images.length > 1 ? () => handleTouchEnd(park.id, park.images.length) : undefined}
                    onMouseDown={park.images && park.images.length > 1 ? handleMouseDown : undefined}
                    onMouseMove={park.images && park.images.length > 1 ? handleMouseMove : undefined}
                    onMouseUp={park.images && park.images.length > 1 ? () => handleMouseUp(park.id, park.images.length) : undefined}
                    onMouseLeave={park.images && park.images.length > 1 ? () => handleMouseUp(park.id, park.images.length) : undefined}
                  >
                    
                    {park.images && park.images.length > 0 && (() => {
                      const currentIndex = currentImageIndex[park.id] || 0;
                      const currentImage = park.images[currentIndex];
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
                            alt={park.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block',
                              transition: 'opacity 0.2s ease-in-out',
                              imageRendering: 'crisp-edges',
                              backfaceVisibility: 'hidden',
                              WebkitBackfaceVisibility: 'hidden',
                              transform: 'translateZ(0)',
                              WebkitTransform: 'translateZ(0)'
                            }}
                            loading="lazy"
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

                    
                    {park.images && park.images.length > 1 && (
                      <>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePrev(park.id, park.images.length);
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
                            handleNext(park.id, park.images.length);
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

                    
                    {park.images && park.images.length > 1 && (
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
                        {park.images.map((_, index) => (
                          <Box
                            key={index}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndex(prev => ({
                                ...prev,
                                [park.id]: index
                              }));
                            }}
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              background: (currentImageIndex[park.id] || 0) === index 
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
                    
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: 15, 
                        left: 15, 
                        background: 'rgba(45, 135, 114, 0.95)', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: 2, 
                        width: 70, 
                        height: 40, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        px: 1, 
                        cursor: 'pointer', 
                        fontSize: 16, 
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                        zIndex: 3
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      {park.rating && (
                        <Typography sx={{ fontSize: 14, fontWeight: 'bold', color: 'white' }}>
                          {park.rating}
                        </Typography>
                      )}
                    </Box>
                    
                    
                    {(!park.images || park.images.length === 0) && (
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
                        <Park sx={{ fontSize: 48, mb: 1 }} />
                        <Typography sx={{ fontSize: 14, fontFamily: 'ZaridSlab, RH-Zak Reg, Arial, sans-serif' }}>
                          لا توجد صورة
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  
                  
                  <Box sx={{ p: '25px 20px', background: 'white', position: 'relative', minHeight: '180px' }}>
                    
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
                        Ø§ÙƒØªØ´Ù
                      </Typography>
                    </Box>
                    
                    
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
                        {park.title}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Fade>
            );
          })}
        </Box>

        {parksData.length === 0 && !loading && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Park sx={{ fontSize: 80, color: "rgba(255,255,255,0.3)", mb: 2 }} />
            <Typography
              variant="h4"
              sx={{
                color: "#fff",
                fontFamily: "Tajawal, sans-serif",
                mb: 2
              }}
            >
              لا توجد منتزهات متاحة حالياً
            </Typography>
            <Typography
              sx={{
                color: "rgba(255,255,255,0.6)",
                fontFamily: "Tajawal, sans-serif",
                mb: 4
              }}
            >
              لا توجد منتزهات متاحة حالياً
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/admin")}
              sx={{
                background: "linear-gradient(135deg,rgb(255, 255rgb(255, 255, 255)%,rgb(255, 255, 255) 100%)",
                fontFamily: "Tajawal, sans-serif",
                fontWeight: "bold"
              }}
            >
              Ø¥Ø¶Ø§ÙØ© Ù…Ù†ØªØ²Ù‡ Ø¬Ø¯ÙŠØ¯
            </Button>
          </Box>
        )}
      </Container>
      
      
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60vh',
          zIndex: 0,
          pointerEvents: 'none',
          background: `
            radial-gradient(ellipse at 0% 100%, #385273 0%, transparent 50%),
            radial-gradient(ellipse at 100% 100%, #318573 0%, transparent 50%),
            radial-gradient(ellipse at 50% 120%, #00b360 0%, transparent 60%)
          `,
          opacity: 0.7,
        }}
      />
    </Box>
  );
};

export default ParksPage;
