'use client';

import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Fade,
  Grow,
} from '@mui/material';
import { 
  Refresh, 
  TrendingUp as TrendingUpIcon,
  Assessment,
  DonutLarge,
  Timeline,
  BarChart as BarChartIcon,
  AttachMoney,
} from '@mui/icons-material';

// Import all dashboard components
import StatCards from './StatCards';
import { 
  ClaimStatusPieChart, 
  ProviderTypePieChart, 
  PatientGenderPieChart 
} from './PieCharts';
import { 
  MonthlyClaimsTrend, 
  MonthlyAmountsTrend, 
  UtilizationTrend 
} from './LineCharts';
import { 
  TopProvidersBarChart, 
  AgeGroupBarChart, 
  PolicyStatusBarChart 
} from './BarCharts';
import { useDashboardStats } from './useDashboardStats';

const DashboardContent: React.FC = () => {
  const { data: stats, loading, error, refetch } = useDashboardStats();

  if (loading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        minHeight="400px"
        sx={{ p: 4 }}
      >
        <CircularProgress size={60} thickness={4} sx={{ mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Loading dashboard analytics...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="error" 
          sx={{
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(244, 67, 54, 0.15)',
          }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={refetch}
              sx={{ borderRadius: 2 }}
            >
              <Refresh sx={{ mr: 1 }} />
              Retry
            </Button>
          }
        >
          Error loading dashboard data: {error}
        </Alert>
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="info"
          sx={{
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(2, 136, 209, 0.15)',
          }}
        >
          No dashboard data available
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Fade in timeout={600}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box display="flex" alignItems="center">
            <Assessment sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
            <Box>
              <Typography 
                variant="h4" 
                component="h1" 
                fontWeight="bold"
                sx={{
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Analytics Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Real-time insights and performance metrics
              </Typography>
            </Box>
          </Box>
          <Button 
            variant="outlined" 
            startIcon={<Refresh />} 
            onClick={refetch}
            disabled={loading}
            sx={{
              borderRadius: 3,
              px: 3,
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white',
                boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
              }
            }}
          >
            Refresh Data
          </Button>
        </Box>
      </Fade>

      {/* Statistics Cards */}
      <Grow in timeout={800}>
        <Box mb={5}>
          <Box display="flex" alignItems="center" mb={3}>
            <TrendingUpIcon sx={{ color: 'success.main', mr: 1 }} />
            <Typography variant="h5" fontWeight="bold" color="text.primary">
              Key Performance Indicators
            </Typography>
          </Box>
          <StatCards
            data={{
              totalPatients: stats.overview.totalPatients,
              totalProviders: stats.overview.totalProviders,
              totalClaims: stats.overview.totalClaims,
              totalClaimAmount: stats.claims.totalClaimAmount,
              activePolicies: stats.policies.activePolicies,
              pendingClaims: stats.claims.pendingClaims,
            }}
          />
        </Box>
      </Grow>

      {/* Charts Grid */}
      <Grid container spacing={5}>
        {/* First Row - Pie Charts */}
        <Grid size={12}>
          <Fade in timeout={1000}>
            <Box display="flex" alignItems="center" mb={3}>
              <DonutLarge sx={{ color: 'primary.main', mr: 1, fontSize: 28 }} />
              <Typography variant="h5" fontWeight="bold" color="text.primary">
                Distribution Analysis
              </Typography>
            </Box>
          </Fade>
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <Grow in timeout={1000} style={{ transformOrigin: '0 0 0' }}>
            <Paper 
              elevation={0}
              sx={{ 
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
                }
              }}
            >
              <ClaimStatusPieChart data={stats.claims.statusBreakdown} />
            </Paper>
          </Grow>
        </Grid>
        
          
        <Grid size={{ xs: 12, md: 6 }}>
          <Grow in timeout={1200} style={{ transformOrigin: '0 0 0' }}>
            <Paper 
              elevation={0}
              sx={{ 
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
                }
              }}
            >
              <ProviderTypePieChart data={stats.providers.typeBreakdown} />
            </Paper>
          </Grow>
        </Grid>
        
        {/* <Grid size={{ xs: 12, md: 4 }}>
          <Grow in timeout={1400} style={{ transformOrigin: '0 0 0' }}>
            <Paper 
              elevation={0}
              sx={{ 
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
                }
              }}
            >
              <PatientGenderPieChart data={stats.patients.genderBreakdown} />
            </Paper>
          </Grow>
        </Grid> */}

        {/* Second Row - Line Charts */}
        <Grid size={12}>
          <Fade in timeout={1600}>
            <Box display="flex" alignItems="center" mb={3} mt={6}>
              <Timeline sx={{ color: 'info.main', mr: 1, fontSize: 28 }} />
              <Typography variant="h5" fontWeight="bold" color="text.primary">
                Trend Analysis
              </Typography>
            </Box>
          </Fade>
        </Grid>
        
        {/* Monthly Claims Trend - Full Row */}
        <Grid size={20}>
          <Grow in timeout={1800} style={{ transformOrigin: '0 0 0' }}>
            <Paper 
              elevation={0}
              sx={{ 
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                minHeight: '400px',
                
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
                }
              }}
            >
              <MonthlyClaimsTrend data={stats.claims.monthlyTrends} />
            </Paper>
          </Grow>
        </Grid>
        
        {/* Monthly Amounts Trend - Full Row */}
        <Grid size={12}>
          <Grow in timeout={2000} style={{ transformOrigin: '0 0 0' }}>
            <Paper 
              elevation={0}
              sx={{ 
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                minHeight: '400px',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
                }
              }}
            >
              <MonthlyAmountsTrend data={stats.claims.monthlyTrends} />
            </Paper>
          </Grow>
        </Grid>
        
        {/* Utilization Trend - Full Row */}
        <Grid size={12}>
          <Grow in timeout={2200} style={{ transformOrigin: '0 0 0' }}>
            <Paper 
              elevation={0}
              sx={{ 
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                minHeight: '400px',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
                }
              }}
            >
              <UtilizationTrend data={stats.financial.monthlyTrends} />
            </Paper>
          </Grow>
        </Grid>

        {/* Third Row - Bar Charts */}
        <Grid size={12}>
          <Fade in timeout={2400}>
            <Box display="flex" alignItems="center" mb={3} mt={6}>
              <BarChartIcon sx={{ color: 'warning.main', mr: 1, fontSize: 28 }} />
              <Typography variant="h5" fontWeight="bold" color="text.primary">
                Performance Analysis
              </Typography>
            </Box>
          </Fade>
        </Grid>
        
        {/* Top Providers Bar Chart - Full Row */}
        <Grid size={12}>
          <Grow in timeout={2600} style={{ transformOrigin: '0 0 0' }}>
            <Paper 
              elevation={0}
              sx={{ 
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                minHeight: '450px',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
                }
              }}
            >
              <TopProvidersBarChart data={stats.providers.topProviders} />
            </Paper>
          </Grow>
        </Grid>
        
        {/* Age Group and Policy Status - Half Rows */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Grow in timeout={2800} style={{ transformOrigin: '0 0 0' }}>
            <Paper 
              elevation={0}
              sx={{ 
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                minHeight: '400px',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
                }
              }}
            >
              <AgeGroupBarChart data={stats.patients.ageBreakdown} />
            </Paper>
          </Grow>
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <Grow in timeout={3000} style={{ transformOrigin: '0 0 0' }}>
            <Paper 
              elevation={0}
              sx={{ 
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                minHeight: '400px',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
                }
              }}
            >
              <PolicyStatusBarChart data={stats.policies.statusBreakdown} />
            </Paper>
          </Grow>
        </Grid>

        {/* Financial Summary */}
        <Grid size={12}>
          <Fade in timeout={3200}>
            <Box display="flex" alignItems="center" mb={3} mt={6}>
              <AttachMoney sx={{ color: 'success.main', mr: 1, fontSize: 28 }} />
              <Typography variant="h5" fontWeight="bold" color="text.primary">
                Financial Overview
              </Typography>
            </Box>
          </Fade>
        </Grid>
        
        <Grid size={12}>
          <Grow in timeout={3400}>
            <Paper 
              elevation={0}
              sx={{ 
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(66, 165, 245, 0.05) 100%)',
                border: '1px solid rgba(25, 118, 210, 0.1)',
                boxShadow: '0 8px 32px rgba(25, 118, 210, 0.1)',
                overflow: 'hidden',
              }}
            >
              <Box sx={{ p: 4 }}>
                <Grid container spacing={4}>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Box 
                      textAlign="center" 
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(66, 165, 245, 0.1) 100%)',
                        border: '1px solid rgba(25, 118, 210, 0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(25, 118, 210, 0.15)',
                        }
                      }}
                    >
                      <Typography variant="h3" color="primary" fontWeight="bold" sx={{ mb: 1 }}>
                        ${(stats.financial.totalClaimAmount / 1000).toFixed(1)}K
                      </Typography>
                      <Typography variant="body1" color="text.secondary" fontWeight="medium">
                        Total Claims Amount
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Box 
                      textAlign="center" 
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.1) 0%, rgba(102, 187, 106, 0.1) 100%)',
                        border: '1px solid rgba(46, 125, 50, 0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(46, 125, 50, 0.15)',
                        }
                      }}
                    >
                      <Typography variant="h3" color="success.main" fontWeight="bold" sx={{ mb: 1 }}>
                        ${(stats.financial.totalCoverageAmount / 1000000).toFixed(1)}M
                      </Typography>
                      <Typography variant="body1" color="text.secondary" fontWeight="medium">
                        Total Coverage Amount
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Box 
                      textAlign="center" 
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, rgba(237, 108, 2, 0.1) 0%, rgba(255, 152, 0, 0.1) 100%)',
                        border: '1px solid rgba(237, 108, 2, 0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(237, 108, 2, 0.15)',
                        }
                      }}
                    >
                      <Typography variant="h3" color="warning.main" fontWeight="bold" sx={{ mb: 1 }}>
                        {stats.financial.claimUtilizationRate.toFixed(1)}%
                      </Typography>
                      <Typography variant="body1" color="text.secondary" fontWeight="medium">
                        Utilization Rate
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Box 
                      textAlign="center" 
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, rgba(2, 136, 209, 0.1) 0%, rgba(3, 169, 244, 0.1) 100%)',
                        border: '1px solid rgba(2, 136, 209, 0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(2, 136, 209, 0.15)',
                        }
                      }}
                    >
                      <Typography variant="h3" color="info.main" fontWeight="bold" sx={{ mb: 1 }}>
                        ${stats.financial.avgClaimAmount.toFixed(0)}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" fontWeight="medium">
                        Average Claim Amount
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grow>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardContent;
