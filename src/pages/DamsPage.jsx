import React, { useState, useEffect, useMemo, useCallback } from "react";
import { onTourismSitesByCategoryChange } from "../services/tourismService";

import {
  Box,
  Typography,
  Container,
  CircularProgress,
  IconButton,
  Alert,
  Fade,
} from "@mui/material";
import { ArrowBack, ArrowForward, Water } from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import titleLeaf from "../assets/titleLeaf.svg";
import SignleYellwPattern from "../assets/SignleYellwPattern.svg";

const API_KEY = "64ed344bced9f674d5e508b40104fdf9";

const DamsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [damsData, setDamsData] = useState([]);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [weather, setWeather] = useState({});
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set());

  const handlePrev = useCallback((siteId, totalImages) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [siteId]: ((prev[siteId] || 0) - 1 + totalImages) % totalImages,
    }));
  }, []);

  useEffect(() => {
    document.title = "بني حسن - السدود";
  }, []);

  const handleNext = useCallback((siteId, totalImages) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [siteId]: ((prev[siteId] || 0) + 1) % totalImages,
    }));
  }, []);

  // دوال التعامل مع اللمس والماوس للتمرير السريع
  const handleTouchStart = useCallback((e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback((damId, totalImages) => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext(damId, totalImages);
    }
    if (isRightSwipe) {
      handlePrev(damId, totalImages);
    }
  }, [touchStart, touchEnd, handleNext, handlePrev]);

  // دوال التعامل مع الماوس
  const handleMouseDown = useCallback((e) => {
    setTouchEnd(null);
    setTouchStart(e.clientX);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (touchStart !== null) {
      setTouchEnd(e.clientX);
    }
  }, [touchStart]);

  const handleMouseUp = useCallback((damId, totalImages) => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext(damId, totalImages);
    }
    if (isRightSwipe) {
      handlePrev(damId, totalImages);
    }

    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, handleNext, handlePrev]);

  // دالة لمعالجة تحميل الصور
  const handleImageLoad = useCallback((imageUrl) => {
    setLoadedImages(prev => new Set(prev).add(imageUrl));
  }, []);

  // دالة لمعالجة أخطاء الصور
  const handleImageError = useCallback((e, imageUrl) => {
    console.error("Image failed to load:", imageUrl);
    e.target.style.display = "none";
  }, []);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onTourismSitesByCategoryChange(
      "dams",
      (sites, error) => {
        if (error) {
          console.error("Failed to fetch dams in real-time:", error);
          setError("حدث خطأ في تحميل البيانات");
          setDamsData([]);
        } else {
          console.log("Dams data received:", sites);
          setDamsData(sites);
          setError(null);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // دالة جلب الطقس
  useEffect(() => {
    if (damsData.length === 0) return;
    setWeatherLoading(true);
    const fetchAll = async () => {
      const map = {};
      await Promise.all(
        damsData.map(async (d) => {
          if (d.coordinates?.lat && d.coordinates?.lon) {
            try {
              const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${d.coordinates.lat}&lon=${d.coordinates.lon}&units=metric&appid=${API_KEY}&lang=ar`
              );
              const data = await res.json();
              map[d.id] = {
                temp: Math.round(data.main.temp),
                icon: data.weather?.[0]?.icon,
              };
            } catch {
              map[d.id] = { temp: "--", icon: "01d" };
            }
          } else {
            map[d.id] = { temp: "--", icon: "01d" };
          }
        })
      );
      setWeather(map);
      setWeatherLoading(false);
    };
    fetchAll();
  }, [damsData]);

  const openInGoogleMaps = useCallback(async (dam) => {
    try {
      let url;
      if (dam.googleMapsUrl) {
        url = dam.googleMapsUrl;
      } else if (dam.coordinates?.lat && dam.coordinates?.lon) {
        url = `https://www.google.com/maps/@${dam.coordinates.lat},${dam.coordinates.lon},15z`;
      } else {
        url = `https://www.google.com/maps/search/${encodeURIComponent(
          dam.title + " " + dam.address
        )}`;
      }

      window.open(url, "_blank");
    } catch (error) {
      console.error("Error opening Google Maps:", error);
    }
  }, []);

  // تحسين الأداء باستخدام useMemo للبيانات المعالجة
  const processedDamsData = useMemo(() => {
    return damsData.map(dam => ({
      ...dam,
      hasImages: dam.images && dam.images.length > 0,
      imagesCount: dam.images ? dam.images.length : 0,
      firstImage: dam.images && dam.images.length > 0 ? dam.images[0] : null,
    }));
  }, [damsData]);

  if (loading) {
    return (
      <Box
        sx={{
          backgroundColor: "#1a1a2e",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <CircularProgress size={60} sx={{ color: "#228B22", mb: 2 }} />
        <Typography
          sx={{
            color: "#fff",
            fontFamily: "'RH-Zak Reg', Arial, sans-serif",
            fontWeight: "bold",
          }}
        >
          جاري تحميل السدود...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: "#000",
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box sx={{ position: "fixed", top: 24, right: 24, zIndex: 1000 }}>
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
            width: 48,
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "scaleX(-1)",
          }}
          aria-label=""
        >
          <ArrowBack sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      <Box
        sx={{
          width: "100%",
          minHeight: "40vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          pt: { xs: 8, md: 12 },
          pb: 2,
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: { xs: 240, md: 340 },
            height: { xs: 220, md: 260 },
          }}
        >
          <Box
            component="img"
            src={titleLeaf}
            alt="leaf"
            sx={{
              width: "100%",
              height: "100%",
              display: "block",
            }}
          />
          <Typography
            variant="h1"
            sx={{
              fontFamily: "RH-Zak Reg, Arial, sans-serif",
              fontWeight: "bold",
              fontSize: { xs: "2.8rem", md: "4.2rem" },
              color: "#fff",
              textAlign: "center",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 2,
              whiteSpace: "nowrap",
              width: "100%",
              letterSpacing: 1,
            }}
          >
            السدود
          </Typography>
        </Box>
      </Box>

      <Container sx={{ py: 8, position: "relative", zIndex: 1 }}>
        {error && (
          <Alert
            severity="info"
            sx={{
              mb: 4,
              background: "rgba(33, 150, 243, 0.1)",
              color: "#2196f3",
              border: "1px solid rgba(33, 150, 243, 0.3)",
              "& .MuiAlert-icon": { color: "#2196f3" },
            }}
          >
            {error}
          </Alert>
        )}

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            justifyContent: "center",
            mt: 2,
          }}
        >
          {processedDamsData.map((dam, idx) => {
            return (
              <Fade in timeout={300 + idx * 100} key={dam.id || idx}>
                <Box
                  sx={{
                    position: "relative",
                    display: "inline-block",
                    "--radius": "6px",
                    backgroundImage:
                      "radial-gradient(var(--radius), transparent 98%, white), linear-gradient(white 0 0)",
                    backgroundRepeat: "round, no-repeat",
                    backgroundPosition:
                      "calc(var(--radius) * -1.5) calc(var(--radius) * -1.5), 50%",
                    backgroundSize:
                      "calc(var(--radius) * 3) calc(var(--radius) * 3), calc(100% - var(--radius) * 3) calc(100% - var(--radius) * 3)",
                    p: 2,
                    mb: 4,
                    fontFamily: "ZaridSlab, RH-Zak Reg, Arial, sans-serif",
                  }}
                >
                  <Box
                    sx={{
                      width: 300,
                      background: "white",
                      position: "relative",
                      borderRadius: 0,
                      overflow: "hidden",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                      cursor: "pointer",
                      transition:
                        "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                      },
                    }}
                    onClick={() => openInGoogleMaps(dam)}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        height: 200,
                        borderRadius: 0,
                        overflow: "hidden",
                        background: "#f5f5f5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor:
                          dam.hasImages && dam.imagesCount > 1
                            ? "grab"
                            : "default",
                        "&:active": {
                          cursor:
                            dam.hasImages && dam.imagesCount > 1
                              ? "grabbing"
                              : "default",
                        },
                      }}
                      onTouchStart={
                        dam.hasImages && dam.imagesCount > 1
                          ? handleTouchStart
                          : undefined
                      }
                      onTouchMove={
                        dam.hasImages && dam.imagesCount > 1
                          ? handleTouchMove
                          : undefined
                      }
                      onTouchEnd={
                        dam.hasImages && dam.imagesCount > 1
                          ? () => handleTouchEnd(dam.id, dam.imagesCount)
                          : undefined
                      }
                      onMouseDown={
                        dam.hasImages && dam.imagesCount > 1
                          ? handleMouseDown
                          : undefined
                      }
                      onMouseMove={
                        dam.hasImages && dam.imagesCount > 1
                          ? handleMouseMove
                          : undefined
                      }
                      onMouseUp={
                        dam.hasImages && dam.imagesCount > 1
                          ? () => handleMouseUp(dam.id, dam.imagesCount)
                          : undefined
                      }
                      onMouseLeave={
                        dam.hasImages && dam.imagesCount > 1
                          ? () => handleMouseUp(dam.id, dam.imagesCount)
                          : undefined
                      }
                    >
                      {dam.hasImages &&
                        (() => {
                          const currentIndex = currentImageIndex[dam.id] || 0;
                          const currentImage = dam.images[currentIndex];
                          let imageUrl = null;

                          if (typeof currentImage === "string") {
                            imageUrl = currentImage;
                          } else if (
                            currentImage &&
                            (currentImage.url || currentImage.base64)
                          ) {
                            imageUrl = currentImage.url || currentImage.base64;
                          }

                          if (imageUrl) {
                            return (
                              <img
                                src={imageUrl}
                                alt={dam.title}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  display: "block",
                                  transition: "opacity 0.2s ease-in-out",
                                  opacity: loadedImages.has(imageUrl) ? 1 : 0.7,
                                }}
                                onError={(e) => handleImageError(e, imageUrl)}
                                onLoad={() => handleImageLoad(imageUrl)}
                                loading="lazy"
                              />
                            );
                          }
                          return null;
                        })()}

                      {dam.hasImages && dam.imagesCount > 1 && (
                        <>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePrev(dam.id, dam.imagesCount);
                            }}
                            sx={{
                              position: "absolute",
                              left: 8,
                              top: "50%",
                              transform: "translateY(-50%)",
                              background: "rgba(0,0,0,0.6)",
                              color: "white",
                              width: 36,
                              height: 36,
                              "&:hover": {
                                background: "rgba(0,0,0,0.8)",
                                transform: "translateY(-50%) scale(1.1)",
                              },
                              transition: "all 0.15s ease-in-out",
                              zIndex: 2,
                              backdropFilter: "blur(4px)",
                            }}
                          >
                            <ArrowBack sx={{ fontSize: 18 }} />
                          </IconButton>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNext(dam.id, dam.imagesCount);
                            }}
                            sx={{
                              position: "absolute",
                              right: 8,
                              top: "50%",
                              transform: "translateY(-50%)",
                              background: "rgba(0,0,0,0.6)",
                              color: "white",
                              width: 36,
                              height: 36,
                              "&:hover": {
                                background: "rgba(0,0,0,0.8)",
                                transform: "translateY(-50%) scale(1.1)",
                              },
                              transition: "all 0.15s ease-in-out",
                              zIndex: 2,
                              backdropFilter: "blur(4px)",
                            }}
                          >
                            <ArrowForward sx={{ fontSize: 18 }} />
                          </IconButton>
                        </>
                      )}

                      {dam.hasImages && dam.imagesCount > 1 && (
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 12,
                            left: "50%",
                            transform: "translateX(-50%)",
                            display: "flex",
                            gap: 1,
                            zIndex: 2,
                          }}
                        >
                          {dam.images.map((_, index) => (
                            <Box
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImageIndex((prev) => ({
                                  ...prev,
                                  [dam.id]: index,
                                }));
                              }}
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background:
                                  (currentImageIndex[dam.id] || 0) === index
                                    ? "rgba(255,255,255,0.9)"
                                    : "rgba(255,255,255,0.4)",
                                cursor: "pointer",
                                transition: "all 0.15s ease-in-out",
                                "&:hover": {
                                  background: "rgba(255,255,255,0.8)",
                                  transform: "scale(1.2)",
                                },
                              }}
                            />
                          ))}
                        </Box>
                      )}

                      {!dam.hasImages && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            color: "rgba(0,0,0,0.4)",
                            zIndex: 1,
                          }}
                        >
                          <Water sx={{ fontSize: 48, mb: 1 }} />
                          <Typography
                            sx={{
                              fontSize: 14,
                              fontFamily:
                                "ZaridSlab, RH-Zak Reg, Arial, sans-serif",
                            }}
                          >
                            لا توجد صورة
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <Box
                      sx={{
                        p: "25px 20px",
                        background: "white",
                        position: "relative",
                        minHeight: "180px",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: "15px",
                          left: "15px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "5px",
                          cursor: "pointer",
                          zIndex: 2,
                        }}
                      >
                        <img
                          src={SignleYellwPattern}
                          alt="pattern"
                          style={{
                            width: "40px",
                            height: "40px",
                          }}
                        />
                        <Typography
                          sx={{
                            color: "#da943c",
                            fontSize: 14,
                            fontWeight: "bold",
                            fontFamily:
                              "ZaridSlab, RH-Zak Reg, Arial, sans-serif",
                          }}
                        >
                          الوصول للموقع
                        </Typography>
                      </Box>

                      <Box sx={{ textAlign: "right", mb: "5px" }}>
                        <Typography
                          sx={{
                            mt: "-10px",
                            fontSize: 20,
                            fontWeight: "bold",
                            color: "#da943c",
                            mb: 1,
                            textAlign: "right",
                            fontFamily:
                              "ZaridSlab, RH-Zak Reg, Arial, sans-serif",
                          }}
                        >
                          {dam.title}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Fade>
            );
          })}
        </Box>

        {processedDamsData.length === 0 && !loading && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Water
              sx={{ fontSize: 80, color: "rgba(255,255,255,0.3)", mb: 2 }}
            />
            <Typography
              variant="h4"
              sx={{
                color: "#fff",
                fontFamily: "Tajawal, sans-serif",
                mb: 2,
              }}
            >
              لا توجد سدود متاحة حالياً
            </Typography>
            <Typography
              sx={{
                color: "rgba(255,255,255,0.6)",
                fontFamily: "Tajawal, sans-serif",
                mb: 4,
              }}
            >
              كن أول من يضيف سد جميل في بني حسن
            </Typography>
          </Box>
        )}
      </Container>

      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "60vh",
          zIndex: 0,
          pointerEvents: "none",
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

export default DamsPage;
