import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'

export function useCheckIn() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const saveCheckIn = async (durationSeconds: number, notes?: string, imageUrl?: string) => {
    if (!user) throw new Error('User not authenticated')
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('check_ins')
        .insert({
          user_id: user.id,
          duration_seconds: durationSeconds,
          notes: notes || '',
          image_url: imageUrl,
          created_at: new Date().toISOString()
        })
        .select()
        .maybeSingle()

      if (error) throw error
      return data
    } finally {
      setLoading(false)
    }
  }

  const getCheckInHistory = async () => {
    if (!user) throw new Error('User not authenticated')
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('check_ins')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } finally {
      setLoading(false)
    }
  }

  const getCheckInStats = async () => {
    if (!user) throw new Error('User not authenticated')
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('check_ins')
        .select('duration_seconds, created_at')
        .eq('user_id', user.id)

      if (error) throw error
      
      // Calculate statistics
      const totalCheckins = data.length
      const totalSeconds = data.reduce((sum, item) => sum + item.duration_seconds, 0)
      const averageSeconds = totalCheckins > 0 ? totalSeconds / totalCheckins : 0
      
      // Calculate streak (consecutive days)
      const today = new Date()
      let streak = 0
      for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today)
        checkDate.setDate(today.getDate() - i)
        const dateStr = checkDate.toISOString().split('T')[0]
        
        const hasCheckIn = data.some(item => 
          item.created_at.startsWith(dateStr)
        )
        
        if (hasCheckIn) {
          streak++
        } else if (i > 0) {
          break
        }
      }
      
      return {
        totalCheckins,
        totalSeconds,
        averageSeconds,
        streak
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    saveCheckIn,
    getCheckInHistory,
    getCheckInStats
  }
}