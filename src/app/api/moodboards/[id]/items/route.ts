import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json()
  const { url, title, description } = body
  if (!url) return NextResponse.json({ error: 'url is required' }, { status: 400 })

  const count = await prisma.moodboardItem.count({ where: { moodboardId: params.id } })

  const item = await prisma.moodboardItem.create({
    data: {
      moodboardId: params.id,
      url,
      title: title || null,
      description: description || null,
      order: count,
    },
  })
  return NextResponse.json(item, { status: 201 })
}
