import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {

  const body = await request.json()
  const doc = await prisma.logisticsDocument.create({
    data: { url: body.url, name: body.name, logisticsId: params.id }
  })
  return NextResponse.json(doc, { status: 201 })
}
