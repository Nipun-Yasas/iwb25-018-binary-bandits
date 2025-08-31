"use client";

import React from "react";
import { Card, CardContent, Typography, Box, Grid, Chip } from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  People,
  LocalHospital,
  Assignment,
  MonetizationOn,
  Policy,
  HourglassEmpty,
} from "@mui/icons-material";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "primary" | "secondary" | "success" | "warning" | "error" | "info";
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = "primary",
}) => {
  const formatValue = (val: string | number): string => {
    if (typeof val === "number") {
      if (val >= 1000000) {
        return `$${(val / 1000000).toFixed(1)}M`;
      } else if (val >= 1000) {
        return `$${(val / 1000).toFixed(1)}K`;
      }
      return val.toLocaleString();
    }
    return val;
  };

  const getGradient = (colorTheme: string) => {
    const gradients = {
      primary: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
      success: "linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)",
      warning: "linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)",
      error: "linear-gradient(135deg, #d32f2f 0%, #f44336 100%)",
      info: "linear-gradient(135deg, #0288d1 0%, #03a9f4 100%)",
      secondary: "linear-gradient(135deg, #7b1fa2 0%, #9c27b0 100%)",
    };
    return gradients[colorTheme as keyof typeof gradients] || gradients.primary;
  };

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 4,
        border: "1px solid rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
        position: "relative",
        "&:hover": {
          transform: "translateY(-8px) scale(1.02)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: getGradient(color),
        },
      }}
    >
      <CardContent sx={{ p: 3, height: "100%" }}>
        <Box
          display="flex"
          alignItems="flex-start"
          justifyContent="space-between"
          mb={2}
        >
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              background: getGradient(color),
              color: "white",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
              minWidth: 56,
              minHeight: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
          {trend && (
            <Chip
              icon={trend.isPositive ? <TrendingUp /> : <TrendingDown />}
              label={`${trend.isPositive ? "+" : "-"}${Math.abs(trend.value)}%`}
              size="small"
              sx={{
                backgroundColor: trend.isPositive
                  ? "success.main"
                  : "error.main",
                color: "white",
                fontWeight: "bold",
                "& .MuiChip-icon": {
                  color: "white",
                },
              }}
            />
          )}
        </Box>

        <Box>
          <Typography
            variant="h3"
            component="div"
            fontWeight="bold"
            sx={{
              background: getGradient(color),
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
            }}
          >
            {formatValue(value)}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            fontWeight="medium"
            sx={{
              lineHeight: 1.2,
              fontSize: "0.95rem",
            }}
          >
            {title}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

interface StatCardsProps {
  data: {
    totalPatients: number;
    totalProviders: number;
    totalClaims: number;
    totalClaimAmount: number;
    activePolicies: number;
    pendingClaims: number;
  };
}

const StatCards: React.FC<StatCardsProps> = ({ data }) => {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <StatCard
          title="Total Patients"
          value={data.totalPatients}
          icon={<People fontSize="large" />}
          color="primary"
          trend={{ value: 12, isPositive: true }}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <StatCard
          title="Healthcare Providers"
          value={data.totalProviders}
          icon={<LocalHospital fontSize="large" />}
          color="info"
          trend={{ value: 5, isPositive: true }}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <StatCard
          title="Total Claims"
          value={data.totalClaims}
          icon={<Assignment fontSize="large" />}
          color="secondary"
          trend={{ value: 8, isPositive: true }}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <StatCard
          title="Claim Amount"
          value={data.totalClaimAmount}
          icon={<MonetizationOn fontSize="large" />}
          color="success"
          trend={{ value: 15, isPositive: true }}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <StatCard
          title="Active Policies"
          value={data.activePolicies}
          icon={<Policy fontSize="large" />}
          color="warning"
          trend={{ value: 3, isPositive: false }}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <StatCard
          title="Pending Claims"
          value={data.pendingClaims}
          icon={<HourglassEmpty fontSize="large" />}
          color="error"
          trend={{ value: 7, isPositive: false }}
        />
      </Grid>
    </Grid>
  );
};

export default StatCards;
