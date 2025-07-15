import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mzzbykwqjnypbrxrvkle.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16emJ5a3dxam55cGJyeHJ2a2xlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMTg4ODAsImV4cCI6MjA2Nzg5NDg4MH0.yqK_6-5bqDo8Y9n0NLmk4NJVGKtQtZAFISkQxDbbBxE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  nickname?: string
  avatar_url?: string
  created_at: string
  last_login_at: string
}

export interface CheckIn {
  id: string
  user_id: string
  duration_seconds: number
  notes?: string
  image_url?: string
  created_at: string
}

export interface Template {
  id: string
  name: string
  thumbnail_url?: string
  template_url?: string
  is_active: boolean
  created_at: string
}