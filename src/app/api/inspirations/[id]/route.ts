import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const inspiration = await prisma.inspiration.findUnique({
    where: { id: params.id },
  })
  if (!inspiration) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(inspiration)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json()
  const { title, description, tags, source } = body
  const inspiration = await prisma.inspiration.update({
    where: { id: params.id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(tags !== undefined && { tags }),
      ...(source !== undefined && { source }),
    },
  })
  return NextResponse.json(inspiration)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.inspiration.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
