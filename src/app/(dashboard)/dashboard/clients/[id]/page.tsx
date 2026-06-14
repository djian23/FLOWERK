'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, Save, X, Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Client, Event } from '@/types'
import { formatDate, formatCurrency, EVENT_STATUSES, EVENT_STATUS_COLORS } from '@/lib/utils'

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [client, setClient] = useState<Client & { events: Event[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  })

  const fetchClient = useCallback(async () => {
    const res = await fetch(`/api/clients/${id}`)
    if (!res.ok) { router.push('/dashboard/clients'); return }
    const data = await res.json()
    setClient(data && !data.error ? data : null)
    setEditForm({
      name: data.name,
      email: data.email || '',
      phone: data.phone || '',
      address: data.address || '',
      notes: data.notes || '',
    })
    setLoading(false)
  }, [id, router])

  useEffect(() => { fetchClient() }, [fetchClient])

  async function handleSave() {
    setSaving(true)
    await fetch(`/api/clients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    })
    await fetchClient()
    setEditing(false)
    setSaving(false)
  }

  async function handleDelete() {
    if (!confirm('Supprimer ce client ? Cette action est irréversible.')) return
    await fetch(`/api/clients/${id}`, { method: 'DELETE' })
    router.push('/dashboard/clients')
  }

  if (loading) return <div className="text-center py-12 text-[#C4B8A8]">Chargement...</div>
  if (!client) return null

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/clients">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          </Link>
          <div className="w-10 h-10 rounded-full bg-[#E8E0D5] flex items-center justify-center">
            <span className="text-[#0A0A0A] font-semibold">{client.name.charAt(0).toUpperCase()}</span>
          </div>
          <h2 className="font-serif text-2xl text-[#0A0A0A]">{client.name}</h2>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <Button onClick={() => setEditing(false)} variant="outline" size="sm">
                <X className="h-3 w-3 mr-1" /> Annuler
              </Button>
              <Button onClick={handleSave} disabled={saving} size="sm" className="bg-[#0A0A0A] text-white">
                <Save className="h-3 w-3 mr-1" /> {saving ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setEditing(true)} variant="outline" size="sm">
                <Edit className="h-3 w-3 mr-1" /> Modifier
              </Button>
              <Button onClick={handleDelete} variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
                <Trash2 className="h-3 w-3 mr-1" /> Supprimer
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Informations</CardTitle></CardHeader>
            <CardContent>
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <Label>Nom complet *</Label>
                    <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="mt-1" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Email</Label>
                      <Input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="mt-1" />
                    </div>
                    <div>
                      <Label>Téléphone</Label>
                      <Input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label>Adresse</Label>
                    <Input value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} className="mt-1" />
                  </div>
                  <div>
                    <Label>Notes</Label>
                    <Textarea value={editForm.notes} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} className="mt-1" rows={3} />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {client.email && (
                    <div>
                      <div className="text-xs text-[#C4B8A8]">Email</div>
                      <a href={`mailto:${client.email}`} className="text-sm hover:underline">{client.email}</a>
                    </div>
                  )}
                  {client.phone && (
                    <div>
                      <div className="text-xs text-[#C4B8A8]">Téléphone</div>
                      <a href={`tel:${client.phone}`} className="text-sm hover:underline">{client.phone}</a>
                    </div>
                  )}
                  {client.address && (
                    <div>
                      <div className="text-xs text-[#C4B8A8]">Adresse</div>
                      <div className="text-sm">{client.address}</div>
                    </div>
                  )}
                  {client.notes && (
                    <div>
                      <div className="text-xs text-[#C4B8A8]">Notes</div>
                      <div className="text-sm bg-[#E8E0D5]/30 rounded p-3 mt-1">{client.notes}</div>
                    </div>
                  )}
                  {!client.email && !client.phone && !client.address && !client.notes && (
                    <p className="text-sm text-[#C4B8A8]">Aucune information supplémentaire</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Events */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Événements ({client.events?.length || 0})</CardTitle>
              <Link href={`/dashboard/events/new`}>
                <Button size="sm" variant="outline" className="gap-1">
                  <Plus className="h-3 w-3" /> Nouvel événement
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {!client.events?.length ? (
                <div className="text-center py-6 text-[#C4B8A8]">Aucun événement</div>
              ) : (
                <div className="divide-y divide-[#E8E0D5]">
                  {client.events.map((event) => (
                    <Link key={event.id} href={`/dashboard/events/${event.id}`}>
                      <div className="flex items-center justify-between px-4 py-3 hover:bg-[#E8E0D5]/20 transition-colors">
                        <div>
                          <div className="text-sm font-medium">{event.name}</div>
                          <div className="text-xs text-[#C4B8A8] mt-0.5">
                            {formatDate(event.date)}
                            {event.budget && ` • ${formatCurrency(event.budget)}`}
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${EVENT_STATUS_COLORS[event.status] || 'bg-gray-100 text-gray-800'}`}>
                          {EVENT_STATUSES[event.status] || event.status}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="p-4">
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-[#E8E0D5] flex items-center justify-center mx-auto mb-3">
                  <span className="text-[#0A0A0A] font-bold text-2xl">{client.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="font-semibold text-[#0A0A0A]">{client.name}</div>
                <div className="text-xs text-[#C4B8A8] mt-1">Client depuis {formatDate(client.createdAt)}</div>
                <div className="mt-3 pt-3 border-t border-[#E8E0D5]">
                  <div className="text-2xl font-bold text-[#0A0A0A]">{client.events?.length || 0}</div>
                  <div className="text-xs text-[#C4B8A8]">événement(s)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
