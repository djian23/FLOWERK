import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const eventId = searchParams.get('eventId') || ''

    const quotes = await prisma.quote.findMany({
      where: eventId ? { eventId } : {},
      orderBy: { createdAt: 'desc' },
      include: {
        lines: { orderBy: { order: 'asc' } },
        event: { include: { client: true } },
        invoice: true,
      },
    })
    return NextResponse.json(quotes)
  } catch (error) {
    console.error('GET /api/quotes error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Auto-generate quoteNumber
    const lastQuote = await prisma.quote.findFirst({
      orderBy: { quoteNumber: 'desc' },
      select: { quoteNumber: true },
    })
    let nextNumber = 1
    if (lastQuote) {
      const parsed = parseInt(lastQuote.quoteNumber.replace('D', ''), 10)
      if (!isNaN(parsed)) nextNumber = parsed + 1
    }
    const quoteNumber = 'D' + String(nextNumber).padStart(6, '0')

    // Calculate totalHT from lines
    const lines = body.lines || []
    const totalHT = lines.reduce(
      (sum: number, line: { quantity: number; unitPrice: number }) =>
        sum + line.quantity * line.unitPrice,
      0
    )

    const quote = await prisma.quote.create({
      data: {
        eventId: body.eventId,
        quoteNumber,
        validUntil: body.validUntil ? new Date(body.validUntil) : null,
        conditions: body.conditions || null,
        notes: body.notes || null,
        totalHT,
        lines: {
          create: lines.map((line: { prestation: string; description?: string; quantity: number; unitPrice: number; order: number }) => ({
            prestation: line.prestation,
            description: line.description || null,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            order: line.order,
          })),
        },
      },
      include: {
        lines: { orderBy: { order: 'asc' } },
        event: { include: { client: true } },
        invoice: true,
      },
    })
    return NextResponse.json(quote, { status: 201 })
  } catch (error) {
    console.error('POST /api/quotes error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
