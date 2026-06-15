import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const recipes = await prisma.floralRecipe.findMany({
      include: {
        ingredients: true,
        _count: { select: { ingredients: true } },
      },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(recipes)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const recipe = await prisma.floralRecipe.create({
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
    return NextResponse.json(recipe, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
