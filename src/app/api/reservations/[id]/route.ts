import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const reservation = await prisma.reservation.update({
      where: { id: params.id },
      data: {
        quantity: parseInt(body.quantity),
        notes: body.notes || null,
      },
      include: { stockItem: { include: { category: true } } },
    })
    return NextResponse.json(reservation)
  } catch (error) {
    console.error('PUT /api/reservations/[id] error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.reservation.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/reservations/[id] error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
