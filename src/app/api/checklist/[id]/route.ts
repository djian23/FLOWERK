import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const item = await prisma.checklistItem.update({
      where: { id: params.id },
      data: {
        done: body.done !== undefined ? body.done : undefined,
        label: body.label !== undefined ? body.label : undefined,
        order: body.order !== undefined ? body.order : undefined,
      },
    })
    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.checklistItem.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
