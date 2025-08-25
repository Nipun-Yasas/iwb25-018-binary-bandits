'use client'

import React, { useState, useEffect } from 'react'
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline'
import { claimsApi, type Claim } from '@/lib/api'
import { useClaimUpdates, useWebSocketConnection } from '@/lib/useRealTime'

type RiskLevel = 'low' | 'medium' | 'high' | 'critical'
type Status = 'pending' | 'approved' | 'rejected' | 'under_review' | 'in_review'

export const ClaimsTable: React.FC = () => {
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<keyof Claim>('created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  // WebSocket integration for real-time updates
  const wsConnection = useWebSocketConnection()
  const claimUpdates = useClaimUpdates()

  // Handle real-time claim updates
  useEffect(() => {
    claimUpdates.onClaimUpdate((updatedClaimData) => {
      console.log('🔄 Real-time claim update received:', updatedClaimData)
      
      // Re-fetch all claims to ensure consistency
      fetchClaims()
    })
  }, [claimUpdates])

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const response = await claimsApi.getAllClaims();
      console.log('📊 Full claims response:', response);
      
      // Extract the claims array from the response
      let claimsData: Claim[] = [];
      
      if (response.claims && Array.isArray(response.claims)) {
        // Backend returns { claims: [...] } 
        claimsData = response.claims;
      } else if (response.data && Array.isArray(response.data)) {
        // Fallback: { data: [...] }
        claimsData = response.data;
      } else if (response && Array.isArray(response)) {
        // Fallback: direct array
        claimsData = response;
      } else {
        console.warn('⚠️ Unexpected response structure:', response);
        claimsData = [];
      }
      
      console.log('📋 Processed claims data:', claimsData);
      setClaims(claimsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch claims');
      console.error('Error fetching claims:', err);
      setClaims([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchClaims();
    
    // Refresh data every 30 seconds (but we'll now rely more on WebSocket updates)
    const interval = setInterval(fetchClaims, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSort = (field: keyof Claim) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Ensure claims is always an array before filtering
  const filteredClaims = (claims || [])
    .filter((claim) => {
      if (!searchTerm) return true
      const searchLower = searchTerm.toLowerCase()
      return (
        claim.id.toLowerCase().includes(searchLower) ||
        claim.claim_type.toLowerCase().includes(searchLower) ||
        (claim.reviewer && claim.reviewer.toLowerCase().includes(searchLower))
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
    under_review: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    in_review: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    approved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  }

  const statusLabels = {
    pending: 'Pending',
    under_review: 'Under Review',
    in_review: 'In Review',
    approved: 'Approved',
    rejected: 'Rejected',
  }

  if (loading) {
    return (
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/30 shadow-lg p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/30 shadow-lg p-8">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Error: {error}</p>
          <p className="text-sm text-red-500 dark:text-red-300 mt-1">
            Make sure the backend server is running on http://localhost:8080
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/30 shadow-lg">
      {/* Search and filter with WebSocket status */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Claims Management
          </h3>
          
          {/* WebSocket Connection Status */}
          <div className="flex items-center space-x-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${wsConnection.isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`${wsConnection.isConnected ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {wsConnection.isConnected ? 'Real-time Connected' : 'Offline'}
            </span>
            {claimUpdates.updateCount > 0 && (
              <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs">
                {claimUpdates.updateCount} updates
              </span>
            )}
          </div>
        </div>
        
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
                onClick={() => handleSort('submission_date')}
              >
                <div className="flex items-center space-x-1">
                  <span>Date</span>
                  {sortField === 'submission_date' && (
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
                onClick={() => handleSort('risk_level')}
              >
                <div className="flex items-center space-x-1">
                  <span>Risk Level</span>
                  {sortField === 'risk_level' && (
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
                onClick={() => handleSort('claim_type')}
              >
                <div className="flex items-center space-x-1">
                  <span>Type</span>
                  {sortField === 'claim_type' && (
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
                  {formatDate(claim.submission_date)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                  {formatCurrency(claim.amount)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${riskBadgeClasses[claim.risk_level as RiskLevel]}`}>
                    {claim.risk_level.charAt(0).toUpperCase() + claim.risk_level.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeClasses[claim.status as Status]}`}>
                    {statusLabels[claim.status as Status] || claim.status}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                  {claim.claim_type}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                  {claim.reviewer || 'Unassigned'}
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

        {filteredClaims.length === 0 && !loading && (
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