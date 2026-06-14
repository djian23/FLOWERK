import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const categories = await prisma.stockCategory.findMany({
      include: {
        subCategories: true,
        _count: { select: { items: true } },
      },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(categories)
  } catch (error) {
    console.error('GET /api/categories error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (body.parentId) {
      // Create subcategory
      const sub = await prisma.stockSubCategory.create({
        data: { name: body.name, categoryId: body.parentId },
      })
      return NextResponse.json(sub, { status: 201 })
    }
    const category = await prisma.stockCategory.create({
      data: { name: body.name },
    })
    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('POST /api/categories error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
