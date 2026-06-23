import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const photo = await prisma.supplierPhoto.create({
      data: { url: body.url, supplierId: params.id }
    })
    return NextResponse.json(photo, { status: 201 })
  } catch (error) {
    console.error('POST /api/suppliers/[id]/photos error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
