import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    if (!prisma) {
      return NextResponse.json({
        totalWords: 0,
        todayReviews: 0,
        totalReviews: 0,
        successRate: 0
      })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const [totalWords, todayReviews, totalReviews, correctReviews] = await Promise.all([
      prisma.vocabulary.count({ where: { isActive: true } }),
      prisma.vocabulary.count({
        where: {
          isActive: true,
          nextReviewDate: {
            gte: today,
            lt: tomorrow
          }
        }
      }),
      prisma.reviewHistory.count({
        where: {
          vocabulary: {
            isActive: true
          }
        }
      }),
      prisma.reviewHistory.count({
        where: {
          result: true,
          vocabulary: {
            isActive: true
          }
        }
      })
    ])

    const successRate = totalReviews > 0 ? Math.round((correctReviews / totalReviews) * 100) : 0

    return NextResponse.json({
      totalWords,
      todayReviews,
      totalReviews,
      successRate
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({
      totalWords: 0,
      todayReviews: 0,
      totalReviews: 0,
      successRate: 0
    })
  }
}