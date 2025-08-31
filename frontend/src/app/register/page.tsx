'use client';

import React, { useState } from 'react';
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff, PersonAdd } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Quantum } from "ldrs/react";
import "ldrs/react/Quantum.css";
interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  userId?: number;
  sessionToken?: string;
  user?: {
    id: number;
    username: string;
    email: string;
    fullName: string;
  };
  expiresAt?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    fullName: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterFormData> = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof RegisterFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data: RegisterResponse = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        
        // If session token is provided, store it and redirect
        if (data.sessionToken && data.user) {
          // Store session data in localStorage
          localStorage.setItem('sessionToken', data.sessionToken);
          localStorage.setItem('user', JSON.stringify(data.user));
          if (data.expiresAt) {
            localStorage.setItem('sessionExpiry', data.expiresAt);
          }
          
          // Show success message briefly then redirect
          setTimeout(() => {
            router.push('/login'); // Redirect to home page
          }, 1500);
        } else {
          // Reset form if no auto-login
          setFormData({
            username: '',
            email: '',
            password: '',
            fullName: ''
          });
        }
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Network error. Please check if the server is running.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <PersonAdd className="text-blue-600 text-3xl" />
            </div>
            <Typography variant="h4" component="h1" className="font-bold text-gray-800 mb-2">
              Sign Up
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Create your account to get started
            </Typography>
          </div>

          {message && (
            <Alert 
              severity={message.type} 
              className="mb-4"
              onClose={() => setMessage(null)}
            >
              {message.text}
              {message.type === 'success' && message.text.includes('logged in') && (
                <div className="mt-2 text-sm">
                  Redirecting to home page...
                </div>
              )}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              error={!!errors.fullName}
              helperText={errors.fullName}
              variant="outlined"
              disabled={loading}
            />

            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              error={!!errors.username}
              helperText={errors.username}
              variant="outlined"
              disabled={loading}
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
              variant="outlined"
              disabled={loading}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              error={!!errors.password}
              helperText={errors.password}
              variant="outlined"
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 py-3 mt-6"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Quantum size="45" speed="1.75" color="#5AA9F9" />
                  {message?.type === 'success' && message.text.includes('logged in') 
                    ? 'Logging in...' 
                    : 'Creating Account...'
                  }
                </div>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <div className="text-center mt-6">
            <Typography variant="body2" className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign in
              </Link>
            </Typography>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
