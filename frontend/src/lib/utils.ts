import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'approved':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'rejected':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'pending':
    case 'suspicious':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export function getDarkStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'approved':
      return 'bg-green-900/30 text-green-400 border-green-800'
    case 'rejected':
      return 'bg-red-900/30 text-red-400 border-red-800'
    case 'pending':
    case 'suspicious':
      return 'bg-orange-900/30 text-orange-400 border-orange-800'
    default:
      return 'bg-gray-900/30 text-gray-400 border-gray-800'
  }
}

export function generateMockData() {
  const claims = []
  const hospitals = ['City General Hospital', 'Memorial Medical Center', 'St. Mary\'s Hospital', 'Regional Medical Center', 'University Hospital']
  const statuses = ['approved', 'rejected', 'pending', 'suspicious']
  
  for (let i = 1; i <= 50; i++) {
    claims.push({
      id: `CLM-${i.toString().padStart(4, '0')}`,
      hospital: hospitals[Math.floor(Math.random() * hospitals.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      amount: Math.floor(Math.random() * 50000) + 1000,
      fraudFlag: Math.random() > 0.8,
      submittedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      patientAge: Math.floor(Math.random() * 80) + 18,
      treatmentType: ['Emergency', 'Surgery', 'Consultation', 'Diagnostic', 'Therapy'][Math.floor(Math.random() * 5)]
    })
  }
  
  return claims
}
