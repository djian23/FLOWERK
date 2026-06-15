import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const template = await prisma.eventTemplate.findUnique({
      where: { id: params.id },
      include: { checklist: { orderBy: { order: 'asc' } } },
    })
    if (!template) return NextResponse.json({ error: 'Non trouvé' }, { status: 404 })
    return NextResponse.json(template)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    await prisma.templateChecklistItem.deleteMany({ where: { templateId: params.id } })
    const template = await prisma.eventTemplate.update({
      where: { id: params.id },
      data: {
        name: body.name,
        type: body.type || null,
        style: body.style || null,
        description: body.description || null,
        checklist: body.checklist?.length ? {
          create: body.checklist.map((item: any, i: number) => ({
            label: item.label,
            order: item.order ?? i,
          })),
        } : undefined,
      },
      include: { checklist: { orderBy: { order: 'asc' } } },
    })
    return NextResponse.json(template)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.eventTemplate.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
