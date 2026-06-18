import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(req: NextRequest, { params }: { params: { id: string; photoId: string } }) {
  try {
    await prisma.venuePhoto.delete({ where: { id: params.photoId } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/venues/[id]/photos/[photoId] error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
