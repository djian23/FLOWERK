import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const costData = {
      flowers: parseFloat(body.flowers) || 0,
      freshFlowersCost: parseFloat(body.freshFlowersCost) || 0,
      materials: parseFloat(body.materials) || 0,
      labor: parseFloat(body.labor) || 0,
      delivery: parseFloat(body.delivery) || 0,
      subcontracting: parseFloat(body.subcontracting) || 0,
      misc: parseFloat(body.misc) || 0,
      postEventCosts: parseFloat(body.postEventCosts) || 0,
      invoicedPrice: parseFloat(body.invoicedPrice) || 0,
      deposit: parseFloat(body.deposit) || 0,
      depositDate: body.depositDate ? new Date(body.depositDate) : null,
      balanceDueDate: body.balanceDueDate ? new Date(body.balanceDueDate) : null,
      paymentMethod: body.paymentMethod || null,
      discount: parseFloat(body.discount) || 0,
      notes: body.notes || null,
    }
    const cost = await prisma.eventCost.upsert({
      where: { eventId: body.eventId },
      create: { eventId: body.eventId, ...costData },
      update: costData,
    })
    return NextResponse.json(cost, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
