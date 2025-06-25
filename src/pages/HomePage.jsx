import React from "react";
import { Box } from "@mui/material";
import HeroSection from "../components/HeroSection";
import NextSection from "../components/NextSection";
import Footer from "../components/Footer";

import { useLocation } from "react-router-dom";
import { useEffect } from "react";

function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    window.gtag("config", "G-S5KLTR1HNK", {
      page_path: location.pathname,
    });
  }, [location]);

  useEffect(() => {
    document.title = "بني حسن - الرئيسية";
  }, []);
}

export default function HomePage() {
  usePageTracking();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#000000",
      }}
    >
      <HeroSection />
      <NextSection />
      <Footer />
    </Box>
  );
}
