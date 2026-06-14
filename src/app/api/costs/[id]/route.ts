import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {

  const body = await request.json()
  const cost = await prisma.eventCost.update({
    where: { id: params.id },
    data: {
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
  return NextResponse.json(cost)
}
