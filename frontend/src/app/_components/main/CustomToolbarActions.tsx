'use client'

import Box from '@mui/material/Box';
import UserMenu from './UserMenu';
import IconButton from '@mui/material/IconButton';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../ClientThemeProvider';

export default function CustomToolbarActions() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <IconButton 
        onClick={toggleTheme}
        sx={{ 
          color: theme === 'light' ? '#3b82f6' : '#f8fafc',
          bgcolor: theme === 'light' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(248, 250, 252, 0.1)',
          '&:hover': {
            bgcolor: theme === 'light' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(248, 250, 252, 0.2)',
          }
        }}
        aria-label="Toggle theme"
      >
        {theme === 'light' ? (
          <SunIcon className="w-5 h-5" />
        ) : (
          <MoonIcon className="w-5 h-5" />
        )}
      </IconButton>
      <UserMenu />
    </Box>
  );
}