import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export function CallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    handleAuthCallback()
  }, [])

  const handleAuthCallback = async () => {
    try {
      // Get the hash fragment from the URL
      const hashFragment = window.location.hash

      if (hashFragment && hashFragment.length > 0) {
        // Exchange the auth code for a session
        const { data, error } = await supabase.auth.exchangeCodeForSession(hashFragment)

        if (error) {
          console.error('Error exchanging code for session:', error.message)
          // Redirect to error page or show error message
          navigate('/auth/login?error=' + encodeURIComponent(error.message))
          return
        }

        if (data.session) {
          // Successfully signed in, redirect to app
          navigate('/')
          return
        }
      }

      // If we get here, something went wrong
      navigate('/auth/login?error=No session found')
    } catch (error) {
      console.error('Auth callback error:', error)
      navigate('/auth/login?error=Authentication failed')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-300 mx-auto mb-4"></div>
        <div className="text-xl">正在验证登录...</div>
      </div>
    </div>
  )
}
