import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Card,
  CardContent,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { useSystemAdmin } from '../contexts/SystemAdminContext';
import { useAuth } from '../contexts/AuthContext';

export default function SystemAdminDashboard() {
  const { 
    admins, 
    loading, 
    error, 
    createAdminInvitation, 
    updateAdminStatus, 
    deleteAdmin,
    fetchSystemLogs,
    fetchAdmins
  } = useSystemAdmin();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [openInviteDialog, setOpenInviteDialog] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('');
  const [newAdminPermissions, setNewAdminPermissions] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 2) { 
      loadSystemLogs();
    }
  }, [activeTab]);

  const loadSystemLogs = async () => {
    setLogsLoading(true);
    try {
      const logs = await fetchSystemLogs();
      setSystemLogs(logs);
    } catch (error) {
      console.error('Error loading system logs:', error);
    } finally {
      setLogsLoading(false);
    }
  };

  const handleInviteAdmin = async () => {
    try {
      await createAdminInvitation(newAdminEmail, newAdminRole, newAdminPermissions);
      setOpenInviteDialog(false);
      setNewAdminEmail('');
      setNewAdminRole('');
      setNewAdminPermissions([]);
      await fetchAdmins();
    } catch (error) {
      console.error('Error inviting admin:', error);
    }
  };

  const handleStatusChange = async (adminId, newStatus) => {
    try {
      await updateAdminStatus(adminId, newStatus);
    } catch (error) {
      console.error('Error updating admin status:', error);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الأدمن؟')) {
      try {
        await deleteAdmin(adminId);
      } catch (error) {
        console.error('Error deleting admin:', error);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, color: '#1a1a2e' }}>
        لوحة تحكم System Admin
      </Typography>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="الأدمنز" />
          <Tab label="الدعوات" />
          <Tab label="سجلات النظام" />
        </Tabs>

        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">قائمة الأدمنز</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenInviteDialog(true)}
              >
                دعوة أدمن جديد
              </Button>
            </Box>

            <Grid container spacing={3}>
              {admins.map((admin) => (
                <Grid item xs={12} md={6} lg={4} key={admin.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{admin.email}</Typography>
                      <Typography color="textSecondary" gutterBottom>
                        {admin.role}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        {admin.permissions?.map((permission) => (
                          <Chip
                            key={permission}
                            label={permission}
                            size="small"
                            sx={{ mr: 1, mb: 1 }}
                          />
                        ))}
                      </Box>
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <IconButton
                          onClick={() => handleStatusChange(admin.id, admin.status === 'active' ? 'suspended' : 'active')}
                          color={admin.status === 'active' ? 'error' : 'success'}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteAdmin(admin.id)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              دعوات الأدمنز المعلقة
            </Typography>
          </Box>
        )}

        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">سجلات النظام</Typography>
              <Button
                startIcon={<RefreshIcon />}
                onClick={loadSystemLogs}
                disabled={logsLoading}
              >
                تحديث
              </Button>
            </Box>

            {logsLoading ? (
              <CircularProgress />
            ) : (
              <Grid container spacing={2}>
                {systemLogs.map((log) => (
                  <Grid item xs={12} key={log.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="body2" color="textSecondary">
                          {new Date(log.timestamp?.toDate()).toLocaleString()}
                        </Typography>
                        <Typography variant="body1">{log.message}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          بواسطة: {log.user}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}
      </Paper>

      <Dialog open={openInviteDialog} onClose={() => setOpenInviteDialog(false)}>
        <DialogTitle>دعوة أدمن جديد</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="البريد الإلكتروني"
            type="email"
            fullWidth
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>الدور</InputLabel>
            <Select
              value={newAdminRole}
              onChange={(e) => setNewAdminRole(e.target.value)}
              label="الدور"
            >
              <MenuItem value="admin">أدمن</MenuItem>
              <MenuItem value="super_admin">سوبر أدمن</MenuItem>
              <MenuItem value="content_manager">مدير المحتوى</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>الصلاحيات</InputLabel>
            <Select
              multiple
              value={newAdminPermissions}
              onChange={(e) => setNewAdminPermissions(e.target.value)}
              label="الصلاحيات"
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              <MenuItem value="manage_users">إدارة المستخدمين</MenuItem>
              <MenuItem value="manage_content">إدارة المحتوى</MenuItem>
              <MenuItem value="manage_settings">إدارة الإعدادات</MenuItem>
              <MenuItem value="view_reports">عرض التقارير</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInviteDialog(false)}>إلغاء</Button>
          <Button onClick={handleInviteAdmin} variant="contained">
            إرسال الدعوة
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 