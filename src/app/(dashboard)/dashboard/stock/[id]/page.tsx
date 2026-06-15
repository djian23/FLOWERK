'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { StockItem, StockCategory } from '@/types'
import { STOCK_CONDITIONS, formatCurrency, formatDate } from '@/lib/utils'
import { ArrowLeft, Upload, Trash2, Edit2, Check, X } from 'lucide-react'

export default function StockDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [item, setItem] = useState<StockItem | null>(null)
  const [categories, setCategories] = useState<StockCategory[]>([])
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [isFoldable, setIsFoldable] = useState(false)
  const [form, setForm] = useState<Record<string, string>>({})

  const load = useCallback(async () => {
    const [itemRes, catRes] = await Promise.all([
      fetch(`/api/stock/${params.id}`),
      fetch('/api/categories')
    ])
    const [itemData, catData] = await Promise.all([itemRes.json(), catRes.json()])
    setItem(itemData)
    setCategories(catData)
    setForm({
      name: itemData.name || '',
      categoryId: itemData.categoryId || '',
      subCategoryId: itemData.subCategoryId || '',
      color: itemData.color || '',
      description: itemData.description || '',
      totalQuantity: String(itemData.totalQuantity || 0),
      purchasePrice: String(itemData.purchasePrice || ''),
      storageLocation: itemData.storageLocation || '',
      condition: itemData.condition || 'BON_ETAT',
      notes: itemData.notes || '',
      material: itemData.material || '',
      dimensions: itemData.dimensions || '',
      weight: itemData.weight ? String(itemData.weight) : '',
      capacity: itemData.capacity || '',
      shape: itemData.shape || '',
      pieces: itemData.pieces ? String(itemData.pieces) : '',
      species: itemData.species || '',
      stemLength: itemData.stemLength ? String(itemData.stemLength) : '',
      archShape: itemData.archShape || '',
      assemblyTime: itemData.assemblyTime ? String(itemData.assemblyTime) : '',
      candleType: itemData.candleType || '',
      burnTime: itemData.burnTime ? String(itemData.burnTime) : '',
    })
    setIsFoldable(itemData.isFoldable || false)
    setLoading(false)
  }, [params.id])

  useEffect(() => { load() }, [load])

  async function handleSave() {
    setSaving(true)
    const res = await fetch(`/api/stock/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, isFoldable })
    })
    if (res.ok) {
      await load()
      setEditing(false)
    }
    setSaving(false)
  }

  async function handleDelete() {
    if (!confirm('Supprimer cet article ?')) return
    await fetch(`/api/stock/${params.id}`, { method: 'DELETE' })
    router.push('/dashboard/stock')
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd })
    const { url } = await uploadRes.json()
    await fetch('/api/stock/' + params.id + '/photos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    })
    await load()
    setUploading(false)
  }

  async function handleDeletePhoto(photoId: string) {
    await fetch(`/api/stock/${params.id}/photos/${photoId}`, { method: 'DELETE' })
    await load()
  }

  if (loading) return <div className="animate-pulse h-96 bg-[#E8E0D5] rounded-lg" />
  if (!item) return <div>Article non trouvé</div>

  const selectedCategory = categories.find(c => c.id === form.categoryId)

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/stock" className="text-[#C4B8A8] hover:text-[#0A0A0A] transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-serif text-2xl text-[#0A0A0A]">{item.name}</h1>
        </div>
        <div className="flex gap-2">
          {!editing ? (
            <>
              <Button variant="outline" onClick={() => setEditing(true)} className="gap-2">
                <Edit2 className="h-4 w-4" /> Modifier
              </Button>
              <Button variant="outline" onClick={handleDelete} className="gap-2 text-red-600 border-red-200 hover:bg-red-50">
                <Trash2 className="h-4 w-4" /> Supprimer
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleSave} disabled={saving} className="bg-[#0A0A0A] hover:bg-[#1a1a1a] gap-2">
                <Check className="h-4 w-4" /> {saving ? 'Sauvegarde...' : 'Enregistrer'}
              </Button>
              <Button variant="outline" onClick={() => setEditing(false)} className="gap-2">
                <X className="h-4 w-4" /> Annuler
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-1">
          <CardContent className="p-5 text-center">
            <div className="text-3xl font-bold text-[#0A0A0A]">{item.totalQuantity}</div>
            <div className="text-xs text-[#C4B8A8] mt-1">Total</div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardContent className="p-5 text-center">
            <div className="text-3xl font-bold text-amber-600">{item.reservedQuantity || 0}</div>
            <div className="text-xs text-[#C4B8A8] mt-1">Réservé</div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardContent className="p-5 text-center">
            <div className={`text-3xl font-bold ${(item.availableQuantity ?? 0) > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {item.availableQuantity ?? item.totalQuantity}
            </div>
            <div className="text-xs text-[#C4B8A8] mt-1">Disponible</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Détails</CardTitle></CardHeader>
        <CardContent className="p-6 space-y-5">
          {editing ? (
            <>
              <div className="space-y-2">
                <Label>Nom *</Label>
                <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Catégorie</Label>
                  <select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value, subCategoryId: ''})}
                    className="h-10 w-full rounded-md border border-[#E8E0D5] bg-[#FAFAFA] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4B8A8]">
                    <option value="">Sans catégorie</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Sous-catégorie</Label>
                  <select value={form.subCategoryId} onChange={e => setForm({...form, subCategoryId: e.target.value})} disabled={!selectedCategory}
                    className="h-10 w-full rounded-md border border-[#E8E0D5] bg-[#FAFAFA] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4B8A8] disabled:opacity-50">
                    <option value="">Sans sous-catégorie</option>
                    {selectedCategory?.subCategories?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Couleur</Label><Input value={form.color} onChange={e => setForm({...form, color: e.target.value})} /></div>
                <div className="space-y-2">
                  <Label>État</Label>
                  <select value={form.condition} onChange={e => setForm({...form, condition: e.target.value})}
                    className="h-10 w-full rounded-md border border-[#E8E0D5] bg-[#FAFAFA] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4B8A8]">
                    {Object.entries(STOCK_CONDITIONS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Quantité totale *</Label><Input type="number" min="0" value={form.totalQuantity} onChange={e => setForm({...form, totalQuantity: e.target.value})} /></div>
                <div className="space-y-2"><Label>Prix d'achat (€)</Label><Input type="number" step="0.01" value={form.purchasePrice} onChange={e => setForm({...form, purchasePrice: e.target.value})} /></div>
              </div>
              <div className="space-y-2"><Label>Emplacement</Label><Input value={form.storageLocation} onChange={e => setForm({...form, storageLocation: e.target.value})} /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} /></div>
              <div className="space-y-2"><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={2} /></div>
              <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-[#0A0A0A] flex items-center gap-2 list-none select-none mt-4">
                  <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
                  Attributs spécifiques
                </summary>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Matière</Label><Input value={form.material || ''} onChange={e => setForm({...form, material: e.target.value})} /></div>
                  <div className="space-y-2"><Label>Dimensions</Label><Input value={form.dimensions || ''} onChange={e => setForm({...form, dimensions: e.target.value})} placeholder="100x50x200cm" /></div>
                  <div className="space-y-2"><Label>Poids (kg)</Label><Input type="number" step="0.1" value={form.weight || ''} onChange={e => setForm({...form, weight: e.target.value})} /></div>
                  <div className="space-y-2"><Label>Capacité</Label><Input value={form.capacity || ''} onChange={e => setForm({...form, capacity: e.target.value})} placeholder="50cl" /></div>
                  <div className="space-y-2"><Label>Forme</Label><Input value={form.shape || ''} onChange={e => setForm({...form, shape: e.target.value})} /></div>
                  <div className="space-y-2"><Label>Nb. pièces</Label><Input type="number" value={form.pieces || ''} onChange={e => setForm({...form, pieces: e.target.value})} /></div>
                  <div className="flex items-center gap-2 mt-3">
                    <input type="checkbox" checked={isFoldable} onChange={e => setIsFoldable(e.target.checked)} className="h-4 w-4 rounded" />
                    <Label>Pliable</Label>
                  </div>
                  <div />
                  <div className="space-y-2"><Label>Espèce</Label><Input value={form.species || ''} onChange={e => setForm({...form, species: e.target.value})} /></div>
                  <div className="space-y-2"><Label>Longueur tige (cm)</Label><Input type="number" step="0.1" value={form.stemLength || ''} onChange={e => setForm({...form, stemLength: e.target.value})} /></div>
                  <div className="space-y-2"><Label>Forme arche</Label><Input value={form.archShape || ''} onChange={e => setForm({...form, archShape: e.target.value})} /></div>
                  <div className="space-y-2"><Label>Assemblage (min)</Label><Input type="number" value={form.assemblyTime || ''} onChange={e => setForm({...form, assemblyTime: e.target.value})} /></div>
                  <div className="space-y-2"><Label>Type bougie</Label><Input value={form.candleType || ''} onChange={e => setForm({...form, candleType: e.target.value})} /></div>
                  <div className="space-y-2"><Label>Combustion (h)</Label><Input type="number" value={form.burnTime || ''} onChange={e => setForm({...form, burnTime: e.target.value})} /></div>
                </div>
              </details>
            </>
          ) : (
            <dl className="grid grid-cols-2 gap-4">
              <div><dt className="text-xs text-[#C4B8A8] uppercase tracking-wide mb-1">Catégorie</dt><dd className="text-sm text-[#0A0A0A]">{item.category?.name || '—'}</dd></div>
              <div><dt className="text-xs text-[#C4B8A8] uppercase tracking-wide mb-1">Sous-catégorie</dt><dd className="text-sm text-[#0A0A0A]">{item.subCategory?.name || '—'}</dd></div>
              <div><dt className="text-xs text-[#C4B8A8] uppercase tracking-wide mb-1">Couleur</dt><dd className="text-sm text-[#0A0A0A]">{item.color || '—'}</dd></div>
              <div><dt className="text-xs text-[#C4B8A8] uppercase tracking-wide mb-1">État</dt><dd><Badge variant="secondary">{STOCK_CONDITIONS[item.condition] || item.condition}</Badge></dd></div>
              <div><dt className="text-xs text-[#C4B8A8] uppercase tracking-wide mb-1">Prix d'achat</dt><dd className="text-sm text-[#0A0A0A]">{item.purchasePrice ? formatCurrency(item.purchasePrice) : '—'}</dd></div>
              <div><dt className="text-xs text-[#C4B8A8] uppercase tracking-wide mb-1">Emplacement</dt><dd className="text-sm text-[#0A0A0A]">{item.storageLocation || '—'}</dd></div>
              {item.description && <div className="col-span-2"><dt className="text-xs text-[#C4B8A8] uppercase tracking-wide mb-1">Description</dt><dd className="text-sm text-[#0A0A0A]">{item.description}</dd></div>}
              {item.notes && <div className="col-span-2"><dt className="text-xs text-[#C4B8A8] uppercase tracking-wide mb-1">Notes</dt><dd className="text-sm text-[#0A0A0A]">{item.notes}</dd></div>}
              {(item as any).material && <div><dt className="text-xs text-[#C4B8A8] uppercase tracking-wide mb-1">Matière</dt><dd className="text-sm text-[#0A0A0A]">{(item as any).material}</dd></div>}
              {(item as any).dimensions && <div><dt className="text-xs text-[#C4B8A8] uppercase tracking-wide mb-1">Dimensions</dt><dd className="text-sm text-[#0A0A0A]">{(item as any).dimensions}</dd></div>}
              {(item as any).species && <div><dt className="text-xs text-[#C4B8A8] uppercase tracking-wide mb-1">Espèce</dt><dd className="text-sm text-[#0A0A0A]">{(item as any).species}</dd></div>}
              {(item as any).candleType && <div><dt className="text-xs text-[#C4B8A8] uppercase tracking-wide mb-1">Type bougie</dt><dd className="text-sm text-[#0A0A0A]">{(item as any).candleType}</dd></div>}
            </dl>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Photos</CardTitle>
          <label className="cursor-pointer">
            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-[#E8E0D5] rounded-md hover:bg-[#FAFAFA] transition-colors">
              <Upload className="h-4 w-4" /> {uploading ? 'Envoi...' : 'Ajouter une photo'}
            </span>
          </label>
        </CardHeader>
        <CardContent>
          {item.photos && item.photos.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {item.photos.map(photo => (
                <div key={photo.id} className="relative group">
                  <img src={photo.url} alt="" className="w-full h-32 object-cover rounded-md" />
                  <button
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#C4B8A8]">Aucune photo</p>
          )}
        </CardContent>
      </Card>

      {item.reservations && item.reservations.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Réservations actives</CardTitle></CardHeader>
          <CardContent>
            <ul className="divide-y divide-[#E8E0D5]">
              {item.reservations.filter(r => r.event?.status !== 'CLOTURE').map(r => (
                <li key={r.id} className="py-3 flex items-center justify-between">
                  <div>
                    <Link href={`/dashboard/events/${r.event?.id}`} className="text-sm font-medium text-[#0A0A0A] hover:underline">
                      {r.event?.name}
                    </Link>
                    <p className="text-xs text-[#C4B8A8]">{r.event?.date ? formatDate(r.event.date) : ''}</p>
                  </div>
                  <Badge variant="outline">× {r.quantity}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
