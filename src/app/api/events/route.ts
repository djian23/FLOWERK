import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const clientId = searchParams.get('clientId') || ''

    const events = await prisma.event.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { name: { contains: search, mode: 'insensitive' } },
                  { description: { contains: search, mode: 'insensitive' } },
                  { address: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {},
          status ? { status } : {},
          clientId ? { clientId } : {},
        ],
      },
      orderBy: { date: 'desc' },
      include: {
        client: true,
        _count: {
          select: { reservations: true, documents: true, previews: true, gallery: true },
        },
      },
    })
    return NextResponse.json(events)
  } catch (error) {
    console.error('GET /api/events error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const event = await prisma.event.create({
      data: {
        name: body.name,
        clientId: body.clientId || null,
        date: new Date(body.date),
        address: body.address || null,
        phone: body.phone || null,
        budget: body.budget ? parseFloat(body.budget) : null,
        description: body.description || null,
        status: body.status || 'DEVIS_EN_COURS',
        type: body.type || null,
        style: body.style || null,
        theme: body.theme || null,
        colorPalette: body.colorPalette || null,
        isOutdoor: body.isOutdoor ?? false,
        guestCount: body.guestCount ? parseInt(body.guestCount) : null,
        roundTables: body.roundTables ? parseInt(body.roundTables) : null,
        rectTables: body.rectTables ? parseInt(body.rectTables) : null,
        squareTables: body.squareTables ? parseInt(body.squareTables) : null,
        centerpieces: body.centerpieces ? parseInt(body.centerpieces) : null,
        ceremonyCompositions: body.ceremonyCompositions ? parseInt(body.ceremonyCompositions) : null,
        roomWidth: body.roomWidth ? parseFloat(body.roomWidth) : null,
        roomLength: body.roomLength ? parseFloat(body.roomLength) : null,
        roomHeight: body.roomHeight ? parseFloat(body.roomHeight) : null,
        setupStartTime: body.setupStartTime ? new Date(body.setupStartTime) : null,
        setupEndTime: body.setupEndTime ? new Date(body.setupEndTime) : null,
        dismantlingTime: body.dismantlingTime ? new Date(body.dismantlingTime) : null,
        weddingPlannerName: body.weddingPlannerName || null,
        weddingPlannerPhone: body.weddingPlannerPhone || null,
        catererName: body.catererName || null,
        photographerName: body.photographerName || null,
        onSiteContactName: body.onSiteContactName || null,
        onSiteContactPhone: body.onSiteContactPhone || null,
        floorPlanUrl: body.floorPlanUrl || null,
        venueId: body.venueId || null,
      },
      include: { client: true, venue: true },
    })
    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('POST /api/events error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
