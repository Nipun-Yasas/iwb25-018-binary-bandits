'use client'

import React, { useState, useEffect } from 'react'
import { Box, Typography, Card, CardContent, List, ListItem, ListItemText, ListItemAvatar, Avatar, Chip, Button, Grid, IconButton, Badge, Divider, useTheme, alpha, Alert } from '@mui/material'
import { Notifications, NotificationsActive, CheckCircle, Warning, Info, Clear, MarkEmailRead, Refresh, LocalHospital, Schedule } from '@mui/icons-material'
// import { useRealTime } from '@/lib/useRealTime'

interface Notification {
  id: string
  type: 'claim_update' | 'fraud_alert' | 'system' | 'reminder'
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: 'high' | 'medium' | 'low'
  claimId?: string
  actionRequired?: boolean
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'claim_update': return <CheckCircle />
    case 'fraud_alert': return <Warning />
    case 'system': return <Info />
    case 'reminder': return <Schedule />
    default: return <Notifications />
  }
}

const getNotificationColor = (type: string, priority: string) => {
  if (priority === 'high') return 'error'
  if (type === 'claim_update') return 'success'
  if (type === 'fraud_alert') return 'warning'
  return 'info'
}

export default function NotificationsPage() {
  const theme = useTheme()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<'all' | 'unread' | 'high_priority'>('all')
  
  // WebSocket connection for real-time notifications
  const { isConnected, lastMessage } = useRealTime()

  // Mock initial notifications
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'claim_update',
        title: 'Claim Approved',
        message: 'Your claim CLM001 for John Doe has been approved. Amount: $250.00',
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'medium',
        claimId: 'CLM001'
      },
      {
        id: '2',
        type: 'fraud_alert',
        title: 'Fraud Alert',
        message: 'Suspicious activity detected in claim CLM005. Please review immediately.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        read: false,
        priority: 'high',
        claimId: 'CLM005',
        actionRequired: true
      },
      {
        id: '3',
        type: 'system',
        title: 'System Maintenance',
        message: 'Scheduled system maintenance on Sunday 2:00 AM - 4:00 AM EST.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: true,
        priority: 'low'
      },
      {
        id: '4',
        type: 'reminder',
        title: 'Documentation Required',
        message: 'Missing documents for claim CLM003. Please upload within 48 hours.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        read: false,
        priority: 'medium',
        claimId: 'CLM003',
        actionRequired: true
      },
      {
        id: '5',
        type: 'claim_update',
        title: 'Claim In Review',
        message: 'Your claim CLM002 is now under review by our team.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        read: true,
        priority: 'low',
        claimId: 'CLM002'
      }
    ]
    setNotifications(mockNotifications)
  }, [])

  // Handle real-time WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage)
        
        if (data.type === 'claim_updated') {
          const newNotification: Notification = {
            id: Date.now().toString(),
            type: 'claim_update',
            title: 'Claim Status Updated',
            message: `Claim ${data.claimId} status changed to ${data.newStatus}`,
            timestamp: new Date().toISOString(),
            read: false,
            priority: 'medium',
            claimId: data.claimId
          }
          
          setNotifications(prev => [newNotification, ...prev])
        } else if (data.type === 'fraud_alert') {
          const newNotification: Notification = {
            id: Date.now().toString(),
            type: 'fraud_alert',
            title: 'Fraud Alert',
            message: data.message || 'Suspicious activity detected',
            timestamp: new Date().toISOString(),
            read: false,
            priority: 'high',
            claimId: data.claimId,
            actionRequired: true
          }
          
          setNotifications(prev => [newNotification, ...prev])
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }
  }, [lastMessage])

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read
    if (filter === 'high_priority') return notification.priority === 'high'
    return true
  })

  const unreadCount = notifications.filter(n => !n.read).length
  const highPriorityCount = notifications.filter(n => n.priority === 'high' && !n.read).length

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <Box>
      {/* Header */}
      <Card
        sx={{
          mb: 4,
          background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.primary.main} 100%)`,
          color: 'white',
          borderRadius: 4
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                🔔 Notifications
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Stay updated with real-time claim notifications and alerts.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight="bold">
                  {unreadCount}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Unread
                </Typography>
              </Box>
              {isConnected ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: '#4caf50',
                      animation: 'pulse 2s infinite'
                    }}
                  />
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Live Updates
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" sx={{ opacity: 0.6 }}>
                  Connecting...
                </Typography>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Badge badgeContent={unreadCount} color="primary">
                <NotificationsActive sx={{ fontSize: 40, color: theme.palette.primary.main }} />
              </Badge>
              <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                {notifications.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Notifications
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Warning sx={{ fontSize: 40, color: theme.palette.error.main }} />
              <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                {highPriorityCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                High Priority
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <LocalHospital sx={{ fontSize: 40, color: theme.palette.success.main }} />
              <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                {notifications.filter(n => n.type === 'claim_update').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Claim Updates
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* WebSocket Status Alert */}
      {!isConnected && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
          Real-time notifications are currently disconnected. Trying to reconnect...
        </Alert>
      )}

      {/* Filter Controls */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant={filter === 'all' ? 'contained' : 'outlined'}
                onClick={() => setFilter('all')}
                size="small"
              >
                All ({notifications.length})
              </Button>
              <Button
                variant={filter === 'unread' ? 'contained' : 'outlined'}
                onClick={() => setFilter('unread')}
                size="small"
                color="primary"
              >
                Unread ({unreadCount})
              </Button>
              <Button
                variant={filter === 'high_priority' ? 'contained' : 'outlined'}
                onClick={() => setFilter('high_priority')}
                size="small"
                color="error"
              >
                High Priority ({highPriorityCount})
              </Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                startIcon={<MarkEmailRead />}
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                size="small"
              >
                Mark All Read
              </Button>
              <IconButton size="small">
                <Refresh />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <List sx={{ p: 0 }}>
          {filteredNotifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <ListItem
                sx={{
                  backgroundColor: notification.read ? 'transparent' : alpha(theme.palette.primary.main, 0.02),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05)
                  },
                  py: 2,
                  px: 3
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      backgroundColor: theme.palette[getNotificationColor(notification.type, notification.priority)].main,
                      color: 'white'
                    }}
                  >
                    {getNotificationIcon(notification.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {notification.title}
                      </Typography>
                      <Chip
                        label={notification.priority}
                        size="small"
                        color={notification.priority === 'high' ? 'error' : notification.priority === 'medium' ? 'warning' : 'default'}
                        sx={{ fontSize: '0.7rem', height: 20 }}
                      />
                      {notification.actionRequired && (
                        <Chip
                          label="Action Required"
                          size="small"
                          color="error"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem', height: 20 }}
                        />
                      )}
                      {!notification.read && (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: theme.palette.primary.main
                          }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {notification.message}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          {formatTimeAgo(notification.timestamp)}
                        </Typography>
                        {notification.claimId && (
                          <Chip
                            label={notification.claimId}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem', height: 18 }}
                          />
                        )}
                      </Box>
                    </Box>
                  }
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 2 }}>
                  {!notification.read && (
                    <Button
                      size="small"
                      onClick={() => markAsRead(notification.id)}
                      sx={{ minWidth: 'auto', fontSize: '0.7rem' }}
                    >
                      Mark Read
                    </Button>
                  )}
                  <IconButton
                    size="small"
                    onClick={() => deleteNotification(notification.id)}
                    sx={{ color: 'text.secondary' }}
                  >
                    <Clear />
                  </IconButton>
                </Box>
              </ListItem>
              {index < filteredNotifications.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>

        {filteredNotifications.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Notifications sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              {filter === 'unread' ? 'No unread notifications' : 
               filter === 'high_priority' ? 'No high priority notifications' : 
               'No notifications'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {filter === 'all' && 'You\'re all caught up!'}
            </Typography>
          </Box>
        )}
      </Card>
    </Box>
  )
}
