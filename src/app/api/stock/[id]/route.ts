import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const item = await prisma.stockItem.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        subCategory: true,
        photos: true,
        reservations: {
          include: { event: { include: { client: true } } },
        },
      },
    })
    if (!item) return NextResponse.json({ error: 'Non trouvé' }, { status: 404 })

    const reservedQuantity = item.reservations
      .filter((r) => r.event.status !== 'CLOTURE')
      .reduce((sum, r) => sum + r.quantity, 0)

    return NextResponse.json({
      ...item,
      reservedQuantity,
      availableQuantity: item.totalQuantity - reservedQuantity,
    })
  } catch (error) {
    console.error('GET /api/stock/[id] error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const item = await prisma.stockItem.update({
      where: { id: params.id },
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
        material: body.material !== undefined ? (body.material || null) : undefined,
        dimensions: body.dimensions !== undefined ? (body.dimensions || null) : undefined,
        weight: body.weight !== undefined ? (body.weight ? parseFloat(body.weight) : null) : undefined,
        capacity: body.capacity !== undefined ? (body.capacity || null) : undefined,
        shape: body.shape !== undefined ? (body.shape || null) : undefined,
        isFoldable: body.isFoldable !== undefined ? body.isFoldable : undefined,
        pieces: body.pieces !== undefined ? (body.pieces ? parseInt(body.pieces) : null) : undefined,
        species: body.species !== undefined ? (body.species || null) : undefined,
        stemLength: body.stemLength !== undefined ? (body.stemLength ? parseFloat(body.stemLength) : null) : undefined,
        archShape: body.archShape !== undefined ? (body.archShape || null) : undefined,
        assemblyTime: body.assemblyTime !== undefined ? (body.assemblyTime ? parseInt(body.assemblyTime) : null) : undefined,
        candleType: body.candleType !== undefined ? (body.candleType || null) : undefined,
        burnTime: body.burnTime !== undefined ? (body.burnTime ? parseInt(body.burnTime) : null) : undefined,
      },
      include: { category: true, subCategory: true, photos: true },
    })
    return NextResponse.json(item)
  } catch (error) {
    console.error('PUT /api/stock/[id] error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.stockItem.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/stock/[id] error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
