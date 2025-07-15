import React from 'react'

interface CircularProgressProps {
  percentage: number
  size?: number
  strokeWidth?: number
  title: string
  subtitle: string
  className?: string
}

export function CircularProgress({ 
  percentage, 
  size = 120, 
  strokeWidth = 8, 
  title,
  subtitle,
  className = '' 
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-amber-200/30"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-amber-500 transition-all duration-1000 ease-out"
          style={{
            filter: 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.4))'
          }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="text-2xl font-bold text-amber-800">
          {Math.round(percentage)}%
        </div>
        <div className="text-xs text-amber-600 font-medium">{title}</div>
        <div className="text-xs text-amber-500">{subtitle}</div>
      </div>
    </div>
  )
}
