'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  FileText, 
  Shield, 
  Settings, 
  Activity,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
    description: 'Overview & Analytics'
  },
  {
    title: 'Claims',
    href: '/claims',
    icon: FileText,
    description: 'Manage Claims'
  },
  {
    title: 'Fraud Alerts',
    href: '/fraud-alerts',
    icon: Shield,
    description: 'Security & Fraud'
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'System Config'
  }
]

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <motion.aside
      initial={false}
      animate={{
        width: isCollapsed ? 80 : 280
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut"
      }}
      className="h-screen bg-white backdrop-blur-md border-r border-slate-200/60 shadow-xl"
    >
      <div className="flex h-full flex-col">
        {/* Logo Section */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200/60 bg-slate-50/50">
          <motion.div
            initial={false}
            animate={{
              opacity: isCollapsed ? 0 : 1,
              scale: isCollapsed ? 0.8 : 1
            }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-teal-600 text-white">
              <Activity className="h-6 w-6" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-lg font-bold text-slate-900">
                  ClaimSecure
                </span>
                <span className="text-xs text-slate-500">
                  Insurance Audit
                </span>
              </div>
            )}
          </motion.div>
          
          <button
            onClick={onToggle}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200/60 bg-white text-slate-600 hover:bg-slate-50 transition-all duration-200 shadow-sm"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 backdrop-blur-sm",
                  isActive
                    ? "bg-gradient-to-r from-blue-100 to-teal-100 dark:from-blue-900/30 dark:to-teal-900/30 text-blue-700 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 shadow-sm"
                    : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 shrink-0",
                  isActive ? "text-blue-700 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"
                )} />
                
                <motion.div
                  initial={false}
                  animate={{
                    opacity: isCollapsed ? 0 : 1,
                    width: isCollapsed ? 0 : "auto"
                  }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  {!isCollapsed && (
                    <div className="flex flex-col">
                      <span>{item.title}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {item.description}
                      </span>
                    </div>
                  )}
                </motion.div>
              </Link>
            )
          })}
        </nav>

        {/* Live Status Indicator */}
        <motion.div
          initial={false}
          animate={{
            opacity: isCollapsed ? 0 : 1
          }}
          transition={{ duration: 0.2 }}
          className="p-4 border-t border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-slate-800 dark:to-slate-700"
        >
          {!isCollapsed && (
            <div className="flex items-center space-x-2 text-sm">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-slate-600">
                System Online
              </span>
            </div>
          )}
        </motion.div>
      </div>
    </motion.aside>
  )
}
