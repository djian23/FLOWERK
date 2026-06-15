import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const logistics = await prisma.logistics.update({
      where: { id: params.id },
      data: {
        transporterId: body.transporterId || null,
        pickupDate: body.pickupDate ? new Date(body.pickupDate) : null,
        deliveryDate: body.deliveryDate ? new Date(body.deliveryDate) : null,
        returnDate: body.returnDate ? new Date(body.returnDate) : null,
        status: body.status || null,
        vehicleType: body.vehicleType || null,
        tripsCount: body.tripsCount ? parseInt(body.tripsCount) : null,
        estimatedVolume: body.estimatedVolume || null,
        departureAddress: body.departureAddress || null,
        loadingNotes: body.loadingNotes || null,
        hasFragileItems: body.hasFragileItems ?? false,
        notes: body.notes || null,
      },
      include: { transporter: true, documents: true },
    })
    return NextResponse.json(logistics)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.logistics.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
