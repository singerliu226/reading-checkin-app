import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Palette, Sparkles, Check, Wand2, Coffee, Leaf, BookOpen, Star, Heart } from 'lucide-react'
import { StepIndicator } from '@/components/ui/StepIndicator'

// 预设的分享卡片模板（使用实际存在的图片文件）
const templates = [
  {
    id: 'template1',
    name: '经典书香',
    thumbnail: '/templates/classic-template.jpg',
    style: 'classic',
    description: '简约优雅，适合各类读书分享',
    icon: BookOpen,
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'template2',
    name: '现代简约',
    thumbnail: '/templates/modern-template.jpg', 
    style: 'modern',
    description: '干净清爽，突出内容重点',
    icon: Star,
    color: 'from-blue-500 to-indigo-500'
  },
  {
    id: 'template3',
    name: '复古文艺',
    thumbnail: '/templates/vintage-template.jpg',
    style: 'vintage', 
    description: '温暖复古，营造文艺氛围',
    icon: Heart,
    color: 'from-rose-500 to-pink-500'
  },
  {
    id: 'template4',
    name: '温馨阅读',
    thumbnail: '/templates/elegant-template.jpg',
    style: 'cozy',
    description: '温馨舒适，分享阅读温度',
    icon: Coffee,
    color: 'from-yellow-500 to-amber-500'
  },
  {
    id: 'template5',
    name: '古典优雅',
    thumbnail: '/templates/template5.jpg',
    style: 'elegant',
    description: '古典美学，彰显品味',
    icon: BookOpen,
    color: 'from-purple-500 to-violet-500'
  },
  {
    id: 'template6',
    name: '舒适书房',
    thumbnail: '/templates/template6.jpg',
    style: 'comfort',
    description: '舒适环境，静享阅读',
    icon: Coffee,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'template7',
    name: '简约清新',
    thumbnail: '/templates/template7.jpg',
    style: 'fresh',
    description: '简约设计，清新自然',
    icon: Leaf,
    color: 'from-teal-500 to-cyan-500'
  },
  {
    id: 'template8',
    name: '秋日阅读',
    thumbnail: '/templates/template8.jpeg',
    style: 'autumn',
    description: '秋日暖意，书香满怀',
    icon: Leaf,
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'template9',
    name: '现代极简',
    thumbnail: '/templates/template9.jpg',
    style: 'minimal',
    description: '现代设计，极简美学',
    icon: Star,
    color: 'from-gray-500 to-slate-500'
  },
  {
    id: 'template10',
    name: '咖啡时光',
    thumbnail: '/templates/template10.jpeg',
    style: 'coffee',
    description: '咖啡书香，惬意时光',
    icon: Coffee,
    color: 'from-amber-600 to-orange-600'
  },
  {
    id: 'ai-generated',
    name: 'AI智能生成',
    thumbnail: '/templates/ai-placeholder.jpg',
    style: 'ai',
    description: '根据读后感智能生成个性化背景',
    icon: Wand2,
    color: 'from-violet-500 to-purple-500',
    isAI: true
  }
]

