import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/lib/auth'

// Import pages
import { HomePage } from '@/pages/HomePage'
import { TimerPage } from '@/pages/TimerPage'
import { NotesPage } from '@/pages/NotesPage'
import { TemplatesPage } from '@/pages/TemplatesPage'
import { AIGeneratePage } from '@/pages/AIGeneratePage'
import { ComposePage } from '@/pages/ComposePage'
import { ProfilePage } from '@/pages/ProfilePage'
import { HistoryPage } from '@/pages/HistoryPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { CallbackPage } from '@/pages/auth/CallbackPage'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Main App Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/timer" element={<TimerPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/ai-generate" element={<AIGeneratePage />} />
          <Route path="/compose" element={<ComposePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/history" element={<HistoryPage />} />
          
          {/* Auth Routes */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/callback" element={<CallbackPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
