'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface AddVocabularyModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddVocabularyModal({ isOpen, onClose }: AddVocabularyModalProps) {
  const [formData, setFormData] = useState({
    chinese: '',
    pinyin: '',
    vietnamese: '',
    notes: '',
    example: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/vocabulary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFormData({
          chinese: '',
          pinyin: '',
          vietnamese: '',
          notes: '',
          example: ''
        })
        onClose()
        // Refresh the page to update data
        window.location.reload()
      } else {
        alert('Có lỗi xảy ra khi thêm từ vựng')
      }
    } catch (error) {
      console.error('Error adding vocabulary:', error)
      alert('Có lỗi xảy ra khi thêm từ vựng')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Thêm từ vựng mới</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chữ Hán *
            </label>
            <input
              type="text"
              name="chinese"
              value={formData.chinese}
              onChange={handleChange}
              required
              className="input"
              placeholder="汉字"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pinyin *
            </label>
            <input
              type="text"
              name="pinyin"
              value={formData.pinyin}
              onChange={handleChange}
              required
              className="input"
              placeholder="hàn zì"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nghĩa tiếng Việt *
            </label>
            <input
              type="text"
              name="vietnamese"
              value={formData.vietnamese}
              onChange={handleChange}
              required
              className="input"
              placeholder="chữ Hán"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ghi chú
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="input"
              rows={2}
              placeholder="Ghi chú về từ vựng này..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ví dụ câu
            </label>
            <textarea
              name="example"
              value={formData.example}
              onChange={handleChange}
              className="input"
              rows={2}
              placeholder="Ví dụ câu sử dụng từ này..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Đang thêm...' : 'Thêm từ vựng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 