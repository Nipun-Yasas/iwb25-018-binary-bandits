"use client";

import React from 'react';
import { Fab, Tooltip } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { styled } from '@mui/material/styles';

const StyledFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: 20,
  left: 20,
  zIndex: 1000,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  animation: 'pulse 2s infinite',
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
      boxShadow: '0 0 0 0 rgba(25, 118, 210, 0.7)',
    },
    '70%': {
      transform: 'scale(1.05)',
      boxShadow: '0 0 0 10px rgba(25, 118, 210, 0)',
    },
    '100%': {
      transform: 'scale(1)',
      boxShadow: '0 0 0 0 rgba(25, 118, 210, 0)',
    },
  },
}));

interface ChatbotIconProps {
  onClick: () => void;
}

const ChatbotIcon: React.FC<ChatbotIconProps> = ({ onClick }) => {
  return (
    <Tooltip title="Insurance Claim Assistant" placement="top">
      <StyledFab onClick={onClick} aria-label="Open Insurance Claim Assistant">
        <ChatIcon />
      </StyledFab>
    </Tooltip>
  );
};

export default ChatbotIcon;
