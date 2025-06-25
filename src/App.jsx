import React, { useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { SystemAdminProvider } from './contexts/SystemAdminContext';
import LocationFetcher from './components/LocationFetcher';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLogin from './components/AdminLogin';
import AdminSignup from './components/AdminSignup';
import SystemAdminLogin from './components/SystemAdminLogin';
import SystemAdminSignup from './components/SystemAdminSignup';
import SystemAdminDashboard from './components/SystemAdminDashboard';

import HomePage from './pages/HomePage';
import ViewpointsPage from './pages/ViewpointsPage';
import AdminPanel from './pages/AdminPanel';
import CafesPage from './pages/CafesPage';
import DamsPage from './pages/DamsPage';
import ParksPage from './pages/ParksPage';
import HousingPage from './pages/HousingPage';
import FarmsPage from './pages/FarmsPage';
import ParkDetailsPage from './pages/ParkDetailsPage';
import FarmDetailsPage from './pages/FarmDetailsPage';
import HousingDetailsPage from './pages/HousingDetailsPage';

const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: "'RH-Zak Reg', Arial, sans-serif",
    h1: {
      fontFamily: "'RH-Zak Reg', Arial, sans-serif",
      fontWeight: 700,
    },
    h2: {
      fontFamily: "'RH-Zak Reg', Arial, sans-serif",
      fontWeight: 700,
    },
    h3: {
      fontFamily: "'RH-Zak Reg', Arial, sans-serif",
      fontWeight: 600,
    },
    h4: {
      fontFamily: "'RH-Zak Reg', Arial, sans-serif",
      fontWeight: 600,
    },
    h5: {
      fontFamily: "'RH-Zak Reg', Arial, sans-serif",
      fontWeight: 600,
    },
    h6: {
      fontFamily: "'RH-Zak Reg', Arial, sans-serif",
      fontWeight: 600,
    },
  },
  palette: {
    primary: {
      main: '#4D3873', 
      light: '#6B4D9E',
      dark: '#2F3D76',
    },
    secondary: {
      main: '#2F8872', 
      light: '#47A88E',
      dark: '#1A6B5A',
    },
    accent: {
      main: '#DA943B', 
      light: '#E5B06B',
      dark: '#B87A2F',
    },
    background: {
      default: '#000000',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#ffffff', 
      secondary: '#cccccc',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        'body, html': {
          height: '100%',
          scrollBehavior: 'smooth'
        },
        body: {
          '&::-webkit-scrollbar': {
            width: '8px'
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(0,0,0,0.1)'
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '10px',
            '&:hover': {
              background: 'linear-gradient(135deg, #74b9ff 0%, #a29bfe 100%)'
            }
          }
        },
        '*': {
          margin: 0,
          padding: 0,
          boxSizing: 'border-box'
        }
      }
    }
  }
});

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        fontFamily: "'RH-Zak Reg', Arial, sans-serif"
      }}
    >
      <div
        style={{
          textAlign: 'center',
          padding: '2rem',
          backgroundColor: '#1a1a1a',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
          border: '1px solid #333'
        }}
      >
        <h2 style={{ color: '#ff6b6b', marginBottom: '1rem' }}>❌ الصفحة غير موجودة</h2>
        <p style={{ color: '#cccccc', marginBottom: '1rem' }}>
          عذراً، الصفحة التي تبحث عنها غير متوفرة
        </p>
        <button
          onClick={() => navigate('/')}
          style={{
            backgroundColor: '#667eea',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontFamily: "'RH-Zak Reg', Arial, sans-serif"
          }}
        >
          العودة للصفحة الرئيسية
        </button>
      </div>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    document.title = 'بني حسن - دليل المواقع السياحية';
    
    const hideInitialLoading = () => {
      const initialLoader = document.getElementById('initial-loading');
      if (initialLoader) {
        initialLoader.classList.add('fade-out');
        setTimeout(() => {
          initialLoader.style.display = 'none';
        }, 300);
      }
    };

    const timer = setTimeout(() => {
      hideInitialLoading();
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <SystemAdminProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <Routes>
              <Route path="/admin-signup" element={<AdminSignup />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                } 
              />
              <Route path="/system-admin/login" element={<SystemAdminLogin />} />
              <Route path="/system-admin/signup" element={<SystemAdminSignup />} />
              <Route
                path="/system-admin/dashboard"
                element={
                  <ProtectedRoute>
                    <SystemAdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Layout />}>  
                <Route index element={<HomePage />} />
                <Route path="location" element={<LocationFetcher />} />
                <Route path="viewpoints" element={<ViewpointsPage />} />
                <Route path="cafes" element={<CafesPage />} />
                <Route path="dams" element={<DamsPage />} />
                <Route path="parks" element={<ParksPage />} />
                <Route path="parks/:id" element={<ParkDetailsPage />} />
                <Route path="farms/:id" element={<FarmDetailsPage />} />
                <Route path="housing/:id" element={<HousingDetailsPage />} />
                <Route path="housing" element={<HousingPage />} />
                <Route path="farms" element={<FarmsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </SystemAdminProvider>
    </AuthProvider>
  );
}
