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
import { Client } from '@/types'
import { EVENT_STATUSES, EVENT_STATUS_COLORS, formatDate } from '@/lib/utils'
import { ArrowLeft, Edit2, Check, X, Trash2, Phone, Mail, MapPin } from 'lucide-react'

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [client, setClient] = useState<any>(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', notes: '' })

  const load = useCallback(async () => {
    const res = await fetch(`/api/clients/${params.id}`)
    const data = await res.json()
    setClient(data)
    setForm({ name: data.name || '', email: data.email || '', phone: data.phone || '', address: data.address || '', notes: data.notes || '' })
    setLoading(false)
  }, [params.id])

  useEffect(() => { load() }, [load])

  async function handleSave() {
    setSaving(true)
    const res = await fetch(`/api/clients/${params.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
    })
    if (res.ok) { await load(); setEditing(false) }
    setSaving(false)
  }

  async function handleDelete() {
    if (!confirm('Supprimer ce client ?')) return
    await fetch(`/api/clients/${params.id}`, { method: 'DELETE' })
    router.push('/dashboard/clients')
  }

  if (loading) return <div className="animate-pulse h-96 bg-[#E8E0D5] rounded-lg" />
  if (!client) return <div>Client non trouvé</div>

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/clients" className="text-[#C4B8A8] hover:text-[#0A0A0A]"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="font-serif text-2xl text-[#0A0A0A]">{client.name}</h1>
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

      <Card>
        <CardHeader><CardTitle className="text-base">Informations</CardTitle></CardHeader>
        <CardContent className="p-6">
          {editing ? (
            <div className="space-y-4">
              <div className="space-y-2"><Label>Nom *</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
                <div className="space-y-2"><Label>Téléphone</Label><Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
              </div>
              <div className="space-y-2"><Label>Adresse</Label><Input value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
              <div className="space-y-2"><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={3} /></div>
            </div>
          ) : (
            <div className="space-y-3">
              {client.email && <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-[#C4B8A8]" />{client.email}</div>}
              {client.phone && <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-[#C4B8A8]" />{client.phone}</div>}
              {client.address && <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-[#C4B8A8]" />{client.address}</div>}
              {client.notes && <p className="text-sm text-[#C4B8A8] mt-2">{client.notes}</p>}
            </div>
          )}
        </CardContent>
      </Card>

      {client.events && (
        <Card>
          <CardHeader><CardTitle className="text-base">Événements ({client.events.length})</CardTitle></CardHeader>
          <CardContent>
            {client.events.length === 0 ? (
              <p className="text-sm text-[#C4B8A8]">Aucun événement</p>
            ) : (
              <ul className="divide-y divide-[#E8E0D5]">
                {client.events.map((event: any) => (
                  <li key={event.id} className="py-3 flex items-center justify-between">
                    <div>
                      <Link href={`/dashboard/events/${event.id}`} className="text-sm font-medium text-[#0A0A0A] hover:underline">{event.name}</Link>
                      <p className="text-xs text-[#C4B8A8]">{formatDate(event.date)}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${EVENT_STATUS_COLORS[event.status] || 'bg-gray-100'}`}>{EVENT_STATUSES[event.status] || event.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
