'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StockCategory } from '@/types'

export default function NewStockPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<StockCategory[]>([])
  const [newCategory, setNewCategory] = useState('')
  const [addingCategory, setAddingCategory] = useState(false)
  const [form, setForm] = useState({
    name: '',
    categoryId: '',
    subCategoryId: '',
    color: '',
    description: '',
    totalQuantity: '0',
    purchasePrice: '',
    storageLocation: '',
    condition: 'BON_ETAT',
    notes: '',
  })

  useEffect(() => {
    fetch('/api/categories').then((r) => r.json()).then(d => setCategories(Array.isArray(d) ? d : []))
  }, [])

  const selectedCategory = categories.find((c) => c.id === form.categoryId)

  async function handleAddCategory() {
    if (!newCategory.trim()) return
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCategory }),
    })
    const cat = await res.json()
    setCategories([...categories, cat])
    setForm({ ...form, categoryId: cat.id })
    setNewCategory('')
    setAddingCategory(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const item = await res.json()
      if (res.ok) {
        router.push(`/dashboard/stock/${item.id}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/stock">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </Link>
        <h2 className="font-serif text-2xl text-[#0A0A0A]">Nouvel article</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations de l&apos;article</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Nom de l&apos;article *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="mt-1"
                  placeholder="Vase cylindrique, Chandelier doré..."
                />
              </div>

              <div>
                <Label>Catégorie</Label>
                <div className="flex gap-2 mt-1">
                  <select
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value, subCategoryId: '' })}
                    className="flex-1 px-3 py-2 border border-[#E8E0D5] rounded-md text-sm bg-[#FAFAFA] focus:outline-none focus:ring-2 focus:ring-[#C4B8A8]"
                  >
                    <option value="">— Aucune catégorie —</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAddingCategory(!addingCategory)}
                    className="px-2"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {addingCategory && (
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Nom de la catégorie"
                      className="flex-1"
                    />
                    <Button type="button" onClick={handleAddCategory} size="sm" className="bg-[#0A0A0A] text-white">
                      Créer
                    </Button>
                  </div>
                )}
              </div>

              {selectedCategory?.subCategories && selectedCategory.subCategories.length > 0 && (
                <div>
                  <Label>Sous-catégorie</Label>
                  <select
                    value={form.subCategoryId}
                    onChange={(e) => setForm({ ...form, subCategoryId: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-[#E8E0D5] rounded-md text-sm bg-[#FAFAFA]"
                  >
                    <option value="">— Aucune —</option>
                    {selectedCategory.subCategories.map((sub) => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <Label htmlFor="color">Couleur</Label>
                <Input
                  id="color"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  className="mt-1"
                  placeholder="Blanc, Or, Rose..."
                />
              </div>

              <div>
                <Label htmlFor="totalQuantity">Quantité totale *</Label>
                <Input
                  id="totalQuantity"
                  type="number"
                  min="0"
                  value={form.totalQuantity}
                  onChange={(e) => setForm({ ...form, totalQuantity: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="purchasePrice">Prix d&apos;achat (€)</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  step="0.01"
                  value={form.purchasePrice}
                  onChange={(e) => setForm({ ...form, purchasePrice: e.target.value })}
                  className="mt-1"
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="storageLocation">Emplacement de stockage</Label>
                <Input
                  id="storageLocation"
                  value={form.storageLocation}
                  onChange={(e) => setForm({ ...form, storageLocation: e.target.value })}
                  className="mt-1"
                  placeholder="Étagère A3, Boîte 12..."
                />
              </div>

              <div>
                <Label>État</Label>
                <select
                  value={form.condition}
                  onChange={(e) => setForm({ ...form, condition: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-[#E8E0D5] rounded-md text-sm bg-[#FAFAFA]"
                >
                  <option value="BON_ETAT">Bon état</option>
                  <option value="A_REPARER">À réparer</option>
                  <option value="HORS_SERVICE">Hors service</option>
                </select>
              </div>

              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="mt-1"
                  rows={3}
                  placeholder="Description de l'article..."
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="notes">Notes internes</Label>
                <Textarea
                  id="notes"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="mt-1"
                  rows={2}
                  placeholder="Notes internes..."
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Link href="/dashboard/stock">
                <Button type="button" variant="outline">Annuler</Button>
              </Link>
              <Button type="submit" disabled={loading} className="bg-[#0A0A0A] hover:bg-[#1a1a1a] text-white">
                {loading ? 'Création...' : 'Créer l\'article'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
