"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Fade,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Add as AddIcon,
  ExitToApp as LogoutIcon,
  Analytics as AnalyticsIcon,
} from "@mui/icons-material";
import DashboardContent from "./components/DashboardContent";

type User = {
  full_name?: string;
  username?: string;
  [key: string]: unknown;
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("sessionToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleNewClaim = () => {
    window.location.href = "/claim-form";
  };
  return (
    <Container maxWidth="xl">
      <Fade in timeout={800}>
        <Box>
          {/* Welcome Header */}
          <Card
            elevation={3}
            sx={{
              mb: 4,
              borderRadius: 4,
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Grid container spacing={3} alignItems="center">
                <Grid size={{ xs: 12, md: 8 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar
                      sx={{
                        bgcolor: "primary.main",
                        mr: 2,
                        width: 56,
                        height: 56,
                        background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                      }}
                    >
                      <DashboardIcon fontSize="large" />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <AnalyticsIcon sx={{ mr: 1, color: "primary.main" }} />
                        {user
                          ? `Welcome back, ${user.fullName || user.username}!`
                          : "Advanced Analytics & Insights"}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ maxWidth: 600 }}
                  >
                    Monitor healthcare claims, track performance metrics, and
                    manage your insurance operations with our comprehensive
                    analytics platform.
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Box
                    display="flex"
                    gap={2}
                    justifyContent={{ xs: "flex-start", md: "flex-end" }}
                  >
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<LogoutIcon />}
                      onClick={handleLogout}
                      sx={{
                        borderRadius: 3,
                        px: 3,
                        color: "primary.main",
                        "&:hover": {
                          borderColor: "error.main",
                          color: "error.main",
                          backgroundColor: "rgba(244, 67, 54, 0.04)",
                        },
                      }}
                    >
                      Logout
                    </Button>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<AddIcon />}
                      onClick={handleNewClaim}
                      sx={{
                        borderRadius: 3,
                        px: 3,
                        background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                        boxShadow: "0 4px 20px rgba(25, 118, 210, 0.3)",
                        "&:hover": {
                          background:
                            "linear-gradient(45deg, #1565c0, #1976d2)",
                          boxShadow: "0 6px 25px rgba(25, 118, 210, 0.4)",
                        },
                      }}
                    >
                      Submit New Claim
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Dashboard Content */}
          <Box
            sx={{
              backdropFilter: "blur(20px)",
              borderRadius: 4,
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              overflow: "hidden",
            }}
          >
            <DashboardContent />
          </Box>
        </Box>
      </Fade>
    </Container>
  );
}
