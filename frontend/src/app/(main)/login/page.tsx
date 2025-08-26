'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  InputAdornment,
  IconButton,
  Link,
  Divider,
  Checkbox,
  FormControlLabel,
  Grid2 as Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  SecurityShield,
  VerifiedUser,
  Assessment,
  TrendingUp,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store session token
        localStorage.setItem('sessionToken', data.sessionToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }

        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <SecurityShield sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Secure Platform',
      description: 'Advanced security measures to protect your sensitive claim data'
    },
    {
      icon: <VerifiedUser sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'Automated Validation',
      description: 'AI-powered claim validation with 99.7% accuracy rate'
    },
    {
      icon: <Assessment sx={{ fontSize: 40, color: 'info.main' }} />,
      title: 'Real-time Analytics',
      description: 'Comprehensive dashboards with detailed claim insights'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: 'Performance Tracking',
      description: 'Monitor processing times and validation success rates'
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4, minHeight: '100vh' }}>
      <Grid container spacing={4} sx={{ minHeight: '90vh' }}>
        {/* Left Side - Login Form */}
        <Grid size={{ xs: 12, lg: 6 }} sx={{ display: 'flex', alignItems: 'center' }}>
          <Paper 
            elevation={12} 
            sx={{ 
              p: 6, 
              borderRadius: 4, 
              width: '100%', 
              maxWidth: 500,
              mx: 'auto',
              background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
            }}
          >
            {/* Header */}
            <Box textAlign="center" mb={4}>
              <SecurityShield sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" color="primary.main">
                Welcome Back
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Insurance Claim Validation System
              </Typography>
            </Box>

            {/* Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="primary" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                margin="normal"
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange('password')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                margin="normal"
                sx={{ mb: 3 }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Remember me"
                />
                <Link href="#" underline="hover" color="primary.main" fontWeight="medium">
                  Forgot password?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ 
                  py: 1.5, 
                  mb: 3,
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #0A74DA 30%, #5AA9F9 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #004A99 30%, #0A74DA 90%)',
                  }
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>

              <Box textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Link
                    href="/register"
                    underline="hover"
                    sx={{ 
                      color: 'primary.main', 
                      fontWeight: 'bold',
                      '&:hover': { color: 'primary.dark' }
                    }}
                  >
                    Create one here
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Right Side - Features & Info */}
        <Grid size={{ xs: 12, lg: 6 }} sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: '100%', pl: { lg: 4 } }}>
            {/* Hero Section */}
            <Box textAlign="center" mb={6}>
              <Typography variant="h2" component="h2" gutterBottom fontWeight="bold" color="primary.main">
                Advanced Claim Validation
              </Typography>
              <Typography variant="h5" color="text.secondary" mb={4}>
                Streamline your insurance operations with AI-powered validation technology
              </Typography>
            </Box>

            {/* Features Grid */}
            <Grid container spacing={3}>
              {features.map((feature, index) => (
                <Grid size={6} key={index}>
                  <Card 
                    elevation={3} 
                    sx={{ 
                      height: '100%',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 6
                      }
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Box mb={2}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" gutterBottom fontWeight="bold">
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Stats Section */}
            <Box 
              sx={{ 
                mt: 6, 
                p: 4, 
                background: 'linear-gradient(135deg, #0A74DA 0%, #6C2DC7 100%)',
                borderRadius: 3,
                color: 'white'
              }}
            >
              <Grid container spacing={4} textAlign="center">
                <Grid size={4}>
                  <Typography variant="h3" fontWeight="bold">99.7%</Typography>
                  <Typography variant="body2" opacity={0.9}>Accuracy Rate</Typography>
                </Grid>
                <Grid size={4}>
                  <Typography variant="h3" fontWeight="bold">2.3s</Typography>
                  <Typography variant="body2" opacity={0.9}>Avg Processing</Typography>
                </Grid>
                <Grid size={4}>
                  <Typography variant="h3" fontWeight="bold">500K+</Typography>
                  <Typography variant="body2" opacity={0.9}>Claims Processed</Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
