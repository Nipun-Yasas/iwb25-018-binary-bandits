'use client'

import React from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Grid,
  useTheme,
  alpha
} from '@mui/material'
import {
  Add,
  Schedule,
  CheckCircle,
  Cancel,
  Visibility,
  AccessTime,
  HelpOutline,
  Phone,
  Email,
  Assignment,
  TrendingUp,
  Person
} from '@mui/icons-material'
import Link from 'next/link'

// Mock data
const statsData = [
  {
    title: 'Claims Submitted',
    value: '24',
    description: 'Total claims this month',
    icon: <Assignment />,
    color: '#1976d2',
    trend: '+12%'
  },
  {
    title: 'Approved Claims',
    value: '18',
    description: 'Successfully approved',
    icon: <CheckCircle />,
    color: '#2e7d32',
    trend: '+8%'
  },
  {
    title: 'Pending Review',
    value: '4',
    description: 'Under review',
    icon: <Schedule />,
    color: '#ed6c02',
    trend: '-2%'
  },
  {
    title: 'Rejected Claims',
    value: '2',
    description: 'Need attention',
    icon: <Cancel />,
    color: '#d32f2f',
    trend: '0%'
  }
]

const recentClaims = [
  {
    id: 'CLM001',
    patientName: 'John Doe',
    patientId: 'PAT001',
    type: 'Medical Consultation',
    date: '2024-01-15',
    status: 'approved',
    amount: 250.00
  },
  {
    id: 'CLM002',
    patientName: 'Jane Smith',
    patientId: 'PAT002',
    type: 'Surgery',
    date: '2024-01-20',
    status: 'in_review',
    amount: 5750.00
  },
  {
    id: 'CLM003',
    patientName: 'Robert Johnson',
    patientId: 'PAT003',
    type: 'Emergency Treatment',
    date: '2024-01-22',
    status: 'pending',
    amount: 1200.00
  },
  {
    id: 'CLM004',
    patientName: 'Emily Brown',
    patientId: 'PAT004',
    type: 'Diagnostic Tests',
    date: '2024-01-18',
    status: 'rejected',
    amount: 420.00
  }
]

const notifications = [
  {
    id: 1,
    type: 'success',
    title: 'Claim Approved',
    message: 'Your claim CLM-2024-001 has been approved for $1,250.00',
    time: '2 hours ago'
  },
  {
    id: 2,
    type: 'warning',
    title: 'Documentation Required',
    message: 'Additional documents needed for CLM-2024-005',
    time: '4 hours ago'
  },
  {
    id: 3,
    type: 'info',
    title: 'System Update',
    message: 'New features added to the claims portal',
    time: '1 day ago'
  }
]

