'use client'

import React from 'react'
import { Palette } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface BackgroundSelectorProps {
  currentBg: string
  onBgChange: (bg: string) => void
}

const backgroundOptions = [
  { id: 'bg-option-1', name: 'Classic Gray', description: 'Professional gray gradient' },
  { id: 'bg-option-2', name: 'Ocean Blue', description: 'Calming blue tones' },
  { id: 'bg-option-3', name: 'Fresh Teal', description: 'Modern teal gradient' },
  { id: 'bg-option-4', name: 'Nature Green', description: 'Refreshing green shades' },
  { id: 'bg-option-5', name: 'Warm Orange', description: 'Energetic orange tones' },
  { id: 'bg-option-6', name: 'Soft Pink', description: 'Gentle rose gradient' },
  { id: 'bg-option-7', name: 'Royal Purple', description: 'Elegant purple shades' },
  { id: 'bg-option-8', name: 'Deep Indigo', description: 'Rich indigo gradient' },
  { id: 'bg-option-9', name: 'Golden Yellow', description: 'Bright golden tones' }
]

export function BackgroundSelector({ currentBg, onBgChange }: BackgroundSelectorProps) {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-semibold text-slate-900 dark:text-white">
          <Palette className="h-5 w-5 mr-2" />
          Background Theme
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {backgroundOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => onBgChange(option.id)}
              className={`group relative h-16 w-full rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                currentBg === option.id 
                  ? 'border-blue-500 shadow-lg' 
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              } ${option.id}`}
              title={option.description}
            >
              <div className="absolute inset-0 bg-black/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <span className="text-white text-xs font-medium text-center px-2">
                  {option.name}
                </span>
              </div>
              {currentBg === option.id && (
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-blue-500 rounded-full border-2 border-white"></div>
              )}
            </button>
          ))}
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 text-center">
          Click any color to change the dashboard background
        </p>
      </CardContent>
    </Card>
  )
}
