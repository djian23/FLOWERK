import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const eventId = searchParams.get('eventId') || ''
    const items = await prisma.checklistItem.findMany({
      where: eventId ? { eventId } : undefined,
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(items)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const item = await prisma.checklistItem.create({
      data: {
        eventId: body.eventId,
        label: body.label,
        done: body.done ?? false,
        order: body.order ?? 0,
      },
    })
    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
