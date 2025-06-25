import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { Thermostat, Star, Place, Agriculture } from "@mui/icons-material";
import leafIcon from "../assets/Leaf.svg";
import SignleYellwPattern from "../assets/SignleYellwPattern.svg";
import { getTourismSiteById } from "../services/tourismService";
import { getFromLocalCache, saveToLocalCache } from "../services/localCacheService";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import ArrowBack from "@mui/icons-material/ArrowBack";
import SingleLeaf from "../assets/SingleLeaf.svg";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
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

const FarmDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [farm, setFarm] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  const formatrating = (rating) => {
    if (!rating) return "--";
    const numRating = parseFloat(rating);
    return Number.isInteger(numRating)
      ? numRating.toFixed(1)
      : numRating.toString();
  };

  useEffect(() => {
    if (farm?.title) {
      document.title = "بني حسن - المزارع - " + farm.title;
    }
  }, [farm?.title]);

  useEffect(() => {
    const fetchFarm = async () => {
      setLoading(true);
      const cacheKey = `farm_${id}`;
      const cached = getFromLocalCache(cacheKey);
      if (cached) {
        setFarm(cached);
        if (cached && cached.coordinates?.lat && cached.coordinates?.lon) {
          fetchWeather(cached.coordinates.lat, cached.coordinates.lon);
        }
        setLoading(false);
        getTourismSiteById(id).then((fresh) => {
          if (JSON.stringify(fresh) !== JSON.stringify(cached)) {
            setFarm(fresh);
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
        setFarm(site);
        if (site && site.coordinates?.lat && site.coordinates?.lon) {
          fetchWeather(site.coordinates.lat, site.coordinates.lon);
        }
        saveToLocalCache(cacheKey, site);
      } catch (error) {
        console.error("Error fetching farm:", error);
        setFarm(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFarm();
  }, [id]);

  const fetchWeather = async (lat, lon) => {
    try {
      const API_KEY = "64ed344bced9f674d5e508b40104fdf9";
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=ar`
      );
      const data = await res.json();
      setWeather({
        temp: Math.round(data.main.temp),
        icon: data.weather?.[0]?.icon,
      });
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };

  const getImageUrl = (img) => {
    if (!img) return "";
    if (typeof img === "string") return img;
    if (img.url) return img.url;
    if (img.base64) return img.base64;
    return "";
  };

  if (loading)
    return <FastLoadingSpinner message="جاري تحميل تفاصيل المزرعة..." />;
  if (!farm)
    return (
      <Box sx={{ color: "#fff", textAlign: "center", mt: 8 }}>
        لم يتم العثور على هذه المزرعة.
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
          <ArrowBack sx={{ fontSize: { xs: 20, sm: 24, md: 26 } }} />
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
        onClick={() => navigate("/farms")}
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
        {farm.images && farm.images.length > 0 && (
          <>
            <img
              src={getImageUrl(farm.images[currentImage])}
              alt={farm.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transition: "opacity 0.3s",
              }}
            />
            {farm.images.length > 1 && (
              <>
                <IconButton
                  onClick={() =>
                    setCurrentImage(
                      (currentImage - 1 + farm.images.length) %
                        farm.images.length
                    )
                  }
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: { xs: 5, sm: 10 },
                    transform: "translateY(-50%)",
                    bgcolor: "rgba(0,0,0,0.4)",
                    color: "#fff",
                    "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                    width: { xs: 32, sm: 40, md: 48 },
                    height: { xs: 32, sm: 40, md: 48 },
                  }}
                >
                  <ArrowBackIcon
                    sx={{ fontSize: { xs: 16, sm: 20, md: 24 } }}
                  />
                </IconButton>
                <IconButton
                  onClick={() =>
                    setCurrentImage((currentImage + 1) % farm.images.length)
                  }
                  sx={{
                    position: "absolute",
                    top: "50%",
                    right: { xs: 5, sm: 10 },
                    transform: "translateY(-50%)",
                    bgcolor: "rgba(0,0,0,0.4)",
                    color: "#fff",
                    "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                    width: { xs: 32, sm: 40, md: 48 },
                    height: { xs: 32, sm: 40, md: 48 },
                  }}
                >
                  <ArrowForwardIcon
                    sx={{ fontSize: { xs: 16, sm: 20, md: 24 } }}
                  />
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
                  {farm.images.map((_, idx) => (
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
                  fontSize: { xs: 20, sm: 22, md: 24, lg: 26 },
                  color: "white",
                  flexShrink: 0,
                  transform: "translateY(-4px)",
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
                {weather?.temp ? `${weather.temp}°` : "--°"}
              </Typography>
            </Box>

            <Box
              sx={{
                width: "2px",
                height: { xs: 55, sm: 50, md: 55, lg: 85, xl: 95 },
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
                  fontSize: { xs: 20, sm: 22, md: 24, lg: 26 },
                  color: "#fff",
                  stroke: "white",
                  strokeWidth: 0.5,
                  flexShrink: 0,
                  transform: "translateY(-5px)",
                }}
              />
              <Typography
                sx={{
                  fontSize: { xs: 20, sm: 22, md: 24, lg: 26 },
                  fontWeight: "bold",
                  color: "white",
                  lineHeight: 1,
                  display: "flex",
                  alignItems: "baseline",
                }}
              >
                {formatrating(farm.rating) || "--"}
              </Typography>
            </Box>
          </Box>

          <Button
            fullWidth
            sx={{
              bgcolor: "#da943c",
              color: "white",
              fontWeight: "bold",
              fontSize: { xs: 12, sm: 13, md: 14, lg: 16 },
              fontFamily: "Tajawal, Arial, sans-serif",
              borderRadius: 0,
              borderBottomLeftRadius: { xs: 8, sm: 10, md: 12, lg: 14 },
              borderBottomRightRadius: { xs: 8, sm: 10, md: 12, lg: 14 },
              py: { xs: 0.8, sm: 1, md: 1.2, lg: 1.4 },
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
              gap: { xs: 0.6, sm: 0.8, md: 1, lg: 1.2 },
            }}
            onClick={() => window.open(farm.googleMapsUrl, "_blank")}
          >
            <Place
              sx={{
                color: "white",
                fontSize: { xs: 16, sm: 18, md: 20, lg: 22 },
                transform: "translateY(-1px)",
              }}
            />
            <Typography
              sx={{
                fontSize: { xs: 12, sm: 13, md: 14, lg: 16 },
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
            نبذة عن {farm.title}
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
            {farm.description}
          </Typography>
          {farm.details && farm.details.length > 0 && (
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
                المعلومات الإضافية
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row-reverse",
                  gap: { xs: 1, sm: 2, md: 3, lg: 4 },
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  width: "100%",
                  direction: "rtl",
                  mb: { xs: 2, sm: 3, md: 4, lg: 6 },
                  mt: { xs: 0, sm: 1, md: 2, lg: 3 },
                }}
              >
                {farm.details.map((detail, idx) => {
                  const iconsMap = {
                    LocalFlorist: LocalFloristIcon,
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
                  const IconComp = iconsMap[detail.icon] || LocalFloristIcon;
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
                          width: 90,
                          height: 90,
                          mb: 1,
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
                          <IconComp sx={{ fontSize: 40, color: "#fff" }} />
                        </Box>
                      </Box>
                      <Typography
                        sx={{
                          color: "#ffffff",
                          fontWeight: "bold",
                          fontSize: 16,
                          fontFamily: "Tajawal, Arial, sans-serif",
                          textAlign: "right",
                          mt: 0.5,
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
          {farm.activities && farm.activities.length > 0 && (
            <Box sx={{ mt: { xs: 3, sm: 3.5, md: 4 } }}>
              <Typography
                variant="h4"
                sx={{
                  color: "#17998c",
                  fontWeight: "bold",
                  mb: 0.5,
                  textAlign: "right",
                  fontFamily: "Tajawal, Arial, sans-serif",
                  fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2.125rem" },
                }}
              >
                الأنشطة الترفيهية
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row-reverse",
                  gap: { xs: 2, sm: 3, md: 4 },
                  flexWrap: "wrap",
                  justifyContent: "flex-start",
                  alignItems: "flex-end",
                  width: "100%",
                  direction: "rtl",
                }}
              >
                {farm.activities.map((act, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      minWidth: { xs: 80, sm: 100, md: 120 },
                    }}
                  >
                    {act.includes("حصاد") ? (
                      <img
                        src={leafIcon}
                        alt="منطقة حصاد"
                        style={{
                          width: "48px",
                          height: "48px",
                          marginBottom: "16px",
                        }}
                      />
                    ) : act.includes("زراعة") ? (
                      <img
                        src={SignleYellwPattern}
                        alt="منطقة زراعة"
                        style={{
                          width: "48px",
                          height: "48px",
                          marginBottom: "16px",
                        }}
                      />
                    ) : (
                      <Agriculture
                        sx={{
                          fontSize: 48,
                          color: "#17998c",
                          mb: 1,
                        }}
                      />
                    )}
                    <Typography
                      sx={{
                        color: "#ffffff",
                        fontWeight: "bold",
                        fontSize: { xs: 12, sm: 14, md: 18 },
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

export default FarmDetailsPage;
