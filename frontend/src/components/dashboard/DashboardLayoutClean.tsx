'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { StatsCards } from './StatsCards'
import { ChartsSection } from './ChartsSection'
import { ClaimsTable } from './ClaimsTable'
import { FraudAlert } from './FraudAlert'
import { MobileNavigation } from './MobileNavigation'

export function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true)
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
      </div>
      
      {/* Topbar */}
      <Topbar />
      
      {/* Fraud Alert */}
      <FraudAlert />
      
      {/* Main Content */}
      <motion.main
        initial={false}
        animate={{
          marginLeft: isMobile ? 0 : (sidebarCollapsed ? 80 : 280),
          paddingTop: 80,
          paddingBottom: isMobile ? 80 : 0
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut"
        }}
        className="p-4 lg:p-6 space-y-4 lg:space-y-6"
      >
        {/* Stats Cards */}
        <section>
          <StatsCards />
        </section>

        {/* Charts Section */}
        <section>
          <ChartsSection />
        </section>

        {/* Claims Table */}
        <section>
          <ClaimsTable />
        </section>
      </motion.main>

      {/* Mobile Navigation */}
      <MobileNavigation />
    </div>
  )
}
