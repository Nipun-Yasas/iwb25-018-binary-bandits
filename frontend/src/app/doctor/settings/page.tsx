'use client'

import React, { useState } from 'react'
import { Box, Typography, Card, CardContent, Switch, Button, Divider, List, ListItem, useTheme, alpha } from '@mui/material'
import { Notifications, Security, Palette, Download, ArrowForward } from '@mui/icons-material'

interface SettingsSection {
  title: string
  icon: React.ReactNode
  settings: Setting[]
}

interface Setting {
  name: string
  description: string
  type: 'toggle' | 'button' | 'info'
  value?: boolean
  action?: () => void
}

export default function SettingsPage() {
  const theme = useTheme()
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    fraudAlerts: true,
    claimUpdates: true,
    systemMaintenance: false,
    darkMode: false,
    soundEnabled: true,
    autoLogout: true,
    twoFactorAuth: false,
    downloadData: false,
    deleteAccount: false
  })

  const handleToggle = (settingKey: string) => {
    setSettings(prev => ({
      ...prev,
      [settingKey]: !prev[settingKey as keyof typeof prev]
    }))
  }

  const settingsSections: SettingsSection[] = [
    {
      title: 'Notifications',
      icon: <Notifications />,
      settings: [
        {
          name: 'Email Notifications',
          description: 'Receive notifications via email',
          type: 'toggle',
          value: settings.emailNotifications
        },
        {
          name: 'Push Notifications',
          description: 'Browser push notifications',
          type: 'toggle',
          value: settings.pushNotifications
        },
        {
          name: 'SMS Notifications',
          description: 'Text message alerts for urgent matters',
          type: 'toggle',
          value: settings.smsNotifications
        },
        {
          name: 'Fraud Alerts',
          description: 'Immediate alerts for suspicious activity',
          type: 'toggle',
          value: settings.fraudAlerts
        },
        {
          name: 'Claim Updates',
          description: 'Status changes on your claims',
          type: 'toggle',
          value: settings.claimUpdates
        },
        {
          name: 'System Maintenance',
          description: 'Scheduled maintenance notifications',
          type: 'toggle',
          value: settings.systemMaintenance
        }
      ]
    },
    {
      title: 'Appearance',
      icon: <Palette />,
      settings: [
        {
          name: 'Dark Mode',
          description: 'Use dark theme for better night viewing',
          type: 'toggle',
          value: settings.darkMode
        },
        {
          name: 'Sound Effects',
          description: 'Play sounds for notifications and actions',
          type: 'toggle',
          value: settings.soundEnabled
        }
      ]
    },
    {
      title: 'Security',
      icon: <Security />,
      settings: [
        {
          name: 'Two-Factor Authentication',
          description: 'Add extra security to your account',
          type: 'toggle',
          value: settings.twoFactorAuth
        },
        {
          name: 'Auto Logout',
          description: 'Automatically log out after 30 minutes of inactivity',
          type: 'toggle',
          value: settings.autoLogout
        },
        {
          name: 'Change Password',
          description: 'Update your account password',
          type: 'button',
          action: () => console.log('Change password')
        },
        {
          name: 'Login History',
          description: 'View recent login activity',
          type: 'button',
          action: () => console.log('View login history')
        }
      ]
    },
    {
      title: 'Privacy & Data',
      icon: <Download />,
      settings: [
        {
          name: 'Download My Data',
          description: 'Export all your personal data',
          type: 'button',
          action: () => console.log('Download data')
        },
        {
          name: 'Delete Account',
          description: 'Permanently delete your account and all data',
          type: 'button',
          action: () => console.log('Delete account')
        }
      ]
    }
  ]

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
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
            ⚙️ Settings
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Customize your account preferences and security settings.
          </Typography>
        </CardContent>
      </Card>

      {/* Settings Sections */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {settingsSections.map((section, sectionIndex) => (
          <Card key={sectionIndex} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main
                  }}
                >
                  {section.icon}
                </Box>
                <Typography variant="h6" fontWeight="bold">
                  {section.title}
                </Typography>
              </Box>

              <List sx={{ p: 0 }}>
                {section.settings.map((setting, settingIndex) => (
                  <React.Fragment key={settingIndex}>
                    <ListItem
                      sx={{
                        px: 0,
                        py: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" fontWeight="500" sx={{ mb: 0.5 }}>
                          {setting.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {setting.description}
                        </Typography>
                      </Box>

                      <Box sx={{ ml: 2 }}>
                        {setting.type === 'toggle' && (
                          <Switch
                            checked={setting.value || false}
                            onChange={() => handleToggle(setting.name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/gi, ''))}
                            color="primary"
                          />
                        )}
                        {setting.type === 'button' && (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={setting.action}
                            endIcon={<ArrowForward />}
                            sx={{ 
                              minWidth: 'auto',
                              ...(setting.name.includes('Delete') && {
                                color: theme.palette.error.main,
                                borderColor: theme.palette.error.main,
                                '&:hover': {
                                  borderColor: theme.palette.error.dark,
                                  backgroundColor: alpha(theme.palette.error.main, 0.04)
                                }
                              })
                            }}
                          >
                            {setting.name.includes('Download') ? 'Export' : 
                             setting.name.includes('Delete') ? 'Delete' :
                             setting.name.includes('Change') ? 'Change' : 'View'}
                          </Button>
                        )}
                      </Box>
                    </ListItem>
                    {settingIndex < section.settings.length - 1 && (
                      <Divider sx={{ mx: 0 }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        ))}

        {/* Save Changes */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Changes are automatically saved. Some settings may require you to log out and back in.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5
              }}
            >
              Apply All Changes
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
