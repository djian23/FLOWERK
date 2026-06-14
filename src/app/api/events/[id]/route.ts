import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        client: true,
        reservations: {
          include: { stockItem: { include: { category: true, subCategory: true } } },
        },
        logistics: { include: { transporter: true, documents: true } },
        previews: true,
        gallery: true,
        documents: true,
        costs: true,
        _count: {
          select: { reservations: true, documents: true, previews: true, gallery: true },
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
      },
      include: { client: true },
    })
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
