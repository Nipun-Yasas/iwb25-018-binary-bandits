// Dashboard Components Index
export { default as StatCards } from './StatCards';
export { default as DashboardContent } from './DashboardContent';
export { 
  ClaimStatusPieChart, 
  ProviderTypePieChart, 
  PatientGenderPieChart 
} from './PieCharts';
export { 
  MonthlyClaimsTrend, 
  MonthlyAmountsTrend, 
  UtilizationTrend 
} from './LineCharts';
export { 
  TopProvidersBarChart, 
  AgeGroupBarChart, 
  PolicyStatusBarChart 
} from './BarCharts';
export { useDashboardStats } from './useDashboardStats';
export type { DashboardStats } from './useDashboardStats';