const quickActions = [
  {
    title: 'Submit New Claim',
    description: 'File a new insurance claim',
    icon: <Add />,
    href: '/doctor/submit-claim',
    color: '#1976d2'
  },
  {
    title: 'View All Claims',
    description: 'See your complete claims history',
    icon: <Assignment />,
    href: '/doctor/my-claims',
    color: '#2e7d32'
  },
  {
    title: 'Get Help',
    description: 'Contact support or view guides',
    icon: <HelpOutline />,
    href: '/doctor/help',
    color: '#ed6c02'
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved': return 'success'
    case 'rejected': return 'error'
    case 'in_review': return 'warning'
    case 'pending': return 'default'
    default: return 'default'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'approved': return <CheckCircle />
    case 'rejected': return <Cancel />
    case 'in_review': return <AccessTime />
    case 'pending': return <Schedule />
    default: return <Schedule />
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

export default function DoctorDashboard() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: '1400px', 
      mx: 'auto', 
      p: { xs: 2, md: 3 }
    }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          fontWeight="bold" 
          sx={{ 
            mb: 1,
            background: isDark 
              ? 'linear-gradient(45deg, #90caf9 30%, #81c784 90%)'
              : 'linear-gradient(45deg, #1976d2 30%, #2e7d32 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}
        >
          Welcome back, Dr. Johnson! 👋
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Here's your claims overview for today. You have 4 pending claims that need attention.
        </Typography>
        
        {/* Quick Submit Button */}
        <Link href="/doctor/submit-claim" passHref>
          <Button
            variant="contained"
            size="large"
            startIcon={<Add />}
            sx={{
              background: 'linear-gradient(45deg, #ff6b6b 30%, #4ecdc4 90%)',
              color: 'white',
              fontWeight: 'bold',
              py: 1.5,
              px: 4,
              borderRadius: 2,
              boxShadow: 3,
              '&:hover': {
                background: 'linear-gradient(45deg, #ff5252 30%, #26c6da 90%)',
                transform: 'translateY(-2px)',
                boxShadow: 6,
              },
              transition: 'all 0.3s ease',
            }}
          >
            Submit New Claim
          </Button>
        </Link>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsData.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                background: isDark 
                  ? alpha(theme.palette.grey[800], 0.9)
                      : alpha(theme.palette.primary.main, 0.05),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(stat.color, 0.2)}`,
                borderRadius: 3,
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      backgroundColor: alpha(stat.color, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: stat.color,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <TrendingUp sx={{ fontSize: 16, color: stat.trend.startsWith('+') ? 'success.main' : 'error.main' }} />
                    <Typography variant="caption" color={stat.trend.startsWith('+') ? 'success.main' : 'error.main'}>
                      {stat.trend}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="h3" fontWeight="bold" color={stat.color} sx={{ mb: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="h6" fontWeight="600" sx={{ mb: 0.5 }}>
                  {stat.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Recent Claims Table */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ 
            borderRadius: 3,
            background: isDark 
              ? alpha(theme.palette.grey[800], 0.9)
                      : alpha(theme.palette.primary.main, 0.05),
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  📋 Recent Claims
                </Typography>
                <Link href="/doctor/my-claims" passHref>
                  <Button variant="outlined" size="small">
                    View All
                  </Button>
                </Link>
              </Box>
              
              <TableContainer sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ 
                      backgroundColor: alpha(theme.palette.primary.main, 0.05)
                    }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Claim ID</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Patient</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', display: { xs: 'none', sm: 'table-cell' } }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', display: { xs: 'none', md: 'table-cell' } }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentClaims.map((claim) => (
                      <TableRow
                        key={claim.id}
                        sx={{
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.02)
                          }
                        }}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight="500">
                            {claim.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ 
                              width: 32, 
                              height: 32, 
                              backgroundColor: theme.palette.primary.main,
                              fontSize: '0.875rem'
                            }}>
                              <Person />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="500">
                                {claim.patientName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {claim.patientId}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                          <Typography variant="body2">
                            {claim.type}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="500">
                            {formatCurrency(claim.amount)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={claim.status === 'in_review' ? 'In Review' : claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                            color={getStatusColor(claim.status) as 'success' | 'error' | 'warning' | 'default'}
                            icon={getStatusIcon(claim.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(claim.date)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            size="small" 
                            sx={{ 
                              color: theme.palette.primary.main,
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.1)
                              }
                            }}
                          >
                            <Visibility />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Quick Actions */}
            <Card sx={{ 
              borderRadius: 3,
              background: isDark 
                ? alpha(theme.palette.grey[800], 0.9)
                      : alpha(theme.palette.primary.main, 0.05),
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  ⚡ Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {quickActions.map((action, index) => (
                    <Link href={action.href} key={index} passHref>
                      <Card 
                        sx={{ 
                          p: 2, 
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          border: `1px solid ${alpha(action.color, 0.2)}`,
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: 3,
                            backgroundColor: alpha(action.color, 0.05)
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ 
                            color: action.color,
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            {action.icon}
                          </Box>
                          <Box>
                            <Typography variant="body2" fontWeight="500">
                              {action.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {action.description}
                            </Typography>
                          </Box>
                        </Box>
                      </Card>
                    </Link>
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card sx={{ 
              borderRadius: 3,
              background: isDark 
                ? alpha(theme.palette.grey[800], 0.9)
                      : alpha(theme.palette.primary.main, 0.05),
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">
                    🔔 Notifications
                  </Typography>
                  <Link href="/doctor/notifications" passHref>
                    <Button variant="text" size="small">
                      View All
                    </Button>
                  </Link>
                </Box>
                <List sx={{ p: 0 }}>
                  {notifications.map((notification, index) => (
                    <React.Fragment key={notification.id}>
                      <ListItem sx={{ px: 0, py: 1.5 }}>
                        <ListItemIcon>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: notification.type === 'success' ? 'success.main' : 
                                             notification.type === 'warning' ? 'warning.main' : 'info.main',
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2" fontWeight="500">
                              {notification.title}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" sx={{ mb: 0.5 }}>
                                {notification.message}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {notification.time}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < notifications.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}