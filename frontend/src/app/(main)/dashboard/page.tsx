'use client'

import { StatsCards } from '@/components/dashboard/StatsCards'
import { ChartsSection } from '@/components/dashboard/ChartsSection'
import { ClaimsTable } from '@/components/dashboard/ClaimsTable'
import { FraudAlert } from '@/components/dashboard/FraudAlert'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-white">
      {/* Fraud Alert */}
      <FraudAlert />
      
      {/* Main Content */}
      <main className="pt-4 pb-4 lg:pb-6 px-4 lg:px-6 space-y-4 lg:space-y-6 bg-white">
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
  )
}