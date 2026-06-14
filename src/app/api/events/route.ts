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
                  { name: { contains: search } },
                  { description: { contains: search } },
                  { address: { contains: search } },
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
      },
      include: { client: true },
    })
    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('POST /api/events error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
