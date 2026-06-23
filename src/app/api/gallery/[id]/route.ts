import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.mediaItem.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/gallery/[id] error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
