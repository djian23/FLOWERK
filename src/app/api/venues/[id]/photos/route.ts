import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const photo = await prisma.venuePhoto.create({
      data: {
        url: body.url,
        venueId: params.id,
        eventId: body.eventId || null,
        eventName: body.eventName || null,
        caption: body.caption || null,
      },
    })
    return NextResponse.json(photo, { status: 201 })
  } catch (error) {
    console.error('POST /api/venues/[id]/photos error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
