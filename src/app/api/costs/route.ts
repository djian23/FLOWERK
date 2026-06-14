import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const cost = await prisma.eventCost.upsert({
    where: { eventId: body.eventId },
    create: {
      eventId: body.eventId,
      flowers: parseFloat(body.flowers) || 0,
      materials: parseFloat(body.materials) || 0,
      labor: parseFloat(body.labor) || 0,
      delivery: parseFloat(body.delivery) || 0,
      subcontracting: parseFloat(body.subcontracting) || 0,
      misc: parseFloat(body.misc) || 0,
      invoicedPrice: parseFloat(body.invoicedPrice) || 0,
      notes: body.notes || null,
    },
    update: {
      flowers: parseFloat(body.flowers) || 0,
      materials: parseFloat(body.materials) || 0,
      labor: parseFloat(body.labor) || 0,
      delivery: parseFloat(body.delivery) || 0,
      subcontracting: parseFloat(body.subcontracting) || 0,
      misc: parseFloat(body.misc) || 0,
      invoicedPrice: parseFloat(body.invoicedPrice) || 0,
      notes: body.notes || null,
    }
  })
  return NextResponse.json(cost, { status: 201 })
}
