'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { generateMockData } from '@/lib/utils'

interface Claim {
  id: string
  hospital: string
  status: string
  amount: number
  fraudFlag: boolean
  submittedAt: Date
  patientAge: number
  treatmentType: string
}

interface DashboardStats {
  totalClaims: number
  approvedClaims: number
  rejectedClaims: number
  fraudClaims: number
  totalAmount: number
  approvedAmount: number
  rejectedAmount: number
  pendingClaims: number
}

interface ChartData {
  date: string
  approved: number
  rejected: number
  pending: number
}

interface FraudCategoryData {
  category: string
  count: number
}

interface DashboardContextType {
  claims: Claim[]
  stats: DashboardStats
  chartData: ChartData[]
  fraudData: FraudCategoryData[]
  isLive: boolean
  lastUpdate: Date
  refreshData: () => void
  toggleLive: () => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [claims, setClaims] = useState<Claim[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalClaims: 0,
    approvedClaims: 0,
    rejectedClaims: 0,
    fraudClaims: 0,
    totalAmount: 0,
    approvedAmount: 0,
    rejectedAmount: 0,
    pendingClaims: 0
  })
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [fraudData, setFraudData] = useState<FraudCategoryData[]>([])
  const [isLive, setIsLive] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  const calculateStats = (claimsData: Claim[]): DashboardStats => {
    return {
      totalClaims: claimsData.length,
      approvedClaims: claimsData.filter(c => c.status === 'approved').length,
      rejectedClaims: claimsData.filter(c => c.status === 'rejected').length,
      fraudClaims: claimsData.filter(c => c.fraudFlag).length,
      totalAmount: claimsData.reduce((sum, c) => sum + c.amount, 0),
      approvedAmount: claimsData.filter(c => c.status === 'approved').reduce((sum, c) => sum + c.amount, 0),
      rejectedAmount: claimsData.filter(c => c.status === 'rejected').reduce((sum, c) => sum + c.amount, 0),
      pendingClaims: claimsData.filter(c => c.status === 'pending' || c.status === 'suspicious').length
    }
  }

  const generateChartData = (claimsData: Claim[]): ChartData[] => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split('T')[0]
    }).reverse()

    return last7Days.map(date => {
      const dayStart = new Date(date)
      const dayEnd = new Date(date)
      dayEnd.setHours(23, 59, 59, 999)

      const dayClaims = claimsData.filter(claim => 
        claim.submittedAt >= dayStart && claim.submittedAt <= dayEnd
      )

      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        approved: dayClaims.filter(c => c.status === 'approved').length,
        rejected: dayClaims.filter(c => c.status === 'rejected').length,
        pending: dayClaims.filter(c => c.status === 'pending' || c.status === 'suspicious').length
      }
    })
  }

  const generateFraudData = (claimsData: Claim[]): FraudCategoryData[] => {
    const fraudClaims = claimsData.filter(c => c.fraudFlag)
    const categories = ['Emergency', 'Surgery', 'Consultation', 'Diagnostic', 'Therapy']
    
    return categories.map(category => ({
      category,
      count: fraudClaims.filter(c => c.treatmentType === category).length
    }))
  }

  const refreshData = React.useCallback(() => {
    const newClaims = generateMockData()
    setClaims(newClaims)
    setStats(calculateStats(newClaims))
    setChartData(generateChartData(newClaims))
    setFraudData(generateFraudData(newClaims))
    setLastUpdate(new Date())
  }, [])

  const toggleLive = () => {
    setIsLive(prev => !prev)
  }

  useEffect(() => {
    // Initial data load
    refreshData()

    // Simulate live updates every 30 seconds
    const interval = setInterval(() => {
      if (isLive) {
        // Randomly add a new claim or update existing ones
        if (Math.random() > 0.5) {
          refreshData()
        }
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [isLive, refreshData])

  return (
    <DashboardContext.Provider value={{
      claims,
      stats,
      chartData,
      fraudData,
      isLive,
      lastUpdate,
      refreshData,
      toggleLive
    }}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}
