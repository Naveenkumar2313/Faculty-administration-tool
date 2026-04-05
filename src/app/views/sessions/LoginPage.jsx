import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, Grid, Button, Typography, TextField,
  Alert, Divider, Chip, Stack
} from '@mui/material';
import { LockOpen, AccountCircle } from '@mui/icons-material';

import { useAuth, ROLE_CONFIG, mockUsers } from '../../contexts/AuthContext';
import useSettings from '../../hooks/useSettings';

// ─── ROLE QUICK-LOGIN BUTTONS CONFIG ─────────────────────────────────────────
const ROLE_BUTTONS = [
  { role: 'superAdmin', label: 'Super Admin' },
  { role: 'faculty', label: 'Faculty' },
  { role: 'hostelAdmin', label: 'Hostel Admin' },
  { role: 'transportAdmin', label: 'Transport Admin' },
  { role: 'driver', label: 'Driver' },
  { role: 'student', label: 'Student' },
  { role: 'maintenance', label: 'Maintenance' }
];

const LoginPage = () => {
  const { login, quickLogin } = useAuth();
  const { updateSettings } = useSettings();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // After a successful login, sync the role into SettingsContext and navigate
  const handleAuthSuccess = (loggedInUser) => {
    // Keep SettingsContext role in sync (used by legacy Sidenav.jsx if still mounted)
    updateSettings({ role: loggedInUser.role });
    navigate(loggedInUser.redirectPath || '/dashboard/default');
  };

  // Email + password form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const loggedInUser = login(email.trim(), password);
      handleAuthSuccess(loggedInUser);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // One-click role button
  const handleQuickLogin = (role) => {
    setError('');
    try {
      const loggedInUser = quickLogin(role);
      handleAuthSuccess(loggedInUser);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1A2038 0%, #222A45 100%)',
        p: 2
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: '100%',
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          boxShadow: '0 24px 64px rgba(0,0,0,0.4)'
        }}
      >
        {/* Header */}
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <Box
            sx={{
              p: 1.5,
              bgcolor: 'primary.main',
              borderRadius: '50%',
              mb: 1.5,
              display: 'flex'
            }}
          >
            <LockOpen sx={{ fontSize: 32, color: '#fff' }} />
          </Box>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            CampusOne ERP
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Unified Faculty Administration & Campus Infrastructure Portal
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Email / Password form */}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            margin="normal"
            size="small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. faculty@parc.edu"
            autoComplete="email"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            size="small"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="123456"
            autoComplete="current-password"
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            type="submit"
            disabled={loading}
            sx={{ mt: 1, mb: 1, py: 1.4, fontWeight: 700 }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        <Divider sx={{ my: 2.5 }}>
          <Typography variant="caption" color="text.secondary">
            OR QUICK LOGIN AS
          </Typography>
        </Divider>

        {/* 7 role quick-login buttons */}
        <Grid container spacing={1}>
          {ROLE_BUTTONS.map(({ role, label, icon, hint }) => {
            const cfg = ROLE_CONFIG[role];
            return (
              <Grid item xs={6} key={role}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  onClick={() => handleQuickLogin(role)}
                  sx={{
                    borderColor: cfg.color,
                    color: cfg.color,
                    py: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.3,
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: `${cfg.color}14`,
                      borderColor: cfg.color
                    }
                  }}
                >
                  <span style={{ fontSize: 18, lineHeight: 1 }}>{icon}</span>
                  <Typography variant="caption" fontWeight={700} lineHeight={1.2}>
                    {label}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ fontSize: '9px', opacity: 0.65, lineHeight: 1 }}
                  >
                    {hint}
                  </Typography>
                </Button>
              </Grid>
            );
          })}
        </Grid>

        {/* Footer note */}
        <Box mt={3} p={1.5} bgcolor="action.hover" borderRadius={2}>
          <Typography variant="caption" color="text.secondary" display="block" textAlign="center">
            <strong>7 roles</strong> · Super Admin · Faculty · Hostel Admin · Transport Admin ·
            Driver · Student · Maintenance Staff
          </Typography>
        </Box>
      </Card>
    </Box >
  );
};

export default LoginPage;
