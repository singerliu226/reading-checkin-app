import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useImageUpload() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadImage = async (imageData: string, fileName: string, bucket: string = 'reading-checkin-images') => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('Uploading image:', fileName)
      
      const { data, error } = await supabase.functions.invoke('upload-image', {
        body: {
          imageData,
          fileName,
          bucket
        }
      })

      if (error) {
        console.error('Image upload error:', error)
        throw error
      }

      if (!data?.data?.publicUrl) {
        throw new Error('No public URL returned from upload service')
      }

      console.log('Image uploaded successfully:', data.data.publicUrl)
      return data.data.publicUrl
    } catch (err: any) {
      const errorMessage = err.message || '图片上传失败，请重试'
      console.error('Image upload failed:', errorMessage)
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const convertCanvasToDataURL = (canvas: HTMLCanvasElement, quality: number = 0.9): string => {
    return canvas.toDataURL('image/png', quality)
  }

  return {
    loading,
    error,
    uploadImage,
    convertCanvasToDataURL
  }
}
