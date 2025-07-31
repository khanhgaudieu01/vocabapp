import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateNextReviewDate } from '@/lib/utils'

export async function GET() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const reviews = await prisma.vocabulary.findMany({
      where: {
        isActive: true,
        nextReviewDate: {
          gte: today,
          lt: tomorrow
        }
      },
      orderBy: { nextReviewDate: 'asc' }
    })
    
    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { vocabularyId, result, timeSpent } = body

    if (vocabularyId === undefined || result === undefined) {
      return NextResponse.json(
        { error: 'vocabularyId và result là bắt buộc' },
        { status: 400 }
      )
    }

    // Get current vocabulary
    const vocabulary = await prisma.vocabulary.findUnique({
      where: { id: vocabularyId }
    })

    if (!vocabulary) {
      return NextResponse.json(
        { error: 'Không tìm thấy từ vựng' },
        { status: 404 }
      )
    }

    // Calculate new level and next review date
    const newLevel = result ? Math.min(vocabulary.level + 1, 6) : 1
    const nextReviewDate = calculateNextReviewDate(newLevel, result)

    // Update vocabulary
    const updatedVocabulary = await prisma.vocabulary.update({
      where: { id: vocabularyId },
      data: {
        level: newLevel,
        reviewCount: vocabulary.reviewCount + 1,
        nextReviewDate
      }
    })

    // Create review history
    const reviewHistory = await prisma.reviewHistory.create({
      data: {
        vocabularyId,
        result,
        timeSpent: timeSpent || 0
      }
    })

    return NextResponse.json({
      vocabulary: updatedVocabulary,
      reviewHistory
    })
  } catch (error) {
    console.error('Error updating review:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 