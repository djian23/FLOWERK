import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const eventId = searchParams.get('eventId') || ''
    const entries = await prisma.eventTimeline.findMany({
      where: eventId ? { eventId } : undefined,
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(entries)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const entry = await prisma.eventTimeline.create({
      data: {
        eventId: body.eventId,
        action: body.action,
        details: body.details || null,
        automatic: body.automatic ?? false,
      },
    })
    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
