import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { useCheckIn } from '@/hooks/useCheckIn'
import { ArrowLeft, User, Mail, LogOut, Calendar, Clock, TrendingUp, Book } from 'lucide-react'

export function ProfilePage() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { getCheckInStats } = useCheckIn()
  
  const [stats, setStats] = useState({
    totalCheckins: 0,
    totalSeconds: 0,
    averageSeconds: 0,
    streak: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const result = await getCheckInStats()
      setStats(result)
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}小时${minutes}分钟`
    }
    return `${minutes}分钟`
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold">个人中心</h1>
        <div className="w-10"></div>
      </header>

      <div className="px-4 py-6">
        {/* User Info */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{user?.user_metadata?.nickname || '读书爱好者'}</h2>
              <div className="flex items-center space-x-2 text-purple-200">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{user?.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {!loading && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-2">
                <Calendar className="h-6 w-6 text-purple-300" />
                <span className="text-sm text-purple-200">总打卡</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.totalCheckins}</div>
              <div className="text-sm text-purple-300">次</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-2">
                <Clock className="h-6 w-6 text-purple-300" />
                <span className="text-sm text-purple-200">累计时长</span>
              </div>
              <div className="text-2xl font-bold text-white">{formatDuration(stats.totalSeconds)}</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-2">
                <TrendingUp className="h-6 w-6 text-purple-300" />
                <span className="text-sm text-purple-200">连续天数</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.streak}</div>
              <div className="text-sm text-purple-300">天</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-2">
                <Book className="h-6 w-6 text-purple-300" />
                <span className="text-sm text-purple-200">平均时长</span>
              </div>
              <div className="text-2xl font-bold text-white">{formatDuration(stats.averageSeconds)}</div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-300 mx-auto mb-4"></div>
              <div>加载统计数据中...</div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="space-y-4 mb-8">
          <button
            onClick={() => navigate('/history')}
            className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm py-4 px-6 rounded-xl flex items-center justify-between transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Calendar className="h-6 w-6 text-purple-300" />
              <span className="font-medium">打卡历史</span>
            </div>
            <span className="text-purple-300">→</span>
          </button>
        </div>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-400 text-red-300 font-medium py-3 px-6 rounded-xl transition-colors flex items-center justify-center space-x-2"
        >
          <LogOut className="h-5 w-5" />
          <span>退出登录</span>
        </button>
      </div>
    </div>
  )
}
