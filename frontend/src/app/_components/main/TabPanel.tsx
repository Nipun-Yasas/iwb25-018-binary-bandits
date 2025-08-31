'use client';

import React from 'react';
import Box, { type BoxProps } from '@mui/material/Box';

export interface TabPanelProps extends BoxProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}

export default function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </Box>
  );
}
