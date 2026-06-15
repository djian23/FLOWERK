import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await prisma.client.findUnique({
      where: { id: params.id },
      include: {
        events: {
          orderBy: { date: 'desc' },
          include: { _count: { select: { reservations: true } } },
        },
        _count: { select: { events: true } },
      },
    })
    if (!client) return NextResponse.json({ error: 'Non trouvé' }, { status: 404 })
    return NextResponse.json(client)
  } catch (error) {
    console.error('GET /api/clients/[id] error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const client = await prisma.client.update({
      where: { id: params.id },
      data: {
        name: body.name,
        email: body.email || null,
        phone: body.phone || null,
        address: body.address || null,
        notes: body.notes || null,
        source: body.source !== undefined ? (body.source || null) : undefined,
        clientType: body.clientType !== undefined ? (body.clientType || null) : undefined,
        preferredStyle: body.preferredStyle !== undefined ? (body.preferredStyle || null) : undefined,
        avoidedColors: body.avoidedColors !== undefined ? (body.avoidedColors || null) : undefined,
        floralAllergies: body.floralAllergies !== undefined ? (body.floralAllergies || null) : undefined,
        usualBudget: body.usualBudget !== undefined ? (body.usualBudget ? parseFloat(body.usualBudget) : null) : undefined,
        isVip: body.isVip !== undefined ? body.isVip : undefined,
      },
    })
    return NextResponse.json(client)
  } catch (error) {
    console.error('PUT /api/clients/[id] error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.client.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/clients/[id] error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
