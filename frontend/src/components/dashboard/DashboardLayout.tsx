'use client'

import React from 'react'
import { Topbar } from './Topbar'
import { StatsCards } from './StatsCards'
import { ChartsSection } from './ChartsSection'
import { ClaimsTable } from './ClaimsTable'
import { FraudAlert } from './FraudAlert'
import { MobileNavigation } from './MobileNavigation'

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-white">
      {/* Main Content Container - Full Width */}
      <div className="w-full bg-white min-h-screen">
        {/* Topbar */}
        <Topbar />
        
        {/* Fraud Alert */}
        <FraudAlert />
        
        {/* Main Content */}
        <main className="pt-20 pb-4 lg:pb-6 px-4 lg:px-6 space-y-4 lg:space-y-6 bg-white">
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
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation />
    </div>
  )
}
