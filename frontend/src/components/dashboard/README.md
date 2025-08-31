# Dashboard Components

This folder contains all the dashboard components for the Healthcare Claims Management System.

## Components Overview

### 1. StatCards.tsx
- **Purpose**: Displays key metrics as cards with icons and trend indicators
- **Features**: 
  - Color-coded cards for different metrics
  - Trend indicators (up/down arrows with percentages)
  - Responsive grid layout
  - Automatic number formatting

### 2. PieCharts.tsx
- **Purpose**: Pure CSS/SVG pie charts for distribution analysis
- **Charts Included**:
  - `ClaimStatusPieChart`: Shows distribution of claim statuses (Approved, Pending, Rejected, Under Review)
  - `ProviderTypePieChart`: Shows breakdown of provider types (Doctors, Hospitals, Clinics, etc.)
  - `PatientGenderPieChart`: Shows patient gender distribution
- **Features**:
  - Custom SVG-based pie charts (no external dependencies)
  - Color-coded segments with legends
  - Percentage calculations
  - Responsive design

### 3. LineCharts.tsx
- **Purpose**: SVG-based line charts for trend analysis
- **Charts Included**:
  - `MonthlyClaimsTrend`: Shows claim count trends over time
  - `MonthlyAmountsTrend`: Shows claim amount trends over time
  - `UtilizationTrend`: Shows claim utilization rate trends
- **Features**:
  - Gradient area fills
  - Interactive data points
  - Grid lines and axis labels
  - Responsive design

### 4. BarCharts.tsx
- **Purpose**: CSS-based bar charts for comparative analysis
- **Charts Included**:
  - `TopProvidersBarChart`: Shows top providers by claim count
  - `AgeGroupBarChart`: Shows patient age distribution
  - `PolicyStatusBarChart`: Shows policy status distribution
- **Features**:
  - Horizontal and vertical bar chart options
  - Color-coded bars
  - Value labels
  - Animated transitions

### 5. DashboardContent.tsx
- **Purpose**: Main dashboard component that combines all charts and statistics
- **Features**:
  - Responsive grid layout
  - Loading and error states
  - Refresh functionality
  - Organized sections for different types of analysis

### 6. useDashboardStats.ts
- **Purpose**: Custom React hook for fetching dashboard statistics
- **Features**:
  - API integration with backend statistics endpoint
  - Loading and error state management
  - Mock data fallback for development
  - Type-safe data handling
  - Automatic refetch functionality

## Data Flow

1. **API Call**: `useDashboardStats` hook calls `/dashboard/statistics` endpoint
2. **Data Processing**: Raw data is transformed into chart-friendly formats
3. **Component Rendering**: Each chart component receives specific data slices
4. **Real-time Updates**: Refresh button allows manual data updates

## Statistics Covered

### Overview Statistics
- Total Patients, Providers, Insurers, Policies, Claims
- Key performance indicators with trend indicators

### Claims Analysis
- Status distribution (Approved, Pending, Rejected, Under Review)
- Monthly trends (count and amounts)
- Average claim amounts
- Processing metrics

### Provider Analysis
- Provider type breakdown
- Top providers by volume
- Performance metrics

### Patient Demographics
- Gender distribution
- Age group analysis
- Total patient counts

### Policy Analysis
- Policy status distribution
- Coverage amounts
- Active vs expired policies

### Financial Analysis
- Total claim amounts
- Coverage utilization rates
- Monthly financial trends
- Average amounts and ratios

## Styling

- **Material-UI**: Used for consistent theming and responsive design
- **Custom Colors**: Each chart type uses distinct color schemes
- **Gradients**: Applied to enhance visual appeal
- **Animations**: Smooth transitions and hover effects

## Usage

```tsx
import { DashboardContent } from '@/components/dashboard';

function DashboardPage() {
  return <DashboardContent />;
}
```

## Backend Integration

The components integrate with the backend statistics service located at:
- **Backend Module**: `backend/modules/statistics/statistics_service.bal`
- **API Endpoint**: `GET /dashboard/statistics`
- **Main Service**: Updated `main.bal` to include statistics endpoints

## Development Notes

- All charts are built with pure CSS/SVG for performance and to avoid external chart library dependencies
- Components include fallback mock data for development when backend is unavailable
- TypeScript interfaces ensure type safety across all components
- Responsive design ensures compatibility across different screen sizes
