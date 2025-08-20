'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'
import { useDashboard } from '@/contexts/DashboardContext'

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

export function FraudAlert() {
  const { claims } = useDashboard()
  const [showAlert, setShowAlert] = useState(false)
  const [alertClaim, setAlertClaim] = useState<Claim | null>(null)

  useEffect(() => {
    // Check for new fraud cases
    const fraudClaims = claims.filter(claim => claim.fraudFlag)
    const recentFraud = fraudClaims.find(claim => {
      const timeDiff = Date.now() - claim.submittedAt.getTime()
      return timeDiff < 60000 // Less than 1 minute ago
    })

    if (recentFraud && !showAlert) {
      setAlertClaim(recentFraud)
      setShowAlert(true)
      
      // Auto-hide after 10 seconds
      const timer = setTimeout(() => {
        setShowAlert(false)
      }, 10000)
      
      return () => clearTimeout(timer)
    }
  }, [claims, showAlert])

  return (
    <AnimatePresence>
      {showAlert && alertClaim && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.95 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 25 
          }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md"
        >
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg shadow-lg p-4 mx-4 animate-pulse-danger">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-100">
                    Fraud Alert Detected
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    Suspicious activity found in claim <span className="font-mono">{alertClaim.id}</span>
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    Hospital: {alertClaim.hospital} • Amount: ${alertClaim.amount.toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAlert(false)}
                className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
              >
                <X className="h-4 w-4 text-red-600 dark:text-red-400" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
