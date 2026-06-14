import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const categoryId = searchParams.get('categoryId') || ''
    const condition = searchParams.get('condition') || ''
    const color = searchParams.get('color') || ''

    const items = await prisma.stockItem.findMany({
      where: {
        AND: [
          search ? { OR: [{ name: { contains: search } }, { description: { contains: search } }] } : {},
          categoryId ? { categoryId } : {},
          condition ? { condition } : {},
          color ? { color: { contains: color } } : {},
        ],
      },
      orderBy: { name: 'asc' },
      include: {
        category: true,
        subCategory: true,
        photos: true,
        reservations: {
          where: {
            event: { status: { not: 'CLOTURE' } },
          },
        },
      },
    })

    const itemsWithAvailability = items.map((item) => {
      const reservedQuantity = item.reservations.reduce((sum, r) => sum + r.quantity, 0)
      return {
        ...item,
        reservedQuantity,
        availableQuantity: item.totalQuantity - reservedQuantity,
      }
    })

    return NextResponse.json(itemsWithAvailability)
  } catch (error) {
    console.error('GET /api/stock error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const item = await prisma.stockItem.create({
      data: {
        name: body.name,
        categoryId: body.categoryId || null,
        subCategoryId: body.subCategoryId || null,
        color: body.color || null,
        description: body.description || null,
        totalQuantity: parseInt(body.totalQuantity) || 0,
        purchasePrice: body.purchasePrice ? parseFloat(body.purchasePrice) : null,
        storageLocation: body.storageLocation || null,
        condition: body.condition || 'BON_ETAT',
        notes: body.notes || null,
      },
      include: { category: true, subCategory: true, photos: true },
    })
    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('POST /api/stock error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
