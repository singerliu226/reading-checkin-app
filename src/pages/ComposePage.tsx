import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Download, Share2, RefreshCw } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { useCheckIn } from '@/hooks/useCheckIn'
import { useImageUpload } from '@/hooks/useImageUpload'

// 模板配置（使用实际存在的图片文件）
const templates = [
  {
    id: 'template1',
    name: '经典书香',
    thumbnail: '/templates/classic-template.jpg',
    style: 'classic',
    description: '简约优雅，适合各类读书分享'
  },
  {
    id: 'template2',
    name: '现代简约',
    thumbnail: '/templates/modern-template.jpg', 
    style: 'modern',
    description: '干净清爽，突出内容重点'
  },
  {
    id: 'template3',
    name: '复古文艺',
    thumbnail: '/templates/vintage-template.jpg',
    style: 'vintage', 
    description: '温暖复古，营造文艺氛围'
  },
  {
    id: 'template4',
    name: '温馨阅读',
    thumbnail: '/templates/elegant-template.jpg',
    style: 'cozy',
    description: '温馨舒适，分享阅读温度'
  },
  {
    id: 'template5',
    name: '古典优雅',
    thumbnail: '/templates/template5.jpg',
    style: 'elegant',
    description: '古典美学，彰显品味'
  },
  {
    id: 'template6',
    name: '舒适书房',
    thumbnail: '/templates/template6.jpg',
    style: 'comfort',
    description: '舒适环境，静享阅读'
  },
  {
    id: 'template7',
    name: '简约清新',
    thumbnail: '/templates/template7.jpg',
    style: 'fresh',
    description: '简约设计，清新自然'
  },
  {
    id: 'template8',
    name: '秋日阅读',
    thumbnail: '/templates/template8.jpeg',
    style: 'autumn',
    description: '秋日暖意，书香满怀'
  },
  {
    id: 'template9',
    name: '现代极简',
    thumbnail: '/templates/template9.jpg',
    style: 'minimal',
    description: '现代设计，极简美学'
  },
  {
    id: 'template10',
    name: '咖啡时光',
    thumbnail: '/templates/template10.jpeg',
    style: 'coffee',
    description: '咖啡书香，惬意时光'
  }
]

