"use client";

import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

// Simple line chart component using SVG
interface LineChartData {
  month: string;
  value: number;
}

interface SimpleLineChartProps {
  data: LineChartData[];
  title: string;
  color?: string;
  height?: number;
  yAxisLabel?: string;
}

const SimpleLineChart: React.FC<SimpleLineChartProps> = ({
  data,
  title,
  color = "#2196f3",
  height = 300,
  yAxisLabel = "Value",
}) => {
  if (!data || data.length === 0) {
    return (
      <Card sx={{ height: "100%" }}>
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

  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const valueRange = maxValue - minValue || 1;

  const chartWidth = 400;
  const chartHeight = 200;
  const padding = 40;

  // Create points for the line
  const points = data.map((item, index) => {
    const x =
      padding + (index * (chartWidth - 2 * padding)) / (data.length - 1);
    const y =
      chartHeight -
      padding -
      ((item.value - minValue) / valueRange) * (chartHeight - 2 * padding);
    return { x, y, value: item.value, month: item.month };
  });

  // Create path string for the line
  const pathData = points.reduce((path, point, index) => {
    const command = index === 0 ? "M" : "L";
    return `${path} ${command} ${point.x} ${point.y}`;
  }, "");

  // Create area path for gradient fill
  const areaData = `${pathData} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`;

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom>
          {title}
        </Typography>

        <Box sx={{ width: "100%", overflow: "auto" }}>
          <svg
            width={chartWidth}
            height={chartHeight + 60}
            viewBox={`0 0 ${chartWidth} ${chartHeight + 60}`}
          >
            {/* Define gradient */}
            <defs>
              <linearGradient
                id={`gradient-${title.replace(/\s+/g, "-")}`}
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={color} stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => {
              const y = padding + (i * (chartHeight - 2 * padding)) / 4;
              const value = maxValue - (i * valueRange) / 4;
              return (
                <g key={i}>
                  <line
                    x1={padding}
                    y1={y}
                    x2={chartWidth - padding}
                    y2={y}
                    stroke="#e0e0e0"
                    strokeDasharray="2,2"
                  />
                  <text
                    x={padding - 10}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="10"
                    fill="#666"
                  >
                    {Math.round(value).toLocaleString()}
                  </text>
                </g>
              );
            })}

            {/* Area fill */}
            <path
              d={areaData}
              fill={`url(#gradient-${title.replace(/\s+/g, "-")})`}
            />

            {/* Line */}
            <path
              d={pathData}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points */}
            {points.map((point, index) => (
              <g key={index}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill={color}
                  stroke="white"
                  strokeWidth="2"
                />
                {/* X-axis labels */}
                <text
                  x={point.x}
                  y={chartHeight + 20}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#666"
                >
                  {point.month}
                </text>
              </g>
            ))}

            {/* Y-axis label */}
            <text x="15" y="20" fontSize="12" fill="#666" fontWeight="bold">
              {yAxisLabel}
            </text>
          </svg>
        </Box>
      </CardContent>
    </Card>
  );
};

// Monthly claims trend line chart
interface MonthlyClaimsTrendProps {
  data: Array<{
    month: string;
    claimCount: number;
    totalAmount: number;
  }>;
}

export const MonthlyClaimsTrend: React.FC<MonthlyClaimsTrendProps> = ({
  data,
}) => {
  const chartData = data.map((item) => ({
    month: item.month,
    value: item.claimCount,
  }));

  return (
    <SimpleLineChart
      data={chartData}
      title="Monthly Claims Trend"
      color="#2196f3"
      yAxisLabel="Number of Claims"
    />
  );
};

// Monthly claim amounts trend
export const MonthlyAmountsTrend: React.FC<MonthlyClaimsTrendProps> = ({
  data,
}) => {
  const chartData = data.map((item) => ({
    month: item.month,
    value: item.totalAmount,
  }));

  return (
    <SimpleLineChart
      data={chartData}
      title="Monthly Claim Amounts"
      color="#4caf50"
      yAxisLabel="Amount ($)"
    />
  );
};

// Financial utilization trend
interface FinancialTrendProps {
  data: Array<{
    month: string;
    totalClaims: number;
    totalCoverage: number;
    utilizationRate: number;
  }>;
}

export const UtilizationTrend: React.FC<FinancialTrendProps> = ({ data }) => {
  const chartData = data.map((item) => ({
    month: item.month,
    value: item.utilizationRate,
  }));

  return (
    <SimpleLineChart
      data={chartData}
      title="Claim Utilization Rate Trend"
      color="#ff9800"
      yAxisLabel="Utilization Rate (%)"
    />
  );
};

export default SimpleLineChart;
