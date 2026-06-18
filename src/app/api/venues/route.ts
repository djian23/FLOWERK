import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const venues = await prisma.venue.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { photos: true, events: true },
        },
        photos: { take: 1, orderBy: { createdAt: 'desc' } },
      },
    })
    return NextResponse.json(venues)
  } catch (error) {
    console.error('GET /api/venues error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const venue = await prisma.venue.create({
      data: {
        name: body.name,
        address: body.address || null,
        city: body.city || null,
        type: body.type || null,
        capacity: body.capacity ? parseInt(body.capacity) : null,
        contactName: body.contactName || null,
        contactPhone: body.contactPhone || null,
        contactEmail: body.contactEmail || null,
        notes: body.notes || null,
      },
    })
    return NextResponse.json(venue, { status: 201 })
  } catch (error) {
    console.error('POST /api/venues error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
