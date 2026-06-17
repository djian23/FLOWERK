import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const recipe = await prisma.floralRecipe.findUnique({
      where: { id: params.id },
      include: { ingredients: true, photos: { orderBy: { createdAt: 'desc' } } },
    })
    if (!recipe) return NextResponse.json({ error: 'Non trouvé' }, { status: 404 })
    return NextResponse.json(recipe)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    // Delete existing ingredients and recreate
    await prisma.floralIngredient.deleteMany({ where: { recipeId: params.id } })
    const recipe = await prisma.floralRecipe.update({
      where: { id: params.id },
      data: {
        name: body.name,
        description: body.description || null,
        prepTime: body.prepTime ? parseInt(body.prepTime) : null,
        estimatedCost: body.estimatedCost ? parseFloat(body.estimatedCost) : null,
        ingredients: body.ingredients?.length ? {
          create: body.ingredients.map((ing: any) => ({
            name: ing.name,
            quantity: parseInt(ing.quantity) || 1,
            unit: ing.unit || 'tiges',
            notes: ing.notes || null,
          })),
        } : undefined,
      },
      include: { ingredients: true },
    })
    return NextResponse.json(recipe)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.floralRecipe.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
