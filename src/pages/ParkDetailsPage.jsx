import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { Thermostat, Star, Place, Park } from "@mui/icons-material";
import leafIcon from "../assets/Leaf.svg";
import SignleYellwPattern from "../assets/SignleYellwPattern.svg";
import { getTourismSiteById } from "../services/tourismService";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import ArrowBack from "@mui/icons-material/ArrowBack";
import SingleLeaf from "../assets/SingleLeaf.svg";
import ParkIcon from "@mui/icons-material/Park";
import ForestIcon from "@mui/icons-material/Forest";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import IcecreamIcon from "@mui/icons-material/Icecream";
import PoolIcon from "@mui/icons-material/Pool";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import WavesIcon from "@mui/icons-material/Waves";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CelebrationIcon from "@mui/icons-material/Celebration";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import ToysIcon from "@mui/icons-material/Toys";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import TheaterComedyIcon from "@mui/icons-material/TheaterComedy";
import LocalBarbecueIcon from "@mui/icons-material/OutdoorGrill";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import PedalBikeIcon from "@mui/icons-material/PedalBike";
import NaturePeopleIcon from "@mui/icons-material/NaturePeople";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import HikingIcon from "@mui/icons-material/Hiking";
import KayakingIcon from "@mui/icons-material/Kayaking";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import DirectionsSubwayIcon from "@mui/icons-material/DirectionsSubway";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import LocalAirportIcon from "@mui/icons-material/LocalAirport";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import LocalPlayIcon from "@mui/icons-material/LocalPlay";
import LocalSeeIcon from "@mui/icons-material/LocalSee";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import LocalHotelIcon from "@mui/icons-material/LocalHotel";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import LocalPostOfficeIcon from "@mui/icons-material/LocalPostOffice";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import LocalConvenienceStoreIcon from "@mui/icons-material/LocalConvenienceStore";
import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryService";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LocalPizzaIcon from "@mui/icons-material/LocalPizza";
import FastLoadingSpinner from "../components/FastLoadingSpinner";
import { getFromLocalCache, saveToLocalCache } from "../services/localCacheService";

const ParkDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [park, setPark] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  const formatRating = (rating) => {
    if (!rating) return "--";
    const numRating = parseFloat(rating);
    return Number.isInteger(numRating)
      ? numRating.toFixed(1)
      : numRating.toString();
  };

  useEffect(() => {
    const fetchPark = async () => {
      setLoading(true);
      const cacheKey = `park_${id}`;
      const cached = getFromLocalCache(cacheKey);
      if (cached) {
        setPark(cached);
        if (cached && cached.coordinates?.lat && cached.coordinates?.lon) {
          fetchWeather(cached.coordinates.lat, cached.coordinates.lon);
        }
        setLoading(false);
        getTourismSiteById(id).then((fresh) => {
          if (JSON.stringify(fresh) !== JSON.stringify(cached)) {
            setPark(fresh);
            saveToLocalCache(cacheKey, fresh);
            if (fresh && fresh.coordinates?.lat && fresh.coordinates?.lon) {
              fetchWeather(fresh.coordinates.lat, fresh.coordinates.lon);
            }
          }
        });
        return;
      }
      try {
        const site = await getTourismSiteById(id);
        setPark(site);
        if (site && site.coordinates?.lat && site.coordinates?.lon) {
          fetchWeather(site.coordinates.lat, site.coordinates.lon);
        }
        saveToLocalCache(cacheKey, site);
      } catch (error) {
        setPark(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPark();
  }, [id]);

  useEffect(() => {
    if (park?.title) {
      document.title = "بني حسن - المنتزهات - " + park.title;
    }
  }, [park?.title]);

  const fetchWeather = async (lat, lon) => {
    try {
      const API_KEY = "64ed344bced9f674d5e508b40104fdf9";
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=ar`
      );
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

  const getImageUrl = (img) => {
    if (!img) return "";
    if (typeof img === "string") return img;
    if (img.url) return img.url;
    return "";
  };

  // عرض فقط الصور التي تحتوي على url (رابط Firebase)
  const validImages = Array.isArray(park?.images) ? park.images.filter(img => (typeof img === 'string') || (img && img.url)) : [];

  if (loading)
    return <FastLoadingSpinner />;
  if (!park)
    return (
      <Box sx={{ color: "#fff", textAlign: "center", mt: 8 }}>
        لم يتم العثور على هذا المنتزه.
      </Box>
    );

  return (
    <Box
      sx={{
        background: "#000",
        minHeight: "100vh",
        py: 0,
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          top: { xs: 16, sm: 20, md: 23 },
          right: { xs: 16, sm: 20, md: 24 },
          zIndex: 1000,
        }}
      >
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            background: "rgba(255,255,255,0.15)",
            color: "#fff",
            borderRadius: "50%",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            backdropFilter: "blur(8px)",
            transition: "background 0.2s",
            "&:hover": { background: "rgba(255,255,255,0.28)" },
            width: { xs: 40, sm: 44, md: 48 },
            height: { xs: 40, sm: 44, md: 48 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "scaleX(-1)",
          }}
          aria-label=""
        >
          <ArrowBack
            sx={{ fontSize: { xs: 20, sm: 24, md: 26 }, marginLeft: "2px" }}
          />
        </IconButton>
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: { xs: 140, sm: 160, md: 200, lg: 260 },
          zIndex: 1,
          pointerEvents: "none",
          background:
            "linear-gradient(180deg, #4D3873 0%, rgba(77,56,115,0.85) 40%, rgba(0,0,0,0.0) 100%)",
        }}
      />

      <Button
        variant="outlined"
        onClick={() => navigate("/parks")}
        sx={{
          mb: { xs: 1, sm: 1.5, md: 2 },
          fontWeight: "bold",
          fontSize: { xs: 14, sm: 16, md: 18 },
          borderRadius: 2,
          mx: { xs: 2, sm: 3, md: 4 },
          mt: { xs: 1, sm: 1.5, md: 2 },
        }}
      ></Button>

      <Box
        sx={{
          width: "90%",
          maxWidth: { xs: 800, lg: 1000, xl: 1200 },
          mx: "auto",
          borderRadius: { xs: 3, sm: 4, md: 5 },
          overflow: "hidden",
          mb: { xs: 1, sm: 1.5, md: 2, lg: 4 },
          boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
          position: "relative",
          background: "#222",
          zIndex: 2,
          height: { xs: 280, sm: 250, md: 220, lg: 300, xl: 350 },
          mt: { xs: 2, sm: 3, md: 4, lg: 6 },
        }}
      >
        {validImages && validImages.length > 0 && (
          <>
            <img
              src={getImageUrl(validImages[currentImage])}
              alt={park.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transition: "opacity 0.3s",
              }}
            />
            {validImages.length > 1 && (
              <>
                <IconButton
                  onClick={() =>
                    setCurrentImage((currentImage + 1) % validImages.length)
                  }
                  sx={{
                    position: "absolute",
                    left: { xs: 5, sm: 10 },
                    top: "50%",
                    transform: "translateY(-50%)",
                    bgcolor: "rgba(0,0,0,0.4)",
                    color: "#fff",
                    "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                    width: { xs: 32, sm: 40, md: 48 },
                    height: { xs: 32, sm: 40, md: 48 },
                  }}
                >
                  <ArrowBackIcon sx={{ fontSize: { xs: 16, sm: 20, md: 24 } }} />
                </IconButton>
                <IconButton
                  onClick={() =>
                    setCurrentImage((currentImage - 1 + validImages.length) % validImages.length)
                  }
                  sx={{
                    position: "absolute",
                    right: { xs: 5, sm: 10 },
                    top: "50%",
                    transform: "translateY(-50%)",
                    bgcolor: "rgba(0,0,0,0.4)",
                    color: "#fff",
                    "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                    width: { xs: 32, sm: 40, md: 48 },
                    height: { xs: 32, sm: 40, md: 48 },
                  }}
                >
                  <ArrowForwardIcon sx={{ fontSize: { xs: 16, sm: 20, md: 24 } }} />
                </IconButton>

                <Box
                  sx={{
                    position: "absolute",
                    bottom: { xs: 8, sm: 10, md: 12 },
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: { xs: 0.5, sm: 0.75, md: 1 },
                  }}
                >
                  {validImages.map((_, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        width: { xs: 6, sm: 8, md: 10 },
                        height: { xs: 6, sm: 8, md: 10 },
                        borderRadius: "50%",
                        bgcolor: idx === currentImage ? "#da943c" : "#fff",
                        opacity: idx === currentImage ? 1 : 0.5,
                        transition: "all 0.2s",
                      }}
                    />
                  ))}
                </Box>
              </>
            )}
          </>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row-reverse" },
          gap: { xs: 2, sm: 3, md: 6, lg: 8 },
          alignItems: "flex-start",
          justifyContent: "center",
          maxWidth: { xs: 950, lg: 1200, xl: 1400 },
          mx: "auto",
          mb: { xs: 2, sm: 2.5, md: 4, lg: 6 },
          px: { xs: 2, sm: 3, md: 4, lg: 6 },
        }}
      >
        <Box
          sx={{
            minWidth: { xs: "100%", md: 240, lg: 260 },
            maxWidth: { xs: "100%", md: 300, lg: 320 },
            width: "100%",
            bgcolor: "#2d8772",
            borderRadius: { xs: 2, sm: 2.5, md: 3 },
            p: 0,
            boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
            mb: { xs: 2, md: 0 },
            order: { xs: 2, md: 1 },
            mt: { xs: 2, sm: 3, md: 4, lg: 6 },
          }}
        >
          <Box
            sx={{
              width: "94%",
              height: { xs: 55, sm: 50, md: 55, lg: 85, xl: 95 },
              mx: "auto",
              mt: { xs: 0.5, sm: 1, md: 1.5, lg: 2 },
              mb: { xs: 0.5, sm: 1, md: 1.5, lg: 2 },
              border: "3px solid #fff",
              borderRadius: { xs: 1.5, sm: 2, md: 2.5 },
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: { xs: 2, sm: 2.5, md: 3, lg: 4 },
              py: 0,
              position: "relative",
              bgcolor: "transparent",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                flex: 1,
                justifyContent: "flex-start",
              }}
            >
              <WbSunnyIcon
                sx={{
                  fontSize: { xs: 24, sm: 26, md: 28, lg: 30 },
                  color: "white",
                  flexShrink: 0,
                  transform: "translateY(-4px)",
                }}
              />
              <Typography
                sx={{
                  fontSize: { xs: 28, sm: 30, md: 32, lg: 34 },
                  fontWeight: "bold",
                  color: "white",
                  lineHeight: 1,
                  display: "flex",
                  alignItems: "baseline",
                }}
              >
                {weather?.temp ? `${weather.temp}°` : "--°"}
              </Typography>
            </Box>

            <Box
              sx={{
                width: "2px",
                height: { xs: 45, sm: 50, md: 55, lg: 70, xl: 80 },
                bgcolor: "rgba(255,255,255,0.8)",
                mx: 2,
                borderRadius: 1,
                flexShrink: 0,
              }}
            />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                flex: 1,
                justifyContent: "flex-end",
              }}
            >
              <Star
                sx={{
                  fontSize: { xs: 24, sm: 26, md: 28, lg: 30 },
                  color: "#fff",
                  stroke: "white",
                  strokeWidth: 0.5,
                  flexShrink: 0,
                  transform: "translateY(-5px)",
                }}
              />
              <Typography
                sx={{
                  fontSize: { xs: 24, sm: 26, md: 28, lg: 30 },
                  fontWeight: "bold",
                  color: "white",
                  lineHeight: 1,
                  display: "flex",
                  alignItems: "baseline",
                }}
              >
                {formatRating(park.rating) || "--"}
              </Typography>
            </Box>
          </Box>

          <Button
            fullWidth
            sx={{
              bgcolor: "#da943c",
              color: "white",
              fontWeight: "bold",
              fontSize: { xs: 13, sm: 14, md: 16, lg: 18 },
              fontFamily: "Tajawal, Arial, sans-serif",
              borderRadius: 0,
              borderBottomLeftRadius: { xs: 8, sm: 10, md: 12, lg: 14 },
              borderBottomRightRadius: { xs: 8, sm: 10, md: 12, lg: 14 },
              py: { xs: 1, sm: 1.2, md: 1.4, lg: 1.6 },
              mt: 0,
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                bgcolor: "#c07d2e",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(218, 148, 60, 0.3)",
              },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: { xs: 0.8, sm: 1, md: 1.2, lg: 1.5 },
            }}
            onClick={() => window.open(park.googleMapsUrl, "_blank")}
          >
            <Place
              sx={{
                color: "white",
                fontSize: { xs: 18, sm: 20, md: 22, lg: 24 },
                transform: "translateY(-1px)",
              }}
            />
            <Typography
              sx={{
                fontSize: { xs: 13, sm: 14, md: 16, lg: 18 },
                fontWeight: "bold",
                fontFamily: "inherit",
              }}
            >
              الوصول للموقع
            </Typography>
          </Button>
        </Box>
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            order: { xs: 1, md: 2 },
            mt: { xs: 2, sm: 3, md: 4, lg: 6 },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              color: "#17998c",
              mb: { xs: 1, sm: 1.5, md: 2, lg: 3 },
              textAlign: "right",
              fontFamily: "Tajawal, Arial, sans-serif",
              fontSize: {
                xs: "1.5rem",
                sm: "1.75rem",
                md: "2.125rem",
                lg: "3rem",
              },
            }}
          >
            نبذة عن {park.title}
          </Typography>
          <Typography
            sx={{
              color: "#fff",
              fontSize: { xs: 14, sm: 16, md: 18, lg: 20 },
              mb: { xs: 2, sm: 2.5, md: 4, lg: 6 },
              textAlign: "right",
              fontFamily: "Tajawal, Arial, sans-serif",
              lineHeight: { xs: 1.6, sm: 1.7, md: 2, lg: 2.2 },
            }}
          >
            {park.description}
          </Typography>
          {park.details && park.details.length > 0 && (
            <Box sx={{ mt: { xs: 3, sm: 3.5, md: 5, lg: 7 } }}>
              <Typography
                variant="h4"
                sx={{
                  color: "#17998c",
                  fontWeight: "bold",
                  mb: { xs: 0.5, sm: 1, md: 2, lg: 3 },
                  textAlign: "right",
                  fontFamily: "Tajawal, Arial, sans-serif",
                  fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2.125rem", lg: "2.5rem" },
                }}
              >
                الأنشطة الترفيهية
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: { xs: 1, sm: 2, md: 3, lg: 4 },
                  flexWrap: "wrap",
                  alignItems: "flex-end",
                  justifyContent: "flex-start",
                  width: "100%",
                  mb: { xs: 2, sm: 3, md: 4, lg: 6 },
                  mt: { xs: 0, sm: 1, md: 2, lg: 3 },
                  direction: "rtl",
                }}
              >
                {park.details.map((detail, idx) => {
                  const iconsMap = {
                    Park: ParkIcon,
                    Forest: ForestIcon,
                    WbSunny: WbSunnyIcon,
                    SportsSoccer: SportsSoccerIcon,
                    SportsTennis: SportsTennisIcon,
                    SportsBasketball: SportsBasketballIcon,
                    SportsEsports: SportsEsportsIcon,
                    DirectionsRun: DirectionsRunIcon,
                    Fastfood: FastfoodIcon,
                    LocalDining: LocalDiningIcon,
                    LocalCafe: LocalCafeIcon,
                    Icecream: IcecreamIcon,
                    Pool: PoolIcon,
                    WaterDrop: WaterDropIcon,
                    Waves: WavesIcon,
                    BeachAccess: BeachAccessIcon,
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
                    LocalDrink: LocalDrinkIcon,
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

                  const IconComp = iconsMap[detail.icon] || ParkIcon;

                  return (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        mb: 1,
                      }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          width: { xs: 90, sm: 100, md: 110, lg: 120 },
                          height: { xs: 90, sm: 100, md: 110, lg: 120 },
                          mb: { xs: 1, sm: 1.5, md: 2, lg: 3 },
                        }}
                      >
                        <img
                          src={SingleLeaf}
                          alt="leaf"
                          style={{
                            width: "100%",
                            height: "100%",
                            opacity: 0.7,
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <IconComp sx={{ fontSize: { xs: 40, sm: 44, md: 48, lg: 52 }, color: "#fff" }} />
                        </Box>
                      </Box>
                      <Typography
                        sx={{
                          color: "#ffffff",
                          fontWeight: "bold",
                          fontSize: { xs: 16, sm: 18, md: 20, lg: 22 },
                          fontFamily: "Tajawal, Arial, sans-serif",
                          textAlign: "right",
                          mt: { xs: 0.5, sm: 1, md: 1.5, lg: 2 },
                        }}
                      >
                        {detail.title}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}

          {park.activities && park.activities.length > 0 && (
            <Box sx={{ mt: { xs: 3, sm: 3.5, md: 5, lg: 7 } }}>
              <Typography
                variant="h4"
                sx={{
                  color: "#ffffff",
                  fontWeight: "bold",
                  mb: { xs: 0.5, sm: 1, md: 2, lg: 3 },
                  textAlign: "right",
                  fontFamily: "Tajawal, Arial, sans-serif",
                  fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2.125rem", lg: "2.5rem" },
                }}
              >
                الأنشطة المتاحة
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row-reverse",
                  gap: { xs: 2, sm: 3, md: 4, lg: 6 },
                  flexWrap: "wrap",
                  justifyContent: "flex-start",
                  alignItems: "flex-end",
                  width: "100%",
                  direction: "rtl",
                  mt: { xs: 0, sm: 1, md: 2, lg: 3 },
                }}
              >
                {park.activities.map((act, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      minWidth: { xs: 80, sm: 100, md: 120, lg: 140 },
                    }}
                  >
                    {act.includes("لعب") ? (
                      <img
                        src={leafIcon}
                        alt="منطقة ألعاب"
                        style={{
                          width: "48px",
                          height: "48px",
                          marginBottom: "16px",
                        }}
                      />
                    ) : act.includes("مسرح") ? (
                      <img
                        src={SignleYellwPattern}
                        alt="مسرح عروض"
                        style={{
                          width: "48px",
                          height: "48px",
                          marginBottom: "16px",
                        }}
                      />
                    ) : (
                      <Park
                        sx={{
                          fontSize: { xs: 48, sm: 52, md: 56, lg: 60 },
                          color: "#ffffff",
                          mb: { xs: 1, sm: 1.5, md: 2, lg: 3 },
                        }}
                      />
                    )}
                    <Typography
                      sx={{
                        color: "#ffffff",
                        fontWeight: "bold",
                        fontSize: { xs: 12, sm: 14, md: 18, lg: 20 },
                        fontFamily: "Tajawal, Arial, sans-serif",
                        textAlign: "right",
                      }}
                    >
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

export default ParkDetailsPage;
