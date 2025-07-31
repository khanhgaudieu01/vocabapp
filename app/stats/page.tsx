import Header from '@/components/Header'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { getLevelName } from '@/lib/utils'
import { BarChart3, TrendingUp, Clock, CheckCircle } from 'lucide-react'

async function getStats() {
  // Temporary mock data for build success
  return {
    totalWords: 0,
    totalReviews: 0,
    correctReviews: 0,
    successRate: 0,
    levelDistribution: [] as any[],
    recentReviews: [] as any[]
  }
}

export default async function StatsPage() {
  const stats = await getStats()

  return (
    <div>
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thống kê học tập
          </h1>
          <p className="text-gray-600">
            Theo dõi tiến độ và hiệu suất học tập của bạn
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
                             <BarChart3 className="h-8 w-8 text-blue-600" />
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
                <p className="text-sm font-medium text-gray-600">Tổng ôn tập</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalReviews}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đúng</p>
                <p className="text-2xl font-bold text-gray-900">{stats.correctReviews}</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Level Distribution */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Phân bố theo cấp độ</h2>
            <div className="space-y-4">
              {stats.levelDistribution.length === 0 ? (
                <p className="text-gray-500 text-center">Chưa có dữ liệu</p>
              ) : (
                stats.levelDistribution.map((level) => (
                <div key={level.level} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700">
                      Level {level.level}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({getLevelName(level.level)})
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                                                 className="bg-blue-600 h-2 rounded-full"
                        style={{ 
                          width: `${(level._count.level / stats.totalWords) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {level._count.level}
                    </span>
                  </div>
                </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Ôn tập gần đây</h2>
            <div className="space-y-3">
              {stats.recentReviews.length === 0 ? (
                <p className="text-gray-500 text-center">Chưa có dữ liệu ôn tập</p>
              ) : (
                stats.recentReviews.map((review) => (
                <div key={review.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="text-lg font-bold text-gray-900 mr-3">
                      {review.vocabulary.chinese}
                    </div>
                    <div className="text-sm text-gray-600">
                      {review.vocabulary.pinyin}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      review.result 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {review.result ? 'Đúng' : 'Sai'}
                    </span>
                                         <span className="text-xs text-gray-500">
                       {format(review.reviewDate, 'dd/MM HH:mm')}
                     </span>
                  </div>
                </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Study Tips */}
        <div className="mt-8 card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Lời khuyên học tập</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">🎯 Mục tiêu hàng ngày</h3>
              <p className="text-gray-600 text-sm">
                Cố gắng ôn tập ít nhất 10-20 từ mỗi ngày để duy trì hiệu quả học tập.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">⏰ Thời gian tốt nhất</h3>
              <p className="text-gray-600 text-sm">
                Ôn tập vào buổi sáng hoặc trước khi đi ngủ để ghi nhớ tốt hơn.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">📈 Theo dõi tiến độ</h3>
              <p className="text-gray-600 text-sm">
                Kiểm tra thống kê thường xuyên để điều chỉnh phương pháp học.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">🔄 Ôn tập đều đặn</h3>
              <p className="text-gray-600 text-sm">
                Tuân thủ lịch ôn tập để tối ưu hóa việc ghi nhớ từ vựng.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 