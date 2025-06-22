import React, { useState, useEffect } from 'react';
import {
  Box, Drawer, AppBar, Toolbar, Typography, Button, IconButton, List, ListItem, ListItemIcon, ListItemText, Divider, Container, Card, CardContent, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Chip, CircularProgress, Snackbar, Alert, Tooltip, Grid, InputAdornment, Select, MenuItem, Box as MuiBox
} from '@mui/material';
import {
  Home, Park, LocalCafe, Water, Hotel, Landscape, Agriculture, Logout, Add, Edit, Delete, Info, Brightness4, Brightness7, ArrowBackIos, ArrowForwardIos, AdminPanelSettings, Menu
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAllTourismSites, addTourismSite, updateTourismSite, deleteTourismSite } from '../services/tourismService';
import { handleGooglePlaceInfo, validateGoogleMapsUrl } from '../services/googleService';
import { setupCurrentUserAsAdmin, checkUserPermissions } from '../utils/setupAdmin';
import { testFirebaseStorageConnection } from '../services/firebaseStorageService';
import { testLocalStorage } from '../services/localStorageService';
import ParkIcon from '@mui/icons-material/Park';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import LocalBarbecueIcon from '@mui/icons-material/OutdoorGrill';
import IcecreamIcon from '@mui/icons-material/Icecream';
import PoolIcon from '@mui/icons-material/Pool';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import WavesIcon from '@mui/icons-material/Waves';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import PedalBikeIcon from '@mui/icons-material/PedalBike';
import EmojiNatureIcon from '@mui/icons-material/EmojiNature';
import ForestIcon from '@mui/icons-material/Forest';
import NaturePeopleIcon from '@mui/icons-material/NaturePeople';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CelebrationIcon from '@mui/icons-material/Celebration';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import ToysIcon from '@mui/icons-material/Toys';
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import EventIcon from '@mui/icons-material/Event';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PoolIcon2 from '@mui/icons-material/Pool';
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
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
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
import LocalPostOfficeIcon2 from '@mui/icons-material/LocalPostOffice';
import LocalPrintshopIcon2 from '@mui/icons-material/LocalPrintshop';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocalDiningIcon2 from '@mui/icons-material/LocalDining';

const CATEGORIES = [
  { id: 'parks', label: 'المنتزهات', icon: <Park /> },
  { id: 'cafes', label: 'المقاهي', icon: <LocalCafe /> },
  { id: 'dams', label: 'السدود', icon: <Water /> },
  { id: 'housing', label: 'النزل', icon: <Hotel /> },
  { id: 'viewpoints', label: 'المطلات', icon: <Landscape /> },
  { id: 'farms', label: 'المزارع', icon: <Agriculture /> },
];

const drawerWidth = 260;

const panelFont = `'Cairo', 'Tajawal', Arial, sans-serif`;
const sidebarFont = `'Noto Kufi Arabic', 'Cairo', Arial, sans-serif`;

