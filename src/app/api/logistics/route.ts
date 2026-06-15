import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const eventId = searchParams.get('eventId')

    const logistics = await prisma.logistics.findMany({
      where: eventId ? { eventId } : undefined,
      include: {
        transporter: true,
        event: { include: { client: true } },
        documents: true,
      },
    })
    return NextResponse.json(logistics)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const logistics = await prisma.logistics.upsert({
      where: { eventId: body.eventId },
      create: {
        eventId: body.eventId,
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
      update: {
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
    return NextResponse.json(logistics, { status: 201 })
  } catch (error) {
    console.error('POST /api/logistics error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
