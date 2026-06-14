import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const eventId = searchParams.get('eventId')

    const previews = await prisma.preview.findMany({
      where: eventId ? { eventId } : undefined,
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(previews)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const preview = await prisma.preview.create({
      data: {
        eventId: body.eventId,
        url: body.url,
        type: body.type || 'MOODBOARD',
        status: body.status || 'BROUILLON',
        notes: body.notes || null,
      },
    })
    return NextResponse.json(preview, { status: 201 })
  } catch (error) {
    console.error('POST /api/previews error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
