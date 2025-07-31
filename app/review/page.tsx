'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { CheckCircle, XCircle, Eye, EyeOff, ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { getLevelName } from '@/lib/utils'

interface Vocabulary {
  id: number
  chinese: string
  pinyin: string
  vietnamese: string
  notes?: string
  example?: string
  level: number
  reviewCount: number
}

export default function ReviewPage() {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [completedCount, setCompletedCount] = useState(0)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/review')
      if (response.ok) {
        const data = await response.json()
        setVocabulary(data)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleShowAnswer = () => {
    setShowAnswer(true)
  }

  const handleResult = async (result: boolean) => {
    if (!vocabulary[currentIndex]) return

    setIsSubmitting(true)
    const startTime = Date.now()

    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vocabularyId: vocabulary[currentIndex].id,
          result,
          timeSpent: Math.floor((Date.now() - startTime) / 1000)
        }),
      })

      if (response.ok) {
        const newCompletedCount = completedCount + 1
        setCompletedCount(newCompletedCount)
        
        if (currentIndex < vocabulary.length - 1) {
          setCurrentIndex(prev => prev + 1)
          setShowAnswer(false)
        } else {
          // Completed all reviews
          alert('Chúc mừng! Bạn đã hoàn thành tất cả từ cần ôn tập hôm nay.')
          // Redirect to home page after completion
          window.location.href = '/'
        }
      }
    } catch (error) {
      console.error('Error submitting result:', error)
      alert('Có lỗi xảy ra khi cập nhật kết quả')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNext = () => {
    if (currentIndex < vocabulary.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setShowAnswer(false)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
      setShowAnswer(false)
    }
  }

  if (isLoading) {
    return (
      <div>
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải từ vựng...</p>
          </div>
        </div>
      </div>
    )
  }

  if (vocabulary.length === 0) {
    return (
      <div>
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Không có từ nào cần ôn tập hôm nay!
            </h1>
            <p className="text-gray-600 mb-6">
              Tất cả từ vựng đã được ôn tập hoặc chưa đến lịch ôn tập.
            </p>
            <Link href="/" className="btn btn-primary">
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const currentWord = vocabulary[currentIndex]

  return (
    <div>
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Tiến độ: {Math.min(currentIndex + 1, vocabulary.length)} / {vocabulary.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round((Math.min(currentIndex + 1, vocabulary.length) / vocabulary.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(Math.min(currentIndex + 1, vocabulary.length) / vocabulary.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="btn btn-secondary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Từ trước
          </button>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Ôn tập từ vựng</h1>
            <p className="text-gray-600">
              Từ {currentIndex + 1} trong {vocabulary.length}
            </p>
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex === vocabulary.length - 1}
            className="btn btn-secondary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Từ tiếp
            <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        </div>

        {/* Word Card */}
        <div className="card max-w-2xl mx-auto">
          <div className="text-center">
            {/* Chinese Character */}
            <div className="text-6xl font-bold text-gray-900 mb-6">
              {currentWord.chinese}
            </div>

            {/* Pinyin */}
            <div className="text-xl text-gray-600 mb-4">
              {currentWord.pinyin}
            </div>

            {/* Vietnamese Meaning */}
            {showAnswer ? (
              <div className="text-lg text-gray-800 mb-6">
                {currentWord.vietnamese}
              </div>
            ) : (
              <div className="text-lg text-gray-400 mb-6">
                • • • • • • • •
              </div>
            )}

            {/* Notes */}
            {showAnswer && currentWord.notes && (
              <div className="text-sm text-gray-600 mb-4 p-3 bg-gray-50 rounded-lg">
                <strong>Ghi chú:</strong> {currentWord.notes}
              </div>
            )}

            {/* Example */}
            {showAnswer && currentWord.example && (
              <div className="text-sm text-gray-600 mb-6 p-3 bg-gray-50 rounded-lg">
                <strong>Ví dụ:</strong> {currentWord.example}
              </div>
            )}

            {/* Word Info */}
            <div className="flex justify-center space-x-4 mb-6 text-sm text-gray-500">
              <span>Level {currentWord.level} ({getLevelName(currentWord.level)})</span>
              <span>Ôn {currentWord.reviewCount} lần</span>
            </div>

            {/* Actions */}
            {!showAnswer ? (
              <button
                onClick={handleShowAnswer}
                className="btn btn-primary flex items-center mx-auto"
              >
                <Eye className="h-4 w-4 mr-2" />
                Xem đáp án
              </button>
            ) : (
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => handleResult(false)}
                  disabled={isSubmitting}
                  className="btn btn-danger flex items-center"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Sai
                </button>
                <button
                  onClick={() => handleResult(true)}
                  disabled={isSubmitting}
                  className="btn btn-success flex items-center"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Đúng
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            <strong>Hướng dẫn:</strong> Xem từ tiếng Trung, thử đọc Pinyin và nghĩa, 
            sau đó xem đáp án và đánh giá kết quả.
          </p>
        </div>
      </main>
    </div>
  )
} 