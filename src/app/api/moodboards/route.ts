import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const eventId = request.nextUrl.searchParams.get('eventId')
  const where = eventId ? { eventId } : {}
  const moodboards = await prisma.moodboard.findMany({
    where,
    include: {
      event: { include: { client: true } },
      items: { orderBy: { order: 'asc' } },
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(moodboards)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { eventId, title, notes } = body
  if (!eventId || !title) {
    return NextResponse.json({ error: 'eventId and title are required' }, { status: 400 })
  }
  const moodboard = await prisma.moodboard.create({
    data: { eventId, title, notes: notes || null },
    include: {
      event: { include: { client: true } },
      items: { orderBy: { order: 'asc' } },
    },
  })
  return NextResponse.json(moodboard, { status: 201 })
}
