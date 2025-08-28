"use client";

import { Typography, Box } from "@mui/material";
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const DoctorAppTitle: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <LocalHospitalIcon sx={{ color: 'primary.main', fontSize: 28 }} />
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          background: (theme) => theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, #4FC3F7 0%, #29B6F6 50%, #0288D1 100%)'
            : 'linear-gradient(135deg, #0A74DA 0%, #28a745 50%, #0A74DA 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '1.25rem',
        }}
      >
        HealthCare Portal
      </Typography>
    </Box>
  );
};

export default DoctorAppTitle;
