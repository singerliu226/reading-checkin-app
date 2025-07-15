import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { useCheckIn } from '@/hooks/useCheckIn'
import { Book, Timer, User, TrendingUp, Clock, Edit3, Sparkles, Target, Calendar, BookOpen, Play, Pause, Square, ArrowRight, Palette, BarChart3, Zap, Star, Heart, Coffee, Leaf, Wand2 } from 'lucide-react'
import { HeatmapCalendar } from '@/components/ui/HeatmapCalendar'
import { CircularProgress } from '@/components/ui/CircularProgress'

export function HomePage() {
  const { user, loading: authLoading } = useAuth()
  const { getCheckInStats } = useCheckIn()
  const navigate = useNavigate()
  
  // 计时器状态
  const [isRunning, setIsRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  
  // 其他状态
  const [stats, setStats] = useState({
    totalCheckins: 0,
    totalSeconds: 0,
    streak: 0
  })
  const [statsLoading, setStatsLoading] = useState(false)
  const [showManualInput, setShowManualInput] = useState(false)
  const [manualMinutes, setManualMinutes] = useState('')
  const [heatmapData, setHeatmapData] = useState<{ date: string; count: number }[]>([])

  // 计时器逻辑
  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - seconds * 1000
      intervalRef.current = setInterval(() => {
        const now = Date.now()
        const elapsed = Math.floor((now - startTimeRef.current) / 1000)
        setSeconds(elapsed)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  const startTimer = () => {
    console.log('开始计时器被调用')
    setIsRunning(true)
  }

  const pauseTimer = () => {
    console.log('暂停计时器被调用')
    setIsRunning(false)
  }

  const stopTimer = () => {
    console.log('停止计时器被调用，时长:', seconds)
    setIsRunning(false)
    // Navigate to notes page with reading duration
    navigate('/notes', { state: { duration: seconds } })
  }

  const resetTimer = () => {
    setIsRunning(false)
    setSeconds(0)
  }

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    if (user) {
      loadStats()
      loadHeatmapData()
    }
  }, [user])

  const loadStats = async () => {
    setStatsLoading(true)
    try {
      const result = await getCheckInStats()
      setStats(result)
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setStatsLoading(false)
    }
  }

  const loadHeatmapData = async () => {
    // 模拟热力图数据，实际应从数据库获取
    const mockData = []
    const today = new Date()
    for (let i = 0; i < 90; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const count = Math.random() > 0.7 ? Math.floor(Math.random() * 4) : 0
      mockData.push({ date: dateStr, count })
    }
    setHeatmapData(mockData)
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}小时${minutes}分钟`
    }
    return `${minutes}分钟`
  }

  const handleManualTimeSubmit = () => {
    const minutes = parseInt(manualMinutes)
    if (minutes > 0 && minutes <= 1440) { // 最多24小时
      navigate('/notes', { state: { duration: minutes * 60 } })
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-stone-700 text-xl">加载中...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-orange-50 flex items-center justify-center p-4">
        <div className="text-center text-stone-700 max-w-md">
          {/* 白驹LOGO区域 */}
          <div className="mb-8 relative">
            <div className="w-32 h-32 mx-auto bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-amber-200">
              {/* 简化的白驹图标 */}
              <div className="text-6xl">🐎</div>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-2 text-stone-800">白驹读书</h1>
          <p className="text-stone-600 mb-8 text-lg">
            白驹过隙，不负读书时光
          </p>
          <div className="space-y-4">
            <button
              onClick={() => navigate('/auth/login')}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-6 rounded-xl transition-colors shadow-lg"
            >
              登录
            </button>
            <button
              onClick={() => navigate('/auth/register')}
              className="w-full border-2 border-amber-400 text-amber-700 hover:bg-amber-50 font-medium py-3 px-6 rounded-xl transition-colors"
            >
              注册
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-orange-50">
      {/* 顶部导航 */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-amber-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* 白驹LOGO */}
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center text-white text-xl">
                🐎
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-stone-800">白驹读书</h1>
            </div>
            <div className="flex items-center space-x-2">
              {/* 移动端指示器 */}
              <div className="block sm:hidden">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              </div>
              <button
                onClick={() => navigate('/profile')}
                className="p-2 rounded-xl hover:bg-amber-100 transition-colors"
              >
                <User className="h-6 w-6 text-stone-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* 元标签摘要 - 仅在桌面端显示 */}
        <div className="hidden lg:block mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-amber-200 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Palette className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-800">模板分类摘要</h3>
                  <p className="text-sm text-stone-600">共 33 个精美模板</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span className="text-sm text-amber-600 font-medium">实时更新</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: '经典书香', count: 12, icon: BookOpen, color: 'from-amber-500 to-orange-500', percentage: 35 },
                { name: '现代简约', count: 8, icon: Star, color: 'from-blue-500 to-indigo-500', percentage: 25 },
                { name: '复古文艺', count: 6, icon: Heart, color: 'from-rose-500 to-pink-500', percentage: 18 },
                { name: '温馨阅读', count: 5, icon: Coffee, color: 'from-yellow-500 to-amber-500', percentage: 15 },
                { name: '自然清新', count: 2, icon: Leaf, color: 'from-green-500 to-emerald-500', percentage: 7 }
              ].map((tag, index) => {
                const IconComponent = tag.icon
                return (
                  <div
                    key={index}
                    className={`group relative overflow-hidden rounded-2xl p-4 bg-gradient-to-r ${tag.color} hover:shadow-md hover:scale-102 transition-all duration-300 cursor-pointer`}
                    onClick={() => navigate('/templates')}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative z-10 flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0">
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-white text-sm truncate">{tag.name}</h4>
                          <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full">
                            {tag.count}
                          </span>
                        </div>
                        <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-white/80 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${tag.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        
        {/* 主要计时器区域 - 增强视觉效果 */}
        <div className="w-full max-w-4xl mx-auto mb-8">
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-200 overflow-hidden">
            {/* 动态背景效果 */}
            <div className="absolute inset-0 opacity-20">
              <div className={`absolute top-0 left-0 w-32 h-32 bg-gradient-to-br ${
                isRunning ? 'from-emerald-400 to-green-500' : 
                seconds > 0 ? 'from-amber-400 to-orange-500' : 
                'from-blue-400 to-indigo-500'
              } rounded-full blur-3xl animate-pulse`} />
              <div className={`absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br ${
                isRunning ? 'from-emerald-400 to-green-500' : 
                seconds > 0 ? 'from-amber-400 to-orange-500' : 
                'from-blue-400 to-indigo-500'
              } rounded-full blur-2xl animate-pulse`} style={{ animationDelay: '1s' }} />
            </div>

            {/* 圆形进度环 - 仅在桌面端显示 */}
            <div className="hidden md:flex items-center justify-center mb-8">
              <div className="relative w-64 h-64">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-stone-300"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${Math.min((seconds / 1800) * 283, 283)} 283`}
                    className={`${
                      isRunning ? 'text-emerald-500' : 
                      seconds > 0 ? 'text-amber-500' : 
                      'text-blue-500'
                    } transition-all duration-1000 ease-out`}
                    style={{ filter: 'drop-shadow(0 0 8px currentColor)' }}
                  />
                </svg>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl font-mono font-light text-stone-800 mb-2 tracking-wider">
                    {formatTime(seconds)}
                  </div>
                  <div className="text-xs text-stone-600 font-medium">
                    {Math.round(Math.min((seconds / 1800) * 100, 100))}% 完成
                  </div>
                </div>
              </div>
            </div>

            {/* 移动端时间显示 */}
            <div className="md:hidden text-center mb-8">
              <div className="text-5xl sm:text-6xl font-mono font-light mb-4 tracking-wider text-stone-800">
                {formatTime(seconds)}
              </div>
              <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden mb-4">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    isRunning ? 'bg-emerald-500' : 
                    seconds > 0 ? 'bg-amber-500' : 
                    'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min((seconds / 1800) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* 状态指示器 */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${
                  isRunning ? 'bg-emerald-500 animate-pulse' : 
                  seconds > 0 ? 'bg-amber-500' : 
                  'bg-blue-500'
                }`} />
                <span className="text-lg sm:text-xl font-medium text-stone-700">
                  {isRunning ? '正在阅读中...' : seconds > 0 ? '已暂停' : '准备开始阅读'}
                </span>
              </div>
              <p className="text-stone-600 text-sm sm:text-base">
                {isRunning ? '沉浸在知识的海洋中' : seconds > 0 ? '每一秒都是成长' : '即将开始美好的阅读之旅'}
              </p>
            </div>

            {/* 控制按钮 */}
            <div className="flex items-center justify-center space-x-4 sm:space-x-6 mb-6">
              {!isRunning ? (
                <button
                  onClick={startTimer}
                  className="group relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-xl shadow-emerald-500/30"
                >
                  <Play className="h-6 w-6 sm:h-8 sm:w-8 ml-1 text-white" />
                  <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                </button>
              ) : (
                <button
                  onClick={pauseTimer}
                  className="group relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-xl shadow-amber-500/30"
                >
                  <Pause className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                </button>
              )}

              {seconds > 0 && (
                <>
                  <button
                    onClick={stopTimer}
                    className="group relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg shadow-blue-500/30"
                  >
                    <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                  </button>
                  <button
                    onClick={resetTimer}
                    className="px-4 py-2 sm:px-6 sm:py-3 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl transition-colors font-medium text-sm sm:text-base"
                  >
                    重置
                  </button>
                </>
              )}
            </div>

            {/* 操作提示 */}
            <div className="text-center text-xs sm:text-sm text-stone-500">
              <div className="flex items-center justify-center space-x-4 sm:space-x-6">
                <span className="flex items-center">
                  <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-emerald-500" />
                  开始/继续
                </span>
                <span className="flex items-center">
                  <Pause className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-amber-500" />
                  暂停
                </span>
                <span className="flex items-center">
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-blue-500" />
                  完成记录
                </span>
              </div>
            </div>

            {/* 底部信息卡片 */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Target className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-stone-600">今日目标</div>
                  <div className="text-sm sm:text-lg font-semibold text-stone-800">30分钟</div>
                </div>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-stone-600">完成度</div>
                  <div className="text-sm sm:text-lg font-semibold text-stone-800">
                    {Math.round(Math.min((seconds / 1800) * 100, 100))}%
                  </div>
                </div>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-stone-600">专注状态</div>
                  <div className="text-sm sm:text-lg font-semibold text-stone-800">
                    {isRunning ? '专注中' : '待启动'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 统计数据展示 - 响应式优化 */}
        {!statsLoading && (
          <div className="w-full max-w-6xl mx-auto mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-center border border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-amber-700 mb-2">{stats.totalCheckins}</div>
                <div className="text-sm text-stone-600 font-medium mb-2">总打卡次数</div>
                <div className="flex items-center justify-center">
                  <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded-full">记录每一天</span>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-center border border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-orange-700 mb-2">{formatDuration(stats.totalSeconds)}</div>
                <div className="text-sm text-stone-600 font-medium mb-2">累计阅读</div>
                <div className="flex items-center justify-center">
                  <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">时间见证成长</span>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-center border border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 sm:col-span-2 lg:col-span-1">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Target className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-emerald-700 mb-2">{stats.streak}</div>
                <div className="text-sm text-stone-600 font-medium mb-2">连续天数</div>
                <div className="flex items-center justify-center">
                  <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">坚持的力量</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 其他功能按钮 - 响应式优化 */}
        <div className="w-full max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* 手动输入时间 */}
            <button
              onClick={() => setShowManualInput(!showManualInput)}
              className="w-full bg-white/80 hover:bg-white/90 backdrop-blur-sm py-4 px-6 rounded-2xl flex items-center justify-between transition-all duration-300 border border-amber-200 shadow-lg group hover:shadow-xl hover:scale-102"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl group-hover:scale-110 transition-transform">
                  <Edit3 className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-stone-700 text-sm sm:text-base">手动输入阅读时间</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                <span className="text-amber-600 font-bold text-lg">{showManualInput ? '−' : '+'}</span>
              </div>
            </button>

            {/* 查看历史记录 */}
            <button
              onClick={() => navigate('/history')}
              className="w-full bg-white/80 hover:bg-white/90 backdrop-blur-sm py-4 px-6 rounded-2xl flex items-center justify-between transition-all duration-300 border border-amber-200 shadow-lg group hover:shadow-xl hover:scale-102"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-gradient-to-r from-emerald-400 to-green-500 rounded-xl group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-stone-700 text-sm sm:text-base">查看历史记录</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                <span className="text-emerald-600 text-lg">→</span>
              </div>
            </button>
          </div>

          {/* 手动输入面板 */}
          {showManualInput && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-amber-200 animate-in slide-in-from-top duration-300 shadow-lg mb-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-stone-700 mb-2">输入阅读时间</h3>
                <p className="text-sm text-stone-600">请输入您的阅读时长（分钟）</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex-1 w-full">
                  <input
                    type="number"
                    min="1"
                    max="1440"
                    value={manualMinutes}
                    onChange={(e) => setManualMinutes(e.target.value)}
                    placeholder="例如：30"
                    className="w-full bg-white border-2 border-amber-200 rounded-xl px-4 py-3 text-stone-700 placeholder-stone-400 focus:outline-none focus:border-amber-400 transition-all"
                  />
                </div>
                <span className="text-stone-600 font-medium">分钟</span>
                <button
                  onClick={handleManualTimeSubmit}
                  disabled={!manualMinutes || parseInt(manualMinutes) <= 0}
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed px-6 py-3 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  确认
                </button>
              </div>
            </div>
          )}

          {/* 快捷操作按钮 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/templates')}
              className="bg-white/80 hover:bg-white/90 backdrop-blur-sm py-4 px-4 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border border-amber-200 shadow-lg group hover:shadow-xl hover:scale-102"
            >
              <div className="p-3 bg-gradient-to-r from-violet-400 to-purple-500 rounded-xl group-hover:scale-110 transition-transform mb-2">
                <Palette className="h-5 w-5 text-white" />
              </div>
              <span className="font-medium text-stone-700 text-sm text-center">选择样式</span>
            </button>

            <button
              onClick={() => navigate('/notes')}
              className="bg-white/80 hover:bg-white/90 backdrop-blur-sm py-4 px-4 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border border-amber-200 shadow-lg group hover:shadow-xl hover:scale-102"
            >
              <div className="p-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl group-hover:scale-110 transition-transform mb-2">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="font-medium text-stone-700 text-sm text-center">写读后感</span>
            </button>

            <button
              onClick={() => navigate('/compose')}
              className="bg-white/80 hover:bg-white/90 backdrop-blur-sm py-4 px-4 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border border-amber-200 shadow-lg group hover:shadow-xl hover:scale-102"
            >
              <div className="p-3 bg-gradient-to-r from-rose-400 to-pink-500 rounded-xl group-hover:scale-110 transition-transform mb-2">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="font-medium text-stone-700 text-sm text-center">制作分享</span>
            </button>

            <button
              onClick={() => navigate('/profile')}
              className="bg-white/80 hover:bg-white/90 backdrop-blur-sm py-4 px-4 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border border-amber-200 shadow-lg group hover:shadow-xl hover:scale-102"
            >
              <div className="p-3 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-xl group-hover:scale-110 transition-transform mb-2">
                <User className="h-5 w-5 text-white" />
              </div>
              <span className="font-medium text-stone-700 text-sm text-center">个人资料</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
