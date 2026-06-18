import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const quote = await prisma.quote.findUnique({
      where: { id: params.id },
      include: {
        lines: { orderBy: { order: 'asc' } },
        event: { include: { client: true } },
        invoice: true,
      },
    })
    if (!quote) return NextResponse.json({ error: 'Non trouvé' }, { status: 404 })
    return NextResponse.json(quote)
  } catch (error) {
    console.error('GET /api/quotes/[id] error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()

    // If lines are provided, delete existing and recalculate totalHT
    let linesData: Record<string, unknown> | undefined
    let totalHT: number | undefined

    if (body.lines) {
      await prisma.quoteLine.deleteMany({ where: { quoteId: params.id } })

      totalHT = body.lines.reduce(
        (sum: number, line: { quantity: number; unitPrice: number }) =>
          sum + line.quantity * line.unitPrice,
        0
      )

      linesData = {
        create: body.lines.map((line: { prestation: string; description?: string; quantity: number; unitPrice: number; order: number }) => ({
          prestation: line.prestation,
          description: line.description || null,
          quantity: line.quantity,
          unitPrice: line.unitPrice,
          order: line.order,
        })),
      }
    }

    const quote = await prisma.quote.update({
      where: { id: params.id },
      data: {
        status: body.status,
        validUntil: body.validUntil !== undefined ? (body.validUntil ? new Date(body.validUntil) : null) : undefined,
        conditions: body.conditions !== undefined ? (body.conditions || null) : undefined,
        notes: body.notes !== undefined ? (body.notes || null) : undefined,
        ...(totalHT !== undefined ? { totalHT } : {}),
        ...(linesData ? { lines: linesData } : {}),
      },
      include: {
        lines: { orderBy: { order: 'asc' } },
        event: { include: { client: true } },
        invoice: true,
      },
    })
    return NextResponse.json(quote)
  } catch (error) {
    console.error('PUT /api/quotes/[id] error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.quote.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/quotes/[id] error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
