'use client'

import React from 'react'
import { Box, Typography, Card, CardContent, Avatar, Chip, Button, useTheme, alpha } from '@mui/material'
import { Person, Email, Phone, LocalHospital, Edit, Security, Notifications } from '@mui/icons-material'

export default function DoctorProfilePage() {
  const theme = useTheme()

  const doctorProfile = {
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@hospital.com',
    phone: '+1 (555) 123-4567',
    specialization: 'Cardiology',
    licenseNumber: 'MD123456789',
    hospitalAffiliation: 'St. Mary\'s Medical Center',
    bio: 'Board-certified cardiologist with over 15 years of experience in interventional cardiology and heart disease prevention.'
  }

  return (
    <Box>
      {/* Header */}
      <Card
        sx={{
          mb: 4,
          background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
          color: 'white',
          borderRadius: 4
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                backgroundColor: alpha('#fff', 0.2),
                fontSize: '2rem'
              }}
            >
              <Person sx={{ fontSize: '2.5rem' }} />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                👨‍⚕️ Doctor Profile
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Manage your professional information and preferences.
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
        {/* Profile Information */}
        <Box sx={{ flex: 2 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Person sx={{ color: theme.palette.primary.main }} />
                  <Typography variant="h6" fontWeight="bold">
                    Professional Information
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  size="small"
                >
                  Edit Profile
                </Button>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Full Name
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {doctorProfile.name}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Email Address
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Email sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body1" fontWeight="500">
                        {doctorProfile.email}
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Phone Number
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Phone sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body1" fontWeight="500">
                        {doctorProfile.phone}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Specialization
                    </Typography>
                    <Chip
                      label={doctorProfile.specialization}
                      color="primary"
                      sx={{ fontWeight: 500 }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Medical License
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {doctorProfile.licenseNumber}
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Hospital Affiliation
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocalHospital sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body1" fontWeight="500">
                      {doctorProfile.hospitalAffiliation}
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Professional Bio
                  </Typography>
                  <Typography variant="body1">
                    {doctorProfile.bio}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Profile Summary & Quick Actions */}
        <Box sx={{ flex: 1 }}>
          {/* Profile Summary */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', mb: 3 }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  mx: 'auto',
                  mb: 2,
                  backgroundColor: theme.palette.primary.main,
                  fontSize: '2.5rem'
                }}
              >
                {doctorProfile.name.split(' ').map(n => n[0]).join('')}
              </Avatar>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                {doctorProfile.name}
              </Typography>
              <Chip
                label={doctorProfile.specialization}
                color="primary"
                sx={{ mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {doctorProfile.hospitalAffiliation}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                License: {doctorProfile.licenseNumber}
              </Typography>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Security />}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Change Password
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Notifications />}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Notification Settings
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Edit />}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Edit Profile
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`
            }}
          >
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Account Status
              </Typography>
              <Chip
                label="Verified Doctor"
                color="success"
                sx={{ mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                Your medical credentials have been verified and your account is in good standing.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  )
}
