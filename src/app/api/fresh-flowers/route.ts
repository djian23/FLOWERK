import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const eventId = searchParams.get('eventId') || ''
    const orders = await prisma.freshFlowerOrder.findMany({
      where: eventId ? { eventId } : undefined,
      include: { supplier: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const order = await prisma.freshFlowerOrder.create({
      data: {
        eventId: body.eventId,
        supplierId: body.supplierId || null,
        species: body.species,
        quantity: parseInt(body.quantity) || 0,
        unit: body.unit || 'tiges',
        unitPrice: body.unitPrice ? parseFloat(body.unitPrice) : null,
        orderDate: body.orderDate ? new Date(body.orderDate) : null,
        deliveryDate: body.deliveryDate ? new Date(body.deliveryDate) : null,
        received: body.received ?? false,
        notes: body.notes || null,
      },
      include: { supplier: true },
    })
    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
