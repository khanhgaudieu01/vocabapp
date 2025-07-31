'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { format } from 'date-fns'
import Link from 'next/link'
import { BookOpen, Clock, CheckCircle, TrendingUp } from 'lucide-react'

interface Stats {
  totalWords: number
  todayReviews: number
  totalReviews: number
  successRate: number
}

interface Vocabulary {
  id: number
  chinese: string
  pinyin: string
  vietnamese: string
  level: number
  reviewCount: number
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats>({
    totalWords: 0,
    todayReviews: 0,
    totalReviews: 0,
    successRate: 0
  })
  const [todayReviews, setTodayReviews] = useState<Vocabulary[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    fetchTodayReviews()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchTodayReviews = async () => {
    try {
      const response = await fetch('/api/review')
      if (response.ok) {
        const data = await response.json()
        setTodayReviews(data.slice(0, 10))
      }
    } catch (error) {
      console.error('Error fetching today reviews:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Học từ vựng tiếng Trung hiệu quả
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sử dụng phương pháp Spaced Repetition để ghi nhớ từ vựng lâu dài và có hệ thống
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="card">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng từ vựng</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalWords}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cần ôn hôm nay</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todayReviews}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng ôn tập</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalReviews}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tỷ lệ thành công</p>
                <p className="text-2xl font-bold text-gray-900">{stats.successRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Reviews */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Từ cần ôn tập hôm nay ({format(new Date(), 'dd/MM/yyyy')})
            </h2>
            {stats.todayReviews > 0 && (
              <Link 
                href="/review" 
                className="btn btn-primary"
              >
                Bắt đầu ôn tập
              </Link>
            )}
          </div>

          {todayReviews.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                Không có từ nào cần ôn tập hôm nay!
              </p>
              <p className="text-gray-400 mt-2">
                Hãy thêm từ vựng mới để bắt đầu học.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todayReviews.map((word) => (
                <div key={word.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    {word.chinese}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    {word.pinyin}
                  </div>
                  <div className="text-sm text-gray-800 mb-2">
                    {word.vietnamese}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Level {word.level}
                    </span>
                    <span className="text-xs text-gray-500">
                      Ôn {word.reviewCount} lần
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/vocabulary" className="card hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quản lý từ vựng</h3>
            <p className="text-gray-600">Xem và chỉnh sửa tất cả từ vựng đã học</p>
          </Link>

          <Link href="/stats" className="card hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Thống kê chi tiết</h3>
            <p className="text-gray-600">Theo dõi tiến độ học tập và hiệu suất</p>
          </Link>

          <div className="card hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Hướng dẫn sử dụng</h3>
            <p className="text-gray-600">Tìm hiểu cách sử dụng hiệu quả ứng dụng</p>
          </div>
        </div>
      </main>
    </div>
  )
} 