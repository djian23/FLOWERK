import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const templates = await prisma.eventTemplate.findMany({
      include: {
        checklist: { orderBy: { order: 'asc' } },
        _count: { select: { checklist: true } },
      },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(templates)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const template = await prisma.eventTemplate.create({
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
    return NextResponse.json(template, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
