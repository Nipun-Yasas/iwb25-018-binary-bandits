'use client'

import React, { useState, useEffect } from 'react'
import { 
  ArrowTrendingUpIcon as TrendingUpIcon, 
  ShieldCheckIcon, 
  ClockIcon, 
  CheckCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline'
import { dashboardApi, type DashboardStats } from '@/lib/api'
import { useDashboardStats } from '@/lib/useRealTime'

interface StatCardProps {
  title: string
  value: string | number
  change: string
  icon: React.ReactNode
  color: 'blue' | 'red' | 'green' | 'purple'
  description: string
  isImprovement?: boolean
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  color, 
  description, 
  isImprovement = true 
}) => {
  const colorClasses = {
    blue: {
      bg: 'from-blue-500/10 to-cyan-500/10',
      border: 'border-blue-200/30 dark:border-blue-500/30',
      icon: 'text-blue-600 dark:text-blue-400',
      value: 'text-blue-700 dark:text-blue-300',
      change: isImprovement ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
    },
    red: {
      bg: 'from-red-500/10 to-pink-500/10',
      border: 'border-red-200/30 dark:border-red-500/30',
      icon: 'text-red-600 dark:text-red-400',
      value: 'text-red-700 dark:text-red-300',
      change: isImprovement ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
    },
    green: {
      bg: 'from-emerald-500/10 to-teal-500/10',
      border: 'border-emerald-200/30 dark:border-emerald-500/30',
      icon: 'text-emerald-600 dark:text-emerald-400',
      value: 'text-emerald-700 dark:text-emerald-300',
      change: isImprovement ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
    },
    purple: {
      bg: 'from-purple-500/10 to-indigo-500/10',
      border: 'border-purple-200/30 dark:border-purple-500/30',
      icon: 'text-purple-600 dark:text-purple-400',
      value: 'text-purple-700 dark:text-purple-300',
      change: isImprovement ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
    }
  }

  const classes = colorClasses[color]

  return (
    <div className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${classes.bg} 
                     backdrop-blur-sm border ${classes.border} 
                     shadow-lg hover:shadow-xl transition-all duration-300 
                     hover:scale-[1.02] hover:-translate-y-1`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-white/5 dark:bg-white/[0.02]"></div>
      
      {/* Content */}
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-white/20 dark:bg-white/10 ${classes.icon}`}>
            {icon}
          </div>
          <div className={`flex items-center space-x-1 text-sm ${classes.change}`}>
            {isImprovement ? (
              <ArrowUpIcon className="w-4 h-4" />
            ) : (
              <ArrowDownIcon className="w-4 h-4" />
            )}
            <span className="font-medium">{change}</span>
          </div>
        </div>

        {/* Value */}
        <div className="mb-2">
          <div className={`text-3xl font-bold ${classes.value} mb-1`}>
            {value}
          </div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            {title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {description}
        </p>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                        pointer-events-none"></div>
      </div>
    </div>
  )
}

export const StatsCards: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // WebSocket integration for real-time updates
  const dashboardStatsHook = useDashboardStats()

  // Handle real-time dashboard stats updates
  useEffect(() => {
    dashboardStatsHook.onStatsUpdate((updatedStatsData) => {
      console.log('📊 Real-time dashboard stats update received:', updatedStatsData)
      
      // Re-fetch all stats to ensure consistency
      fetchStats()
    })
  }, [dashboardStatsHook])

  const fetchStats = async () => {
    try {
      setLoading(true);
      console.log('📊 Fetching dashboard stats...');
      const response = await dashboardApi.getStats();
      console.log('📊 Full dashboard response:', response);
      
      // The backend returns stats directly in response.data, but if that doesn't exist,
      // use the response object itself (which contains the stats)
      const statsData = response.data || response;
      
      if (statsData && (statsData as DashboardStats).summary) {
        setStats(statsData as DashboardStats);
        setError(null);
        console.log('✅ Dashboard stats set successfully:', statsData);
      } else {
        console.warn('⚠️ No stats data found in response:', response);
        setError('No dashboard data received');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard stats');
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStats();
    
    // Refresh data every 30 seconds (but we'll now rely more on WebSocket updates)
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="col-span-full p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
          <p className="text-red-600 dark:text-red-400">Error: {error}</p>
          <p className="text-sm text-red-500 dark:text-red-300 mt-1">
            Make sure the backend server is running on http://localhost:8080
          </p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return <div>No data available</div>;
  }

  // Calculate total claims from summary
  const totalClaims = stats.summary?.total_claims || 0;
  
  // Get fraud alert counts  
  const totalFraudAlerts = stats.summary?.total_fraud_alerts || 0;
  
  // Get recent activity data (use the actual fields from backend)
  const recentClaims30Days = stats.recent_activity?.recent_claims_30_days || 0;
  const recentFraudAlerts30Days = stats.recent_activity?.recent_fraud_alerts_30_days || 0;
  
  // Calculate some derived metrics from claims_by_status
  const claimsByStatus = stats.claims_by_status?.by_status || [];
  const totalAmount = claimsByStatus.reduce((sum, item) => sum + (item.total_amount || 0), 0);
  const avgAmount = totalClaims > 0 ? totalAmount / totalClaims : 0;
  
  // Calculate approved claims count
  const approvedClaims = claimsByStatus.find(item => item.status === 'approved')?.count || 0;
  
  const statCards = [
    {
      title: 'Total Claims',
      value: totalClaims.toLocaleString(),
      change: recentClaims30Days > 0 ? `+${recentClaims30Days}` : '0',
      icon: <TrendingUpIcon className="w-6 h-6" />,
      color: 'blue' as const,
      description: `${recentClaims30Days} new claims in last 30 days`,
      isImprovement: recentClaims30Days >= 0
    },
    {
      title: 'Fraud Detected',
      value: totalFraudAlerts,
      change: recentFraudAlerts30Days > 0 ? `+${recentFraudAlerts30Days}` : '0',
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      color: 'red' as const,
      description: `${recentFraudAlerts30Days} new alerts in last 30 days`,
      isImprovement: recentFraudAlerts30Days === 0
    },
    {
      title: 'Approved Claims',
      value: approvedClaims,
      change: approvedClaims > 0 ? '+5%' : '0%',
      icon: <ClockIcon className="w-6 h-6" />,
      color: 'green' as const,
      description: 'Claims approved and processed',
      isImprovement: true
    },
    {
      title: 'Average Amount',
      value: `$${Math.round(avgAmount).toLocaleString()}`,
      change: '+2.1%',
      icon: <CheckCircleIcon className="w-6 h-6" />,
      color: 'purple' as const,
      description: `Based on ${totalClaims} total claims`,
      isImprovement: true
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  )
}
