const API_BASE_URL = 'http://localhost:8080/api'

export interface Claim {
  id: string
  submission_date: string
  amount: number
  risk_level: string
  status: string
  claim_type: string
  reviewer: string | null
  submitter_id: string
  description: string
  incident_date: string
  location: string
  created_at: string
  updated_at: string
}

export interface DashboardStats {
  summary: {
    total_claims: number
    total_fraud_alerts: number
    generated_at: string
    status: string
  }
  claims_by_status: {
    by_status: Array<{
      status: string
      count: number
      total_amount: number
    }>
  }
  claims_by_risk: {
    by_risk_level: Array<{
      risk_level: string
      count: number
      average_amount: number
    }>
  }
  fraud_alerts: {
    total: number
    active: number
    dismissed: number
  }
  financial_metrics: {
    total_amount: number
    average_amount: number
    high_value_claims: number
  }
  recent_activity: {
    recent_claims_30_days: number
    recent_fraud_alerts_30_days: number
    period: string
  }
}

export interface FraudAlert {
  id: string
  claim_id: string
  alert_type: string
  severity: string
  description: string
  status: string
  created_at: string
  updated_at: string
}

export interface ApiResponse<T> {
  message: string
  data?: T
  count?: number
  total_count?: number
  claims?: T  // For claims endpoint
  retrieved_at?: string
}

export interface BasicTestResponse {
  message: string
  timestamp: string
  service: string
}

export interface HealthCheckResponse {
  message: string
  timestamp: string
  database_status: string
  service_status: string
}

export interface DbTestResponse {
  message: string
  database_connection: string
  timestamp: string
}

export interface StatusUpdateResponse {
  message: string
  claim_id: string
  new_status: string
  updated_at: string
}

export interface AlertDismissResponse {
  message: string
  alert_id: string
  dismissed_at: string
}

// Enhanced fetch function with better error handling
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  console.log(`🔍 Making API request to: ${url}`)
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    console.log(`📡 Response status: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ API Error: ${response.status} - ${errorText}`)
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`✅ API Response:`, data)
    return data
  } catch (error) {
    console.error(`🚫 Network Error:`, error)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Cannot connect to backend server. Make sure it\'s running on http://localhost:8080')
    }
    throw error
  }
}

export const claimsApi = {
  getAllClaims: () => apiRequest<ApiResponse<Claim[]>>('/claims'),
  getClaimById: (id: string) => apiRequest<ApiResponse<Claim>>(`/claims/${id}`),
  getClaimsByStatus: (status: string) => apiRequest<ApiResponse<Claim[]>>(`/claims/status/${status}`),
  updateClaimStatus: (id: string, status: string) => 
    apiRequest<ApiResponse<StatusUpdateResponse>>(`/claims/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
}

export const dashboardApi = {
  getStats: () => apiRequest<ApiResponse<DashboardStats>>('/dashboard/stats'),
}

export const fraudApi = {
  getAllAlerts: () => apiRequest<ApiResponse<FraudAlert[]>>('/fraud'),
  getActiveAlerts: () => apiRequest<ApiResponse<FraudAlert[]>>('/fraud/active'),
  dismissAlert: (id: string) => 
    apiRequest<ApiResponse<AlertDismissResponse>>(`/fraud/${id}/dismiss`, {
      method: 'PUT',
    }),
}

// Test function to check backend connectivity
export const testApi = {
  healthCheck: () => apiRequest<HealthCheckResponse>('/health'),
  basicTest: () => apiRequest<BasicTestResponse>('/test'),
  dbTest: () => apiRequest<DbTestResponse>('/dbtest'),
}