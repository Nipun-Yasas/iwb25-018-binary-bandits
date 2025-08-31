'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';

// Simple bar chart component using CSS
interface BarChartData {
  name: string;
  value: number;
  color?: string;
}

interface SimpleBarChartProps {
  data: BarChartData[];
  title: string;
  color?: string;
  horizontal?: boolean;
  height?: number;
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ 
  data, 
  title, 
  color = '#2196f3',
  horizontal = false,
  height = 300 
}) => {
  if (!data || data.length === 0) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom>
          {title}
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          {horizontal ? (
            // Horizontal bar chart
            <Box>
              {data.map((item, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                    <Typography variant="body2" fontSize="0.85rem">
                      {item.name}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {item.value.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: '100%',
                      height: 20,
                      backgroundColor: '#f5f5f5',
                      borderRadius: 1,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        height: '100%',
                        width: `${(item.value / maxValue) * 100}%`,
                        backgroundColor: item.color || color,
                        borderRadius: 1,
                        transition: 'width 0.3s ease-in-out',
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            // Vertical bar chart
            <Box display="flex" alignItems="end" justifyContent="space-around" height={height - 100}>
              {data.map((item, index) => (
                <Box key={index} display="flex" flexDirection="column" alignItems="center">
                  <Typography variant="body2" fontWeight="bold" mb={1}>
                    {item.value.toLocaleString()}
                  </Typography>
                  <Box
                    sx={{
                      width: 40,
                      height: `${(item.value / maxValue) * (height - 150)}px`,
                      backgroundColor: item.color || color,
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.3s ease-in-out',
                      mb: 1,
                    }}
                  />
                  <Typography 
                    variant="caption" 
                    textAlign="center"
                    sx={{ 
                      writingMode: 'horizontal-tb',
                      maxWidth: 60,
                      wordWrap: 'break-word',
                      fontSize: '0.7rem',
                    }}
                  >
                    {item.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

// Top providers bar chart
interface TopProvidersBarChartProps {
  data: Array<{
    providerId: string;
    name: string;
    type: string;
    claimCount: number;
    totalAmount: number;
  }>;
}

export const TopProvidersBarChart: React.FC<TopProvidersBarChartProps> = ({ data }) => {
  const chartData = data.map(provider => ({
    name: provider.name.length > 15 ? provider.name.substring(0, 15) + '...' : provider.name,
    value: provider.claimCount,
    color: provider.type === 'Doctor' ? '#2196f3' :
           provider.type === 'Hospital' ? '#4caf50' :
           provider.type === 'Clinic' ? '#ff9800' :
           provider.type === 'Laboratory' ? '#9c27b0' :
           provider.type === 'Pharmacy' ? '#f44336' : '#607d8b',
  }));

  return (
    <SimpleBarChart
      data={chartData}
      title="Top Providers by Claims"
      horizontal={true}
    />
  );
};

// Age group distribution bar chart
interface AgeGroupBarChartProps {
  data: {
    under18: number;
    age18to30: number;
    age31to50: number;
    age51to65: number;
    over65: number;
  };
}

export const AgeGroupBarChart: React.FC<AgeGroupBarChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Under 18', value: data.under18, color: '#2196f3' },
    { name: '18-30', value: data.age18to30, color: '#4caf50' },
    { name: '31-50', value: data.age31to50, color: '#ff9800' },
    { name: '51-65', value: data.age51to65, color: '#f44336' },
    { name: 'Over 65', value: data.over65, color: '#9c27b0' },
  ];

  return (
    <SimpleBarChart
      data={chartData}
      title="Patient Age Distribution"
      horizontal={false}
    />
  );
};

// Policy status bar chart
interface PolicyStatusBarChartProps {
  data: {
    active: number;
    expired: number;
    terminated: number;
  };
}

export const PolicyStatusBarChart: React.FC<PolicyStatusBarChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Active', value: data.active, color: '#4caf50' },
    { name: 'Expired', value: data.expired, color: '#ff9800' },
    { name: 'Terminated', value: data.terminated, color: '#f44336' },
  ];

  return (
    <SimpleBarChart
      data={chartData}
      title="Policy Status Distribution"
      horizontal={false}
    />
  );
};

export default SimpleBarChart;
