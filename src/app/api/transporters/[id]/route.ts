import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const transporter = await prisma.transporter.findUnique({
      where: { id: params.id },
      include: {
        logistics: {
          include: { event: { include: { client: true } } },
        },
        photos: { orderBy: { createdAt: 'desc' } },
        _count: { select: { logistics: true } },
      },
    })
    if (!transporter) return NextResponse.json({ error: 'Non trouvé' }, { status: 404 })
    return NextResponse.json(transporter)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const transporter = await prisma.transporter.update({
      where: { id: params.id },
      data: {
        name: body.name,
        phone: body.phone || null,
        email: body.email || null,
        notes: body.notes || null,
      },
    })
    return NextResponse.json(transporter)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.transporter.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
