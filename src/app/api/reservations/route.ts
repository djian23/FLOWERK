import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const eventId = searchParams.get('eventId')
    const stockItemId = searchParams.get('stockItemId')

    const reservations = await prisma.reservation.findMany({
      where: {
        AND: [
          eventId ? { eventId } : {},
          stockItemId ? { stockItemId } : {},
        ],
      },
      include: {
        event: { include: { client: true } },
        stockItem: { include: { category: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(reservations)
  } catch (error) {
    console.error('GET /api/reservations error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const reservation = await prisma.reservation.create({
      data: {
        eventId: body.eventId,
        stockItemId: body.stockItemId,
        quantity: parseInt(body.quantity),
        notes: body.notes || null,
      },
      include: {
        stockItem: { include: { category: true } },
        event: true,
      },
    })
    return NextResponse.json(reservation, { status: 201 })
  } catch (error) {
    console.error('POST /api/reservations error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
