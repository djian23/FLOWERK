'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, CheckCircle, Circle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate, formatCurrency } from '@/lib/utils'

export default function FreshFlowersPage() {
  const { id } = useParams<{ id: string }>()
  const [orders, setOrders] = useState<any[]>([])
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [eventName, setEventName] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    species: '', quantity: '1', unit: 'tiges', unitPrice: '', supplierId: '',
    orderDate: '', deliveryDate: '', notes: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const fetchOrders = useCallback(async () => {
    const res = await fetch(`/api/fresh-flowers?eventId=${id}`)
    const data = await res.json()
    setOrders(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [id])

  useEffect(() => {
    fetchOrders()
    fetch('/api/suppliers').then((r) => r.json()).then((d) => setSuppliers(Array.isArray(d) ? d : []))
    fetch(`/api/events/${id}`).then((r) => r.json()).then((d) => { if (d && !d.error) setEventName(d.name) })
  }, [fetchOrders, id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    await fetch('/api/fresh-flowers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, eventId: id }),
    })
    setForm({ species: '', quantity: '1', unit: 'tiges', unitPrice: '', supplierId: '', orderDate: '', deliveryDate: '', notes: '' })
    setShowForm(false)
    setSubmitting(false)
    fetchOrders()
  }

  async function toggleReceived(orderId: string, received: boolean) {
    await fetch(`/api/fresh-flowers/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ received: !received }),
    })
    fetchOrders()
  }

  async function deleteOrder(orderId: string) {
    if (!confirm('Supprimer cette commande ?')) return
    await fetch(`/api/fresh-flowers/${orderId}`, { method: 'DELETE' })
    fetchOrders()
  }

  const totalCost = orders.reduce((sum, o) => sum + (o.unitPrice ? o.unitPrice * o.quantity : 0), 0)
  const receivedCount = orders.filter((o) => o.received).length

  if (loading) return <div className="text-center py-12 text-[#C4B8A8]">Chargement...</div>

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/events/${id}`}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          </Link>
          <div>
            <h2 className="font-serif text-2xl text-[#0A0A0A]">Fleurs fraîches</h2>
            {eventName && <p className="text-sm text-[#C4B8A8]">{eventName}</p>}
          </div>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-[#0A0A0A] text-white gap-2">
          <Plus className="h-4 w-4" />
          Ajouter commande
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border border-[#E8E0D5]">
          <CardContent className="p-4 text-center">
            <div className="text-xs text-[#C4B8A8] mb-1">Commandes</div>
            <div className="text-xl font-bold text-[#0A0A0A]">{orders.length}</div>
          </CardContent>
        </Card>
        <Card className="border border-[#E8E0D5]">
          <CardContent className="p-4 text-center">
            <div className="text-xs text-[#C4B8A8] mb-1">Reçues</div>
            <div className="text-xl font-bold text-green-600">{receivedCount}/{orders.length}</div>
          </CardContent>
        </Card>
        <Card className="border border-[#E8E0D5]">
          <CardContent className="p-4 text-center">
            <div className="text-xs text-[#C4B8A8] mb-1">Coût total</div>
            <div className="text-xl font-bold text-[#0A0A0A]">{formatCurrency(totalCost)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Add form */}
      {showForm && (
        <Card className="border border-[#E8E0D5]">
          <CardHeader><CardTitle>Nouvelle commande</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Espèce / Fleur *</Label>
                  <Input value={form.species} onChange={(e) => setForm({ ...form, species: e.target.value })} required className="mt-1" placeholder="Rose, Pivoine..." />
                </div>
                <div>
                  <Label>Fournisseur</Label>
                  <select value={form.supplierId} onChange={(e) => setForm({ ...form, supplierId: e.target.value })} className="mt-1 w-full px-3 py-2 border border-[#E8E0D5] rounded-md text-sm bg-[#FAFAFA]">
                    <option value="">— Aucun —</option>
                    {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Quantité</Label>
                  <div className="flex gap-2 mt-1">
                    <Input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className="w-24" />
                    <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="flex-1 px-2 py-2 border border-[#E8E0D5] rounded-md text-sm bg-[#FAFAFA]">
                      <option value="tiges">tiges</option>
                      <option value="bouquets">bouquets</option>
                      <option value="pots">pots</option>
                      <option value="branches">branches</option>
                      <option value="pièces">pièces</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label>Prix unitaire (€)</Label>
                  <Input type="number" step="0.01" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label>Date de commande</Label>
                  <Input type="date" value={form.orderDate} onChange={(e) => setForm({ ...form, orderDate: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label>Date de livraison</Label>
                  <Input type="date" value={form.deliveryDate} onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })} className="mt-1" />
                </div>
                <div className="col-span-2">
                  <Label>Notes</Label>
                  <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="mt-1" rows={2} />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Annuler</Button>
                <Button type="submit" disabled={submitting} className="bg-[#0A0A0A] text-white">
                  {submitting ? 'Ajout...' : 'Ajouter'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Orders list */}
      <Card className="border border-[#E8E0D5]">
        <CardContent className="p-0">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-[#C4B8A8]">Aucune commande de fleurs fraîches</div>
          ) : (
            <div className="divide-y divide-[#E8E0D5]">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleReceived(order.id, order.received)}>
                      {order.received
                        ? <CheckCircle className="h-5 w-5 text-green-600" />
                        : <Circle className="h-5 w-5 text-[#C4B8A8]" />
                      }
                    </button>
                    <div>
                      <div className="text-sm font-medium text-[#0A0A0A]">{order.species}</div>
                      <div className="text-xs text-[#C4B8A8]">
                        {order.quantity} {order.unit}
                        {order.supplier && ` • ${order.supplier.name}`}
                        {order.deliveryDate && ` • Livraison: ${formatDate(order.deliveryDate)}`}
                      </div>
                      {order.notes && <div className="text-xs text-[#C4B8A8] mt-0.5">{order.notes}</div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      {order.unitPrice && (
                        <div className="text-sm font-semibold text-[#0A0A0A]">{formatCurrency(order.unitPrice * order.quantity)}</div>
                      )}
                      <div className={`text-xs ${order.received ? 'text-green-600' : 'text-orange-500'}`}>
                        {order.received ? 'Reçu' : 'En attente'}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => deleteOrder(order.id)} className="text-red-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
