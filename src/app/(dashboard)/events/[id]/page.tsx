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
import { Event, Client } from '@/types'
import { EVENT_STATUSES, EVENT_STATUS_COLORS, formatDate, formatCurrency } from '@/lib/utils'
import { ArrowLeft, Edit2, Check, X, Trash2, Package, Truck, Image, FileText, DollarSign } from 'lucide-react'

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<Record<string, string>>({})

  const load = useCallback(async () => {
    const [eventRes, clientsRes] = await Promise.all([
      fetch(`/api/events/${params.id}`),
      fetch('/api/clients')
    ])
    const [eventData, clientsData] = await Promise.all([eventRes.json(), clientsRes.json()])
    setEvent(eventData)
    setClients(clientsData)
    const d = new Date(eventData.date)
    const localDate = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}T${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
    setForm({
      name: eventData.name || '',
      clientId: eventData.clientId || '',
      date: localDate,
      address: eventData.address || '',
      phone: eventData.phone || '',
      budget: String(eventData.budget || ''),
      description: eventData.description || '',
      status: eventData.status || 'DEVIS_EN_COURS',
      type: eventData.type || '',
    })
    setLoading(false)
  }, [params.id])

  useEffect(() => { load() }, [load])

  async function handleSave() {
    setSaving(true)
    const res = await fetch(`/api/events/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    if (res.ok) { await load(); setEditing(false) }
    setSaving(false)
  }

  async function handleDelete() {
    if (!confirm('Supprimer cet événement et toutes ses données ?')) return
    await fetch(`/api/events/${params.id}`, { method: 'DELETE' })
    router.push('/dashboard/events')
  }

  if (loading) return <div className="animate-pulse h-96 bg-[#E8E0D5] rounded-lg" />
  if (!event) return <div>Événement non trouvé</div>

  const quickLinks = [
    { href: `reservations`, label: 'Réservations', icon: Package, count: event._count?.reservations },
    { href: `logistics`, label: 'Logistique', icon: Truck },
    { href: `previews`, label: 'Previews', icon: Image, count: event._count?.previews },
    { href: `gallery`, label: 'Galerie', icon: Image, count: event._count?.gallery },
    { href: `documents`, label: 'Documents', icon: FileText, count: event._count?.documents },
    { href: `finance`, label: 'Finance', icon: DollarSign },
  ]

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/events" className="text-[#C4B8A8] hover:text-[#0A0A0A]">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl text-[#0A0A0A]">{event.name}</h1>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${EVENT_STATUS_COLORS[event.status] || 'bg-gray-100 text-gray-800'}`}>
              {EVENT_STATUSES[event.status] || event.status}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          {!editing ? (
            <>
              <Button variant="outline" onClick={() => setEditing(true)} className="gap-2"><Edit2 className="h-4 w-4" /> Modifier</Button>
              <Button variant="outline" onClick={handleDelete} className="gap-2 text-red-600 border-red-200 hover:bg-red-50"><Trash2 className="h-4 w-4" /> Supprimer</Button>
            </>
          ) : (
            <>
              <Button onClick={handleSave} disabled={saving} className="bg-[#0A0A0A] hover:bg-[#1a1a1a] gap-2"><Check className="h-4 w-4" />{saving ? 'Sauvegarde...' : 'Enregistrer'}</Button>
              <Button variant="outline" onClick={() => setEditing(false)} className="gap-2"><X className="h-4 w-4" /> Annuler</Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {quickLinks.map(ql => {
          const Icon = ql.icon
          return (
            <Link key={ql.href} href={`/dashboard/events/${params.id}/${ql.href}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <Icon className="h-4 w-4 text-[#C4B8A8]" />
                  <div>
                    <div className="text-sm font-medium text-[#0A0A0A]">{ql.label}</div>
                    {ql.count !== undefined && <div className="text-xs text-[#C4B8A8]">{ql.count} élément{ql.count !== 1 ? 's' : ''}</div>}
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Informations générales</CardTitle></CardHeader>
        <CardContent className="p-6">
          {editing ? (
            <div className="space-y-5">
              <div className="space-y-2"><Label>Nom *</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Client</Label>
                  <select value={form.clientId} onChange={e => setForm({...form, clientId: e.target.value})}
                    className="h-10 w-full rounded-md border border-[#E8E0D5] bg-[#FAFAFA] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4B8A8]">
                    <option value="">Sans client</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2"><Label>Date *</Label><Input type="datetime-local" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Type</Label><Input value={form.type} onChange={e => setForm({...form, type: e.target.value})} placeholder="Mariage, Corporate..." /></div>
                <div className="space-y-2">
                  <Label>Statut</Label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                    className="h-10 w-full rounded-md border border-[#E8E0D5] bg-[#FAFAFA] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4B8A8]">
                    {Object.entries(EVENT_STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2"><Label>Adresse</Label><Input value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Téléphone</Label><Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
                <div className="space-y-2"><Label>Budget (€)</Label><Input type="number" step="0.01" value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} /></div>
              </div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} /></div>
            </div>
          ) : (
            <dl className="grid grid-cols-2 gap-4">
              <div><dt className="text-xs text-[#C4B8A8] uppercase tracking-wide mb-1">Client</dt><dd className="text-sm">{event.client ? <Link href={`/dashboard/clients/${event.client.id}`} className="text-[#0A0A0A] hover:underline">{event.client.name}</Link> : '—'}</dd></div>
              <div><dt className="text-xs text-[#C4B8A8] uppercase tracking-wide mb-1">Date</dt><dd className="text-sm text-[#0A0A0A]">{formatDate(event.date)}</dd></div>
              <div><dt className="text-xs text-[#C4B8A8] uppercase tracking-wide mb-1">Type</dt><dd className="text-sm text-[#0A0A0A]">{event.type || '—'}</dd></div>
              <div><dt className="text-xs text-[#C4B8A8] uppercase tracking-wide mb-1">Budget</dt><dd className="text-sm text-[#0A0A0A]">{event.budget ? formatCurrency(event.budget) : '—'}</dd></div>
              <div className="col-span-2"><dt className="text-xs text-[#C4B8A8] uppercase tracking-wide mb-1">Adresse</dt><dd className="text-sm text-[#0A0A0A]">{event.address || '—'}</dd></div>
              {event.phone && <div><dt className="text-xs text-[#C4B8A8] uppercase tracking-wide mb-1">Téléphone</dt><dd className="text-sm text-[#0A0A0A]">{event.phone}</dd></div>}
              {event.description && <div className="col-span-2"><dt className="text-xs text-[#C4B8A8] uppercase tracking-wide mb-1">Description</dt><dd className="text-sm text-[#0A0A0A]">{event.description}</dd></div>}
            </dl>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
