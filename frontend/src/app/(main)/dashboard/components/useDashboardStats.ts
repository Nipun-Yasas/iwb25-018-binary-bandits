"use client";

import { useState, useEffect } from "react";

// Types for dashboard statistics
export interface DashboardStats {
  overview: {
    totalPatients: number;
    totalProviders: number;
    totalInsurers: number;
    totalPolicies: number;
    totalClaims: number;
  };
  claims: {
    statusBreakdown: {
      approved: number;
      pending: number;
      rejected: number;
      underReview: number;
    };
    totalClaimAmount: number;
    avgClaimAmount: number;
    pendingClaims: number;
    approvedClaims: number;
    rejectedClaims: number;
    monthlyTrends: Array<{
      month: string;
      claimCount: number;
      totalAmount: number;
    }>;
  };
  providers: {
    typeBreakdown: {
      doctors: number;
      hospitals: number;
      clinics: number;
      laboratories: number;
      pharmacies: number;
      others: number;
    };
    topProviders: Array<{
      providerId: string;
      name: string;
      type: string;
      claimCount: number;
      totalAmount: number;
    }>;
  };
  policies: {
    statusBreakdown: {
      active: number;
      expired: number;
      terminated: number;
    };
    totalCoverageAmount: number;
    avgCoverageAmount: number;
    activePolicies: number;
    expiredPolicies: number;
  };
  patients: {
    genderBreakdown: {
      male: number;
      female: number;
      other: number;
      unknown: number;
    };
    ageBreakdown: {
      under18: number;
      age18to30: number;
      age31to50: number;
      age51to65: number;
      over65: number;
    };
    totalPatients: number;
  };
  financial: {
    totalClaimAmount: number;
    totalCoverageAmount: number;
    avgClaimAmount: number;
    avgCoverageAmount: number;
    claimUtilizationRate: number;
    monthlyTrends: Array<{
      month: string;
      totalClaims: number;
      totalCoverage: number;
      utilizationRate: number;
    }>;
  };
}

interface UseDashboardStatsReturn {
  data: DashboardStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Custom hook to fetch dashboard statistics
export const useDashboardStats = (): UseDashboardStatsReturn => {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "http://localhost:8080/dashboard/statistics",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.message || "Failed to fetch statistics");
      }
    } catch (err) {
      console.error("Error fetching dashboard statistics:", err);
      setError(err instanceof Error ? err.message : "An error occurred");

      // Set mock data for development/demo purposes
      setData(getMockDashboardStats());
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchStats();
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { data, loading, error, refetch };
};

// Mock data for development/demo purposes
const getMockDashboardStats = (): DashboardStats => {
  return {
    overview: {
      totalPatients: 1250,
      totalProviders: 48,
      totalInsurers: 12,
      totalPolicies: 890,
      totalClaims: 324,
    },
    claims: {
      statusBreakdown: {
        approved: 186,
        pending: 89,
        rejected: 32,
        underReview: 17,
      },
      totalClaimAmount: 485750.5,
      avgClaimAmount: 1499.23,
      pendingClaims: 89,
      approvedClaims: 186,
      rejectedClaims: 32,
      monthlyTrends: [
        { month: "Jan 2025", claimCount: 45, totalAmount: 67500.0 },
        { month: "Feb 2025", claimCount: 52, totalAmount: 78000.0 },
        { month: "Mar 2025", claimCount: 48, totalAmount: 72000.0 },
        { month: "Apr 2025", claimCount: 59, totalAmount: 88500.0 },
        { month: "May 2025", claimCount: 55, totalAmount: 82500.0 },
        { month: "Jun 2025", claimCount: 65, totalAmount: 97500.0 },
      ],
    },
    providers: {
      typeBreakdown: {
        doctors: 28,
        hospitals: 8,
        clinics: 7,
        laboratories: 3,
        pharmacies: 2,
        others: 0,
      },
      topProviders: [
        {
          providerId: "HOSP001",
          name: "City General Hospital",
          type: "Hospital",
          claimCount: 89,
          totalAmount: 156750.0,
        },
        {
          providerId: "DR567",
          name: "Dr. Sarah Johnson",
          type: "Doctor",
          claimCount: 67,
          totalAmount: 89500.0,
        },
        {
          providerId: "CLIN003",
          name: "Wellness Medical Clinic",
          type: "Clinic",
          claimCount: 45,
          totalAmount: 67500.0,
        },
        {
          providerId: "DR234",
          name: "Dr. Michael Brown",
          type: "Doctor",
          claimCount: 38,
          totalAmount: 52750.0,
        },
        {
          providerId: "LAB001",
          name: "Advanced Diagnostics Lab",
          type: "Laboratory",
          claimCount: 32,
          totalAmount: 45000.0,
        },
      ],
    },
    policies: {
      statusBreakdown: {
        active: 756,
        expired: 98,
        terminated: 36,
      },
      totalCoverageAmount: 8900000.0,
      avgCoverageAmount: 10000.0,
      activePolicies: 756,
      expiredPolicies: 98,
    },
    patients: {
      genderBreakdown: {
        male: 620,
        female: 590,
        other: 25,
        unknown: 15,
      },
      ageBreakdown: {
        under18: 185,
        age18to30: 298,
        age31to50: 445,
        age51to65: 236,
        over65: 86,
      },
      totalPatients: 1250,
    },
    financial: {
      totalClaimAmount: 485750.5,
      totalCoverageAmount: 8900000.0,
      avgClaimAmount: 1499.23,
      avgCoverageAmount: 10000.0,
      claimUtilizationRate: 5.46,
      monthlyTrends: [
        {
          month: "Jan 2025",
          totalClaims: 67500.0,
          totalCoverage: 1200000.0,
          utilizationRate: 5.62,
        },
        {
          month: "Feb 2025",
          totalClaims: 78000.0,
          totalCoverage: 1250000.0,
          utilizationRate: 6.24,
        },
        {
          month: "Mar 2025",
          totalClaims: 72000.0,
          totalCoverage: 1300000.0,
          utilizationRate: 5.54,
        },
        {
          month: "Apr 2025",
          totalClaims: 88500.0,
          totalCoverage: 1350000.0,
          utilizationRate: 6.56,
        },
        {
          month: "May 2025",
          totalClaims: 82500.0,
          totalCoverage: 1400000.0,
          utilizationRate: 5.89,
        },
        {
          month: "Jun 2025",
          totalClaims: 97500.0,
          totalCoverage: 1450000.0,
          utilizationRate: 6.72,
        },
      ],
    },
  };
};

export default useDashboardStats;
