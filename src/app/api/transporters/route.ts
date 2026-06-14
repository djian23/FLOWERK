import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const transporters = await prisma.transporter.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { logistics: true } } },
    })
    return NextResponse.json(transporters)
  } catch (error) {
    console.error('GET /api/transporters error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const transporter = await prisma.transporter.create({
      data: {
        name: body.name,
        phone: body.phone || null,
        email: body.email || null,
        notes: body.notes || null,
      },
    })
    return NextResponse.json(transporter, { status: 201 })
  } catch (error) {
    console.error('POST /api/transporters error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
