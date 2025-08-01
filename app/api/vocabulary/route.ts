import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Check if prisma is available
    if (!prisma) {
      return NextResponse.json([])
    }

    const vocabulary = await prisma.vocabulary.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(vocabulary)
  } catch (error) {
    console.error('Error fetching vocabulary:', error)
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if prisma is available
    if (!prisma) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { chinese, pinyin, vietnamese, notes, example } = body

    // Validate required fields
    if (!chinese || !pinyin || !vietnamese) {
      return NextResponse.json(
        { error: 'Chữ Hán, Pinyin và nghĩa tiếng Việt là bắt buộc' },
        { status: 400 }
      )
    }

    // Check if word already exists (only active words)
    const existingWord = await prisma.vocabulary.findFirst({
      where: { 
        chinese,
        isActive: true 
      }
    })

    if (existingWord) {
      return NextResponse.json(
        { error: 'Từ vựng này đã tồn tại' },
        { status: 400 }
      )
    }

    const vocabulary = await prisma.vocabulary.create({
      data: {
        chinese,
        pinyin,
        vietnamese,
        notes: notes || null,
        example: example || null,
        nextReviewDate: new Date(), // Có thể ôn tập ngay
        level: 1,
        reviewCount: 0,
        isActive: true
      }
    })

    return NextResponse.json(vocabulary, { status: 201 })
  } catch (error) {
    console.error('Error creating vocabulary:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 