import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const moodboard = await prisma.moodboard.findUnique({
    where: { id: params.id },
    include: {
      event: { include: { client: true } },
      items: { orderBy: { order: 'asc' } },
    },
  })
  if (!moodboard) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(moodboard)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json()
  const { title, notes } = body
  const moodboard = await prisma.moodboard.update({
    where: { id: params.id },
    data: {
      ...(title !== undefined && { title }),
      ...(notes !== undefined && { notes }),
    },
    include: {
      event: { include: { client: true } },
      items: { orderBy: { order: 'asc' } },
    },
  })
  return NextResponse.json(moodboard)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.moodboard.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
