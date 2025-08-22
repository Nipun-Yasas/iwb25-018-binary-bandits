'use client'

import React from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts'

// Monthly Claims Data
const monthlyClaimsData = [
  { name: 'Jan', claims: 420, fraud: 12 },
  { name: 'Feb', claims: 380, fraud: 18 },
  { name: 'Mar', claims: 510, fraud: 20 },
  { name: 'Apr', claims: 350, fraud: 10 },
  { name: 'May', claims: 490, fraud: 15 },
  { name: 'Jun', claims: 600, fraud: 19 },
  { name: 'Jul', claims: 720, fraud: 21 },
  { name: 'Aug', claims: 620, fraud: 15 }
];

// Risk Assessment Distribution
const riskDistributionData = [
  { name: 'Low Risk', value: 65, color: '#10b981' },
  { name: 'Medium Risk', value: 25, color: '#f59e0b' },
  { name: 'High Risk', value: 10, color: '#ef4444' }
];

// Performance Over Time
const performanceData = [
  { name: 'Jan', accuracy: 94.2, response: 80 },
  { name: 'Feb', accuracy: 95.1, response: 82 },
  { name: 'Mar', accuracy: 94.8, response: 85 },
  { name: 'Apr', accuracy: 96.2, response: 87 },
  { name: 'May', accuracy: 97.0, response: 88 },
  { name: 'Jun', accuracy: 97.5, response: 92 },
  { name: 'Jul', accuracy: 98.0, response: 94 },
  { name: 'Aug', accuracy: 98.5, response: 95 }
];

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/30 shadow-lg p-4">
      <h3 className="text-lg font-medium mb-4 text-slate-800 dark:text-white">{title}</h3>
      <div className="h-64">
        {children}
      </div>
    </div>
  )
}

export const ChartsSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Claims Processing Trends */}
      <ChartCard title="Monthly Claims & Fraud Detection">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={monthlyClaimsData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorClaims" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorFraud" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
            <XAxis dataKey="name" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '8px', 
                border: '1px solid rgba(203, 213, 225, 0.4)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="claims" 
              stroke="#3b82f6" 
              fillOpacity={1} 
              fill="url(#colorClaims)" 
              name="Total Claims"
            />
            <Area 
              type="monotone" 
              dataKey="fraud" 
              stroke="#ef4444" 
              fillOpacity={1} 
              fill="url(#colorFraud)"
              name="Fraud Cases"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Risk Assessment Distribution */}
      <ChartCard title="Risk Assessment Distribution">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={riskDistributionData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent ? (percent * 100).toFixed(0) : 0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {riskDistributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Percentage']}
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '8px', 
                border: '1px solid rgba(203, 213, 225, 0.4)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Performance Metrics */}
      <ChartCard title="Performance Metrics Over Time">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={performanceData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
            <XAxis dataKey="name" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '8px', 
                border: '1px solid rgba(203, 213, 225, 0.4)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="accuracy"
              stroke="#10b981"
              strokeWidth={2}
              activeDot={{ r: 8 }}
              name="Model Accuracy %"
            />
            <Line 
              type="monotone" 
              dataKey="response" 
              stroke="#8b5cf6"
              strokeWidth={2}
              name="Response Score"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Fraud Detection Patterns */}
      <ChartCard title="Fraud Detection by Category">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={[
              { category: 'Identity', count: 12 },
              { category: 'Billing', count: 18 },
              { category: 'Provider', count: 7 },
              { category: 'Claims', count: 15 },
              { category: 'Pharmacy', count: 5 }
            ]}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
            <XAxis dataKey="category" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '8px', 
                border: '1px solid rgba(203, 213, 225, 0.4)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Legend />
            <Bar 
              dataKey="count" 
              name="Fraud Cases" 
              radius={[4, 4, 0, 0]}
            >
              {[
                <Cell key="cell-0" fill="#f43f5e" />,
                <Cell key="cell-1" fill="#e11d48" />,
                <Cell key="cell-2" fill="#be123c" />,
                <Cell key="cell-3" fill="#9f1239" />,
                <Cell key="cell-4" fill="#881337" />
              ]}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}

export default ChartsSection
