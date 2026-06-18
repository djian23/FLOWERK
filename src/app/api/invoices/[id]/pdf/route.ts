import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// NOTE: jspdf does not work well in Next.js API routes (Node.js environment).
// PDF generation is handled client-side via /src/lib/pdf-utils.ts
// This route returns invoice data in JSON format for client-side PDF generation.

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
    console.error('GET /api/invoices/[id]/pdf error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
