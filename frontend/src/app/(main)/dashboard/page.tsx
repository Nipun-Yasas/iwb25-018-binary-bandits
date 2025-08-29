'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import {
  Assessment,
  VerifiedUser,
  TrendingUp,
  Security,
} from '@mui/icons-material';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const stats = [
    {
      title: 'Claims Processed',
      value: '1,247',
      icon: <Assessment sx={{ fontSize: 40, color: 'primary.main' }} />,
      change: '+12%'
    },
    {
      title: 'Validation Rate',
      value: '98.5%',
      icon: <VerifiedUser sx={{ fontSize: 40, color: 'success.main' }} />,
      change: '+2.1%'
    },
    {
      title: 'Processing Speed',
      value: '2.3s',
      icon: <TrendingUp sx={{ fontSize: 40, color: 'info.main' }} />,
      change: '-0.5s'
    },
    {
      title: 'Security Score',
      value: '99.9%',
      icon: <Security sx={{ fontSize: 40, color: 'warning.main' }} />,
      change: 'Excellent'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
        <Typography variant="h3" gutterBottom fontWeight="bold" color="primary.main">
          Welcome to Insurance Claim Validation System
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {user ? `Hello, ${user.fullName || user.username}!` : 'Dashboard Overview'}
        </Typography>
      </Paper>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid size={3} key={index}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box mb={2}>
                  {stat.icon}
                </Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {stat.value}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {stat.title}
                </Typography>
                <Typography variant="body2" color="success.main" fontWeight="medium">
                  {stat.change}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Quick Actions
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid size={3}>
            <Button variant="contained" fullWidth size="large">
              New Claim
            </Button>
          </Grid>
          <Grid size={3}>
            <Button variant="outlined" fullWidth size="large">
              View Reports
            </Button>
          </Grid>
          <Grid size={3}>
            <Button variant="outlined" fullWidth size="large">
              Settings
            </Button>
          </Grid>
          <Grid size={3}>
            <Button 
              variant="outlined" 
              fullWidth 
              size="large"
              onClick={() => {
                localStorage.removeItem('sessionToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
              }}
            >
              Logout
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}