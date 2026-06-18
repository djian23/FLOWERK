import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        client: true,
        venue: true,
        reservations: {
          include: { stockItem: { include: { category: true, subCategory: true } } },
        },
        logistics: { include: { transporter: true, documents: true } },
        previews: true,
        gallery: true,
        documents: true,
        costs: true,
        checklist: { orderBy: { order: 'asc' } },
        freshFlowers: { include: { supplier: true }, orderBy: { createdAt: 'desc' } },
        timeline: { orderBy: { createdAt: 'desc' } },
        quotes: { include: { lines: { orderBy: { order: 'asc' } }, invoice: true }, orderBy: { createdAt: 'desc' } },
        invoices: { include: { quote: true }, orderBy: { createdAt: 'desc' } },
        moodboards: { include: { items: { orderBy: { order: 'asc' } } }, orderBy: { createdAt: 'desc' } },
        _count: {
          select: { reservations: true, documents: true, previews: true, gallery: true, checklist: true, freshFlowers: true, quotes: true, invoices: true, moodboards: true },
        },
      },
    })
    if (!event) return NextResponse.json({ error: 'Non trouvé' }, { status: 404 })
    return NextResponse.json(event)
  } catch (error) {
    console.error('GET /api/events/[id] error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()

    // Get current event to detect status change
    const current = await prisma.event.findUnique({ where: { id: params.id }, select: { status: true } })
    const statusChanged = current && body.status && current.status !== body.status

    const event = await prisma.event.update({
      where: { id: params.id },
      data: {
        name: body.name,
        clientId: body.clientId || null,
        date: body.date ? new Date(body.date) : undefined,
        address: body.address || null,
        phone: body.phone || null,
        budget: body.budget ? parseFloat(body.budget) : null,
        description: body.description || null,
        status: body.status,
        type: body.type || null,
        style: body.style !== undefined ? (body.style || null) : undefined,
        theme: body.theme !== undefined ? (body.theme || null) : undefined,
        colorPalette: body.colorPalette !== undefined ? (body.colorPalette || null) : undefined,
        isOutdoor: body.isOutdoor !== undefined ? body.isOutdoor : undefined,
        guestCount: body.guestCount !== undefined ? (body.guestCount ? parseInt(body.guestCount) : null) : undefined,
        roundTables: body.roundTables !== undefined ? (body.roundTables ? parseInt(body.roundTables) : null) : undefined,
        rectTables: body.rectTables !== undefined ? (body.rectTables ? parseInt(body.rectTables) : null) : undefined,
        squareTables: body.squareTables !== undefined ? (body.squareTables ? parseInt(body.squareTables) : null) : undefined,
        centerpieces: body.centerpieces !== undefined ? (body.centerpieces ? parseInt(body.centerpieces) : null) : undefined,
        ceremonyCompositions: body.ceremonyCompositions !== undefined ? (body.ceremonyCompositions ? parseInt(body.ceremonyCompositions) : null) : undefined,
        roomWidth: body.roomWidth !== undefined ? (body.roomWidth ? parseFloat(body.roomWidth) : null) : undefined,
        roomLength: body.roomLength !== undefined ? (body.roomLength ? parseFloat(body.roomLength) : null) : undefined,
        roomHeight: body.roomHeight !== undefined ? (body.roomHeight ? parseFloat(body.roomHeight) : null) : undefined,
        setupStartTime: body.setupStartTime !== undefined ? (body.setupStartTime ? new Date(body.setupStartTime) : null) : undefined,
        setupEndTime: body.setupEndTime !== undefined ? (body.setupEndTime ? new Date(body.setupEndTime) : null) : undefined,
        dismantlingTime: body.dismantlingTime !== undefined ? (body.dismantlingTime ? new Date(body.dismantlingTime) : null) : undefined,
        weddingPlannerName: body.weddingPlannerName !== undefined ? (body.weddingPlannerName || null) : undefined,
        weddingPlannerPhone: body.weddingPlannerPhone !== undefined ? (body.weddingPlannerPhone || null) : undefined,
        catererName: body.catererName !== undefined ? (body.catererName || null) : undefined,
        photographerName: body.photographerName !== undefined ? (body.photographerName || null) : undefined,
        onSiteContactName: body.onSiteContactName !== undefined ? (body.onSiteContactName || null) : undefined,
        onSiteContactPhone: body.onSiteContactPhone !== undefined ? (body.onSiteContactPhone || null) : undefined,
        floorPlanUrl: body.floorPlanUrl !== undefined ? (body.floorPlanUrl || null) : undefined,
        venueId: body.venueId !== undefined ? (body.venueId || null) : undefined,
      },
      include: { client: true, venue: true },
    })

    // Auto timeline entry on status change
    if (statusChanged) {
      await prisma.eventTimeline.create({
        data: {
          eventId: params.id,
          action: `Statut changé vers ${body.status}`,
          details: `Ancien statut: ${current.status}`,
          automatic: true,
        },
      })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error('PUT /api/events/[id] error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.event.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/events/[id] error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
