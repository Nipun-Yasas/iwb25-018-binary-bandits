'use client'

import React from 'react'
import { Bell, Moon, Sun, RefreshCw, Wifi, WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useTheme } from '@/contexts/ThemeContext'
import { useDashboard } from '@/contexts/DashboardContext'
import { cn } from '@/lib/utils'

export function Topbar() {
  const { theme, toggleTheme } = useTheme()
  const { isLive, lastUpdate, refreshData, toggleLive } = useDashboard()
  const [notifications] = React.useState(3)

  const formatLastUpdate = (date: Date) => {
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    return `${Math.floor(diff / 3600)}h ago`
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-700/60 shadow-sm">
      <div className="flex h-full items-center justify-between px-6">
        {/* Left Section - Hackathon Branding */}
        <div className="flex items-center space-x-4">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Insurance Claim Audit Dashboard
            </h1>
            <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
              <span>Hackathon Project 2025</span>
              <span>•</span>
              <span>Binary Bandits Team</span>
            </div>
          </div>
        </div>

        {/* Right Section - Controls */}
        <div className="flex items-center space-x-4">
          {/* Live Status */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleLive}
              className={cn(
                "flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm",
                isLive 
                  ? "bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-400 hover:from-green-200 hover:to-emerald-200 dark:hover:from-green-900/50 dark:hover:to-emerald-900/50 border border-green-200/60 dark:border-green-800/60" 
                  : "bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-800 dark:to-slate-800 text-gray-700 dark:text-gray-400 hover:from-gray-200 hover:to-slate-200 dark:hover:from-gray-700 dark:hover:to-slate-700 border border-gray-200/60 dark:border-gray-700/60"
              )}
            >
              {isLive ? (
                <Wifi className="h-4 w-4" />
              ) : (
                <WifiOff className="h-4 w-4" />
              )}
              <span>{isLive ? 'Live' : 'Offline'}</span>
              {isLive && <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />}
            </button>
            
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Updated {formatLastUpdate(lastUpdate)}
            </span>
          </div>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            className="h-9"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          {/* Dark Mode Toggle */}
          <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
            <Moon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 shadow-sm">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                {notifications}
              </span>
            )}
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center text-white text-sm font-medium">
              JD
            </div>
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                John Doe
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Audit Manager
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
