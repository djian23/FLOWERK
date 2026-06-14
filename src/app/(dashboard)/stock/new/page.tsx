'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { StockCategory } from '@/types'
import { STOCK_CONDITIONS } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'

export default function NewStockPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<StockCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', categoryId: '', subCategoryId: '', color: '', description: '',
    totalQuantity: '0', purchasePrice: '', storageLocation: '', condition: 'BON_ETAT', notes: ''
  })

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories)
  }, [])

  const selectedCategory = categories.find(c => c.id === form.categoryId)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/stock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    if (res.ok) {
      const item = await res.json()
      router.push(`/dashboard/stock/${item.id}`)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/stock" className="text-[#C4B8A8] hover:text-[#0A0A0A] transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-serif text-2xl text-[#0A0A0A]">Nouvel article</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de l'article *</Label>
              <Input id="name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Catégorie</Label>
                <select
                  value={form.categoryId}
                  onChange={e => setForm({...form, categoryId: e.target.value, subCategoryId: ''})}
                  className="h-10 w-full rounded-md border border-[#E8E0D5] bg-[#FAFAFA] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4B8A8]"
                >
                  <option value="">Sans catégorie</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Sous-catégorie</Label>
                <select
                  value={form.subCategoryId}
                  onChange={e => setForm({...form, subCategoryId: e.target.value})}
                  disabled={!selectedCategory}
                  className="h-10 w-full rounded-md border border-[#E8E0D5] bg-[#FAFAFA] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4B8A8] disabled:opacity-50"
                >
                  <option value="">Sans sous-catégorie</option>
                  {selectedCategory?.subCategories?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="color">Couleur</Label>
                <Input id="color" value={form.color} onChange={e => setForm({...form, color: e.target.value})} placeholder="Blanc, Rouge..." />
              </div>
              <div className="space-y-2">
                <Label>État</Label>
                <select
                  value={form.condition}
                  onChange={e => setForm({...form, condition: e.target.value})}
                  className="h-10 w-full rounded-md border border-[#E8E0D5] bg-[#FAFAFA] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4B8A8]"
                >
                  {Object.entries(STOCK_CONDITIONS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalQuantity">Quantité totale *</Label>
                <Input id="totalQuantity" type="number" min="0" value={form.totalQuantity} onChange={e => setForm({...form, totalQuantity: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchasePrice">Prix d'achat (€)</Label>
                <Input id="purchasePrice" type="number" step="0.01" value={form.purchasePrice} onChange={e => setForm({...form, purchasePrice: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="storageLocation">Emplacement de stockage</Label>
              <Input id="storageLocation" value={form.storageLocation} onChange={e => setForm({...form, storageLocation: e.target.value})} placeholder="Entrepôt A, Étagère 3..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={2} />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading} className="bg-[#0A0A0A] hover:bg-[#1a1a1a]">
                {loading ? 'Création...' : 'Créer l\'article'}
              </Button>
              <Link href="/dashboard/stock">
                <Button type="button" variant="outline">Annuler</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
