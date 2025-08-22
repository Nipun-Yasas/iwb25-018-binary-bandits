'use client'

import React, { useState } from 'react'
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline'

type RiskLevel = 'low' | 'medium' | 'high' | 'critical'
type Status = 'pending' | 'in_review' | 'approved' | 'rejected'

interface Claim {
  id: string
  date: string
  amount: number
  riskLevel: RiskLevel
  status: Status
  claimType: string
  reviewer: string
}

// Sample data
const sampleClaims: Claim[] = [
  {
    id: 'CLM-47291',
    date: '2025-08-15',
    amount: 2450.75,
    riskLevel: 'high',
    status: 'in_review',
    claimType: 'Medical',
    reviewer: 'Sarah Johnson'
  },
  {
    id: 'CLM-47285',
    date: '2025-08-14',
    amount: 890.50,
    riskLevel: 'low',
    status: 'approved',
    claimType: 'Dental',
    reviewer: 'Michael Chen'
  },
  {
    id: 'CLM-47278',
    date: '2025-08-13',
    amount: 5200.00,
    riskLevel: 'medium',
    status: 'pending',
    claimType: 'Medical',
    reviewer: 'Unassigned'
  },
  {
    id: 'CLM-47269',
    date: '2025-08-12',
    amount: 1735.25,
    riskLevel: 'low',
    status: 'approved',
    claimType: 'Vision',
    reviewer: 'Lisa Thompson'
  },
  {
    id: 'CLM-47258',
    date: '2025-08-11',
    amount: 12850.75,
    riskLevel: 'critical',
    status: 'rejected',
    claimType: 'Surgery',
    reviewer: 'David Wilson'
  },
  {
    id: 'CLM-47254',
    date: '2025-08-10',
    amount: 450.00,
    riskLevel: 'low',
    status: 'approved',
    claimType: 'Prescription',
    reviewer: 'Michael Chen'
  }
]

export const ClaimsTable: React.FC = () => {
  const [claims] = useState<Claim[]>(sampleClaims)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<keyof Claim>('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const handleSort = (field: keyof Claim) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredClaims = claims
    .filter((claim) => {
      if (!searchTerm) return true
      const searchLower = searchTerm.toLowerCase()
      return (
        claim.id.toLowerCase().includes(searchLower) ||
        claim.claimType.toLowerCase().includes(searchLower) ||
        claim.reviewer.toLowerCase().includes(searchLower)
      )
    })
    .sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue)
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
      }
      
      return 0
    })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }

  const riskBadgeClasses = {
    low: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
    medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    critical: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 ring-2 ring-red-500/20'
  }

  const statusBadgeClasses = {
    pending: 'bg-slate-100 text-slate-800 dark:bg-slate-700/50 dark:text-slate-300',
    in_review: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    approved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  }

  const statusLabels = {
    pending: 'Pending',
    in_review: 'In Review',
    approved: 'Approved',
    rejected: 'Rejected',
  }

  return (
    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/30 shadow-lg">
      {/* Search and filter */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700/50">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon className="w-5 h-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            placeholder="Search claims by ID, type or reviewer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-700/30">
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center space-x-1">
                  <span>Claim ID</span>
                  {sortField === 'id' && (
                    sortDirection === 'asc' ? 
                      <ChevronUpIcon className="w-4 h-4" /> : 
                      <ChevronDownIcon className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center space-x-1">
                  <span>Date</span>
                  {sortField === 'date' && (
                    sortDirection === 'asc' ? 
                      <ChevronUpIcon className="w-4 h-4" /> : 
                      <ChevronDownIcon className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center space-x-1">
                  <span>Amount</span>
                  {sortField === 'amount' && (
                    sortDirection === 'asc' ? 
                      <ChevronUpIcon className="w-4 h-4" /> : 
                      <ChevronDownIcon className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('riskLevel')}
              >
                <div className="flex items-center space-x-1">
                  <span>Risk Level</span>
                  {sortField === 'riskLevel' && (
                    sortDirection === 'asc' ? 
                      <ChevronUpIcon className="w-4 h-4" /> : 
                      <ChevronDownIcon className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  {sortField === 'status' && (
                    sortDirection === 'asc' ? 
                      <ChevronUpIcon className="w-4 h-4" /> : 
                      <ChevronDownIcon className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('claimType')}
              >
                <div className="flex items-center space-x-1">
                  <span>Type</span>
                  {sortField === 'claimType' && (
                    sortDirection === 'asc' ? 
                      <ChevronUpIcon className="w-4 h-4" /> : 
                      <ChevronDownIcon className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('reviewer')}
              >
                <div className="flex items-center space-x-1">
                  <span>Reviewer</span>
                  {sortField === 'reviewer' && (
                    sortDirection === 'asc' ? 
                      <ChevronUpIcon className="w-4 h-4" /> : 
                      <ChevronDownIcon className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-transparent divide-y divide-slate-200 dark:divide-slate-700/50">
            {filteredClaims.map((claim) => (
              <tr 
                key={claim.id} 
                className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
              >
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                  {claim.id}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                  {formatDate(claim.date)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                  {formatCurrency(claim.amount)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${riskBadgeClasses[claim.riskLevel]}`}>
                    {claim.riskLevel.charAt(0).toUpperCase() + claim.riskLevel.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeClasses[claim.status]}`}>
                    {statusLabels[claim.status]}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                  {claim.claimType}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                  {claim.reviewer}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                    <EllipsisHorizontalIcon className="w-5 h-5" />
                    <span className="sr-only">Options</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredClaims.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-slate-500 dark:text-slate-400">No claims matching your search criteria</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-slate-200 dark:border-slate-700/50">
        <div className="text-sm text-slate-700 dark:text-slate-300">
          Showing <span className="font-medium">{filteredClaims.length}</span> of <span className="font-medium">{claims.length}</span> claims
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
            disabled
          >
            Previous
          </button>
          <button
            className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
            disabled
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default ClaimsTable
