'use client'

import { Plus, BookOpen, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import AddVocabularyModal from './AddVocabularyModal'

export default function Header() {
  const [showAddModal, setShowAddModal] = useState(false)

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">
                  VocabApp
                </span>
              </Link>
            </div>
            
            <nav className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Trang chủ
              </Link>
              <Link 
                href="/review" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Ôn tập
              </Link>
              <Link 
                href="/vocabulary" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Từ vựng
              </Link>
              <Link 
                href="/stats" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <BarChart3 className="h-4 w-4 mr-1" />
                Thống kê
              </Link>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn btn-primary flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Thêm từ mới
              </button>
            </nav>
          </div>
        </div>
      </header>

      <AddVocabularyModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
      />
    </>
  )
} 