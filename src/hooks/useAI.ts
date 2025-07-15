import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useAI() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateImage = async (prompt: string, style: string = 'illustration') => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('Generating AI image with prompt:', prompt)
      
      const { data, error } = await supabase.functions.invoke('generate-ai-image', {
        body: {
          prompt,
          style
        }
      })

      if (error) {
        console.error('AI generation error:', error)
        throw error
      }

      if (!data?.data?.imageUrl) {
        throw new Error('No image URL returned from AI service')
      }

      console.log('AI image generated successfully:', data.data.imageUrl)
      return data.data.imageUrl
    } catch (err: any) {
      const errorMessage = err.message || 'AI图片生成失败，请重试'
      console.error('AI image generation failed:', errorMessage)
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const extractKeywordsFromText = (text: string): string[] => {
    // 简单的关键词提取算法
    const keywords = text
      .replace(/[。，！？；：、""''（）【】《》]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length >= 2)
      .slice(0, 5) // 取前5个关键词
    
    return keywords
  }

  const generatePromptFromKeywords = (keywords: string[]): string => {
    const basePrompt = '唯美的阅读场景'
    if (keywords.length === 0) {
      return basePrompt
    }
    
    return `${basePrompt}，包含${keywords.join('、')}元素的意境`
  }

  return {
    loading,
    error,
    generateImage,
    extractKeywordsFromText,
    generatePromptFromKeywords
  }
}
