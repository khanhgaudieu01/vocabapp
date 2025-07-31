import Header from '@/components/Header'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { getLevelName } from '@/lib/utils'
import { Trash2, Edit } from 'lucide-react'

async function getVocabulary() {
  return await prisma.vocabulary.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  })
}

export default async function VocabularyPage() {
  const vocabulary = await getVocabulary()

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

        {vocabulary.length === 0 ? (
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
                    <button className="text-gray-400 hover:text-red-600">
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
                    <strong>Ôn tập tiếp:</strong> {format(word.nextReviewDate, 'dd/MM/yyyy', { locale: vi })}
                  </div>
                  <div className="text-xs text-gray-500">
                    <strong>Thêm ngày:</strong> {format(word.createdAt, 'dd/MM/yyyy', { locale: vi })}
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