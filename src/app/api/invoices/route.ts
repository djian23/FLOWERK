import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const eventId = searchParams.get('eventId') || ''

    const invoices = await prisma.invoice.findMany({
      where: eventId ? { eventId } : {},
      orderBy: { createdAt: 'desc' },
      include: {
        event: { include: { client: true } },
        quote: { include: { lines: { orderBy: { order: 'asc' } } } },
      },
    })
    return NextResponse.json(invoices)
  } catch (error) {
    console.error('GET /api/invoices error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const quote = await prisma.quote.findUnique({
      where: { id: body.quoteId },
      include: { event: { include: { client: true } }, lines: true },
    })
    if (!quote) return NextResponse.json({ error: 'Devis non trouvé' }, { status: 404 })

    // Auto-generate invoiceNumber
    const latest = await prisma.invoice.findFirst({
      orderBy: { invoiceNumber: 'desc' },
    })
    let nextNumber = 1
    if (latest) {
      const parsed = parseInt(latest.invoiceNumber.replace('F', ''), 10)
      if (!isNaN(parsed)) nextNumber = parsed + 1
    }
    const invoiceNumber = 'F' + String(nextNumber).padStart(6, '0')

    // Snapshot client info
    const client = quote.event.client
    const clientName = client?.name || quote.event.name
    const clientAddress = client?.address || null
    const clientEmail = client?.email || null
    const clientPhone = client?.phone || null

    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 30)

    const invoice = await prisma.invoice.create({
      data: {
        quoteId: quote.id,
        eventId: quote.eventId,
        invoiceNumber,
        clientName,
        clientAddress,
        clientEmail,
        clientPhone,
        totalHT: quote.totalHT,
        notes: body.notes || null,
        dueDate,
      },
      include: {
        event: { include: { client: true } },
        quote: { include: { lines: { orderBy: { order: 'asc' } } } },
      },
    })
    return NextResponse.json(invoice, { status: 201 })
  } catch (error) {
    console.error('POST /api/invoices error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