export function TemplatesPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { duration, notes, bookTitle } = location.state || {}
  
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [currentStep, setCurrentStep] = useState(1)

  const steps = [
    { id: 1, title: "写读后感", description: "记录感悟" },
    { id: 2, title: "选择样式", description: "挑选模板" },
    { id: 3, title: "生成分享", description: "制作卡片" }
  ]

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
  }

  const handleNext = () => {
    if (!selectedTemplate) {
      alert('请选择一个模板')
      return
    }

    if (selectedTemplate === 'ai-generated') {
      // 跳转到AI生成页面
      navigate('/ai-generate', {
        state: {
          duration,
          notes,
          bookTitle,
          template: selectedTemplate
        }
      })
    } else {
      // 跳转到图片合成页面
      navigate('/compose', {
        state: {
          duration,
          notes,
          bookTitle,
          template: selectedTemplate
        }
      })
    }
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
            选择分享样式
          </h1>
          <div className="w-12"></div>
        </div>
        
        {/* Step Indicator */}
        <div className="px-6 pb-4">
          <StepIndicator steps={steps} currentStep={currentStep} />
        </div>
      </header>

      <div className="p-6 pb-24">
        {/* Introduction */}
        <div className="mb-8 text-center">
          <h2 className="text-xl font-semibold text-amber-800 mb-2">选择您喜欢的分享卡片样式</h2>
          <p className="text-amber-600">为您的阅读心得选择最合适的视觉表达</p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {templates.map((template) => {
            const IconComponent = template.icon
            return (
              <div
                key={template.id}
                onClick={() => handleTemplateSelect(template.id)}
                className={`relative cursor-pointer rounded-3xl overflow-hidden transition-all duration-300 group ${
                  selectedTemplate === template.id
                    ? 'ring-4 ring-amber-400 scale-105 shadow-2xl'
                    : 'hover:scale-102 hover:shadow-xl'
                }`}
              >
                {/* Template Preview */}
                <div className="aspect-[3/4] relative overflow-hidden">
                  {template.isAI ? (
                    // AI特殊样式
                    <div className={`w-full h-full bg-gradient-to-br ${template.color} flex items-center justify-center relative`}>
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="relative z-10 text-center text-white">
                        <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                          <Wand2 className="h-10 w-10" />
                        </div>
                        <div className="text-lg font-bold mb-2">AI智能生成</div>
                        <div className="text-sm opacity-90">个性化背景</div>
                      </div>
                      {/* 动画效果 */}
                      <div className="absolute top-4 right-4 w-3 h-3 bg-white/40 rounded-full animate-ping"></div>
                      <div className="absolute bottom-6 left-6 w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                    </div>
                  ) : (
                    // 普通模板预览
                    <div className="relative">
                      <img
                        src={template.thumbnail}
                        alt={template.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          // 图片加载失败时的备用方案
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          const parent = target.parentNode as HTMLElement
                          parent.innerHTML = `
                            <div class="w-full h-full bg-gradient-to-br ${template.color} flex items-center justify-center">
                              <div class="text-center text-white">
                                <div class="w-16 h-16 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center">
                                  <svg class="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                  </svg>
                                </div>
                                <div class="text-sm font-medium">${template.name}</div>
                              </div>
                            </div>
                          `
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="flex items-center space-x-2 mb-1">
                          <IconComponent className="h-4 w-4" />
                          <span className="text-sm font-medium">{template.name}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Selection Indicator */}
                  {selectedTemplate === template.id && (
                    <div className="absolute top-4 right-4 w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                      <Check className="h-6 w-6 text-white" />
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Template Info */}
                <div className="bg-white/80 backdrop-blur-sm p-4 border-t border-amber-200/40">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg text-amber-800">{template.name}</h3>
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${template.color}`}></div>
                  </div>
                  <p className="text-sm text-amber-600">{template.description}</p>
                  {template.isAI && (
                    <div className="mt-2 flex items-center text-xs text-violet-600">
                      <Sparkles className="h-3 w-3 mr-1" />
                      <span>智能个性化</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Selected Template Info */}
        {selectedTemplate && (
          <div className="bg-gradient-to-r from-amber-100/80 to-orange-100/60 rounded-3xl p-6 mb-6 border border-amber-200/40">
            {(() => {
              const selected = templates.find(t => t.id === selectedTemplate)
              const IconComponent = selected?.icon || BookOpen
              return (
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${selected?.color} flex items-center justify-center`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-amber-800">已选择：{selected?.name}</h3>
                    <p className="text-amber-600">{selected?.description}</p>
                  </div>
                  <div className="text-right text-sm text-amber-600">
                    {selected?.isAI ? '✨ AI生成' : '🎨 模板样式'}
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </div>

      {/* Fixed Bottom Action Button */}
      {selectedTemplate && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-amber-200/40 p-6 z-20">
          <button
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-medium py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
          >
            {selectedTemplate === 'ai-generated' ? (
              <>
                <Wand2 className="h-5 w-5" />
                <span>下一步：AI生成背景</span>
              </>
            ) : (
              <>
                <Palette className="h-5 w-5" />
                <span>下一步：制作分享卡片</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