const ICON_OPTIONS = [
  { value: 'Park', icon: <ParkIcon fontSize="medium" /> },
  { value: 'Forest', icon: <ForestIcon fontSize="medium" /> },
  { value: 'WbSunny', icon: <WbSunnyIcon fontSize="medium" /> },
  { value: 'SportsSoccer', icon: <SportsSoccerIcon fontSize="medium" /> },
  { value: 'SportsTennis', icon: <SportsTennisIcon fontSize="medium" /> },
  { value: 'SportsBasketball', icon: <SportsBasketballIcon fontSize="medium" /> },
  { value: 'SportsEsports', icon: <SportsEsportsIcon fontSize="medium" /> },
  { value: 'DirectionsRun', icon: <DirectionsRunIcon fontSize="medium" /> },
  { value: 'Fastfood', icon: <FastfoodIcon fontSize="medium" /> },
  { value: 'LocalDining', icon: <LocalDiningIcon fontSize="medium" /> },
  { value: 'LocalCafe', icon: <LocalCafeIcon fontSize="medium" /> },
  { value: 'Icecream', icon: <IcecreamIcon fontSize="medium" /> },
  { value: 'Pool', icon: <PoolIcon fontSize="medium" /> },
  { value: 'WaterDrop', icon: <WaterDropIcon fontSize="medium" /> },
  { value: 'Waves', icon: <WavesIcon fontSize="medium" /> },
  { value: 'BeachAccess', icon: <BeachAccessIcon fontSize="medium" /> },
  { value: 'CameraAlt', icon: <CameraAltIcon fontSize="medium" /> },
  { value: 'PhotoCamera', icon: <PhotoCameraIcon fontSize="medium" /> },
  { value: 'Celebration', icon: <CelebrationIcon fontSize="medium" /> },
  { value: 'EmojiEvents', icon: <EmojiEventsIcon fontSize="medium" /> },
  { value: 'ChildCare', icon: <ChildCareIcon fontSize="medium" /> },
  { value: 'Toys', icon: <ToysIcon fontSize="medium" /> },
  { value: 'ShoppingCart', icon: <ShoppingCartIcon fontSize="medium" /> },
  { value: 'Storefront', icon: <StorefrontIcon fontSize="medium" /> },
  { value: 'LocalHospital', icon: <LocalHospitalIcon fontSize="medium" /> },
  { value: 'FitnessCenter', icon: <FitnessCenterIcon fontSize="medium" /> },
  { value: 'MusicNote', icon: <MusicNoteIcon fontSize="medium" /> },
  { value: 'TheaterComedy', icon: <TheaterComedyIcon fontSize="medium" /> },
  { value: 'LocalBarbecue', icon: <LocalBarbecueIcon fontSize="medium" /> },
  { value: 'DirectionsBike', icon: <DirectionsBikeIcon fontSize="medium" /> },
  { value: 'PedalBike', icon: <PedalBikeIcon fontSize="medium" /> },
  { value: 'NaturePeople', icon: <NaturePeopleIcon fontSize="medium" /> },
  { value: 'LocalLibrary', icon: <LocalLibraryIcon fontSize="medium" /> },
  { value: 'MenuBook', icon: <MenuBookIcon fontSize="medium" /> },
  { value: 'LocalActivity', icon: <LocalActivityIcon fontSize="medium" /> },
  { value: 'Hiking', icon: <HikingIcon fontSize="medium" /> },
  { value: 'Kayaking', icon: <KayakingIcon fontSize="medium" /> },
  { value: 'DirectionsBoat', icon: <DirectionsBoatIcon fontSize="medium" /> },
  { value: 'DirectionsCar', icon: <DirectionsCarIcon fontSize="medium" /> },
  { value: 'DirectionsBus', icon: <DirectionsBusIcon fontSize="medium" /> },
  { value: 'DirectionsSubway', icon: <DirectionsSubwayIcon fontSize="medium" /> },
  { value: 'DirectionsWalk', icon: <DirectionsWalkIcon fontSize="medium" /> },
  { value: 'LocalAirport', icon: <LocalAirportIcon fontSize="medium" /> },
  { value: 'LocalParking', icon: <LocalParkingIcon fontSize="medium" /> },
  { value: 'LocalFlorist', icon: <LocalFloristIcon fontSize="medium" /> },
  { value: 'LocalPlay', icon: <LocalPlayIcon fontSize="medium" /> },
  { value: 'LocalSee', icon: <LocalSeeIcon fontSize="medium" /> },
  { value: 'LocalDrink', icon: <LocalDrinkIcon fontSize="medium" /> },
  { value: 'LocalFireDepartment', icon: <LocalFireDepartmentIcon fontSize="medium" /> },
  { value: 'LocalGasStation', icon: <LocalGasStationIcon fontSize="medium" /> },
  { value: 'LocalGroceryStore', icon: <LocalGroceryStoreIcon fontSize="medium" /> },
  { value: 'LocalHotel', icon: <LocalHotelIcon fontSize="medium" /> },
  { value: 'LocalMall', icon: <LocalMallIcon fontSize="medium" /> },
  { value: 'LocalPharmacy', icon: <LocalPharmacyIcon fontSize="medium" /> },
  { value: 'LocalPostOffice', icon: <LocalPostOfficeIcon fontSize="medium" /> },
  { value: 'LocalPrintshop', icon: <LocalPrintshopIcon fontSize="medium" /> },
  { value: 'LocalTaxi', icon: <LocalTaxiIcon fontSize="medium" /> },
  { value: 'LocalAtm', icon: <LocalAtmIcon fontSize="medium" /> },
  { value: 'LocalConvenienceStore', icon: <LocalConvenienceStoreIcon fontSize="medium" /> },
  { value: 'LocalLaundryService', icon: <LocalLaundryServiceIcon fontSize="medium" /> },
  { value: 'LocalMovies', icon: <LocalMoviesIcon fontSize="medium" /> },
  { value: 'LocalOffer', icon: <LocalOfferIcon fontSize="medium" /> },
  { value: 'LocalPhone', icon: <LocalPhoneIcon fontSize="medium" /> },
  { value: 'LocalPizza', icon: <LocalPizzaIcon fontSize="medium" /> },
  { value: 'LocalPostOffice2', icon: <LocalPostOfficeIcon2 fontSize="medium" /> },
  { value: 'LocalPrintshop2', icon: <LocalPrintshopIcon2 fontSize="medium" /> },
  { value: 'LocalShipping', icon: <LocalShippingIcon fontSize="medium" /> },
  { value: 'LocalDining2', icon: <LocalDiningIcon2 fontSize="medium" /> },
];

