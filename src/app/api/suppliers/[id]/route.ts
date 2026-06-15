import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id: params.id },
      include: {
        freshFlowers: {
          include: { event: true },
          orderBy: { createdAt: 'desc' },
        },
        _count: { select: { freshFlowers: true } },
      },
    })
    if (!supplier) return NextResponse.json({ error: 'Non trouvé' }, { status: 404 })
    return NextResponse.json(supplier)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const supplier = await prisma.supplier.update({
      where: { id: params.id },
      data: {
        name: body.name,
        phone: body.phone || null,
        email: body.email || null,
        address: body.address || null,
        specialty: body.specialty || null,
        notes: body.notes || null,
      },
    })
    return NextResponse.json(supplier)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.supplier.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
