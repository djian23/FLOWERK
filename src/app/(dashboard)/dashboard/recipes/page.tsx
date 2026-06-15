'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Flower2, Clock, DollarSign } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/recipes')
      .then((r) => r.json())
      .then((data) => { setRecipes(Array.isArray(data) ? data : []); setLoading(false) })
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl text-[#0A0A0A]">Compositions florales</h2>
          <p className="text-[#C4B8A8] text-sm mt-1">{recipes.length} composition(s)</p>
        </div>
        <Link href="/dashboard/recipes/new">
          <Button className="bg-[#0A0A0A] hover:bg-[#1a1a1a] text-white gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle composition
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#C4B8A8]">Chargement...</div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-12">
          <Flower2 className="h-12 w-12 text-[#E8E0D5] mx-auto mb-4" />
          <p className="text-[#C4B8A8]">Aucune composition</p>
          <Link href="/dashboard/recipes/new" className="mt-3 inline-block text-sm text-[#0A0A0A] underline">
            Créer la première composition
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <Link key={recipe.id} href={`/dashboard/recipes/${recipe.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer border border-[#E8E0D5] h-full">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#E8E0D5] flex items-center justify-center">
                      <Flower2 className="h-5 w-5 text-[#0A0A0A]" />
                    </div>
                    <h3 className="font-medium text-[#0A0A0A]">{recipe.name}</h3>
                  </div>
                  {recipe.description && <p className="text-sm text-[#C4B8A8] mb-3 line-clamp-2">{recipe.description}</p>}
                  <div className="flex items-center gap-4 text-xs text-[#C4B8A8]">
                    <div className="flex items-center gap-1">
                      <Flower2 className="h-3 w-3" />
                      <span>{recipe._count?.ingredients || recipe.ingredients?.length || 0} ingrédient(s)</span>
                    </div>
                    {recipe.prepTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{recipe.prepTime} min</span>
                      </div>
                    )}
                    {recipe.estimatedCost && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span>{formatCurrency(recipe.estimatedCost)}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
