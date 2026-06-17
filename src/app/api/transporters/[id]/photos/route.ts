import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json()
  const photo = await prisma.transporterPhoto.create({
    data: { url: body.url, transporterId: params.id }
  })
  return NextResponse.json(photo, { status: 201 })
}
