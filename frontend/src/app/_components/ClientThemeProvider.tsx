"use client";

import { useEffect, createContext, useContext, useState } from "react";

// Create a theme context
export type ThemeMode = 'light' | 'dark';
type ThemeContextType = {
  theme: ThemeMode;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

// Custom hook to use theme
export const useTheme = () => useContext(ThemeContext);

export default function ClientThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<ThemeMode>('light');

  // Initialize theme based on system preference or stored preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const html = document.documentElement;
      
      // Check local storage first
      const storedTheme = localStorage.getItem('theme') as ThemeMode;
      
      if (storedTheme) {
        setTheme(storedTheme);
        html.setAttribute("data-toolpad-color-scheme", storedTheme);
        
        if (storedTheme === 'dark') {
          html.classList.add('dark');
        } else {
          html.classList.remove('dark');
        }
      } 
      // If no stored theme, check system preference
      else {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = systemPrefersDark ? 'dark' : 'light';
        
        setTheme(initialTheme);
        html.setAttribute("data-toolpad-color-scheme", initialTheme);
        
        if (initialTheme === 'dark') {
          html.classList.add('dark');
        }
      }
    }
  }, []);

  // Function to toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    const html = document.documentElement;
    html.setAttribute("data-toolpad-color-scheme", newTheme);
    
    if (newTheme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}


