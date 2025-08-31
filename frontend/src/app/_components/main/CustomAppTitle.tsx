import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { BookOpen } from "lucide-react";

export default function CustomAppTitle() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center', 
        justifyContent: 'space-between',
        width: '100%', 
        px: 2,
        gap:5 
      }}
    >
     <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <BookOpen size={20} color="primary.main" />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            FastClaim
          </Typography>
        </Box>
    </Box>
  );
}