export default function AdminPanel() {
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();
  const userEmail = currentUser?.email;
  const [selectedCategory, setSelectedCategory] = useState('parks');
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    googleMapsUrl: '',
    images: [],
    videos: [],
    details: [],
    openingHours: '',
    contactInfo: '',
    price: '',
    additionalInfo: '',
    coordinates: { lat: '', lon: '' },
    rating: '',
    reviewsCount: ''
  });
  const [selectedSite, setSelectedSite] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', type: 'success' });
  const [settingUpAdmin, setSettingUpAdmin] = useState(false);
  const [userPermissions, setUserPermissions] = useState({ isAdmin: false, isSystemAdmin: false });
  const [testingStorage, setTestingStorage] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [rtl, setRtl] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [currentDetailIndex, setCurrentDetailIndex] = useState(0);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [isAddingSite, setIsAddingSite] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchSites();
  }, [selectedCategory]);

  useEffect(() => {
    if (userEmail) {
      checkPermissions();
    }
  }, [userEmail]);

  const checkPermissions = async () => {
    try {
      const permissions = await checkUserPermissions();
      setUserPermissions(permissions);
    } catch (error) {
      console.error('خطأ في فحص الصلاحيات:', error);
    }
  };

  const handleSetupAdmin = async () => {
    setSettingUpAdmin(true);
    try {
      const result = await setupCurrentUserAsAdmin();
      setSnackbar({
        open: true,
        message: `✅ ${result.message}`,
        type: 'success'
      });
      await checkPermissions(); 
    } catch (error) {
      setSnackbar({
        open: true,
        message: `❌ خطأ: ${error.message}`,
        type: 'error'
      });
    } finally {
      setSettingUpAdmin(false);
    }
  };

  const handleTestStorage = async () => {
    setTestingStorage(true);
    try {
      const result = await testLocalStorage();
      setSnackbar({
        open: true,
        message: result.success ? `✅ ${result.message} (Base64 - حل مؤقت لمشكلة CORS)` : `❌ ${result.message}`,
        type: result.success ? 'success' : 'warning'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: ` خطأ في اختبار التخزين: ${error.message}`,
        type: 'error'
      });
    } finally {
      setTestingStorage(false);
    }
  };

  useEffect(() => {
    if (detailsDialog && selectedSite && selectedSite.details && selectedSite.details.length > 0) {
      setCurrentDetailIndex(0);
    }
  }, [detailsDialog, selectedSite]);

  const fetchSites = async () => {
    setLoading(true);
    try {
      const all = await getAllTourismSites();
      setSites(all.filter(site => site.category === selectedCategory));
    } catch {
      setSnackbar({ open: true, message: 'خطأ في جلب البيانات', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin-login', { replace: true });
  };

  const handleOpenForm = (site = null) => {
    if (site) {
      setFormData({
        ...site,
        details: Array.isArray(site.details) ? site.details : [],
        coordinates: { lat: site.coordinates?.lat || '', lon: site.coordinates?.lon || '' }
      });
      setEditMode(true);
      setSelectedSite(site);
    } else {
      setFormData({
        title: '', description: '', address: '', googleMapsUrl: '', images: [], videos: [], details: [], openingHours: '', contactInfo: '', price: '', additionalInfo: '', coordinates: { lat: '', lon: '' }, rating: '', reviewsCount: ''
      });
      setEditMode(false);
      setSelectedSite(null);
    }
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditMode(false);
    setSelectedSite(null);
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const handleRemoveImage = (idx) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      newImages.splice(idx, 1);
      return { ...prev, images: newImages };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAddingSite(true);
    try {
      const imageFiles = formData.images || [];
      const details = (formData.details || []).map(detail => ({
        ...detail,
        images: detail.images || []
      }));
      const siteData = {
        ...formData,
        images: undefined,
        videos: undefined,
        details: details
      };
      if (editMode && selectedSite) {
        const result = await updateTourismSite(selectedSite.id, siteData, imageFiles);
        setSnackbar({ 
          open: true, 
          message: result.message || 'تم التحديث بنجاح', 
          type: 'success' 
        });
      } else {
        const result = await addTourismSite({ ...siteData, category: selectedCategory }, imageFiles);
        setSnackbar({ 
          open: true, 
          message: result.message || 'تمت الإضافة بنجاح', 
          type: result.hasLocalImages ? 'warning' : 'success' 
        });
      }
      fetchSites();
      handleCloseForm();
    } catch (error) {
      console.error('Error saving site:', error);
      setSnackbar({ open: true, message: 'حدث خطأ أثناء حفظ الموقع', type: 'error' });
    } finally {
      setIsAddingSite(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteTourismSite(selectedSite.id);
      setSnackbar({ open: true, message: 'تم الحذف بنجاح', type: 'success' });
      fetchSites();
      setDeleteDialog(false);
      setSelectedSite(null);
    } catch {
      setSnackbar({ open: true, message: 'حدث خطأ أثناء الحذف', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDetailsChange = (idx, field, value) => {
    const newDetails = [...formData.details];
    newDetails[idx][field] = value;
    setFormData(prev => ({ ...prev, details: newDetails }));
  };
  const handleAddDetail = () => {
    setFormData(prev => ({ ...prev, details: [...prev.details, { title: '', description: '', images: [] }] }));
  };
  const handleRemoveDetail = (idx) => {
    const newDetails = [...formData.details];
    newDetails.splice(idx, 1);
    setFormData(prev => ({ ...prev, details: newDetails }));
  };

  const colors = {
    mainBg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    sidebarBg: 'linear-gradient(180deg, #1e2a3a 0%, #2d3748 100%)',
    paper: '#1e293b',
    cardBg: 'linear-gradient(145deg, #1e293b 0%, #334155 100%)',
    text: '#f8fafc',
    textSecondary: '#cbd5e1',
    border: '#334155',
    divider: '#475569',
    detailBg: '#0f172a',
    inputBg: '#334155',
    inputText: '#f8fafc',
    btn: '#3b82f6',
    accent: '#10b981',
  };

  const handlePrevImage = (siteId, totalImages) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [siteId]: ((prev[siteId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  const handleNextImage = (siteId, totalImages) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [siteId]: ((prev[siteId] || 0) + 1) % totalImages
    }));
  };

  return (
    <Box dir={rtl ? 'rtl' : 'ltr'} sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      background: colors.mainBg, 
      fontFamily: panelFont 
    }}>
      <AppBar position="fixed" sx={{
        display: { xs: 'flex', md: 'none' },
        background: colors.sidebarBg,
        boxShadow: 'none',
        zIndex: 1301
      }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={() => setSidebarOpen(true)}
            sx={{ mr: 2 }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" fontWeight="bold" sx={{ color: colors.text }}>
            لوحة التحكم
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        anchor="right"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: colors.sidebarBg,
            color: colors.text,
            borderLeft: `1px solid ${colors.border}`,
            fontFamily: sidebarFont,
            boxShadow: '0 0 20px rgba(0,0,0,0.1)'
          },
        }}
      >
        <Toolbar sx={{ 
          justifyContent: 'center', 
          mt: 3, 
          mb: 2,
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2,
          borderBottom: `2px solid ${colors.divider}`,
          pb: 3
        }}>
          <Typography variant="h5" fontWeight="bold" sx={{ color: colors.text }}>
            لوحة التحكم
          </Typography>
        </Toolbar>
        <List sx={{ px: 2 }}>
          {CATEGORIES.map(cat => (
            <ListItem 
              component="div"
              key={cat.id} 
              selected={selectedCategory === cat.id} 
              onClick={() => { setSelectedCategory(cat.id); setSidebarOpen(false); }}
              sx={{
                borderRadius: 3,
                mb: 1,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&.Mui-selected': {
                  background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.btn} 100%)`,
                  color: 'white',
                  boxShadow: '0 2px 12px rgba(16,185,129,0.10)',
                  '& .sidebar-icon': {
                    color: '#fff',
                    textShadow: '0 2px 8px rgba(16,185,129,0.18)'
                  }
                },
                '&:hover': { 
                  bgcolor: colors.paper,
                  transform: 'translateX(-4px)'
                }
              }}
            >
              <ListItemIcon 
                className="sidebar-icon"
                sx={{ 
                  color: '#3b82f6',
                  minWidth: 40,
                  fontSize: 28,
                  transition: 'color 0.2s, text-shadow 0.2s',
                  textShadow: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {React.cloneElement(cat.icon, { fontSize: 'inherit' })}
              </ListItemIcon>
              <ListItemText 
                primary={cat.label} 
                primaryTypographyProps={{ 
                  fontFamily: sidebarFont, 
                  fontWeight: 600,
                  fontSize: '0.95rem'
                }} 
              />
            </ListItem>
          ))}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mb: 3, 
          px: 2,
          borderTop: `1px solid ${colors.divider}`,
          pt: 3
        }}>
          <Tooltip title="تسجيل الخروج">
            <Button
              onClick={handleLogout}
              variant="outlined"
              startIcon={<Logout />}
              sx={{
                color: colors.text,
                borderColor: colors.border,
                borderRadius: 3,
                px: 3,
                py: 1,
                fontWeight: 600,
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: '#ef4444',
                  borderColor: '#ef4444',
                  color: 'white',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              تسجيل الخروج
            </Button>
          </Tooltip>
        </Box>
      </Drawer>
      <Drawer
        variant="permanent"
        anchor="right"
        sx={{ 
          display: { xs: 'none', md: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: colors.sidebarBg,
            color: colors.text,
            borderLeft: `1px solid ${colors.border}`,
            fontFamily: sidebarFont,
            boxShadow: '0 0 20px rgba(0,0,0,0.1)'
          },
        }}
        open
      >
        <Toolbar sx={{ 
          justifyContent: 'center', 
          mt: 3, 
          mb: 2,
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2,
          borderBottom: `2px solid ${colors.divider}`,
          pb: 3
        }}>
          <Typography variant="h5" fontWeight="bold" sx={{ color: colors.text }}>
            لوحة التحكم
          </Typography>
        </Toolbar>
        <List sx={{ px: 2 }}>
          {CATEGORIES.map(cat => (
            <ListItem 
              component="div"
              key={cat.id} 
              selected={selectedCategory === cat.id} 
              onClick={() => setSelectedCategory(cat.id)}
              sx={{
                borderRadius: 3,
                mb: 1,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&.Mui-selected': {
                  background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.btn} 100%)`,
                  color: 'white',
                  boxShadow: '0 2px 12px rgba(16,185,129,0.10)',
                  '& .sidebar-icon': {
                    color: '#fff',
                    textShadow: '0 2px 8px rgba(16,185,129,0.18)'
                  }
                },
                '&:hover': { 
                  bgcolor: colors.paper,
                  transform: 'translateX(-4px)'
                }
              }}
            >
              <ListItemIcon 
                className="sidebar-icon"
                sx={{ 
                  color: '#3b82f6',
                  minWidth: 40,
                  fontSize: 28,
                  transition: 'color 0.2s, text-shadow 0.2s',
                  textShadow: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {React.cloneElement(cat.icon, { fontSize: 'inherit' })}
              </ListItemIcon>
              <ListItemText 
                primary={cat.label} 
                primaryTypographyProps={{ 
                  fontFamily: sidebarFont, 
                  fontWeight: 600,
                  fontSize: '0.95rem'
                }} 
              />
            </ListItem>
          ))}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mb: 3, 
          px: 2,
          borderTop: `1px solid ${colors.divider}`,
          pt: 3
        }}>
          <Tooltip title="تسجيل الخروج">
            <Button
              onClick={handleLogout}
              variant="outlined"
              startIcon={<Logout />}
              sx={{
                color: colors.text,
                borderColor: colors.border,
                borderRadius: 3,
                px: 3,
                py: 1,
                fontWeight: 600,
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: '#ef4444',
                  borderColor: '#ef4444',
                  color: 'white',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              تسجيل الخروج
            </Button>
          </Tooltip>
        </Box>
      </Drawer>
      <Box component="main" sx={{ 
        flexGrow: 1, 
        p: { xs: 2, md: 4 }, 
        background: colors.mainBg,
        minHeight: '100vh',
        mt: { xs: 7, md: 0 } 
      }}>
        <Container maxWidth="xl">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 4,
            background: colors.paper,
            borderRadius: 4,
            p: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: `1px solid ${colors.border}`
          }}>
            <Box>
              <Typography variant="h4" fontWeight="bold" color={colors.text} sx={{ mb: 1 }}>
                إدارة {CATEGORIES.find(c => c.id === selectedCategory)?.label}
              </Typography>
              <Typography variant="body1" color={colors.textSecondary}>
                إضافة وتعديل وإدارة المواقع السياحية
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                startIcon={<Add />} 
                onClick={() => handleOpenForm()} 
                sx={{
                  fontWeight: 'bold',
                  background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.btn} 100%)`,
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)'
                  }
                }}
              >
                إضافة جديد
              </Button>
            </Box>
          </Box>

          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              minHeight: '400px'
            }}>
              <Box sx={{ textAlign: 'center' }}>
                <CircularProgress 
                  size={60} 
                  sx={{ color: colors.accent, mb: 2 }} 
                />
                <Typography color={colors.textSecondary}>
                  جاري تحميل البيانات...
                </Typography>
              </Box>
            </Box>
          ) : sites.length === 0 ? (
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px',
              textAlign: 'center',
              gap: 2
            }}>
              <Box sx={{
                background: colors.paper,
                borderRadius: '50%',
                p: 4,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
              }}>
                <Park sx={{ fontSize: 60, color: colors.textSecondary }} />
              </Box>
              <Typography variant="h5" fontWeight="bold" color={colors.text}>
                لا توجد مواقع حالياً
              </Typography>
              <Typography color={colors.textSecondary}>
                ابدأ بإضافة موقع سياحي جديد في {CATEGORIES.find(c => c.id === selectedCategory)?.label}
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<Add />} 
                onClick={() => handleOpenForm()} 
                sx={{
                  mt: 2,
                  background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.btn} 100%)`,
                  borderRadius: 3,
                  px: 4,
                  py: 1.5
                }}
              >
                إضافة موقع جديد
              </Button>
            </Box>
          ) : (
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' },
              gap: { xs: 2, sm: 3, md: 4 },
              width: '100%'
            }}>
              {sites.map(site => (
                <Card key={site.id} sx={{
                  background: colors.cardBg,
                  color: colors.text,
                  borderRadius: 4,
                  height: { xs: 420, sm: 480, md: 520 },
                  width: '100%',
                  maxWidth: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  border: `1px solid ${colors.border}`,
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                  '&:hover': { 
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                    '& .card-image': {
                      transform: 'scale(1.05)'
                    }
                  }
                }}>
                  {site.images && site.images.length > 0 && (
                    <Box sx={{ position: 'relative', width: '100%', height: { xs: 180, sm: 240, md: 280 }, overflow: 'hidden' }}>
                      <img
                        src={typeof site.images[currentImageIndex[site.id] || 0] === 'string'
                          ? site.images[currentImageIndex[site.id] || 0]
                          : site.images[currentImageIndex[site.id] || 0]?.url}
                        alt={site.title}
                        className="card-image"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                        loading="lazy"
                      />
                      {site.images.length > 1 && (
                        <>
                          <IconButton
                            onClick={() => handlePrevImage(site.id, site.images.length)}
                            sx={{
                              position: 'absolute',
                              top: '50%',
                              left: 8,
                              color: '#fff',
                              background: 'rgba(0,0,0,0.4)',
                              transform: 'translateY(-50%)',
                              zIndex: 2,
                              '&:hover': { background: 'rgba(0,0,0,0.7)' }
                            }}
                          >
                            <ArrowBackIos fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={() => handleNextImage(site.id, site.images.length)}
                            sx={{ 
                              position: 'absolute',
                              top: '50%',
                              right: 8,
                              color: '#fff', 
                              background: 'rgba(0,0,0,0.4)',
                              transform: 'translateY(-50%)',
                              zIndex: 2,
                              '&:hover': { background: 'rgba(0,0,0,0.7)' }
                            }}
                          >
                            <ArrowForwardIos fontSize="small" />
                          </IconButton>
                        </>
                      )}
                    </Box>
                  )}
                  <CardContent sx={{ 
                    flex: 1, 
                    p: { xs: 2, sm: 3 }, 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: 1,
                    minHeight: 140
                  }}>
                    <Typography
                      variant="h6"
                      fontWeight="bold" 
                      sx={{
                        mb: 1,
                        fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                        lineHeight: 1.4,
                        textAlign: 'right', 
                        fontFamily: panelFont,
                        color: colors.text,
                        minHeight: 28,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {site.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: colors.textSecondary, 
                        mb: 1.5, 
                        fontSize: { xs: '0.95rem', sm: '1.1rem' },
                        textAlign: 'right', 
                        fontFamily: panelFont,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        minHeight: 20,
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      <Landscape sx={{ fontSize: 18 }} />
                      {site.address}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ 
                        color: colors.textSecondary, 
                        fontSize: { xs: '0.9rem', sm: '1.05rem' }, 
                        lineHeight: 1.6,
                        textAlign: 'right', 
                        fontFamily: panelFont,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        flex: 1,
                        minHeight: 60
                      }}
                    >
                      {site.description}
                    </Typography>
                  </CardContent>
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 1, 
                    p: { xs: 2, sm: 3 }, 
                    pt: 0,
                    justifyContent: 'flex-end',
                    borderTop: `1px solid ${colors.divider}`,
                    minHeight: 60,
                    alignItems: 'center'
                  }}>
                    <Button 
                      size="medium" 
                      startIcon={<Info />} 
                      variant="outlined" 
                      onClick={() => { setSelectedSite(site); setDetailsDialog(true); }}
                      sx={{ 
                        fontSize: { xs: '0.9rem', sm: '1.05rem' }, 
                        px: 2.5, 
                        py: 1, 
                        borderRadius: 2,
                        borderColor: colors.accent,
                        color: colors.accent,
                        fontFamily: panelFont,
                        '&:hover': {
                          bgcolor: colors.accent,
                          color: 'white'
                        }
                      }}
                    >
                      التفاصيل
                    </Button>
                    <Button
                      size="medium"
                      startIcon={<Edit />} 
                      variant="outlined" 
                      onClick={() => handleOpenForm(site)}
                      sx={{ 
                        fontSize: { xs: '0.9rem', sm: '1.05rem' }, 
                        px: 2.5, 
                        py: 1, 
                        borderRadius: 2,
                        borderColor: colors.btn,
                        color: colors.btn,
                        fontFamily: panelFont,
                        '&:hover': {
                          bgcolor: colors.btn,
                          color: 'white'
                        }
                      }}
                    >
                      تعديل
                    </Button>
                    <Button
                      size="medium" 
                      startIcon={<Delete />} 
                      variant="outlined" 
                      color="error" 
                      onClick={() => { setSelectedSite(site); setDeleteDialog(true); }}
                      sx={{
                        fontSize: { xs: '0.9rem', sm: '1.05rem' }, 
                        px: 2.5, 
                        py: 1, 
                        borderRadius: 2,
                        fontFamily: panelFont
                      }}
                    >
                      حذف
                    </Button>
                  </Box>
                </Card>
              ))}
            </Box>
          )}
        </Container>

        <Dialog 
          open={formOpen} 
          onClose={handleCloseForm} 
          maxWidth="md" 
          fullWidth
          PaperProps={{
            sx: {
              background: colors.paper,
              color: colors.text,
              borderRadius: 4,
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }
          }}
        >
          <DialogTitle sx={{ 
            bgcolor: colors.detailBg, 
            color: colors.text,
            borderBottom: `1px solid ${colors.divider}`,
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>
            {editMode ? 'تعديل الموقع' : 'إضافة موقع جديد'}
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="اسم الموقع" 
                  fullWidth
                  margin="dense" 
                  value={formData.title} 
                  onChange={e => handleFormChange('title', e.target.value)} 
                  InputLabelProps={{ style: { color: colors.textSecondary } }} 
                  InputProps={{
                    style: { 
                      color: colors.inputText, 
                      background: colors.inputBg,
                      borderRadius: 8
                    } 
                  }} 
                />
                <TextField
                  label="الوصف" 
                  fullWidth
                  margin="dense" 
                  multiline 
                  rows={3} 
                  value={formData.description} 
                  onChange={e => handleFormChange('description', e.target.value)} 
                  InputLabelProps={{ style: { color: colors.textSecondary } }} 
                  InputProps={{
                    style: { 
                      color: colors.inputText, 
                      background: colors.inputBg,
                      borderRadius: 8
                    } 
                  }} 
                />
                <TextField 
                  label="العنوان" 
                  fullWidth 
                  margin="dense" 
                  value={formData.address} 
                  onChange={e => handleFormChange('address', e.target.value)} 
                  InputLabelProps={{ style: { color: colors.textSecondary } }} 
                  InputProps={{ 
                    style: { 
                      color: colors.inputText, 
                      background: colors.inputBg,
                      borderRadius: 8
                    } 
                  }} 
                />
                <Box sx={{ mb: 2, background: 'rgba(255,255,255,0.12)', borderRadius: 2, p: 1 }}>
                  <Typography sx={{ color: colors.text, fontSize: '1rem', fontFamily: 'Tajawal, sans-serif' }}>
                    لنسخ رابط Google Maps بالكامل: افتح الموقع في Google Maps، ثم انسخ الرابط من شريط العنوان بالأعلى<br/>
                    أو اضغط <span style={{color:'#10b981',fontWeight:'bold'}}>Ctrl + L</span> ثم <span style={{color:'#10b981',fontWeight:'bold'}}>Ctrl + C</span>
                  </Typography>
                </Box>
                <TextField 
                  label="رابط Google Maps" 
                  fullWidth 
                  margin="dense" 
                  value={formData.googleMapsUrl} 
                  onChange={e => handleFormChange('googleMapsUrl', e.target.value)} 
                  onBlur={async (e) => {
                    const url = e.target.value;
                    if (validateGoogleMapsUrl(url)) {
                      try {
                        const info = await handleGooglePlaceInfo(url);
                        console.log('📍 معلومات Google Maps:', info);
                        
                        const updates = {};
                        
                        if (info.coordinates) {
                          updates.coordinates = {
                            lat: info.coordinates.lat?.toString() || '',
                            lon: info.coordinates.lng?.toString() || info.coordinates.lon?.toString() || ''
                          };
                        }
                        
                        if (info.rating) {
                          updates.rating = info.rating.toString();
                        }
                        
                        if (info.reviewsCount) {
                          updates.reviewsCount = info.reviewsCount.toString();
                        }
                        
                        if (Object.keys(updates).length > 0) {
                          setFormData(prev => ({ ...prev, ...updates }));
                          
                          if (info.message) {
                            setSnackbar({
                              open: true,
                              message: `📍 ${info.message}`,
                              type: info.isDefault ? 'warning' : 'info'
                            });
                          }
                        }
                      } catch (err) {
                        console.error('خطأ في معالجة Google Maps URL:', err);
                        setSnackbar({
                          open: true,
                          message: `❌ خطأ في معالجة رابط Google Maps: ${err.message}`,
                          type: 'error'
                        });
                      }
                    }
                  }}
                  InputLabelProps={{ style: { color: colors.textSecondary } }} 
                  InputProps={{ 
                    style: { 
                      color: colors.inputText, 
                      background: colors.inputBg,
                      borderRadius: 8
                    }
                  }} 
                />
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <TextField
                      label="خط العرض (Latitude)" 
                      fullWidth
                      margin="dense" 
                      value={formData.coordinates?.lat || ''} 
                      onChange={e => setFormData(prev => ({ ...prev, coordinates: { ...prev.coordinates, lat: e.target.value } }))} 
                      InputLabelProps={{ style: { color: colors.textSecondary } }} 
                      InputProps={{
                        style: { 
                          color: colors.inputText, 
                          background: colors.inputBg,
                          borderRadius: 8
                        } 
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="خط الطول (Longitude)" 
                      fullWidth
                      margin="dense" 
                      value={formData.coordinates?.lon || ''} 
                      onChange={e => setFormData(prev => ({ ...prev, coordinates: { ...prev.coordinates, lon: e.target.value } }))} 
                      InputLabelProps={{ style: { color: colors.textSecondary } }} 
                      InputProps={{
                        style: { 
                          color: colors.inputText, 
                          background: colors.inputBg,
                          borderRadius: 8
                        } 
                      }} 
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <TextField
                      label="التقييم (Rating)"
                      fullWidth
                      margin="dense"
                      value={formData.rating || ''}
                      onChange={e => handleFormChange('rating', e.target.value)}
                      InputLabelProps={{ style: { color: colors.textSecondary } }}
                      InputProps={{
                        style: {
                          color: colors.inputText,
                          background: colors.inputBg,
                          borderRadius: 8
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="عدد المراجعات (Reviews Count)"
                      fullWidth
                      margin="dense"
                      value={formData.reviewsCount || ''}
                      onChange={e => handleFormChange('reviewsCount', e.target.value)}
                      InputLabelProps={{ style: { color: colors.textSecondary } }}
                      InputProps={{
                        style: {
                          color: colors.inputText,
                          background: colors.inputBg,
                          borderRadius: 8
                        }
                      }}
                    />
                  </Grid>
                </Grid>
                <TextField
                  label="ساعات العمل"
                  fullWidth 
                  margin="dense" 
                  value={formData.openingHours}
                  onChange={e => handleFormChange('openingHours', e.target.value)} 
                  InputLabelProps={{ style: { color: colors.textSecondary } }} 
                  InputProps={{
                    style: { 
                      color: colors.inputText, 
                      background: colors.inputBg,
                      borderRadius: 8
                    } 
                  }} 
                />
                <TextField
                  label="رقم التواصل" 
                  fullWidth
                  margin="dense" 
                  value={formData.contactInfo}
                  onChange={e => handleFormChange('contactInfo', e.target.value)} 
                  InputLabelProps={{ style: { color: colors.textSecondary } }} 
                  InputProps={{
                    style: { 
                      color: colors.inputText, 
                      background: colors.inputBg,
                      borderRadius: 8
                    } 
                  }} 
                />
                <TextField
                  label="السعر" 
                  fullWidth
                  margin="dense" 
                  value={formData.price}
                  onChange={e => handleFormChange('price', e.target.value)} 
                  InputLabelProps={{ style: { color: colors.textSecondary } }} 
                  InputProps={{
                    style: { 
                      color: colors.inputText, 
                      background: colors.inputBg,
                      borderRadius: 8
                    } 
                  }} 
                />
                <TextField
                  label="معلومات إضافية"
                  fullWidth 
                  margin="dense" 
                  value={formData.additionalInfo}
                  onChange={e => handleFormChange('additionalInfo', e.target.value)} 
                  InputLabelProps={{ style: { color: colors.textSecondary } }} 
                  InputProps={{ 
                    style: { 
                      color: colors.inputText, 
                      background: colors.inputBg,
                      borderRadius: 8
                    } 
                  }} 
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography fontWeight="bold" sx={{ mb: 2, color: colors.text, fontSize: '1.1rem' }}>
                  الصور
                </Typography>
                
                <Box sx={{ 
                  border: `2px dashed ${colors.border}`, 
                  borderRadius: 3, 
                  p: 3, 
                  mb: 3, 
                  textAlign: 'center',
                  background: colors.detailBg,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: colors.accent,
                    background: colors.inputBg
                  }
                }}>
                  <Button 
                    variant="outlined" 
                    component="label" 
                    fullWidth 
                    sx={{ 
                      color: colors.accent, 
                      borderColor: colors.accent,
                      borderRadius: 2,
                      py: 1.5,
                      '&:hover': {
                        bgcolor: colors.accent,
                        color: 'white'
                      }
                    }}
                  >
                    رفع صور
                    <input type="file" hidden multiple accept="image/*" onChange={handleImageUpload} />
                  </Button>
                  <Typography variant="caption" sx={{ color: colors.textSecondary, mt: 1, display: 'block' }}>
                    PNG, JPG, GIF حتى 10MB
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                  {formData.images.map((img, idx) => (
                    <Box key={idx} sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
                      <img 
                        src={img instanceof File ? URL.createObjectURL(img) : img.url || img} 
                        alt="site" 
                        style={{ 
                          width: 80, 
                          height: 80, 
                          objectFit: 'cover', 
                          border: `2px solid ${colors.border}`,
                          borderRadius: 8
                        }}
                        loading="lazy"
                      />
                      <IconButton 
                        size="small" 
                        sx={{
                          position: 'absolute', 
                          top: -8, 
                          right: -8, 
                          bgcolor: '#ef4444', 
                          color: 'white', 
                          p: 0.5, 
                          boxShadow: 2,
                          '&:hover': { bgcolor: '#dc2626' }
                        }}
                        onClick={() => handleRemoveImage(idx)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>

                <Divider sx={{ my: 3, bgcolor: colors.divider }} />

                <Typography fontWeight="bold" sx={{ color: colors.text, mb: 2, fontSize: '1.1rem' }}>
                  تفاصيل إضافية (مطاعم، ممشى...)
                </Typography>
                
                {formData.details.map((detail, idx) => (
                  <Box 
                    key={idx} 
                    sx={{ 
                      border: `1px solid ${colors.border}`, 
                      borderRadius: 3, 
                      p: 2.5, 
                      mb: 2, 
                      background: colors.detailBg,
                      position: 'relative'
                    }}
                  >
                    <TextField 
                      label="اسم الفعالية" 
                      fullWidth 
                      margin="dense" 
                      value={detail.title} 
                      onChange={e => handleDetailsChange(idx, 'title', e.target.value)} 
                      InputLabelProps={{ style: { color: colors.textSecondary } }} 
                      InputProps={{ 
                        style: { 
                          color: colors.inputText, 
                          background: colors.inputBg,
                          borderRadius: 8
                        } 
                      }} 
                    />
                    <Select
                      value={detail.icon || ''}
                      onChange={e => handleDetailsChange(idx, 'icon', e.target.value)}
                      displayEmpty
                      sx={{
                        color: colors.inputText,
                        background: colors.inputBg,
                        borderRadius: 1,
                        mt: 2,
                        width: 200,
                        '& .MuiSelect-icon': { color: colors.textSecondary },
                        '& .MuiSelect-select': {
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            backgroundColor: colors.inputBg,
                            color: colors.inputText,
                            minWidth: 400,
                            maxWidth: 600,
                            p: 2,
                            maxHeight: 400
                          }
                        }
                      }}
                      renderValue={selected => {
                        if (!selected) {
                          return <span style={{color: colors.textSecondary}}>اختر أيقونة</span>;
                        }
                        const found = ICON_OPTIONS.find(opt => opt.value === selected);
                        if (found) {
                          return (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {React.cloneElement(found.icon, { 
                                fontSize: 'medium',
                                sx: { color: colors.accent }
                              })}
                              <span style={{color: colors.text}}>{found.value}</span>
                            </Box>
                          );
                        }
                        return <span style={{color: colors.textSecondary}}>اختر أيقونة</span>;
                      }}
                    >
                      <MenuItem value="">
                        <span style={{color: colors.textSecondary}}>اختر أيقونة</span>
                      </MenuItem>
                      {ICON_OPTIONS.map(opt => (
                        <MenuItem 
                          key={opt.value} 
                          value={opt.value} 
                          sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            p: 1.5,
                            borderRadius: 1,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: colors.accent + '20',
                              transform: 'translateX(4px)'
                            },
                            '&.Mui-selected': {
                              backgroundColor: colors.accent + '30',
                              color: colors.accent,
                              fontWeight: 'bold'
                            }
                          }}
                        >
                          {React.cloneElement(opt.icon, { 
                            fontSize: 'medium',
                            sx: { 
                              color: 'inherit',
                              transition: 'all 0.2s ease'
                            }
                          })}
                          <span>{opt.value}</span>
                        </MenuItem>
                      ))}
                    </Select>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      <Button 
                        variant="outlined" 
                        color="error" 
                        size="small" 
                        onClick={() => handleRemoveDetail(idx)}
                        sx={{ borderRadius: 2 }}
                      >
                        حذف الفعالية
                      </Button>
                    </Box>
                  </Box>
                ))}
                
                <Button 
                  variant="outlined" 
                  onClick={handleAddDetail} 
                  sx={{ 
                    color: colors.accent, 
                    borderColor: colors.accent,
                    borderRadius: 2,
                    mt: 1
                  }}
                >
                  إضافة تفصيل جديد
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ 
            bgcolor: colors.detailBg, 
            borderTop: `1px solid ${colors.divider}`,
            p: 3,
            gap: 2
          }}>
            <Button
              onClick={handleCloseForm} 
              sx={{ 
                color: colors.textSecondary,
                borderRadius: 2,
                px: 3
              }}
            >
              إلغاء
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              sx={{
                background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.btn} 100%)`,
                borderRadius: 2,
                px: 4,
                py: 1,
                fontWeight: 'bold',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                }
              }}
            >
              {isAddingSite ? 'جاري الحفظ...' : (editMode ? 'تحديث' : 'إضافة')}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={deleteDialog} 
          onClose={() => setDeleteDialog(false)}
          PaperProps={{
            sx: {
              background: colors.paper,
              color: colors.text,
              borderRadius: 3,
              border: `1px solid ${colors.border}`
            }
          }}
        >
          <DialogTitle sx={{ 
            color: colors.text,
            fontWeight: 'bold',
            borderBottom: `1px solid ${colors.divider}`
          }}>
            تأكيد الحذف
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Typography sx={{ color: colors.text }}>
              هل أنت متأكد أنك تريد حذف هذا الموقع؟ لا يمكن التراجع عن هذا الإجراء.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button 
              onClick={() => setDeleteDialog(false)}
              sx={{ 
                color: colors.textSecondary,
                borderRadius: 2
              }}
            >
              إلغاء
            </Button>
            <Button 
              onClick={handleDelete} 
              color="error" 
              variant="contained"
              sx={{ borderRadius: 2, px: 3 }}
            >
              حذف
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog 
          open={detailsDialog} 
          onClose={() => setDetailsDialog(false)} 
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              background: colors.paper,
              color: colors.text,
              borderRadius: 3,
              border: `1px solid ${colors.border}`
            }
          }}
        >
          <DialogTitle sx={{ 
            color: colors.text,
            fontWeight: 'bold',
            borderBottom: `1px solid ${colors.divider}`,
            background: colors.detailBg
          }}>
            تفاصيل الموقع
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            {selectedSite && selectedSite.details && selectedSite.details.length > 0 ? (
              <Box>
                <Box sx={{ display: 'flex', gap: 1, mb: 3, justifyContent: 'center' }}>
                  {selectedSite.details.map((d, idx) => (
                    <Button
                      key={idx}
                      variant={currentDetailIndex === idx ? 'contained' : 'outlined'}
                      color={currentDetailIndex === idx ? 'success' : 'inherit'}
                      onClick={() => setCurrentDetailIndex(idx)}
                      sx={{
                        fontWeight: currentDetailIndex === idx ? 'bold' : 'normal',
                        borderRadius: 2,
                        minWidth: 80,
                        px: 2,
                        py: 0.5,
                        fontSize: '1rem',
                        background: currentDetailIndex === idx ? 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)' : undefined,
                        color: currentDetailIndex === idx ? '#fff' : undefined
                      }}
                    >
                      {d.title}
                    </Button>
                  ))}
                </Box>
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>{selectedSite.details[currentDetailIndex].title}</Typography>
                  <Typography sx={{ mb: 2 }}>{selectedSite.details[currentDetailIndex].description}</Typography>
                  {selectedSite.details[currentDetailIndex].images && selectedSite.details[currentDetailIndex].images.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                      {selectedSite.details[currentDetailIndex].images.map((img, i) => (
                        <img
                          key={i}
                          src={typeof img === 'string' ? img : img.url}
                          alt={selectedSite.details[currentDetailIndex].title + '-' + i}
                          style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }}
                          loading="lazy"
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>
            ) : (
              <Typography sx={{ color: colors.text, textAlign: 'center', p: 4, fontFamily: panelFont, fontSize: '1.1rem' }}>
                لا توجد تفاصيل إضافية متاحة لهذا الموقع.
              </Typography>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: `1px solid ${colors.divider}` }}>
            <Button
              onClick={() => setDetailsDialog(false)}
              variant="contained"
              sx={{
                background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.btn} 100%)`,
                borderRadius: 2,
                px: 4
              }}
            >
              إغلاق
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000} 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            severity={snackbar.type}
            sx={{ 
              width: '100%',
              borderRadius: 3,
              fontWeight: 'bold'
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}