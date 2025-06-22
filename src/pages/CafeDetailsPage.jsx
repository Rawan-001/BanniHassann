import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { Thermostat, Star, Place, LocalCafe } from "@mui/icons-material";
import leafIcon from '../assets/Leaf.svg';
import SignleYellwPattern from '../assets/SignleYellwPattern.svg';
import { onTourismSitesByCategoryChange } from '../services/tourismService';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import SingleLeaf from '../assets/SingleLeaf.svg';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CelebrationIcon from '@mui/icons-material/Celebration';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import ToysIcon from '@mui/icons-material/Toys';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import LocalBarbecueIcon from '@mui/icons-material/OutdoorGrill';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import PedalBikeIcon from '@mui/icons-material/PedalBike';
import NaturePeopleIcon from '@mui/icons-material/NaturePeople';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import HikingIcon from '@mui/icons-material/Hiking';
import KayakingIcon from '@mui/icons-material/Kayaking';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import DirectionsSubwayIcon from '@mui/icons-material/DirectionsSubway';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import LocalAirportIcon from '@mui/icons-material/LocalAirport';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import LocalPlayIcon from '@mui/icons-material/LocalPlay';
import LocalSeeIcon from '@mui/icons-material/LocalSee';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import LocalHotelIcon from '@mui/icons-material/LocalHotel';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import LocalConvenienceStoreIcon from '@mui/icons-material/LocalConvenienceStore';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';

const CafeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cafe, setCafe] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const unsubscribe = onTourismSitesByCategoryChange('cafes', (sites) => {
      const found = sites.find(c => c.id === id);
      setCafe(found || null);
      setLoading(false);
      if (found && found.coordinates?.lat && found.coordinates?.lon) {
        fetchWeather(found.coordinates.lat, found.coordinates.lon);
      }
    });
    return () => unsubscribe();
  }, [id]);

  const fetchWeather = async (lat, lon) => {
    try {
      const API_KEY = "64ed344bced9f674d5e508b40104fdf9";
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=ar`);
      if (res.ok) {
        const data = await res.json();
        setWeather({
          temp: data.main?.temp != null ? Math.round(data.main.temp) : null,
          icon: data.weather?.[0]?.icon || "01d",
          description: data.weather?.[0]?.description || "ØµØ§ÙÙŠ",
        });
      }
    } catch {}
  };

  // Ø¯Ø§Ù„Ø© Ø§Ø³ØªØ®Ø±Ø§Ø¬ Ø±Ø§Ø¨Ø· Ø§Ù„ØµÙˆØ±Ø© Ø§Ù„ØµØ­ÙŠØ­
  const getImageUrl = (img) => {
    if (!img) return '';
    if (typeof img === 'string') return img;
    if (img.url) return img.url;
    if (img.base64) return img.base64;
    return '';
  };

  if (loading) return <Box sx={{ color: '#fff', textAlign: 'center', mt: 8 }}>جاري تحميل التفاصيل...</Box>;
  if (!cafe) return <Box sx={{ color: '#fff', textAlign: 'center', mt: 8 }}>لم يتم العثور على هذا المقهى.</Box>;

  return (
    <Box sx={{ background: '#000', minHeight: '100vh', py: 0, position: 'relative' }}>
      
      <Box sx={{ 
        position: 'fixed', 
        top: { xs: 16, sm: 20, md: 23 }, 
        right: { xs: 16, sm: 20, md: 24 }, 
        zIndex: 1000 
      }}>
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
            width: { xs: 40, sm: 44, md: 48 },
            height: { xs: 40, sm: 44, md: 48 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'scaleX(-1)',
          }}
          aria-label=""
        >
          <ArrowBackIos sx={{ fontSize: { xs: 20, sm: 24, md: 26 } }} />
        </IconButton>
      </Box>
      
      
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: { xs: 140, sm: 160, md: 200, lg: 260 },
        zIndex: 1,
        pointerEvents: 'none',
        background: 'linear-gradient(180deg, #4D3873 0%, rgba(77,56,115,0.85) 40%, rgba(0,0,0,0.0) 100%)'
      }} />
      
      <Button 
        variant="outlined" 
        onClick={() => navigate('/cafes')} 
        sx={{ 
          mb: { xs: 1, sm: 1.5, md: 2 }, 
          fontWeight: 'bold', 
          fontSize: { xs: 14, sm: 16, md: 18 }, 
          borderRadius: 2,
          mx: { xs: 2, sm: 3, md: 4 },
          mt: { xs: 1, sm: 1.5, md: 2 }
        }}
      >
        
      </Button>
      
      
      <Box sx={{ 
        width: '90%', 
        maxWidth: 800, 
        mx: 'auto', 
        borderRadius: { xs: 3, sm: 4, md: 5 }, 
        overflow: 'hidden', 
        mb: { xs: 1, sm: 1.5, md: 1 }, 
        boxShadow: '0 4px 24px rgba(0,0,0,0.18)', 
        position: 'relative', 
        background: '#222', 
        zIndex: 2,
        height: { xs: 280, sm: 250, md: 220, lg: 300 },
        mt: { xs: 2, sm: 3, md: 4 }
      }}>
        {cafe.images && cafe.images.length > 0 && (
          <>
            <img 
              src={getImageUrl(cafe.images[currentImage])} 
              alt={cafe.title} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover', 
                display: 'block', 
                transition: 'opacity 0.3s' 
              }} 
            />
            {cafe.images.length > 1 && (
              <>
                <IconButton
                  onClick={() => setCurrentImage((currentImage - 1 + cafe.images.length) % cafe.images.length)}
                  sx={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: { xs: 5, sm: 10 }, 
                    transform: 'translateY(-50%)', 
                    bgcolor: 'rgba(0,0,0,0.4)', 
                    color: '#fff', 
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                    width: { xs: 32, sm: 40, md: 48 },
                    height: { xs: 32, sm: 40, md: 48 }
                  }}
                >
                  <ArrowBackIosIcon sx={{ fontSize: { xs: 16, sm: 20, md: 24 } }} />
                </IconButton>
                <IconButton
                  onClick={() => setCurrentImage((currentImage + 1) % cafe.images.length)}
                  sx={{ 
                    position: 'absolute', 
                    top: '50%', 
                    right: { xs: 5, sm: 10 }, 
                    transform: 'translateY(-50%)', 
                    bgcolor: 'rgba(0,0,0,0.4)', 
                    color: '#fff', 
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                    width: { xs: 32, sm: 40, md: 48 },
                    height: { xs: 32, sm: 40, md: 48 }
                  }}
                >
                  <ArrowForwardIosIcon sx={{ fontSize: { xs: 16, sm: 20, md: 24 } }} />
                </IconButton>
                
                <Box sx={{ 
                  position: 'absolute', 
                  bottom: { xs: 8, sm: 10, md: 12 }, 
                  left: '50%', 
                  transform: 'translateX(-50%)', 
                  display: 'flex', 
                  gap: { xs: 0.5, sm: 0.75, md: 1 } 
                }}>
                  {cafe.images.map((_, idx) => (
                    <Box 
                      key={idx} 
                      sx={{ 
                        width: { xs: 6, sm: 8, md: 10 }, 
                        height: { xs: 6, sm: 8, md: 10 }, 
                        borderRadius: '50%', 
                        bgcolor: idx === currentImage ? '#da943c' : '#fff', 
                        opacity: idx === currentImage ? 1 : 0.5, 
                        transition: 'all 0.2s' 
                      }} 
                    />
                  ))}
                </Box>
              </>
            )}
          </>
        )}
      </Box>
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row-reverse' }, 
        gap: { xs: 2, sm: 3, md: 4 }, 
        alignItems: 'flex-start', 
        justifyContent: 'center', 
        maxWidth: 950, 
        mx: 'auto', 
        mb: { xs: 2, sm: 2.5, md: 3 },
        px: { xs: 2, sm: 3, md: 4 }
      }}>
        
        <Box sx={{ 
          minWidth: { xs: '100%', md: 270 }, 
          maxWidth: { xs: '100%', md: 320 }, 
          width: '100%', 
          bgcolor: '#2d8772', 
          borderRadius: { xs: 2, sm: 2.5, md: 3 }, 
          p: 0, 
          boxShadow: '0 2px 12px rgba(0,0,0,0.18)', 
          mb: { xs: 2, md: 0 }, 
          order: { xs: 2, md: 1 }, 
          mt: { xs: 2, sm: 3, md: 4 } 
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            px: { xs: 1.5, sm: 2 }, 
            py: { xs: 1.5, sm: 2 }, 
            borderBottom: '2px solid #fff2', 
            fontWeight: 'bold', 
            fontSize: { xs: 20, sm: 24, md: 28 }, 
            color: 'white', 
            fontFamily: 'Tajawal, Arial, sans-serif' 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
              <span style={{ 
                fontSize: { xs: 24, sm: 28, md: 32 }, 
                fontWeight: 'bold' 
              }}>
                {weather?.temp ? `${weather.temp}Â°` : '--Â°'}
              </span>
              <WbSunnyIcon sx={{ 
                fontSize: { xs: 20, sm: 24, md: 28 }, 
                color: 'white' 
              }} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.25, sm: 0.5 } }}>
              <Star sx={{ 
                fontSize: { xs: 20, sm: 24, md: 26 }, 
                color: '#fff' 
              }} />
              <span style={{ 
                fontWeight: 'bold', 
                fontSize: { xs: 14, sm: 16, md: 18 } 
              }}>
                {cafe.rating ? cafe.rating : '--'}
              </span>
            </Box>
          </Box>
          <Button
            fullWidth
            sx={{
              bgcolor: '#da943c',
              color: 'white',
              fontWeight: 'bold',
              fontSize: { xs: 14, sm: 16, md: 18 },
              borderRadius: 0,
              borderBottomLeftRadius: { xs: 8, sm: 10 },
              borderBottomRightRadius: { xs: 8, sm: 10 },
              py: { xs: 1, sm: 1.25, md: 1.5 },
              mt: 0,
              '&:hover': { bgcolor: '#c07d2e' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: { xs: 0.5, sm: 1 }
            }}
            onClick={() => window.open(cafe.googleMapsUrl, '_blank')}
            startIcon={<Place sx={{ 
              color: 'white', 
              fontSize: { xs: 20, sm: 24, md: 26 } 
            }} />}
          >
            اكتشف
          </Button>
        </Box>
        
        
        <Box sx={{ 
          flex: 1, 
          minWidth: 0, 
          order: { xs: 1, md: 2 }, 
          mt: { xs: 2, sm: 3, md: 4 } 
        }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 'bold', 
              color: '#17998c', 
              mb: { xs: 1, sm: 1.5 }, 
              textAlign: 'right', 
              fontFamily: 'Tajawal, Arial, sans-serif',
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem', lg: '3rem' }
            }}
          >
            Ù†Ø¨Ø°Ø© Ø¹Ù† {cafe.title}
          </Typography>
          <Typography sx={{ 
            color: '#fff', 
            fontSize: { xs: 14, sm: 16, md: 18 }, 
            mb: { xs: 2, sm: 2.5, md: 3 }, 
            textAlign: 'right', 
            fontFamily: 'Tajawal, Arial, sans-serif', 
            lineHeight: { xs: 1.6, sm: 1.7, md: 2 } 
          }}>
            {cafe.description}
          </Typography>
          
          
          {cafe.details && cafe.details.length > 0 && (
            <Box sx={{ mt: { xs: 3, sm: 3.5, md: 4 } }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  color: '#17998c', 
                  fontWeight: 'bold', 
                  mb: 0.5,
                  textAlign: 'right', 
                  fontFamily: 'Tajawal, Arial, sans-serif',
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2.125rem' }
                }}
              >
                Ø§Ù„ÙØ¹Ø§Ù„ÙŠØ§Øª Ø§Ù„Ù…ØµØ§Ø­Ø¨Ø©
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'row-reverse',
                gap: { xs: 1, sm: 2, md: 2.5 },
                flexWrap: 'wrap', 
                alignItems: 'flex-start',
                width: '100%',
                direction: 'rtl',
                mb: 2,
                mt: 0
              }}>
                {cafe.details.map((detail, idx) => {
                  // Ø®Ø±ÙŠØ·Ø© Ø§Ù„Ø£ÙŠÙ‚ÙˆÙ†Ø§Øª
                  const iconsMap = {
                    LocalDining: LocalDiningIcon,
                    Fastfood: FastfoodIcon,
                    LocalDrink: LocalDrinkIcon,
                    CameraAlt: CameraAltIcon,
                    PhotoCamera: PhotoCameraIcon,
                    Celebration: CelebrationIcon,
                    EmojiEvents: EmojiEventsIcon,
                    ChildCare: ChildCareIcon,
                    Toys: ToysIcon,
                    ShoppingCart: ShoppingCartIcon,
                    Storefront: StorefrontIcon,
                    LocalHospital: LocalHospitalIcon,
                    FitnessCenter: FitnessCenterIcon,
                    MusicNote: MusicNoteIcon,
                    TheaterComedy: TheaterComedyIcon,
                    LocalBarbecue: LocalBarbecueIcon,
                    DirectionsBike: DirectionsBikeIcon,
                    PedalBike: PedalBikeIcon,
                    NaturePeople: NaturePeopleIcon,
                    LocalLibrary: LocalLibraryIcon,
                    MenuBook: MenuBookIcon,
                    LocalActivity: LocalActivityIcon,
                    Hiking: HikingIcon,
                    Kayaking: KayakingIcon,
                    DirectionsBoat: DirectionsBoatIcon,
                    DirectionsCar: DirectionsCarIcon,
                    DirectionsBus: DirectionsBusIcon,
                    DirectionsSubway: DirectionsSubwayIcon,
                    DirectionsWalk: DirectionsWalkIcon,
                    LocalAirport: LocalAirportIcon,
                    LocalParking: LocalParkingIcon,
                    LocalFlorist: LocalFloristIcon,
                    LocalPlay: LocalPlayIcon,
                    LocalSee: LocalSeeIcon,
                    LocalFireDepartment: LocalFireDepartmentIcon,
                    LocalGasStation: LocalGasStationIcon,
                    LocalGroceryStore: LocalGroceryStoreIcon,
                    LocalHotel: LocalHotelIcon,
                    LocalMall: LocalMallIcon,
                    LocalPharmacy: LocalPharmacyIcon,
                    LocalPostOffice: LocalPostOfficeIcon,
                    LocalPrintshop: LocalPrintshopIcon,
                    LocalTaxi: LocalTaxiIcon,
                    LocalAtm: LocalAtmIcon,
                    LocalConvenienceStore: LocalConvenienceStoreIcon,
                    LocalLaundryService: LocalLaundryServiceIcon,
                    LocalMovies: LocalMoviesIcon,
                    LocalOffer: LocalOfferIcon,
                    LocalPhone: LocalPhoneIcon,
                    LocalPizza: LocalPizzaIcon,
                  };
                  const IconComp = iconsMap[detail.icon] || LocalCafe;
                  return (
                    <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', mb: 1 }}>
                      <Box sx={{ position: 'relative', width: 90, height: 90, mb: 1 }}>
                        <img src={SingleLeaf} alt="leaf" style={{ width: '100%', height: '100%', opacity: 0.5 }} />
                        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <IconComp sx={{ fontSize: 40, color: '#fff' }} />
                        </Box>
                      </Box>
                      <Typography sx={{ color: '#17998c', fontWeight: 'bold', fontSize: 16, fontFamily: 'Tajawal, Arial, sans-serif', textAlign: 'right', mt: 0.5 }}>
                        {detail.title}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}
          
          {cafe.activities && cafe.activities.length > 0 && (
            <Box sx={{ mt: { xs: 3, sm: 3.5, md: 4 } }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  color: '#17998c', 
                  fontWeight: 'bold', 
                  mb: { xs: 1.5, sm: 2 }, 
                  textAlign: 'right', 
                  fontFamily: 'Tajawal, Arial, sans-serif',
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2.125rem' }
                }}
              >
                Ø§Ù„ÙØ¹Ø§Ù„ÙŠØ§Øª Ø§Ù„Ù…ØµØ§Ø­Ø¨Ø©
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'row-reverse',
                gap: { xs: 2, sm: 3, md: 4 }, 
                flexWrap: 'wrap', 
                justifyContent: 'flex-start',
                alignItems: 'flex-end',
                width: '100%',
                direction: 'rtl'
              }}>
                {cafe.activities.map((act, idx) => (
                  <Box key={idx} sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'flex-end', 
                    minWidth: { xs: 80, sm: 100, md: 120 } 
                  }}>
                    {act.includes('Ù‚Ù‡ÙˆØ©') ? (
                      <img 
                        src={leafIcon} 
                        alt="Ù…Ù†Ø·Ù‚Ø© Ù‚Ù‡ÙˆØ©" 
                        style={{ 
                          width: { xs: 32, sm: 40, md: 48 }, 
                          height: { xs: 32, sm: 40, md: 48 }, 
                          marginBottom: { xs: 2, sm: 3, md: 4 } 
                        }} 
                      />
                    ) : act.includes('Ø·Ø¹Ø§Ù…') ? (
                      <img 
                        src={SignleYellwPattern} 
                        alt="Ù…Ù†Ø·Ù‚Ø© Ø·Ø¹Ø§Ù…" 
                        style={{ 
                          width: { xs: 32, sm: 40, md: 48 }, 
                          height: { xs: 32, sm: 40, md: 48 }, 
                          marginBottom: { xs: 2, sm: 3, md: 4 } 
                        }} 
                      />
                    ) : (
                      <LocalCafe sx={{ 
                        fontSize: { xs: 32, sm: 40, md: 48 }, 
                        color: '#17998c', 
                        mb: { xs: 0.5, sm: 1 } 
                      }} />
                    )}
                    <Typography sx={{ 
                      color: '#fff', 
                      fontWeight: 'bold', 
                      fontSize: { xs: 12, sm: 14, md: 18 }, 
                      fontFamily: 'Tajawal, Arial, sans-serif',
                      textAlign: 'right'
                    }}>
                      {act}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CafeDetailsPage; 
