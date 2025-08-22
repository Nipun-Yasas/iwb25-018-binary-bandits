"use client";

import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { ClaimsTable } from "@/components/dashboard/ClaimsTable";
import { FraudAlert } from "@/components/dashboard/FraudAlert";
import { StatsCards } from "@/components/dashboard/StatsCards";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300 rounded-xl">
      {/* Fraud Alert */}
      <FraudAlert />

      {/* Dashboard Header */}
      <div className="pt-6 pb-4 px-4 lg:px-6">
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 dark:border-slate-700/30 shadow-lg ">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Insurance Claim Audit Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-lg">
                Real-time monitoring and fraud detection for insurance claims
              </p>
              <div className="flex items-center space-x-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Live Monitoring Active
                </span>
                <span>•</span>
                <span>Last Updated: Just now</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  98.5%
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Accuracy Rate
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main
        className="pt-2 pb-4 lg:pb-6 px-4 lg:px-6 space-y-6 
                       bg-gradient-to-br from-slate-50/40 via-blue-50/60 to-indigo-100/40 
                       dark:from-slate-900/40 dark:via-slate-800/60 dark:to-indigo-950/40
                       border border-white/20 dark:border-slate-700/30 
                       rounded-2xl shadow-xl backdrop-blur-sm mx-4
                       transition-all duration-300 ease-in-out"
      >
        {/* Stats Cards */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Key Performance Indicators
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              Overview of claim processing metrics and fraud detection
              performance
            </p>
          </div>
          <StatsCards />
        </section>

        {/* Charts Section */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Analytics & Trends
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              Visual representation of claim patterns and fraud detection trends
            </p>
          </div>
          <ChartsSection />
        </section>

        {/* Claims Table */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Recent Claims Activity
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              Latest claim submissions with real-time status updates and fraud
              risk assessment
            </p>
          </div>
          <ClaimsTable />
        </section>
      </main>
    </div>
  );
}
