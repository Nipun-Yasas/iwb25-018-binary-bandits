'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, CheckCircle, XCircle, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDashboard } from '@/contexts/DashboardContext'
import { formatCurrency, formatNumber } from '@/lib/utils'

function getIconBgColor(color: string): string {
  switch (color) {
    case '#0369a1': return 'bg-blue-100 dark:bg-blue-900/30'
    case '#059669': return 'bg-green-100 dark:bg-green-900/30'
    case '#dc2626': return 'bg-red-100 dark:bg-red-900/30'
    case '#ea580c': return 'bg-orange-100 dark:bg-orange-900/30'
    default: return 'bg-gray-100 dark:bg-gray-900/30'
  }
}

function getIconColor(color: string): string {
  switch (color) {
    case '#0369a1': return 'text-blue-600 dark:text-blue-400'
    case '#059669': return 'text-green-600 dark:text-green-400'
    case '#dc2626': return 'text-red-600 dark:text-red-400'
    case '#ea580c': return 'text-orange-600 dark:text-orange-400'
    default: return 'text-gray-600 dark:text-gray-400'
  }
}

interface StatCardProps {
  title: string
  value: number
  previousValue?: number
  icon: React.ComponentType<{ className?: string }>
  color: string
  format: 'number' | 'currency'
  delay: number
}

function StatCard({ title, value, previousValue = 0, icon: Icon, color, format, delay }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isIncreasing, setIsIncreasing] = useState(false)

  useEffect(() => {
    setIsIncreasing(value > previousValue)
    
    // Animate the number counting up
    const duration = 1000
    const steps = 60
    const increment = (value - displayValue) / steps
    
    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      setDisplayValue(prev => {
        const newValue = prev + increment
        if (currentStep >= steps) {
          clearInterval(timer)
          return value
        }
        return newValue
      })
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value, previousValue, displayValue])

  const percentageChange = previousValue > 0 ? ((value - previousValue) / previousValue) * 100 : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="glass-card card-hover border-l-4" style={{ borderLeftColor: color }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {title}
          </CardTitle>
          <div className={`p-2 rounded-lg ${getIconBgColor(color)}`}>
            <Icon className={`h-5 w-5 ${getIconColor(color)}`} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-2">
            <motion.div
              key={displayValue}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-3xl font-bold text-slate-900 dark:text-white"
            >
              {format === 'currency' ? formatCurrency(displayValue) : formatNumber(Math.round(displayValue))}
            </motion.div>
            
            {previousValue > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className={`flex items-center text-sm font-medium ${
                  isIncreasing 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {isIncreasing ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {Math.abs(percentageChange).toFixed(1)}%
              </motion.div>
            )}
          </div>
          
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isIncreasing ? '+' : ''}{formatNumber(value - previousValue)} from last period
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function StatsCards() {
  const { stats } = useDashboard()
  const [previousStats, setPreviousStats] = useState(stats)

  useEffect(() => {
    // Simulate previous stats for trend calculation
    const timer = setTimeout(() => {
      setPreviousStats(prev => ({
        ...prev,
        totalClaims: Math.max(0, prev.totalClaims - Math.floor(Math.random() * 10)),
        approvedClaims: Math.max(0, prev.approvedClaims - Math.floor(Math.random() * 5)),
        rejectedClaims: Math.max(0, prev.rejectedClaims - Math.floor(Math.random() * 3)),
        fraudClaims: Math.max(0, prev.fraudClaims - Math.floor(Math.random() * 2))
      }))
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const statItems = [
    {
      title: 'Total Claims Submitted',
      value: stats.totalClaims,
      previousValue: previousStats.totalClaims,
      icon: FileText,
      color: '#0369a1',
      format: 'number' as const,
      delay: 0
    },
    {
      title: 'Approved Claims',
      value: stats.approvedClaims,
      previousValue: previousStats.approvedClaims,
      icon: CheckCircle,
      color: '#059669',
      format: 'number' as const,
      delay: 0.1
    },
    {
      title: 'Rejected Claims',
      value: stats.rejectedClaims,
      previousValue: previousStats.rejectedClaims,
      icon: XCircle,
      color: '#dc2626',
      format: 'number' as const,
      delay: 0.2
    },
    {
      title: 'Fraud/Suspicious Claims',
      value: stats.fraudClaims,
      previousValue: previousStats.fraudClaims,
      icon: AlertTriangle,
      color: '#ea580c',
      format: 'number' as const,
      delay: 0.3
    }
  ]

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item, index) => (
        <StatCard key={index} {...item} />
      ))}
    </div>
  )
}
