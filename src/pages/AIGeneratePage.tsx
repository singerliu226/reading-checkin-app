import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Sparkles, Wand2, RefreshCw, Edit3 } from 'lucide-react'
import { useAI } from '@/hooks/useAI'

export function AIGeneratePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { duration, notes, bookTitle, template } = location.state || {}
  
  const { loading, error, generateImage, extractKeywordsFromText, generatePromptFromKeywords } = useAI()
  const [customPrompt, setCustomPrompt] = useState('')
  const [generatedImageUrl, setGeneratedImageUrl] = useState('')
  const [keywords, setKeywords] = useState<string[]>([])
  const [useCustomPrompt, setUseCustomPrompt] = useState(false)

  useEffect(() => {
    if (notes) {
      const extractedKeywords = extractKeywordsFromText(notes)
      setKeywords(extractedKeywords)
      if (!useCustomPrompt) {
        const autoPrompt = generatePromptFromKeywords(extractedKeywords)
        setCustomPrompt(autoPrompt)
      }
    }
  }, [notes, useCustomPrompt])

  const handleGenerate = async () => {
    try {
      const prompt = customPrompt || generatePromptFromKeywords(keywords)
      console.log('Generating with prompt:', prompt)
      const imageUrl = await generateImage(prompt, 'illustration')
      setGeneratedImageUrl(imageUrl)
    } catch (err) {
      console.error('Generation failed:', err)
    }
  }

  const handleNext = () => {
    if (!generatedImageUrl) {
      alert('请先生成AI背景图片')
      return
    }

    navigate('/compose', {
      state: {
        duration,
        notes,
        bookTitle,
        template,
        backgroundImage: generatedImageUrl
      }
    })
  }

  const handleRegenerate = () => {
    setGeneratedImageUrl('')
    handleGenerate()
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
        <h1 className="text-xl font-bold">AI生成背景</h1>
        <div className="w-10"></div>
      </header>

      <div className="px-4 py-6">
        {/* Keywords Display */}
        {keywords.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Wand2 className="h-5 w-5 mr-2 text-purple-300" />
              从读后感中提取的关键词
            </h3>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="bg-purple-500/30 text-purple-200 px-3 py-1 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Prompt Input */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-lg font-medium">生成提示词</label>
            <button
              onClick={() => setUseCustomPrompt(!useCustomPrompt)}
              className="text-sm text-purple-300 hover:text-purple-100 flex items-center space-x-1"
            >
              <Edit3 className="h-4 w-4" />
              <span>{useCustomPrompt ? '使用自动提示词' : '自定义提示词'}</span>
            </button>
          </div>
          
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            readOnly={!useCustomPrompt}
            placeholder="描述你想要的背景图片..."
            className={`w-full h-24 bg-white/10 backdrop-blur-sm border border-purple-400/30 rounded-lg p-4 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none ${
              !useCustomPrompt ? 'opacity-75' : ''
            }`}
          />
          <p className="text-sm text-purple-300 mt-2">
            {useCustomPrompt 
              ? '自定义描述将帮助AI生成更符合你期望的背景图片'
              : '基于读后感内容自动生成的提示词，你也可以选择自定义'
            }
          </p>
        </div>

        {/* Generated Image */}
        {generatedImageUrl && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">生成的背景图片</h3>
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={generatedImageUrl}
                alt="AI生成的背景图片"
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute top-4 right-4">
                <button
                  onClick={handleRegenerate}
                  disabled={loading}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 rounded-lg transition-colors"
                >
                  <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-400 text-red-300 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          {!generatedImageUrl ? (
            <button
              onClick={handleGenerate}
              disabled={loading || !customPrompt.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>AI正在生成中...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>生成AI背景图片</span>
                </>
              )}
            </button>
          ) : (
            <div className="space-y-3">
              <button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>使用此背景制作分享卡片</span>
              </button>
              
              <button
                onClick={handleRegenerate}
                disabled={loading}
                className="w-full border border-purple-400 text-purple-300 hover:bg-purple-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                <span>重新生成</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
