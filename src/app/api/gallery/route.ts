import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const eventId = searchParams.get('eventId')
  const where = eventId ? { eventId } : {}

  const items = await prisma.mediaItem.findMany({ where, orderBy: { createdAt: 'desc' } })
  return NextResponse.json(items)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const item = await prisma.mediaItem.create({
    data: {
      eventId: body.eventId,
      url: body.url,
      type: body.type || 'PHOTO',
      isReel: body.isReel || false,
      notes: body.notes || null,
    }
  })
  return NextResponse.json(item, { status: 201 })
}
