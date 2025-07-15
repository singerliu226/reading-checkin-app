import React from 'react'
import { Check } from 'lucide-react'

interface Step {
  id: number
  title: string
  description: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
  className?: string
}

export function StepIndicator({ steps, currentStep, className = '' }: StepIndicatorProps) {
  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isUpcoming = index > currentStep

          return (
            <div key={step.id} className="flex items-center">
              {/* Step circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                    ${isCompleted 
                      ? 'bg-amber-500 border-amber-500 text-white' 
                      : isCurrent 
                        ? 'bg-amber-100 border-amber-500 text-amber-700' 
                        : 'bg-white border-amber-200 text-amber-400'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step.id}</span>
                  )}
                </div>
                
                {/* Step info */}
                <div className="mt-2 text-center">
                  <div 
                    className={`
                      text-sm font-medium
                      ${isCurrent ? 'text-amber-700' : 'text-amber-600'}
                    `}
                  >
                    {step.title}
                  </div>
                  <div className="text-xs text-amber-500 mt-1 max-w-20">
                    {step.description}
                  </div>
                </div>
              </div>

              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div 
                  className={`
                    flex-1 h-0.5 mx-4 transition-all duration-300
                    ${isCompleted ? 'bg-amber-500' : 'bg-amber-200'}
                  `}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
