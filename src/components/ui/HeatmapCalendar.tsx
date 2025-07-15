import React from 'react'

interface HeatmapCalendarProps {
  data: { date: string; count: number }[]
  className?: string
}

export function HeatmapCalendar({ data, className = '' }: HeatmapCalendarProps) {
  // 生成过去90天的日期
  const generateDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 89; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      dates.push(date.toISOString().split('T')[0])
    }
    return dates
  }

  const dates = generateDates()
  const dataMap = data.reduce((acc, item) => {
    acc[item.date] = item.count
    return acc
  }, {} as Record<string, number>)

  const getIntensity = (count: number) => {
    if (count === 0) return 'bg-amber-100/20'
    if (count === 1) return 'bg-amber-200/40'
    if (count === 2) return 'bg-amber-300/60'
    if (count >= 3) return 'bg-amber-400/80'
    return 'bg-amber-500'
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }

  return (
    <div className={`${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-amber-800 mb-2">打卡足迹</h3>
        <p className="text-sm text-amber-600">过去90天的阅读记录</p>
      </div>
      
      <div className="grid grid-cols-13 gap-1">
        {dates.map((date) => {
          const count = dataMap[date] || 0
          return (
            <div
              key={date}
              className={`
                w-3 h-3 rounded-sm ${getIntensity(count)}
                border border-amber-200/30
                hover:scale-125 transition-transform cursor-pointer
                relative group
              `}
              title={`${formatDate(date)}: ${count}次打卡`}
            >
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-amber-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {formatDate(date)}: {count}次
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="flex items-center justify-between mt-4 text-xs text-amber-600">
        <span>过去90天</span>
        <div className="flex items-center space-x-1">
          <span>少</span>
          <div className="flex space-x-1">
            <div className="w-2 h-2 rounded-sm bg-amber-100/20 border border-amber-200/30"></div>
            <div className="w-2 h-2 rounded-sm bg-amber-200/40 border border-amber-200/30"></div>
            <div className="w-2 h-2 rounded-sm bg-amber-300/60 border border-amber-200/30"></div>
            <div className="w-2 h-2 rounded-sm bg-amber-400/80 border border-amber-200/30"></div>
            <div className="w-2 h-2 rounded-sm bg-amber-500 border border-amber-200/30"></div>
          </div>
          <span>多</span>
        </div>
      </div>
    </div>
  )
}
