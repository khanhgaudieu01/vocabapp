import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if prisma is available
    if (!prisma) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 500 }
      )
    }

    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID không hợp lệ' },
        { status: 400 }
      )
    }

    // Check if vocabulary exists
    const vocabulary = await prisma.vocabulary.findUnique({
      where: { id }
    })

    if (!vocabulary) {
      return NextResponse.json(
        { error: 'Không tìm thấy từ vựng' },
        { status: 404 }
      )
    }

    // Soft delete - set isActive to false
    await prisma.vocabulary.update({
      where: { id },
      data: { isActive: false }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting vocabulary:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}