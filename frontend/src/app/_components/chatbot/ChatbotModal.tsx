"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Avatar,
  CircularProgress,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Send as SendIcon,
  Close as CloseIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  AttachFile as AttachFileIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const ChatContainer = styled(Box)(({ theme }) => ({
  height: '400px',
  overflowY: 'auto',
  padding: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const MessageBubble = styled(Paper)<{ isUser: boolean }>(({ theme, isUser }) => ({
  padding: theme.spacing(1, 2),
  maxWidth: '80%',
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  backgroundColor: isUser ? theme.palette.primary.main : theme.palette.grey[100],
  color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
  borderRadius: isUser ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
}));

const MessageContainer = styled(Box)<{ isUser: boolean }>(({ isUser }) => ({
  display: 'flex',
  alignItems: 'flex-end',
  gap: 8,
  flexDirection: isUser ? 'row-reverse' : 'row',
}));

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  analysis?: any;
}

interface ChatbotModalProps {
  open: boolean;
  onClose: () => void;
}

const ChatbotModal: React.FC<ChatbotModalProps> = ({ open, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your Insurance Claim Assistant. I can help you analyze and validate insurance claims. You can ask me about claim documentation, fraud detection, or upload claim details for analysis.',
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const analyzeInsuranceClaim = async (userMessage: string, file?: File) => {
    try {
      let fileData = '';
      
      if (file) {
        // For demo purposes, we'll use the filename and basic info
        // In a real implementation, you'd extract text from the file
        fileData = `Uploaded file: ${file.name} (${file.type}, ${(file.size / 1024).toFixed(2)} KB)`;
      }

      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          fileData: fileData
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        return result.response;
      } else {
        throw new Error(result.error || 'Unknown error occurred');
      }

    } catch (error) {
      console.error('Error analyzing insurance claim:', error);
      return 'I\'m sorry, I encountered an error while analyzing your claim. Please try again or contact support if the issue persists.';
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() && !selectedFile) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue || (selectedFile ? `Uploaded file: ${selectedFile.name}` : ''),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await analyzeInsuranceClaim(inputValue, selectedFile || undefined);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Error in handleSend:', err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I apologize, but I\'m experiencing technical difficulties. Please try again later.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setSelectedFile(null);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { height: '80vh', display: 'flex', flexDirection: 'column' }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BotIcon color="primary" />
          <Typography variant="h6">Insurance Claim Assistant</Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={{ flex: 1, padding: 0 }}>
        <ChatContainer>
          {messages.map((message) => (
            <MessageContainer key={message.id} isUser={message.isUser}>
              <Avatar sx={{ width: 32, height: 32 }}>
                {message.isUser ? <PersonIcon /> : <BotIcon />}
              </Avatar>
              <MessageBubble isUser={message.isUser}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {message.text}
                </Typography>
              </MessageBubble>
            </MessageContainer>
          ))}
          
          {isLoading && (
            <MessageContainer isUser={false}>
              <Avatar sx={{ width: 32, height: 32 }}>
                <BotIcon />
              </Avatar>
              <MessageBubble isUser={false}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} />
                  <Typography variant="body2">Analyzing claim...</Typography>
                </Box>
              </MessageBubble>
            </MessageContainer>
          )}
          
          <div ref={chatEndRef} />
        </ChatContainer>
      </DialogContent>
      
      <Divider />
      
      <DialogActions sx={{ padding: 2 }}>
        <Box sx={{ display: 'flex', width: '100%', gap: 1, alignItems: 'flex-end' }}>
          {selectedFile && (
            <Chip
              label={selectedFile.name}
              onDelete={() => setSelectedFile(null)}
              color="primary"
              variant="outlined"
              size="small"
            />
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            hidden
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
          />
          
          <IconButton
            onClick={() => fileInputRef.current?.click()}
            color="primary"
            disabled={isLoading}
          >
            <AttachFileIcon />
          </IconButton>
          
          <TextField
            fullWidth
            multiline
            maxRows={3}
            placeholder="Ask about insurance claims, upload documents, or describe your claim..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            variant="outlined"
            size="small"
          />
          
          <Button
            onClick={handleSend}
            disabled={(!inputValue.trim() && !selectedFile) || isLoading}
            variant="contained"
            endIcon={<SendIcon />}
            sx={{ minWidth: 'auto' }}
          >
            Send
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ChatbotModal;
