import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: {
        quote: { include: { lines: { orderBy: { order: 'asc' } } } },
        event: { include: { client: true } },
      },
    })
    if (!invoice) return NextResponse.json({ error: 'Non trouvé' }, { status: 404 })
    return NextResponse.json(invoice)
  } catch (error) {
    console.error('GET /api/invoices/[id] error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()

    const data: Record<string, unknown> = {}
    if (body.status !== undefined) data.status = body.status
    if (body.notes !== undefined) data.notes = body.notes
    if (body.dueDate !== undefined) data.dueDate = body.dueDate ? new Date(body.dueDate) : null
    if (body.paidDate !== undefined) data.paidDate = body.paidDate ? new Date(body.paidDate) : null

    // Auto-set paidDate when marking as paid
    if (body.status === 'PAYEE' && !body.paidDate) {
      data.paidDate = new Date()
    }

    const invoice = await prisma.invoice.update({
      where: { id: params.id },
      data,
      include: {
        quote: { include: { lines: { orderBy: { order: 'asc' } } } },
        event: { include: { client: true } },
      },
    })
    return NextResponse.json(invoice)
  } catch (error) {
    console.error('PUT /api/invoices/[id] error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.invoice.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/invoices/[id] error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
