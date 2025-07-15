import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, Pause, Square, ArrowLeft, Timer, Moon, Sun, Eye, EyeOff, Palette } from 'lucide-react'

export function TimerPage() {
  const navigate = useNavigate()
  const [isRunning, setIsRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [darkMode, setDarkMode] = useState(false)
  const [eyeCareMode, setEyeCareMode] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [lastTap, setLastTap] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null)
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null)
  const [isLongPressing, setIsLongPressing] = useState(false)

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

  // 双击暂停/继续
  const handleDoubleClick = useCallback(() => {
    if (seconds > 0) {
      if (isRunning) {
        pauseTimer()
      } else {
        startTimer()
      }
    }
  }, [isRunning, seconds])

  // 处理单击和双击
  const handleScreenTap = () => {
    const now = Date.now()
    const timeSinceLastTap = now - lastTap
    
    if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
      // 双击
      handleDoubleClick()
    } else {
      // 单击 - 显示/隐藏控制按钮
      setShowControls(true)
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current)
      }
      hideControlsTimeout.current = setTimeout(() => {
        if (isRunning) {
          setShowControls(false)
        }
      }, 3000)
    }
    
    setLastTap(now)
  }

  // 长按结束计时
  const handleLongPress = useCallback(() => {
    if (seconds > 0) {
      stopTimer()
    }
  }, [seconds])

  // 自动隐藏控制按钮 - 修复后的逻辑
  useEffect(() => {
    if (isRunning && showControls) {
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current)
      }
      hideControlsTimeout.current = setTimeout(() => {
        setShowControls(false)
      }, 5000) // 延长到5秒，给用户更多时间
    }
    
    return () => {
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current)
      }
    }
  }, [isRunning, showControls])

  // 切换护眼模式
  const toggleEyeCareMode = () => {
    setEyeCareMode(!eyeCareMode)
  }

  // 切换深色模式
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  // 处理鼠标/触摸按下
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    setIsLongPressing(false)
    
    longPressTimeout.current = setTimeout(() => {
      setIsLongPressing(true)
      if (seconds > 0) {
        navigator.vibrate?.(200) // 触觉反馈
        handleLongPress()
      }
    }, 800) // 800ms 长按
  }

  // 处理鼠标/触摸抬起
  const handlePointerUp = (e: React.PointerEvent) => {
    e.preventDefault()
    
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current)
      longPressTimeout.current = null
    }
    
    if (!isLongPressing) {
      // 短按 - 处理单击/双击
      handleScreenTap()
    }
    
    setIsLongPressing(false)
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

  // 获取当前主题样式
  const getThemeStyles = () => {
    if (eyeCareMode) {
      return {
        bg: 'bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900',
        text: 'text-green-100',
        accent: 'green',
        gradientFrom: 'from-green-100',
        gradientVia: 'via-emerald-100',
        gradientTo: 'to-teal-100'
      }
    } else if (darkMode) {
      return {
        bg: 'bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900',
        text: 'text-slate-100',
        accent: 'blue',
        gradientFrom: 'from-slate-100',
        gradientVia: 'via-gray-100',
        gradientTo: 'to-zinc-100'
      }
    } else {
      return {
        bg: 'bg-gradient-to-br from-amber-900 via-orange-900 to-yellow-900',
        text: 'text-amber-100',
        accent: 'amber',
        gradientFrom: 'from-amber-100',
        gradientVia: 'via-orange-100',
        gradientTo: 'to-yellow-100'
      }
    }
  }

  const theme = getThemeStyles()

  return (
    <div 
      className={`min-h-screen ${theme.bg} ${theme.text} flex flex-col items-center justify-center p-6 relative overflow-hidden cursor-pointer select-none`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onContextMenu={(e) => e.preventDefault()} // 禁用右键菜单
      style={{ touchAction: 'none' }} // 禁用默认触摸行为
    >
      {/* Background Effects */}
      <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${
        eyeCareMode ? 'from-green-800/30' : darkMode ? 'from-slate-800/30' : 'from-amber-800/30'
      } via-transparent to-transparent`}></div>
      <div className={`absolute top-1/4 left-1/3 w-96 h-96 ${
        eyeCareMode ? 'bg-green-600/10' : darkMode ? 'bg-blue-600/10' : 'bg-amber-600/10'
      } rounded-full blur-3xl animate-pulse-slow`}></div>
      <div className={`absolute bottom-1/4 right-1/3 w-80 h-80 ${
        eyeCareMode ? 'bg-emerald-600/10' : darkMode ? 'bg-indigo-600/10' : 'bg-orange-600/10'
      } rounded-full blur-3xl animate-pulse-slow animation-delay-2000`}></div>
      
      {/* Book pages floating animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-8 h-10 ${
          eyeCareMode ? 'bg-green-200/5' : darkMode ? 'bg-slate-200/5' : 'bg-amber-200/5'
        } rounded-sm animate-float transform rotate-12`}></div>
        <div className={`absolute top-1/3 right-1/4 w-6 h-8 ${
          eyeCareMode ? 'bg-emerald-200/5' : darkMode ? 'bg-gray-200/5' : 'bg-orange-200/5'
        } rounded-sm animate-float-delayed transform -rotate-6`}></div>
        <div className={`absolute bottom-1/3 left-1/3 w-7 h-9 ${
          eyeCareMode ? 'bg-teal-200/5' : darkMode ? 'bg-zinc-200/5' : 'bg-yellow-200/5'
        } rounded-sm animate-float-slow transform rotate-3`}></div>
      </div>
      
      {/* Paper texture overlay */}
      <div className="absolute inset-0 opacity-[0.01]" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23000\" fill-opacity=\"1\"%3E%3Ccircle cx=\"7\" cy=\"7\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
      
      {/* Top Controls - 修复显示逻辑 */}
      <div className={`absolute top-8 left-0 right-0 flex justify-between items-center px-8 z-20 transition-all duration-500 ${
        showControls ? 'opacity-100 translate-y-0' : 'opacity-70 -translate-y-2'
      }`}>
        {/* Back Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            navigate('/')
          }}
          className={`p-4 rounded-2xl ${
            eyeCareMode ? 'bg-green-800/40 hover:bg-green-700/60 border-green-600/30 hover:border-green-500/50' :
            darkMode ? 'bg-slate-800/40 hover:bg-slate-700/60 border-slate-600/30 hover:border-slate-500/50' :
            'bg-amber-800/40 hover:bg-amber-700/60 border-amber-600/30 hover:border-amber-500/50'
          } backdrop-blur-xl border transition-all duration-300 group`}
        >
          <ArrowLeft className={`h-6 w-6 ${
            eyeCareMode ? 'text-green-200' : darkMode ? 'text-slate-200' : 'text-amber-200'
          } group-hover:scale-110 transition-transform`} />
        </button>

        {/* Mode Toggle Buttons */}
        <div className="flex items-center space-x-3">
          {/* Eye Care Mode Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleEyeCareMode()
            }}
            className={`p-3 rounded-xl backdrop-blur-xl border transition-all duration-300 ${
              eyeCareMode 
                ? 'bg-green-600/60 border-green-500/50 text-white' 
                : 'bg-white/10 border-white/20 text-white/70 hover:text-white'
            }`}
            title="护眼模式"
          >
            {eyeCareMode ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleDarkMode()
            }}
            className={`p-3 rounded-xl backdrop-blur-xl border transition-all duration-300 ${
              darkMode 
                ? 'bg-slate-600/60 border-slate-500/50 text-white' 
                : 'bg-white/10 border-white/20 text-white/70 hover:text-white'
            }`}
            title="深色模式"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Timer Icon */}
      <div className="relative z-10 mb-8">
        <div className={`p-6 bg-gradient-to-r ${
          eyeCareMode ? 'from-green-600/20 to-emerald-600/20 border-green-500/20' :
          darkMode ? 'from-slate-600/20 to-gray-600/20 border-slate-500/20' :
          'from-amber-600/20 to-orange-600/20 border-amber-500/20'
        } rounded-full backdrop-blur-xl border shadow-2xl`}>
          <Timer className={`h-12 w-12 ${
            eyeCareMode ? 'text-green-300' : darkMode ? 'text-slate-300' : 'text-amber-300'
          }`} />
        </div>
      </div>

      {/* Timer Display */}
      <div className="relative z-10 text-center mb-16">
        <div className={`text-6xl md:text-8xl font-mono font-light mb-6 tracking-wider bg-gradient-to-r ${theme.gradientFrom} ${theme.gradientVia} ${theme.gradientTo} bg-clip-text text-transparent drop-shadow-lg`}>
          {formatTime(seconds)}
        </div>
        <div className={`text-2xl font-medium mb-2 ${
          eyeCareMode ? 'text-green-200' : darkMode ? 'text-slate-200' : 'text-amber-200'
        }`}>
          {isRunning ? '正在阅读中...' : seconds > 0 ? '已暂停' : '准备开始阅读'}
        </div>
        <div className={`font-medium ${
          eyeCareMode ? 'text-green-300' : darkMode ? 'text-slate-300' : 'text-amber-300'
        }`}>
          {isRunning ? '沉浸在知识的海洋中' : seconds > 0 ? '每一秒都是成长' : '即将开始美好的阅读之旅'}
        </div>
        
        {/* Gesture Hints */}
        {isRunning && (
          <div className={`mt-6 text-sm ${
            eyeCareMode ? 'text-green-400' : darkMode ? 'text-slate-400' : 'text-amber-400'
          } animate-pulse`}>
            双击暂停 · 长按结束 · 单击显示控制
          </div>
        )}
      </div>

      {/* Control Buttons - 修复点击事件问题 */}
      <div className={`relative z-10 flex items-center space-x-8 mb-12 transition-all duration-500 ${
        showControls ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-2'
      }`}>
        {!isRunning ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              startTimer()
            }}
            className="group relative w-28 h-28 bg-gradient-to-br from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-2xl shadow-emerald-600/40"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-60"></div>
            <Play className="h-12 w-12 ml-1 text-white relative z-10" />
            <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping-slow"></div>
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation()
              pauseTimer()
            }}
            className={`group relative w-28 h-28 bg-gradient-to-br ${
              eyeCareMode ? 'from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-green-600/40' :
              darkMode ? 'from-slate-600 to-gray-600 hover:from-slate-500 hover:to-gray-500 shadow-slate-600/40' :
              'from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-600/40'
            } rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-2xl`}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-60"></div>
            <Pause className="h-12 w-12 text-white relative z-10" />
            <div className={`absolute inset-0 rounded-full ${
              eyeCareMode ? 'bg-green-400/20' : darkMode ? 'bg-slate-400/20' : 'bg-amber-400/20'
            } animate-ping-slow`}></div>
          </button>
        )}

        {seconds > 0 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                stopTimer()
              }}
              className="group relative w-28 h-28 bg-gradient-to-br from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-2xl shadow-red-600/40"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-60"></div>
              <Square className="h-12 w-12 text-white relative z-10" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                resetTimer()
              }}
              className={`px-8 py-4 bg-gradient-to-r ${
                eyeCareMode ? 'from-green-800/40 to-emerald-800/40 hover:from-green-700/60 hover:to-emerald-700/60 border-green-600/30 hover:border-green-500/50 text-green-200' :
                darkMode ? 'from-slate-800/40 to-gray-800/40 hover:from-slate-700/60 hover:to-gray-700/60 border-slate-600/30 hover:border-slate-500/50 text-slate-200' :
                'from-amber-800/40 to-orange-800/40 hover:from-amber-700/60 hover:to-orange-700/60 border-amber-600/30 hover:border-amber-500/50 text-amber-200'
              } backdrop-blur-xl rounded-2xl border transition-all duration-300 hover:scale-105 font-medium`}
            >
              重置
            </button>
          </>
        )}
      </div>

      {/* Instructions - 始终显示 */}
      <div className={`relative z-10 text-center max-w-lg transition-all duration-500 ${
        showControls ? 'opacity-100 translate-y-0' : 'opacity-80 translate-y-1'
      }`}>
        <div className={`bg-gradient-to-br ${
          eyeCareMode ? 'from-green-800/40 to-emerald-800/30 border-green-600/30' :
          darkMode ? 'from-slate-800/40 to-gray-800/30 border-slate-600/30' :
          'from-amber-800/40 to-orange-800/30 border-amber-600/30'
        } backdrop-blur-xl rounded-2xl p-6 border`}>
          <h3 className={`text-xl font-semibold mb-3 bg-gradient-to-r ${
            eyeCareMode ? 'from-green-200 to-emerald-200' :
            darkMode ? 'from-slate-200 to-gray-200' :
            'from-amber-200 to-orange-200'
          } bg-clip-text text-transparent`}>
            专注阅读，享受知识的芬芳
          </h3>
          <p className={`${
            eyeCareMode ? 'text-green-300' : darkMode ? 'text-slate-300' : 'text-amber-300'
          } text-sm leading-relaxed`}>
            点击开始按钮进入专注模式，让时间在书香中静静流淌。阅读完成后点击“结束”，记录下这段美好的阅读时光。
          </p>
          
          {/* Gesture Instructions */}
          <div className={`text-xs ${
            eyeCareMode ? 'text-green-400' : darkMode ? 'text-slate-400' : 'text-amber-400'
          } space-y-1 border-t ${
            eyeCareMode ? 'border-green-600/20' : darkMode ? 'border-slate-600/20' : 'border-amber-600/20'
          } pt-4 mt-4`}>
            <div>• 双击屏幕：暂停/继续计时</div>
            <div>• 长按屏幕：结束计时并记录</div>
            <div>• 单击屏幕：显示/隐藏控制按钮</div>
            <div className="flex items-center justify-center space-x-4 mt-2">
              <span className="flex items-center">
                <Eye className="h-3 w-3 mr-1" />
                护眼模式
              </span>
              <span className="flex items-center">
                <Moon className="h-3 w-3 mr-1" />
                深色模式
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
