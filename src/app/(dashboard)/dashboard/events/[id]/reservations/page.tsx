'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Reservation, StockItem } from '@/types'
import { ArrowLeft, Plus, Trash2, Search } from 'lucide-react'

export default function ReservationsPage({ params }: { params: { id: string } }) {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [stockItems, setStockItems] = useState<StockItem[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ stockItemId: '', quantity: '1', notes: '' })

  const load = useCallback(async () => {
    const res = await fetch(`/api/reservations?eventId=${params.id}`)
    const _r = await res.json(); setReservations(Array.isArray(_r) ? _r : [])
    setLoading(false)
  }, [params.id])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    const t = setTimeout(() => {
      fetch(`/api/stock?search=${search}`).then(r => r.json()).then(d => setStockItems(Array.isArray(d) ? d : []))
    }, 300)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    fetch('/api/stock').then(r => r.json()).then(d => setStockItems(Array.isArray(d) ? d : []))
  }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, eventId: params.id })
    })
    if (res.ok) {
      await load()
      setForm({ stockItemId: '', quantity: '1', notes: '' })
      setAdding(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cette réservation ?')) return
    await fetch(`/api/reservations/${id}`, { method: 'DELETE' })
    await load()
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/events/${params.id}`} className="text-[#C4B8A8] hover:text-[#0A0A0A]"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="font-serif text-2xl text-[#0A0A0A]">Réservations de matériel</h1>
        </div>
        <Button onClick={() => setAdding(true)} className="gap-2 bg-[#0A0A0A] hover:bg-[#1a1a1a]"><Plus className="h-4 w-4" /> Ajouter</Button>
      </div>

      {adding && (
        <Card className="border-[#C4B8A8]">
          <CardHeader><CardTitle className="text-base">Nouvelle réservation</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Article *</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C4B8A8]" />
                  <Input placeholder="Rechercher un article..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 mb-2" />
                </div>
                <select value={form.stockItemId} onChange={e => setForm({...form, stockItemId: e.target.value})} required
                  className="h-10 w-full rounded-md border border-[#E8E0D5] bg-[#FAFAFA] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4B8A8]">
                  <option value="">Sélectionner un article</option>
                  {stockItems.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.availableQuantity ?? s.totalQuantity} dispo)
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantité *</label>
                  <Input type="number" min="1" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes</label>
                  <Input value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-[#0A0A0A] hover:bg-[#1a1a1a]">Ajouter</Button>
                <Button type="button" variant="outline" onClick={() => setAdding(false)}>Annuler</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-[#E8E0D5] rounded-lg animate-pulse" />)}</div>
      ) : reservations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#C4B8A8]">Aucune réservation pour cet événement</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reservations.map(r => (
            <Card key={r.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {r.stockItem?.photos?.[0] && (
                    <img src={r.stockItem.photos[0].url} alt="" className="h-12 w-12 rounded-md object-cover" />
                  )}
                  <div>
                    <Link href={`/dashboard/stock/${r.stockItemId}`} className="font-medium text-[#0A0A0A] hover:underline">{r.stockItem?.name}</Link>
                    <p className="text-xs text-[#C4B8A8]">{r.stockItem?.category?.name}</p>
                    {r.notes && <p className="text-xs text-[#C4B8A8] mt-0.5">{r.notes}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-lg px-3 py-1">× {r.quantity}</Badge>
                  <button onClick={() => handleDelete(r.id)} className="p-2 text-[#C4B8A8] hover:text-red-500 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
          <div className="text-right text-sm text-[#C4B8A8]">
            Total: {reservations.reduce((sum, r) => sum + r.quantity, 0)} articles
          </div>
        </div>
      )}
    </div>
  )
}
