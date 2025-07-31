import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    if (!prisma) {
      return NextResponse.json({
        totalWords: 0,
        totalReviews: 0,
        correctReviews: 0,
        successRate: 0,
        levelDistribution: [],
        recentReviews: []
      })
    }

    const [
      totalWords,
      totalReviews,
      correctReviews,
      levelDistribution,
      recentReviews
    ] = await Promise.all([
      prisma.vocabulary.count({ where: { isActive: true } }),
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
      }),
      prisma.vocabulary.groupBy({
        by: ['level'],
        where: { isActive: true },
        _count: { level: true }
      }),
      prisma.reviewHistory.findMany({
        take: 10,
        orderBy: { reviewDate: 'desc' },
        where: {
          vocabulary: {
            isActive: true
          }
        },
        include: {
          vocabulary: true
        }
      })
    ])

    const successRate = totalReviews > 0 ? Math.round((correctReviews / totalReviews) * 100) : 0

    return NextResponse.json({
      totalWords,
      totalReviews,
      correctReviews,
      successRate,
      levelDistribution,
      recentReviews
    })
  } catch (error) {
    console.error('Error fetching detailed stats:', error)
    return NextResponse.json({
      totalWords: 0,
      totalReviews: 0,
      correctReviews: 0,
      successRate: 0,
      levelDistribution: [],
      recentReviews: []
    })
  }
}