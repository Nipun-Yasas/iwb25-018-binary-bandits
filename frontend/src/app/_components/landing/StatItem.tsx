import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CountUp from "react-countup";
import React from "react";

interface StatItemProps {
  icon: React.ReactNode;
  number: number;
  text: string;
  suffix?: string; // default: '+'
}

const StatItem: React.FC<StatItemProps> = ({ icon, number, text, suffix = "+" }) => (
  <Box
    textAlign="center"
    display="flex"
    flexDirection="column"
    alignItems="center"
    sx={{
      p: 3,
      borderRadius: 3,
      background: "rgba(25,118,210,0.04)",
      backdropFilter: "blur(8px)",
      border: "1px solid rgba(25,118,210,0.12)",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 10px 30px rgba(25,118,210,0.2)",
        background: "rgba(0,191,165,0.06)",
      },
    }}
  >
    <Box
      sx={{
        p: 2,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #1976d2 0%, #00bfa5 100%)",
        mb: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        width: 64,
        height: 64,
      }}
    >
      {icon}
    </Box>

    <Typography
      variant="h4"
      fontWeight="bold"
      sx={{
        fontSize: { xs: "2rem", md: "2.5rem" },
        background: "linear-gradient(135deg, #1976d2 0%, #00bfa5 100%)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        mb: 1,
      }}
    >
      <CountUp end={number} duration={2.2} separator="," />
      {suffix}
    </Typography>

    <Typography
      variant="body1"
      sx={{
        fontSize: { xs: "0.9rem", md: "1rem" },
        color: "text.secondary",
        fontWeight: 500,
      }}
    >
      {text}
    </Typography>
  </Box>
);

export default StatItem;
