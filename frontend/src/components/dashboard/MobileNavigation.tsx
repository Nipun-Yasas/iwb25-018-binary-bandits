'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { BarChart3, FileText, Shield, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
  },
  {
    title: 'Claims',
    href: '/claims',
    icon: FileText,
  },
  {
    title: 'Fraud',
    href: '/fraud-alerts',
    icon: Shield,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  }
]

export function MobileNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 lg:hidden">
      <div className="flex items-center justify-around px-4 py-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200",
                isActive
                  ? "text-blue-700 dark:text-blue-400"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <Icon className={cn(
                "h-5 w-5",
                isActive ? "text-blue-700 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"
              )} />
              <span>{item.title}</span>
              {isActive && (
                <motion.div
                  layoutId="mobileActiveTab"
                  className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"
                />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
