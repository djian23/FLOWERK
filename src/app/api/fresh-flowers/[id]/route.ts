import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const order = await prisma.freshFlowerOrder.update({
      where: { id: params.id },
      data: {
        supplierId: body.supplierId !== undefined ? (body.supplierId || null) : undefined,
        species: body.species !== undefined ? body.species : undefined,
        quantity: body.quantity !== undefined ? parseInt(body.quantity) : undefined,
        unit: body.unit !== undefined ? body.unit : undefined,
        unitPrice: body.unitPrice !== undefined ? (body.unitPrice ? parseFloat(body.unitPrice) : null) : undefined,
        orderDate: body.orderDate !== undefined ? (body.orderDate ? new Date(body.orderDate) : null) : undefined,
        deliveryDate: body.deliveryDate !== undefined ? (body.deliveryDate ? new Date(body.deliveryDate) : null) : undefined,
        received: body.received !== undefined ? body.received : undefined,
        notes: body.notes !== undefined ? (body.notes || null) : undefined,
      },
      include: { supplier: true },
    })
    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.freshFlowerOrder.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
