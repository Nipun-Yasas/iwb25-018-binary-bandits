'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';

// Simple pie chart component using CSS
interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface SimplePieChartProps {
  data: PieChartData[];
  title: string;
  height?: number;
}

const SimplePieChart: React.FC<SimplePieChartProps> = ({ 
  data, 
  title, 
  height = 300 
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Calculate angles for each segment
  let currentAngle = 0;
  const segments = data.map(item => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const segment = {
      ...item,
      percentage,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
    };
    currentAngle += angle;
    return segment;
  });

  const createPath = (startAngle: number, endAngle: number, radius: number) => {
    const center = 100;
    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (endAngle - 90) * (Math.PI / 180);
    
    const x1 = center + radius * Math.cos(startAngleRad);
    const y1 = center + radius * Math.sin(startAngleRad);
    const x2 = center + radius * Math.cos(endAngleRad);
    const y2 = center + radius * Math.sin(endAngleRad);
    
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    
    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom>
          {title}
        </Typography>
        
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box sx={{ width: '60%' }}>
            <svg width="200" height="200" viewBox="0 0 200 200">
              {segments.map((segment, index) => (
                <path
                  key={index}
                  d={createPath(segment.startAngle, segment.endAngle, 80)}
                  fill={segment.color}
                  stroke="#fff"
                  strokeWidth="2"
                />
              ))}
            </svg>
          </Box>
          
          <Box sx={{ width: '40%' }}>
            {segments.map((segment, index) => (
              <Box key={index} display="flex" alignItems="center" mb={1}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    backgroundColor: segment.color,
                    borderRadius: '50%',
                    mr: 1,
                  }}
                />
                <Box>
                  <Typography variant="body2" fontSize="0.8rem">
                    {segment.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {segment.value} ({segment.percentage.toFixed(1)}%)
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// Pie chart for claim status
interface ClaimStatusPieChartProps {
  data: {
    approved: number;
    pending: number;
    rejected: number;
    underReview: number;
  };
}

export const ClaimStatusPieChart: React.FC<ClaimStatusPieChartProps> = ({ data }) => {
  const chartData: PieChartData[] = [
    { name: 'Approved', value: data.approved, color: '#4caf50' },
    { name: 'Pending', value: data.pending, color: '#ff9800' },
    { name: 'Rejected', value: data.rejected, color: '#f44336' },
    { name: 'Under Review', value: data.underReview, color: '#2196f3' },
  ];

  return (
    <SimplePieChart
      data={chartData}
      title="Claim Status Distribution"
    />
  );
};

// Pie chart for provider types
interface ProviderTypePieChartProps {
  data: {
    doctors: number;
    hospitals: number;
    clinics: number;
    laboratories: number;
    pharmacies: number;
    others: number;
  };
}

export const ProviderTypePieChart: React.FC<ProviderTypePieChartProps> = ({ data }) => {
  const chartData: PieChartData[] = [
    { name: 'Doctors', value: data.doctors, color: '#2196f3' },
    { name: 'Hospitals', value: data.hospitals, color: '#4caf50' },
    { name: 'Clinics', value: data.clinics, color: '#ff9800' },
    { name: 'Laboratories', value: data.laboratories, color: '#9c27b0' },
    { name: 'Pharmacies', value: data.pharmacies, color: '#f44336' },
    { name: 'Others', value: data.others, color: '#607d8b' },
  ].filter(item => item.value > 0);

  return (
    <SimplePieChart
      data={chartData}
      title="Provider Type Distribution"
    />
  );
};

// Pie chart for patient gender
interface PatientGenderPieChartProps {
  data: {
    male: number;
    female: number;
    other: number;
    unknown: number;
  };
}

export const PatientGenderPieChart: React.FC<PatientGenderPieChartProps> = ({ data }) => {
  const chartData: PieChartData[] = [
    { name: 'Male', value: data.male, color: '#2196f3' },
    { name: 'Female', value: data.female, color: '#e91e63' },
    { name: 'Other', value: data.other, color: '#9c27b0' },
    { name: 'Unknown', value: data.unknown, color: '#607d8b' },
  ].filter(item => item.value > 0);

  return (
    <SimplePieChart
      data={chartData}
      title="Patient Gender Distribution"
    />
  );
};

export default SimplePieChart;
