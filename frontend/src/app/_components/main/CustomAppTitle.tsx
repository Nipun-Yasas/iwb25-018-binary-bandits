import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';

export default function CustomAppTitle() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center', 
        justifyContent: 'space-between',
        width: '100%', 
        px: 2,
        gap: 2
      }}
    >
     <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
          borderRadius: '8px',
          width: '34px',
          height: '34px',
          boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)'
        }}>
          <ShieldCheckIcon style={{ color: 'white', width: '20px', height: '20px' }} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.2
            }}
          >
            Insurance Audit
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: (theme) => theme.palette.mode === 'light' ? '#475569' : '#94a3b8',
              lineHeight: 1
            }}
          >
            Fraud Detection Platform
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
