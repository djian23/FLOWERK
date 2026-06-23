import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest, { params }: { params: { id: string; itemId: string } }) {
  try {
    const body = await request.json()
    const { title, description, order } = body
    const item = await prisma.moodboardItem.update({
      where: { id: params.itemId },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(order !== undefined && { order }),
      },
    })
    return NextResponse.json(item)
  } catch (error) {
    console.error('PUT /api/moodboards/[id]/items/[itemId] error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string; itemId: string } }) {
  try {
    await prisma.moodboardItem.delete({ where: { id: params.itemId } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/moodboards/[id]/items/[itemId] error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
