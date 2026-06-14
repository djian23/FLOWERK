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
          { name: { contains: q } },
          { description: { contains: q } },
          { address: { contains: q } },
        ]
      },
      include: { client: { select: { name: true } } },
      take: 10
    }),
    prisma.client.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { email: { contains: q } },
          { phone: { contains: q } },
        ]
      },
      take: 10
    }),
    prisma.stockItem.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { description: { contains: q } },
          { color: { contains: q } },
        ]
      },
      include: { category: { select: { name: true } } },
      take: 10
    }),
  ])

  return NextResponse.json({ events, clients, stock })
}
