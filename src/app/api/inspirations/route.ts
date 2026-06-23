import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get('tag')
  const where = tag ? { tags: { contains: tag, mode: 'insensitive' as const } } : {}
  const inspirations = await prisma.inspiration.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(inspirations)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { url, title, description, tags, source } = body
  if (!url) {
    return NextResponse.json({ error: 'url is required' }, { status: 400 })
  }
  const inspiration = await prisma.inspiration.create({
    data: {
      url,
      title: title || null,
      description: description || null,
      tags: tags || null,
      source: source || null,
    },
  })
  return NextResponse.json(inspiration, { status: 201 })
}
