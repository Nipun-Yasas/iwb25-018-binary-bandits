"use client";

import { useState, MouseEvent } from "react";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme as useCustomTheme } from '../ClientThemeProvider';
import { useRouter } from "next/navigation";

const DoctorToolbarActions: React.FC = () => {
  const theme = useTheme();
  const { theme: customTheme, toggleTheme } = useCustomTheme();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    router.push('/doctor/profile');
    handleCloseMenu();
  };

  const handleSettingsClick = () => {
    router.push('/doctor/settings');
    handleCloseMenu();
  };

  const doctorProfile = {
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiology',
    avatar: null
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      {/* Theme Toggle Button */}
      <IconButton 
        onClick={toggleTheme}
        sx={{ 
          color: customTheme === 'light' ? '#0A74DA' : '#f8fafc',
          bgcolor: customTheme === 'light' ? 'rgba(10, 116, 218, 0.1)' : 'rgba(248, 250, 252, 0.1)',
          '&:hover': {
            bgcolor: customTheme === 'light' ? 'rgba(10, 116, 218, 0.2)' : 'rgba(248, 250, 252, 0.2)',
          }
        }}
        aria-label="Toggle theme"
      >
        {customTheme === 'light' ? (
          <SunIcon className="w-5 h-5" />
        ) : (
          <MoonIcon className="w-5 h-5" />
        )}
      </IconButton>

      <Divider orientation="vertical" flexItem />

      <Box
        sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
        onClick={handleOpenMenu}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar
            sx={{
              width: 44,
              height: 44,
              background: theme.palette.mode === 'dark'
                ? "linear-gradient(135deg, #4FC3F7 0%, #29B6F6 100%)"
                : "linear-gradient(135deg, #0A74DA 0%, #28a745 100%)",
              fontSize: "1.2rem",
              fontWeight: 700,
            }}
          >
            {doctorProfile.name.split(' ').map(n => n[0]).join('')}
          </Avatar>
          <Box sx={{ textAlign: 'left' }}>
            <Typography
              variant="body2"
              sx={{ 
                color: 'text.primary',
                fontWeight: 600,
                lineHeight: 1.2
              }}
            >
              {doctorProfile.name.split(" ")[0]}
            </Typography>
            <Typography
              variant="caption"
              sx={{ 
                color: 'text.secondary',
                fontSize: '0.75rem'
              }}
            >
              {doctorProfile.specialization}
            </Typography>
          </Box>
          <KeyboardArrowDownIcon
            sx={{
              color: "text.secondary",
              fontSize: 16,
              transform: open ? "rotate(180deg)" : "none",
              transition: "transform 0.2s",
            }}
          />
        </Stack>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        onClick={handleCloseMenu}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
            mt: 1.5,
            width: 200,
            borderRadius: 2,
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(30, 30, 30, 0.95)' 
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            "& .MuiMenuItem-root": {
              px: 2,
              py: 1.5,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleProfileClick}>
          <ListItemIcon>
            <PersonIcon fontSize="small" sx={{ color: "text.secondary" }} />
          </ListItemIcon>
          <Typography variant="body2" color="text.primary">
            My Profile
          </Typography>
        </MenuItem>

        <MenuItem onClick={handleSettingsClick}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" sx={{ color: "text.secondary" }} />
          </ListItemIcon>
          <Typography variant="body2" color="text.primary">
            Settings
          </Typography>
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        <MenuItem onClick={handleCloseMenu} sx={{ color: "primary.main" }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: "primary.main" }} />
          </ListItemIcon>
          <Typography variant="body2">Log out</Typography>
        </MenuItem>
      </Menu>
    </Stack>
  );
};

export default DoctorToolbarActions;
