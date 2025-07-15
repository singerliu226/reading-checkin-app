import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCheckIn } from '@/hooks/useCheckIn'
import { ArrowLeft, Clock, Calendar, BookOpen, Image } from 'lucide-react'
import { CheckIn } from '@/lib/supabase'

export function HistoryPage() {
  const navigate = useNavigate()
  const { getCheckInHistory } = useCheckIn()
  
  const [history, setHistory] = useState<CheckIn[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      const data = await getCheckInHistory()
      setHistory(data || [])
    } catch (error) {
      console.error('Failed to load history:', error)
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return '今天'
    } else if (diffDays === 1) {
      return '昨天'
    } else if (diffDays < 7) {
      return `${diffDays}天前`
    } else {
      return date.toLocaleDateString('zh-CN')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold">打卡历史</h1>
        <div className="w-10"></div>
      </header>

      <div className="px-4 py-6">
        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-300 mx-auto mb-4"></div>
            <div>加载历史记录中...</div>
          </div>
        )}

        {/* Empty State */}
        {!loading && history.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-purple-300 opacity-50" />
            <div className="text-xl mb-2">还没有打卡记录</div>
            <div className="text-purple-200 mb-6">开始你的第一次阅读打卡吧</div>
            <button
              onClick={() => navigate('/')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              开始阅读
            </button>
          </div>
        )}

        {/* History List */}
        {!loading && history.length > 0 && (
          <div className="space-y-4">
            {history.map((checkIn) => (
              <div
                key={checkIn.id}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-500/30 rounded-full flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-purple-300" />
                    </div>
                    <div>
                      <div className="font-medium text-lg">阅读打卡</div>
                      <div className="flex items-center space-x-4 text-sm text-purple-200">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatDuration(checkIn.duration_seconds)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(checkIn.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {checkIn.image_url && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden">
                      <img
                        src={checkIn.image_url}
                        alt="打卡分享图"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {checkIn.notes && (
                  <div className="bg-white/5 rounded-lg p-4 mt-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <BookOpen className="h-4 w-4 text-purple-300" />
                      <span className="text-sm font-medium text-purple-200">读后感</span>
                    </div>
                    <p className="text-white leading-relaxed">{checkIn.notes}</p>
                  </div>
                )}

                {checkIn.image_url && (
                  <div className="mt-4">
                    <button
                      onClick={() => window.open(checkIn.image_url, '_blank')}
                      className="flex items-center space-x-2 text-purple-300 hover:text-purple-100 text-sm transition-colors"
                    >
                      <Image className="h-4 w-4" />
                      <span>查看分享图片</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
