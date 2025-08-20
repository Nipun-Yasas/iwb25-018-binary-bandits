'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useDashboard } from '@/contexts/DashboardContext'
import { formatCurrency, getStatusColor, getDarkStatusColor } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeContext'

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

export function ClaimsTable() {
  const { claims } = useDashboard()
  const { theme } = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<keyof Claim>('submittedAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />
      case 'rejected':
        return <XCircle className="h-4 w-4" />
      case 'pending':
      case 'suspicious':
        return <Clock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const handleSort = (field: keyof Claim) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredAndSortedClaims = React.useMemo(() => {
    const filtered = claims.filter(claim => {
      const matchesSearch = 
        claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.treatmentType.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesFilter = 
        filterStatus === 'all' || 
        claim.status === filterStatus ||
        (filterStatus === 'fraud' && claim.fraudFlag)
      
      return matchesSearch && matchesFilter
    })

    return filtered.sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]
      
      if (sortField === 'submittedAt') {
        aValue = new Date(aValue as Date).getTime()
        bValue = new Date(bValue as Date).getTime()
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = (bValue as string).toLowerCase()
      }
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })
  }, [claims, searchTerm, sortField, sortDirection, filterStatus])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="glass-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
              Recent Claims
            </CardTitle>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search claims..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="pending">Pending</option>
                  <option value="suspicious">Suspicious</option>
                  <option value="fraud">Fraud Flagged</option>
                </select>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                    <button
                      onClick={() => handleSort('id')}
                      className="flex items-center space-x-1 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <span>Claim ID</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                    <button
                      onClick={() => handleSort('hospital')}
                      className="flex items-center space-x-1 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <span>Hospital</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                    <button
                      onClick={() => handleSort('status')}
                      className="flex items-center space-x-1 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <span>Status</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                    <button
                      onClick={() => handleSort('amount')}
                      className="flex items-center space-x-1 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <span>Amount</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                    Treatment
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                    Fraud Flag
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedClaims.slice(0, 10).map((claim, index) => (
                  <motion.tr
                    key={claim.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <span className="font-mono text-sm text-slate-900 dark:text-white">
                        {claim.id}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-slate-700 dark:text-slate-300">
                        {claim.hospital}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${
                        theme === 'dark' ? getDarkStatusColor(claim.status) : getStatusColor(claim.status)
                      }`}>
                        {getStatusIcon(claim.status)}
                        <span className="capitalize">{claim.status}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-slate-900 dark:text-white">
                        {formatCurrency(claim.amount)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-slate-600 dark:text-slate-400">
                        {claim.treatmentType}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {claim.fraudFlag ? (
                        <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-xs font-medium">Flagged</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Clear</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <Button variant="outline" size="sm" className="h-8">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredAndSortedClaims.length === 0 && (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              No claims found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
