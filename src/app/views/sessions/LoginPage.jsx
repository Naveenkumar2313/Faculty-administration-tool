import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, mockUsers } from '../../contexts/AuthContext';
import { 
  Box, Card, Grid, Button, Typography, TextField, 
  Alert, Divider 
} from '@mui/material';
import { LockOpen } from '@mui/icons-material';
import useSettings from '../../hooks/useSettings';

const LoginPage = () => {
  const { login } = useAuth();
  const { updateSettings } = useSettings();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuthSuccess = (role) => {
    // 1. Update Global Layout Settings based on Role
    updateSettings({ role: role });

    // 2. Redirect based on Role
    if (role === 'admin') navigate('/admin/dashboard');
    else navigate('/dashboard/default');
  };

  const handleQuickLogin = (role) => {
    const user = mockUsers.find(u => u.role === role);
    if (user) {
      login(user.email, role);
      handleAuthSuccess(role);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      // Find user matching email (Simple check)
      const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (user && password === "123456") { // Hardcoded password for demo
        login(user.email, user.role);
        handleAuthSuccess(user.role);
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#1A2038' }}>
      <Card sx={{ maxWidth: 450, width: '100%', p: 4, borderRadius: 2 }}>
        <Box display="flex" justifyContent="center" mb={3}>
          <Box sx={{ p: 2, bgcolor: 'primary.light', borderRadius: '50%', color: 'white' }}>
            <LockOpen fontSize="large" />
          </Box>
        </Box>
        
        <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
          Sign in to Portal
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary" mb={4}>
          Faculty & Adminstration Tool
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth label="Email Address" variant="outlined" margin="normal"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth label="Password" type="password" variant="outlined" margin="normal"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          <Button 
            fullWidth variant="contained" size="large" type="submit" 
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </form>

        <Divider sx={{ my: 3 }}>OR CONTINUE WITH</Divider>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button 
              fullWidth variant="outlined" color="primary"
              onClick={() => handleQuickLogin('admin')}
            >
              Admin
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button 
              fullWidth variant="outlined" color="secondary"
              onClick={() => handleQuickLogin('faculty')}
            >
              Faculty
            </Button>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default LoginPage;