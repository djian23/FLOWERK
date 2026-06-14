'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Search, Package, Image } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { StockItem, StockCategory } from '@/types'
import { formatCurrency, STOCK_CONDITIONS } from '@/lib/utils'

const CONDITION_COLORS: Record<string, string> = {
  BON_ETAT: 'bg-green-100 text-green-800',
  A_REPARER: 'bg-yellow-100 text-yellow-800',
  HORS_SERVICE: 'bg-red-100 text-red-800',
}

export default function StockPage() {
  const [items, setItems] = useState<StockItem[]>([])
  const [categories, setCategories] = useState<StockCategory[]>([])
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [conditionFilter, setConditionFilter] = useState('')
  const [availabilityFilter, setAvailabilityFilter] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (categoryFilter) params.set('categoryId', categoryFilter)
    if (conditionFilter) params.set('condition', conditionFilter)
    const res = await fetch(`/api/stock?${params}`)
    let data = await res.json()
    if (availabilityFilter === 'available') {
      data = data.filter((item: StockItem) => (item.availableQuantity ?? 0) > 0)
    } else if (availabilityFilter === 'unavailable') {
      data = data.filter((item: StockItem) => (item.availableQuantity ?? 0) <= 0)
    }
    setItems(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [search, categoryFilter, conditionFilter, availabilityFilter])

  useEffect(() => {
    fetch('/api/categories').then((r) => r.json()).then(d => setCategories(Array.isArray(d) ? d : []))
  }, [])

  useEffect(() => {
    const timer = setTimeout(fetchItems, 300)
    return () => clearTimeout(timer)
  }, [fetchItems])

  const filterChips = [
    {
      label: 'Tous',
      active: !categoryFilter && !conditionFilter && !availabilityFilter,
      onClick: () => { setCategoryFilter(''); setConditionFilter(''); setAvailabilityFilter('') },
    },
    ...categories.map((cat) => ({
      label: cat.name,
      active: categoryFilter === cat.id,
      onClick: () => setCategoryFilter(categoryFilter === cat.id ? '' : cat.id),
    })),
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl text-[#0A0A0A]">Stock</h2>
          <p className="text-[#C4B8A8] text-sm mt-1">{items.length} article(s)</p>
        </div>
        <Link href="/dashboard/stock/new">
          <Button className="bg-[#0A0A0A] hover:bg-[#1a1a1a] text-white gap-2">
            <Plus className="h-4 w-4" />
            Nouvel article
          </Button>
        </Link>
      </div>

      {/* Search and filters */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C4B8A8]" />
            <Input
              placeholder="Rechercher dans le stock..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
            className="px-3 py-2 border border-[#E8E0D5] rounded-md text-sm bg-[#FAFAFA] focus:outline-none focus:ring-2 focus:ring-[#C4B8A8]"
          >
            <option value="">Tous les états</option>
            <option value="BON_ETAT">Bon état</option>
            <option value="A_REPARER">À réparer</option>
            <option value="HORS_SERVICE">Hors service</option>
          </select>
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="px-3 py-2 border border-[#E8E0D5] rounded-md text-sm bg-[#FAFAFA] focus:outline-none focus:ring-2 focus:ring-[#C4B8A8]"
          >
            <option value="">Disponibilité</option>
            <option value="available">Disponible</option>
            <option value="unavailable">Épuisé</option>
          </select>
        </div>

        {/* Category filter chips */}
        <div className="flex gap-2 flex-wrap">
          {filterChips.map((chip) => (
            <button
              key={chip.label}
              onClick={chip.onClick}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                chip.active
                  ? 'bg-[#0A0A0A] text-white'
                  : 'bg-[#E8E0D5] text-[#0A0A0A] hover:bg-[#C4B8A8] hover:text-white'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="text-center py-12 text-[#C4B8A8]">Chargement...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-[#E8E0D5] mx-auto mb-4" />
          <p className="text-[#C4B8A8]">Aucun article trouvé</p>
          <Link href="/dashboard/stock/new" className="mt-3 inline-block text-sm text-[#0A0A0A] underline">
            Ajouter le premier article
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => (
            <Link key={item.id} href={`/dashboard/stock/${item.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <div className="aspect-square bg-[#E8E0D5]/30 rounded-t-lg overflow-hidden">
                  {item.photos?.[0] ? (
                    <img src={item.photos[0].url} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="h-12 w-12 text-[#C4B8A8]" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-medium text-[#0A0A0A] text-sm line-clamp-2">{item.name}</h3>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full whitespace-nowrap ${CONDITION_COLORS[item.condition] || 'bg-gray-100 text-gray-800'}`}>
                      {STOCK_CONDITIONS[item.condition] || item.condition}
                    </span>
                  </div>
                  {item.category && (
                    <div className="text-xs text-[#C4B8A8] mb-2">{item.category.name}</div>
                  )}
                  {item.color && (
                    <div className="text-xs text-[#C4B8A8] mb-2">Couleur: {item.color}</div>
                  )}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E8E0D5]">
                    <div className="text-center">
                      <div className="text-xs text-[#C4B8A8]">Total</div>
                      <div className="font-semibold text-sm">{item.totalQuantity}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-[#C4B8A8]">Réservé</div>
                      <div className="font-semibold text-sm text-orange-500">{item.reservedQuantity || 0}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-[#C4B8A8]">Disponible</div>
                      <div className={`font-semibold text-sm ${(item.availableQuantity ?? 0) > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {item.availableQuantity ?? 0}
                      </div>
                    </div>
                  </div>
                  {item.purchasePrice && (
                    <div className="text-xs text-[#C4B8A8] mt-2">{formatCurrency(item.purchasePrice)} / unité</div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
