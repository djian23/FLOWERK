import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(request: NextRequest, { params }: { params: { id: string; photoId: string } }) {
  await prisma.transporterPhoto.delete({ where: { id: params.photoId } })
  return NextResponse.json({ success: true })
}
