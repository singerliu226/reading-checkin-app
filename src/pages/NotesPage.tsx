import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Book, Clock, Sparkles, FileText, Eye, Lightbulb, Users } from 'lucide-react'
import { StepIndicator } from '@/components/ui/StepIndicator'

export function NotesPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const duration = location.state?.duration || 0
  
  const [notes, setNotes] = useState('')
  const [bookTitle, setBookTitle] = useState('')
  const [currentStep, setCurrentStep] = useState(0)
  const [wordCount, setWordCount] = useState(0)

  // 写作模板和提示
  const writingTemplates = [
    {
      title: "感悟分享",
      content: "今天阅读了《书名》，其中最打动我的是...\n\n这让我想到了...\n\n我的收获是..."
    },
    {
      title: "知识总结", 
      content: "通过这次阅读，我学到了...\n\n重要的观点包括：\n1. \n2. \n3. \n\n我会在生活中尝试..."
    },
    {
      title: "思考记录",
      content: "阅读过程中，我思考了这样的问题：...\n\n作者的观点是...\n\n我的看法是..."
    }
  ]

  const steps = [
    { id: 1, title: "写读后感", description: "记录感悟" },
    { id: 2, title: "选择样式", description: "挑选模板" },
    { id: 3, title: "生成分享", description: "制作卡片" }
  ]

  useEffect(() => {
    const count = notes.length
    setWordCount(count)
  }, [notes])

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}小时${minutes}分钟`
    }
    return `${minutes}分钟`
  }

  const handleTemplateSelect = (template: any) => {
    setNotes(template.content)
  }

  const handleNext = () => {
    if (!notes.trim()) {
      alert('请输入读后感')
      return
    }
    
    navigate('/templates', {
      state: {
        duration,
        notes: notes.trim(),
        bookTitle: bookTitle.trim()
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 text-amber-900">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-amber-200/40">
        <div className="flex items-center justify-between p-6">
          <button
            onClick={() => navigate(-1)}
            className="p-3 rounded-2xl bg-amber-100 hover:bg-amber-200 transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-amber-700" />
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 bg-clip-text text-transparent">
            记录阅读心得
          </h1>
          <div className="w-12"></div>
        </div>
        
        {/* Step Indicator */}
        <div className="px-6 pb-4">
          <StepIndicator steps={steps} currentStep={currentStep} />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 lg:flex lg:h-[calc(100vh-180px)]">
        {/* Left Panel - Editor */}
        <div className="lg:w-1/2 p-6 overflow-y-auto">
          {/* Reading Summary */}
          <div className="bg-gradient-to-br from-amber-100/80 to-orange-100/60 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-amber-200/40 shadow-lg">
            <div className="flex items-center space-x-6 mb-4">
              <div className="flex items-center space-x-2 text-amber-700">
                <Clock className="h-6 w-6" />
                <span className="text-2xl font-bold">{formatDuration(duration)}</span>
              </div>
              <div className="flex items-center space-x-2 text-orange-600">
                <Book className="h-5 w-5" />
                <span className="font-medium">专注阅读</span>
              </div>
            </div>
            <p className="text-amber-600 leading-relaxed">
              🎉 恭喜您完成了 {formatDuration(duration)} 的专注阅读！现在记录下您的感悟和收获，与朋友们分享这份美好的阅读体验。
            </p>
          </div>

          {/* Book Title Input */}
          <div className="mb-6">
            <label className="block text-amber-800 text-sm font-semibold mb-3 flex items-center">
              <Book className="h-4 w-4 mr-2" />
              书籍名称 (可选)
            </label>
            <input
              type="text"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              placeholder="请输入您阅读的书籍名称，如：《追风筝的人》"
              className="w-full bg-white/80 border border-amber-200 rounded-2xl px-5 py-4 text-amber-800 placeholder-amber-400 focus:outline-none focus:border-amber-400 focus:bg-white transition-all text-lg"
            />
          </div>

          {/* Writing Templates */}
          <div className="mb-6">
            <label className="block text-amber-800 text-sm font-semibold mb-3 flex items-center">
              <Lightbulb className="h-4 w-4 mr-2" />
              写作模板
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {writingTemplates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => handleTemplateSelect(template)}
                  className="p-3 bg-white/60 hover:bg-white/80 border border-amber-200/50 hover:border-amber-300 rounded-xl text-left transition-all group"
                >
                  <div className="text-sm font-medium text-amber-800 mb-1">{template.title}</div>
                  <div className="text-xs text-amber-600 group-hover:text-amber-700">点击使用此模板</div>
                </button>
              ))}
            </div>
          </div>

          {/* Notes Input */}
          <div className="mb-6">
            <label className="block text-amber-800 text-sm font-semibold mb-3 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              读后感 *
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="分享您的阅读感悟、收获或者印象深刻的内容...&#10;&#10;可以尝试回答这些问题：&#10;• 这本书最打动我的是什么？&#10;• 我学到了什么新知识？&#10;• 这次阅读给我带来了哪些思考？&#10;• 我会如何应用这些知识？"
              rows={12}
              className="w-full bg-white/80 border border-amber-200 rounded-2xl px-5 py-4 text-amber-800 placeholder-amber-400 focus:outline-none focus:border-amber-400 focus:bg-white transition-all resize-none text-lg leading-relaxed"
            />
            <div className="flex justify-between items-center mt-3">
              <span className={`text-sm font-medium ${wordCount < 50 ? 'text-orange-500' : wordCount < 200 ? 'text-amber-600' : 'text-green-600'}`}>
                字数: {wordCount} {wordCount < 50 ? '(建议50字以上)' : wordCount > 300 ? '(内容很丰富！)' : ''}
              </span>
              {wordCount >= 50 && (
                <span className="text-green-600 text-sm flex items-center">
                  <Sparkles className="h-4 w-4 mr-1" />
                  内容充实
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 py-4 px-6 bg-white/60 hover:bg-white/80 border border-amber-200 rounded-2xl font-medium transition-colors text-amber-700"
            >
              返回修改时间
            </button>
            <button
              onClick={handleNext}
              disabled={!notes.trim()}
              className="flex-1 py-4 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed rounded-2xl font-medium transition-all text-white flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>下一步：选择样式</span>
              <Sparkles className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="lg:w-1/2 lg:border-l border-amber-200/40 bg-white/40 p-6 overflow-y-auto">
          <div className="sticky top-0">
            <h3 className="text-lg font-semibold text-amber-800 mb-4 flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              实时预览
            </h3>
            
            {/* Preview Card */}
            <div className="bg-gradient-to-br from-white via-amber-50/50 to-orange-50/30 rounded-3xl p-6 border border-amber-200/40 shadow-xl">
              {/* Mock Template Preview */}
              <div className="aspect-[3/4] bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-6 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-200/20 rounded-full blur-xl"></div>
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col">
                  <div className="text-center mb-4">
                    <div className="text-sm text-amber-600 mb-1">📚 阅读分享</div>
                    <div className="text-lg font-bold text-amber-800">
                      {bookTitle || '《书籍名称》'}
                    </div>
                  </div>
                  
                  <div className="flex-1 mb-4">
                    <div className="text-xs text-amber-600 mb-2">💭 读后感</div>
                    <div className="text-sm text-amber-700 leading-relaxed bg-white/40 rounded-xl p-3 h-32 overflow-hidden">
                      {notes || '在这里将显示您的读后感内容预览...'}
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="flex items-center justify-between text-xs text-amber-600">
                      <span>⏱ {formatDuration(duration)}</span>
                      <span>📅 {new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="mt-6 bg-gradient-to-r from-amber-100/80 to-orange-100/60 rounded-2xl p-4 border border-amber-200/40">
              <h4 className="text-sm font-semibold text-amber-800 mb-2 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                分享小贴士
              </h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• 分享真实的阅读感受，让朋友感受您的收获</li>
                <li>• 可以包含具体的例子或引用来丰富内容</li>
                <li>• 适当的情感表达会让分享更有温度</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
