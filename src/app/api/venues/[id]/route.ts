import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const venue = await prisma.venue.findUnique({
      where: { id: params.id },
      include: {
        photos: { orderBy: { createdAt: 'desc' } },
        events: {
          include: { client: true },
          orderBy: { date: 'desc' },
        },
      },
    })
    if (!venue) return NextResponse.json({ error: 'Non trouvé' }, { status: 404 })
    return NextResponse.json(venue)
  } catch (error) {
    console.error('GET /api/venues/[id] error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const venue = await prisma.venue.update({
      where: { id: params.id },
      data: {
        name: body.name,
        address: body.address !== undefined ? (body.address || null) : undefined,
        city: body.city !== undefined ? (body.city || null) : undefined,
        type: body.type !== undefined ? (body.type || null) : undefined,
        capacity: body.capacity !== undefined ? (body.capacity ? parseInt(body.capacity) : null) : undefined,
        contactName: body.contactName !== undefined ? (body.contactName || null) : undefined,
        contactPhone: body.contactPhone !== undefined ? (body.contactPhone || null) : undefined,
        contactEmail: body.contactEmail !== undefined ? (body.contactEmail || null) : undefined,
        notes: body.notes !== undefined ? (body.notes || null) : undefined,
      },
    })
    return NextResponse.json(venue)
  } catch (error) {
    console.error('PUT /api/venues/[id] error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.venue.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/venues/[id] error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