export function ComposePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { saveCheckIn } = useCheckIn()
  const { uploadImage, convertCanvasToDataURL } = useImageUpload()
  
  const { duration, notes, bookTitle, template, backgroundImage } = location.state || {}
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [composedImageUrl, setComposedImageUrl] = useState('')
  const [isComposing, setIsComposing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    composeImage()
  }, [])

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}小时${minutes}分钟`
    }
    return `${minutes}分钟`
  }

  const formatDate = () => {
    const now = new Date()
    return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`
  }

  const composeImage = async () => {
    if (!canvasRef.current) return

    setIsComposing(true)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = 800
    canvas.height = 1200

    try {
      // Clear canvas with default background
      ctx.fillStyle = '#1e1b4b'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      let backgroundImageUrl = backgroundImage

      // 如果没有AI生成的背景图片，但有选择模板，使用模板的背景图片
      if (!backgroundImageUrl && template && template !== 'ai-generated') {
        const selectedTemplate = templates.find(t => t.id === template)
        if (selectedTemplate) {
          backgroundImageUrl = selectedTemplate.thumbnail
          console.log('Using template background:', backgroundImageUrl)
        }
      }

      // Load and draw background
      if (backgroundImageUrl) {
        try {
          const bgImg = new Image()
          bgImg.crossOrigin = 'anonymous'
          
          await new Promise((resolve, reject) => {
            bgImg.onload = () => {
              console.log('Background image loaded successfully:', backgroundImageUrl)
              resolve(bgImg)
            }
            bgImg.onerror = (error) => {
              console.error('Failed to load background image:', backgroundImageUrl, error)
              reject(error)
            }
            bgImg.src = backgroundImageUrl
          })
          
          // Draw background image
          ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height)
          
          // Add dark overlay for better text readability
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        } catch (error) {
          console.error('Error loading template background, using default gradient:', error)
          // 图片加载失败时使用默认渐变背景
          const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
          gradient.addColorStop(0, '#1e1b4b')
          gradient.addColorStop(0.5, '#7c3aed')
          gradient.addColorStop(1, '#1e1b4b')
          ctx.fillStyle = gradient
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
      } else {
        // Default gradient background when no template is selected
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
        gradient.addColorStop(0, '#1e1b4b')
        gradient.addColorStop(0.5, '#7c3aed')
        gradient.addColorStop(1, '#1e1b4b')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      // Draw content
      drawContent(ctx, canvas.width, canvas.height)
      
      // Convert to image URL
      const dataUrl = convertCanvasToDataURL(canvas)
      setComposedImageUrl(dataUrl)
    } catch (error) {
      console.error('Failed to compose image:', error)
    } finally {
      setIsComposing(false)
    }
  }

  const drawContent = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Set text properties
    ctx.textAlign = 'center'
    ctx.fillStyle = '#ffffff'
    
    // Title
    if (bookTitle) {
      ctx.font = 'bold 36px Arial'
      ctx.fillText(`《${bookTitle}》`, width / 2, 100)
    }
    
    // Reading time
    ctx.font = 'bold 48px Arial'
    ctx.fillStyle = '#fbbf24'
    ctx.fillText(`阅读时长: ${formatDuration(duration)}`, width / 2, 200)
    
    // Date
    ctx.font = '24px Arial'
    ctx.fillStyle = '#e5e7eb'
    ctx.fillText(formatDate(), width / 2, 250)
    
    // Notes
    if (notes) {
      ctx.font = '28px Arial'
      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'left'
      
      const maxWidth = width - 80
      const lineHeight = 40
      const words = notes.split('')
      let currentLine = ''
      let y = 350
      
      for (let i = 0; i < words.length; i++) {
        const testLine = currentLine + words[i]
        const metrics = ctx.measureText(testLine)
        
        if (metrics.width > maxWidth && currentLine !== '') {
          ctx.fillText(currentLine, 40, y)
          currentLine = words[i]
          y += lineHeight
          
          if (y > height - 300) break // Leave space for footer
        } else {
          currentLine = testLine
        }
      }
      
      if (currentLine) {
        ctx.fillText(currentLine, 40, y)
      }
    }
    
    // Footer
    ctx.textAlign = 'center'
    ctx.font = '20px Arial'
    ctx.fillStyle = '#9ca3af'
    ctx.fillText('微信读书群打卡分享', width / 2, height - 100)
    
    if (user?.email) {
      ctx.fillText(`by ${user.email}`, width / 2, height - 60)
    }
  }

  const handleSave = async () => {
    if (!composedImageUrl) return

    setIsSaving(true)
    try {
      // Upload to storage
      const fileName = `checkin-${Date.now()}.png`
      const publicUrl = await uploadImage(composedImageUrl, fileName)
      
      // Save check-in record
      await saveCheckIn(duration, notes, publicUrl)
      
      alert('打卡记录保存成功！')
      navigate('/')
    } catch (error) {
      console.error('Failed to save:', error)
      alert('保存失败，请重试')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownload = () => {
    if (!composedImageUrl) return

    const link = document.createElement('a')
    link.href = composedImageUrl
    link.download = `reading-checkin-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleShare = async () => {
    if (!composedImageUrl) return

    if (navigator.share) {
      try {
        const response = await fetch(composedImageUrl)
        const blob = await response.blob()
        const file = new File([blob], 'reading-checkin.png', { type: 'image/png' })
        
        await navigator.share({
          files: [file],
          title: '我的读书打卡',
          text: '看看我今天的阅读记录'
        })
      } catch (error) {
        console.error('Share failed:', error)
        handleDownload()
      }
    } else {
      handleDownload()
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
        <h1 className="text-xl font-bold">分享卡片</h1>
        <div className="w-10"></div>
      </header>

      <div className="px-4 py-6">
        {/* Canvas (hidden) */}
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Template Info */}
        {template && (
          <div className="mb-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-center">
                <div className="text-sm text-purple-300 mb-1">
                  {template === 'ai-generated' ? '🤖 AI智能生成' : '🎨 选择的模板'}
                </div>
                <div className="text-white font-medium">
                  {(() => {
                    if (template === 'ai-generated') {
                      return 'AI智能生成背景'
                    }
                    const selectedTemplate = templates.find(t => t.id === template)
                    return selectedTemplate ? selectedTemplate.name : '未知模板'
                  })()}
                </div>
                {(() => {
                  const selectedTemplate = templates.find(t => t.id === template)
                  return selectedTemplate && (
                    <div className="text-xs text-purple-200 mt-1">
                      {selectedTemplate.description}
                    </div>
                  )
                })()}
              </div>
            </div>
          </div>
        )}
        
        {/* Preview */}
        {composedImageUrl && (
          <div className="mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <img
                src={composedImageUrl}
                alt="分享卡片预览"
                className="w-full max-w-md mx-auto rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Loading */}
        {isComposing && (
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-300" />
            <div className="text-lg text-white mb-2">正在生成分享卡片...</div>
            <div className="text-sm text-purple-200">
              {template === 'ai-generated' ? '正在应用AI生成的背景' : '正在应用选择的模板样式'}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {composedImageUrl && (
          <div className="space-y-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-lg transition-all duration-300"
            >
              {isSaving ? '保存中...' : '保存打卡记录'}
            </button>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleDownload}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="h-5 w-5" />
                <span>下载</span>
              </button>
              
              <button
                onClick={handleShare}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Share2 className="h-5 w-5" />
                <span>分享</span>
              </button>
            </div>
            
            <button
              onClick={composeImage}
              className="w-full border border-purple-400 text-purple-300 hover:bg-purple-400 hover:text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <RefreshCw className="h-5 w-5" />
              <span>重新生成</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
