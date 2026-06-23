import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {

  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''

  if (!q || q.length < 2) return NextResponse.json({ events: [], clients: [], stock: [] })

  const [events, clients, stock] = await Promise.all([
    prisma.event.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { address: { contains: q, mode: 'insensitive' } },
        ]
      },
      include: { client: { select: { name: true } } },
      take: 10
    }),
    prisma.client.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
          { phone: { contains: q, mode: 'insensitive' } },
        ]
      },
      take: 10
    }),
    prisma.stockItem.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { color: { contains: q, mode: 'insensitive' } },
        ]
      },
      include: { category: { select: { name: true } } },
      take: 10
    }),
  ])

  return NextResponse.json({ events, clients, stock })
}
