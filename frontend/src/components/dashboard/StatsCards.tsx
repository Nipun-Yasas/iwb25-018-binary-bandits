'use client'

import React from 'react'
import { 
  ArrowTrendingUpIcon as TrendingUpIcon, 
  ShieldCheckIcon, 
  ClockIcon, 
  CheckCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline'

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
  const stats = [
    {
      title: 'Total Claims',
      value: '1,247',
      change: '+12%',
      icon: <TrendingUpIcon className="w-6 h-6" />,
      color: 'blue' as const,
      description: 'Total number of claims processed this month',
      isImprovement: true
    },
    {
      title: 'Fraud Detected',
      value: '23',
      change: '-8%',
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      color: 'red' as const,
      description: 'Suspicious claims flagged by AI detection system',
      isImprovement: true
    },
    {
      title: 'Processing Time',
      value: '2.3 days',
      change: '-15%',
      icon: <ClockIcon className="w-6 h-6" />,
      color: 'green' as const,
      description: 'Average time to process and review claims',
      isImprovement: true
    },
    {
      title: 'Accuracy Rate',
      value: '98.5%',
      change: '+2.1%',
      icon: <CheckCircleIcon className="w-6 h-6" />,
      color: 'purple' as const,
      description: 'AI model accuracy in fraud detection',
      isImprovement: true
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  )
}
