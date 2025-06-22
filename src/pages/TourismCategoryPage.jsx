import React, { useState, useEffect } from "react";
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
  Chip,
  Fade,
  Alert
} from "@mui/material";
import {
  Visibility,
  Place,
  Navigation,
  Star,
  AccessTime,
  AttachMoney,
  Phone,
  Share,
  Home
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getTourismSitesByCategory } from "../services/tourismService";
import "./styles.css";

import { useLocation } from 'react-router-dom'

function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    window.gtag('config', 'G-S5KLTR1HNK', {
      page_path: location.pathname,
    });
  }, [location]);
}

const API_KEY = "64ed344bced9f674d5e508b40104fdf9";

export default function TourismCategoryPage({
  category,
  title,
  singularTitle,
  showRating,
  showWeather
}) {
  const navigate = useNavigate();
  const [sites, setSites] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  usePageTracking();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getTourismSitesByCategory(category);
        if (data.length === 0) {
          setError(`لا توجد بيانات في فئة "${title}" حالياً`);
        }
        setSites(data);
      } catch (err) {
        console.error(err);
        setError("حدث خطأ في تحميل البيانات");
      } finally {
        setLoading(false);
      }
    })();
  }, [category, title]);

  useEffect(() => {
    if (!showWeather || sites.length === 0) return;
    setWeatherLoading(true);
    const fetchAll = async () => {
      const map = {};
      await Promise.all(
        sites.map(async (s) => {
          if (s.coordinates?.lat && s.coordinates?.lon) {
            try {
              const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${s.coordinates.lat}&lon=${s.coordinates.lon}&units=metric&appid=${API_KEY}&lang=ar`
              );
              const d = await res.json();
              map[s.id] = {
                temp: Math.round(d.main.temp),
                icon: d.weather?.[0]?.icon,
              };
            } catch {
              map[s.id] = { temp: "--", icon: "01d" };
            }
          } else {
            map[s.id] = { temp: "--", icon: "01d" };
          }
        })
      );
      setWeather(map);
      setWeatherLoading(false);
    };
    fetchAll();
  }, [sites, showWeather]);

  const handlePrev = (id, len) =>
    setCurrentImageIndex((p) => ({
      ...p,
      [id]: ((p[id] || 0) - 1 + len) % len,
    }));
    
  const handleNext = (id, len) =>
    setCurrentImageIndex((p) => ({
      ...p,
      [id]: ((p[id] || 0) + 1) % len,
    }));

  const openMaps = (s) => {
    const url =
      s.googleMapsUrl ||
      (s.coordinates
        ? `https://www.google.com/maps/@${s.coordinates.lat},${s.coordinates.lon},15z`
        : `https://www.google.com/maps/search/${encodeURIComponent(
            s.title + " " + s.address
          )}`);
    window.open(url, "_blank");
  };

  const share = async (s) => {
    const text = `${s.title}\n${s.description}\n${window.location.href}`;
    if (navigator.share) {
      await navigator.share({ title: s.title, text, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(text);
      alert("تم نسخ رابط المشاركة إلى الحافظة");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <CircularProgress size={60} className={`loading-spinner-${category}`} />
        <Typography className="loading-text">جاري تحميل {title}...</Typography>
      </div>
    );
  }

  return (
    <div className="main-container">
      <div 
        className="hero-section" 
        style={{backgroundImage: `url(${require('../assets/Park.webp')})`}}
      >
        <Container>
          <div className="hero-content">
            <Fade in timeout={1000}>
              <Typography className="hero-title">
                {title}
              </Typography>
            </Fade>
            <Fade in timeout={1500}>
              <Typography className="hero-subtitle">
                اكتشف أجمل {title} في بني حسن
              </Typography>
            </Fade>
          </div>
        </Container>
      </div>

      <Container className="container">
        <div className="nav-container">
          <Button 
            className="nav-button-primary"
            onClick={() => navigate("/")}
          >
            <Home />
            العودة للرئيسية
          </Button>
          <Button 
            className={`nav-button-outline nav-button-${category}`}
            onClick={() => navigate("/admin")}
          >
            إضافة {singularTitle} جديد
          </Button>
        </div>

        {error && (
          <Alert className="alert alert-info">
            {error}
          </Alert>
        )}

        <div className="cards-grid">
          {sites.map((s, i) => (
            <Fade in timeout={300 + i * 200} key={s.id || i}>
              <Card className={`site-card site-card-${category}`}>
                <div className="image-section">
                  {s.images?.length > 0 ? (
                    <>
                      <img
                        src={
                          typeof s.images[currentImageIndex[s.id] || 0] === "string"
                            ? s.images[currentImageIndex[s.id] || 0]
                            : s.images[currentImageIndex[s.id] || 0]?.url
                        }
                        alt={s.title}
                        className="site-image"
                      />
                      {s.images.length > 1 && (
                        <>
                          <button
                            onClick={() => handlePrev(s.id, s.images.length)}
                            className="image-nav-button image-nav-prev"
                          >
                            ‹
                          </button>
                          <button
                            onClick={() => handleNext(s.id, s.images.length)}
                            className="image-nav-button image-nav-next"
                          >
                            ›
                          </button>
                          <div className="image-dots">
                            {s.images.map((_, imgIdx) => (
                              <div
                                key={imgIdx}
                                className={`image-dot ${
                                  (currentImageIndex[s.id] || 0) === imgIdx 
                                    ? 'image-dot-active' 
                                    : 'image-dot-inactive'
                                }`}
                                onClick={() => setCurrentImageIndex(prev => ({
                                  ...prev,
                                  [s.id]: imgIdx
                                }))}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className={`image-placeholder image-placeholder-${category}`}>
                      <Place className="placeholder-icon" />
                      <Typography sx={{ fontSize: 14, fontFamily: 'ZaridSlab, RH-Zak Reg, Arial, sans-serif' }}>
                        لا توجد صور متاحة
                      </Typography>
                    </div>
                  )}

                  {showWeather && (
                    <div className={`weather-overlay weather-overlay-${category}`}>
                      {weatherLoading ? (
                        <CircularProgress size={16} />
                      ) : (
                        <>
                          <img
                            src={`https://openweathermap.org/img/wn/${weather[s.id]?.icon}.png`}
                            className="weather-icon"
                            alt="weather"
                          />
                          <Typography className="weather-text">
                            {weather[s.id]?.temp}°C
                          </Typography>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <CardContent className="card-content">
                  <div className="card-header">
                    <div className="card-title-section">
                      <Typography className="card-title">
                        {s.title}
                      </Typography>
                      <Typography className="card-address">
                        {s.address}
                      </Typography>
                    </div>
                    <Place className={`card-icon card-icon-${category}`} />
                  </div>

                  {showRating && (
                    <div className="rating-stats">
                      <div className="rating-section">
                        <div className="rating-stars">
                          <Rating
                            value={s.rating || 4}
                            precision={0.1}
                            readOnly
                            emptyIcon={<Star />}
                            size="small"
                          />
                        </div>
                        <Typography className="rating-text">
                          ({s.rating?.toFixed(1)}) • {s.popularity || "–"}
                        </Typography>
                      </div>
                      <div className="stats-section">
                        <div className="stat-item">
                          <Visibility className="stat-icon" />
                          <Typography className="stat-number">
                            {s.views || 0}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  )}

                  <hr className="divider" />

                  <div className="description">
                    <Typography className="description-text">
                      {s.description}
                    </Typography>
                  </div>

                  {s.features?.length > 0 && (
                    <div className="features">
                      {s.features.slice(0, 4).map((f, idx) => (
                        <span key={idx} className={`feature-chip feature-chip-${category}`}>
                          {f}
                        </span>
                      ))}
                      {s.features.length > 4 && (
                        <span className="feature-chip feature-chip-more">
                          +{s.features.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="additional-info">
                    {s.openingHours && (
                      <div className="info-item">
                        <AccessTime className="info-icon" />
                        <Typography className="info-text">
                          {s.openingHours}
                        </Typography>
                      </div>
                    )}
                    {s.price && (
                      <div className="info-item">
                        <AttachMoney className="info-icon" />
                        <Typography className="info-text">
                          {s.price}
                        </Typography>
                      </div>
                    )}
                    {s.contactInfo && s.contactInfo !== "غير متوفر" && (
                      <div className="info-item">
                        <Phone className="info-icon" />
                        <Typography className="info-text">
                          {s.contactInfo}
                        </Typography>
                      </div>
                    )}
                  </div>

                  <div className="action-buttons">
                    <button
                      onClick={() => openMaps(s)}
                      className={`action-button-primary action-button-${category}`}
                    >
                      <Navigation />
                      التوجه للموقع
                    </button>
                    <button
                      onClick={() => share(s)}
                      className="action-button-share"
                    >
                      <Share />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </Fade>
          ))}
        </div>

        {sites.length === 0 && !loading && (
          <div className="empty-state">
            <div className={`empty-icon-container empty-icon-container-${category}`}>
              <Place className="empty-icon" />
            </div>
            <Typography className="empty-title">
              لا توجد {title} متاحة حالياً
            </Typography>
            <Typography className="empty-subtitle">
              كن أول من يضيف {singularTitle} جديد في بني حسن
            </Typography>
            <button
              onClick={() => navigate("/admin")}
              className={`action-button-primary action-button-${category} empty-button`}
            >
              إضافة {singularTitle} جديد
            </button>
          </div>
        )}
      </Container>
    </div>
  );
}
