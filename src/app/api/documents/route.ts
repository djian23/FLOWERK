import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const eventId = searchParams.get('eventId')
  const where = eventId ? { eventId } : {}

  const docs = await prisma.document.findMany({ where, orderBy: { createdAt: 'desc' } })
  return NextResponse.json(docs)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const doc = await prisma.document.create({
    data: {
      eventId: body.eventId,
      url: body.url,
      name: body.name,
      type: body.type || 'AUTRE',
    }
  })
  return NextResponse.json(doc, { status: 201 })
}
