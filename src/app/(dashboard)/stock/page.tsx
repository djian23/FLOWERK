'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { StockItem, StockCategory } from '@/types'
import { STOCK_CONDITIONS, formatCurrency } from '@/lib/utils'
import { Plus, Search, Package } from 'lucide-react'

export default function StockPage() {
  const [items, setItems] = useState<StockItem[]>([])
  const [categories, setCategories] = useState<StockCategory[]>([])
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterCondition, setFilterCondition] = useState('')
  const [filterAvailable, setFilterAvailable] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories)
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (filterCategory) params.set('categoryId', filterCategory)
    if (filterCondition) params.set('condition', filterCondition)
    fetch(`/api/stock?${params}`).then(r => r.json()).then(data => {
      setItems(data)
      setLoading(false)
    })
  }, [search, filterCategory, filterCondition])

  const filtered = filterAvailable ? items.filter(i => (i.availableQuantity ?? 0) > 0) : items

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-[#0A0A0A]">Stock</h1>
          <p className="text-sm text-[#C4B8A8] mt-0.5">{items.length} article{items.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/dashboard/stock/new">
          <Button className="gap-2 bg-[#0A0A0A] hover:bg-[#1a1a1a]">
            <Plus className="h-4 w-4" /> Nouvel article
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C4B8A8]" />
          <Input
            placeholder="Rechercher..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="h-10 rounded-md border border-[#E8E0D5] bg-[#FAFAFA] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4B8A8]"
        >
          <option value="">Toutes catégories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select
          value={filterCondition}
          onChange={e => setFilterCondition(e.target.value)}
          className="h-10 rounded-md border border-[#E8E0D5] bg-[#FAFAFA] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4B8A8]"
        >
          <option value="">Tous états</option>
          {Object.entries(STOCK_CONDITIONS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <button
          onClick={() => setFilterAvailable(!filterAvailable)}
          className={`px-3 py-2 rounded-md border text-sm transition-colors ${filterAvailable ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' : 'border-[#E8E0D5] text-[#0A0A0A] hover:border-[#C4B8A8]'}`}
        >
          Disponibles uniquement
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 bg-[#E8E0D5] rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-12 w-12 text-[#E8E0D5] mx-auto mb-4" />
          <p className="text-[#C4B8A8]">Aucun article trouvé</p>
          <Link href="/dashboard/stock/new" className="mt-3 inline-block text-sm text-[#0A0A0A] underline">
            Ajouter un article
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(item => (
            <Link key={item.id} href={`/dashboard/stock/${item.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-5">
                  {item.photos && item.photos[0] && (
                    <div className="h-32 mb-3 rounded-md overflow-hidden bg-[#E8E0D5]">
                      <img src={item.photos[0].url} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-medium text-[#0A0A0A] text-sm leading-tight">{item.name}</h3>
                    <Badge variant={item.condition === 'BON_ETAT' ? 'secondary' : item.condition === 'A_REPARER' ? 'outline' : 'destructive'} className="shrink-0 text-xs">
                      {STOCK_CONDITIONS[item.condition] || item.condition}
                    </Badge>
                  </div>
                  {item.category && <p className="text-xs text-[#C4B8A8] mb-3">{item.category.name}</p>}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#C4B8A8]">Total: <strong className="text-[#0A0A0A]">{item.totalQuantity}</strong></span>
                    <span className={`font-medium ${(item.availableQuantity ?? 0) > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {item.availableQuantity ?? item.totalQuantity} dispo
                    </span>
                  </div>
                  {item.purchasePrice && (
                    <p className="text-xs text-[#C4B8A8] mt-1">{formatCurrency(item.purchasePrice)} / unité</p>
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
