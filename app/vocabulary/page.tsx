'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { format } from 'date-fns'
import { getLevelName } from '@/lib/utils'
import { Trash2, Edit } from 'lucide-react'

interface Vocabulary {
  id: number
  chinese: string
  pinyin: string
  vietnamese: string
  notes?: string
  example?: string
  level: number
  reviewCount: number
  nextReviewDate: string
  createdAt: string
}

export default function VocabularyPage() {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchVocabulary()
  }, [])

  const fetchVocabulary = async () => {
    try {
      const response = await fetch('/api/vocabulary')
      if (response.ok) {
        const data = await response.json()
        setVocabulary(data)
      }
    } catch (error) {
      console.error('Error fetching vocabulary:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number, chinese: string) => {
    if (!confirm(`Bạn có chắc muốn xóa từ "${chinese}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/vocabulary/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // Remove from local state
        setVocabulary(prev => prev.filter(word => word.id !== id))
      } else {
        alert('Có lỗi xảy ra khi xóa từ vựng')
      }
    } catch (error) {
      console.error('Error deleting vocabulary:', error)
      alert('Có lỗi xảy ra khi xóa từ vựng')
    }
  }

  return (
    <div>
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quản lý từ vựng
          </h1>
          <p className="text-gray-600">
            Tổng cộng {vocabulary.length} từ vựng
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải từ vựng...</p>
          </div>
        ) : vocabulary.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Chưa có từ vựng nào
            </h2>
            <p className="text-gray-600">
              Hãy thêm từ vựng đầu tiên để bắt đầu học!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vocabulary.map((word) => (
              <div key={word.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-3xl font-bold text-gray-900">
                    {word.chinese}
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-blue-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(word.id, word.chinese)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="text-sm text-gray-600">
                    <strong>Pinyin:</strong> {word.pinyin}
                  </div>
                  <div className="text-sm text-gray-800">
                    <strong>Nghĩa:</strong> {word.vietnamese}
                  </div>
                  {word.notes && (
                    <div className="text-sm text-gray-600">
                      <strong>Ghi chú:</strong> {word.notes}
                    </div>
                  )}
                  {word.example && (
                    <div className="text-sm text-gray-600">
                      <strong>Ví dụ:</strong> {word.example}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Level {word.level} ({getLevelName(word.level)})</span>
                  <span>Ôn {word.reviewCount} lần</span>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    <strong>Ôn tập tiếp:</strong> {format(new Date(word.nextReviewDate), 'dd/MM/yyyy')}
                  </div>
                  <div className="text-xs text-gray-500">
                    <strong>Thêm ngày:</strong> {format(new Date(word.createdAt), 'dd/MM/yyyy')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
} 