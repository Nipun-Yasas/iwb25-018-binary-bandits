'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface FraudAlertProps {
  message?: string
  priority?: 'high' | 'critical'
}

export const FraudAlert: React.FC<FraudAlertProps> = ({
  message = "Critical alert: Unusual activity detected in claim #47291. High fraud probability score.",
  priority = 'critical'
}) => {
  const [isVisible, setIsVisible] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  // Auto-hide after 15 seconds for demo purposes
  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss()
    }, 15000)

    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setIsVisible(false)
    }, 300) // Animation duration
  }

  if (!isVisible) return null

  const priorityClasses = {
    high: 'bg-amber-500/15 dark:bg-amber-600/20 border-amber-500/30 dark:border-amber-600/30',
    critical: 'bg-red-500/15 dark:bg-red-600/20 border-red-500/30 dark:border-red-600/30',
  }

  const iconClasses = {
    high: 'text-amber-600 dark:text-amber-400',
    critical: 'text-red-600 dark:text-red-400',
  }

  return (
    <div 
      className={`relative mx-4 lg:mx-6 mt-4 px-4 py-3 rounded-xl border 
                ${priorityClasses[priority]} backdrop-blur-sm shadow-lg
                transition-all duration-300 ease-in-out
                ${isAnimating ? 'opacity-0 transform -translate-y-4' : 'opacity-100'}`}
    >
      <div className="flex items-start md:items-center gap-3">
        <div className={`p-1 rounded-full ${iconClasses[priority]}`}>
          <ExclamationTriangleIcon className="w-5 h-5" />
        </div>
        
        <div className="flex-1">
          <p className="text-slate-900 dark:text-white text-sm md:text-base">
            {message}
          </p>
        </div>
        
        <button 
          onClick={handleDismiss} 
          className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white p-1 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
        >
          <XMarkIcon className="w-5 h-5" />
          <span className="sr-only">Dismiss</span>
        </button>
      </div>
    </div>
  )
}

export default FraudAlert
