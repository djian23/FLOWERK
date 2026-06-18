'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Edit, Save, X, Trash2, Building2, Upload, MapPin, Phone, Mail, Users, Calendar
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, EVENT_STATUSES, EVENT_STATUS_COLORS } from '@/lib/utils'

const VENUE_TYPES = [
  'Chateau',
  'Domaine',
  'Hotel',
  'Restaurant',
  'Salle de reception',
  'Jardin',
  'Plage',
  'Loft',
  'Autre',
]

interface VenuePhoto {
  id: string
  url: string
  eventId?: string | null
  eventName?: string | null
  caption?: string | null
  createdAt: string
}

interface VenueEvent {
  id: string
  name: string
  date: string
  status: string
  client?: { id: string; name: string } | null
}

interface Venue {
  id: string
  name: string
  address?: string | null
  city?: string | null
  type?: string | null
  capacity?: number | null
  contactName?: string | null
  contactPhone?: string | null
  contactEmail?: string | null
  notes?: string | null
  photos: VenuePhoto[]
  events: VenueEvent[]
  createdAt: string
}

export default function VenueDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [venue, setVenue] = useState<Venue | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '', address: '', city: '', type: '', capacity: '',
    contactName: '', contactPhone: '', contactEmail: '', notes: '',
  })

  const fetchVenue = useCallback(async () => {
    const res = await fetch(`/api/venues/${id}`)
    if (!res.ok) { router.push('/dashboard/venues'); return }
    const data = await res.json()
    setVenue(data && !data.error ? data : null)
    setEditForm({
      name: data.name || '',
      address: data.address || '',
      city: data.city || '',
      type: data.type || '',
      capacity: data.capacity ? String(data.capacity) : '',
      contactName: data.contactName || '',
      contactPhone: data.contactPhone || '',
      contactEmail: data.contactEmail || '',
      notes: data.notes || '',
    })
    setLoading(false)
  }, [id, router])

  useEffect(() => { fetchVenue() }, [fetchVenue])

  async function handleSave() {
    setSaving(true)
    const res = await fetch(`/api/venues/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    })
    if (res.ok) {
      await fetchVenue()
      setEditing(false)
    }
    setSaving(false)
  }

  async function handleDelete() {
    if (!confirm('Supprimer cette salle ? Cette action est irreversible.')) return
    await fetch(`/api/venues/${id}`, { method: 'DELETE' })
    router.push('/dashboard/venues')
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd })
    if (uploadRes.ok) {
      const { url } = await uploadRes.json()
      await fetch(`/api/venues/${id}/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      await fetchVenue()
    }
    setUploading(false)
  }

  async function handleDeletePhoto(photoId: string) {
    await fetch(`/api/venues/${id}/photos/${photoId}`, { method: 'DELETE' })
    await fetchVenue()
  }

  if (loading) return <div className="text-center py-12 text-[#C4B8A8]">Chargement...</div>
  if (!venue) return null

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/venues">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          </Link>
          <div className="w-10 h-10 rounded-full bg-[#E8E0D5] flex items-center justify-center">
            <Building2 className="h-5 w-5 text-[#0A0A0A]" />
          </div>
          <div>
            <h2 className="font-serif text-2xl text-[#0A0A0A]">{venue.name}</h2>
            {venue.type && <span className="text-xs text-[#C4B8A8]">{venue.type}</span>}
          </div>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <Button onClick={() => setEditing(false)} variant="outline" size="sm"><X className="h-3 w-3 mr-1" /> Annuler</Button>
              <Button onClick={handleSave} disabled={saving} size="sm" className="bg-[#0A0A0A] text-white">
                <Save className="h-3 w-3 mr-1" /> {saving ? '...' : 'Enregistrer'}
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setEditing(true)} variant="outline" size="sm"><Edit className="h-3 w-3 mr-1" /> Modifier</Button>
              <Button onClick={handleDelete} variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
                <Trash2 className="h-3 w-3 mr-1" /> Supprimer
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Info Section */}
      <Card>
        <CardHeader><CardTitle>Informations</CardTitle></CardHeader>
        <CardContent>
          {editing ? (
            <div className="space-y-4">
              <div>
                <Label>Nom</Label>
                <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Adresse</Label>
                  <Input value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label>Ville</Label>
                  <Input value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} className="mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <select
                    value={editForm.type}
                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-[#E8E0D5] rounded-md text-sm bg-[#FAFAFA]"
                  >
                    <option value="">-- Choisir --</option>
                    {VENUE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Capacite</Label>
                  <Input type="number" value={editForm.capacity} onChange={(e) => setEditForm({ ...editForm, capacity: e.target.value })} className="mt-1" />
                </div>
              </div>
              <div className="border-t border-[#E8E0D5] pt-4">
                <div className="text-sm font-medium text-[#0A0A0A] mb-3">Contact</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nom</Label>
                    <Input value={editForm.contactName} onChange={(e) => setEditForm({ ...editForm, contactName: e.target.value })} className="mt-1" />
                  </div>
                  <div>
                    <Label>Telephone</Label>
                    <Input value={editForm.contactPhone} onChange={(e) => setEditForm({ ...editForm, contactPhone: e.target.value })} className="mt-1" />
                  </div>
                  <div className="col-span-2">
                    <Label>Email</Label>
                    <Input type="email" value={editForm.contactEmail} onChange={(e) => setEditForm({ ...editForm, contactEmail: e.target.value })} className="mt-1" />
                  </div>
                </div>
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea value={editForm.notes} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} className="mt-1" rows={3} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {venue.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-[#C4B8A8] mt-0.5" />
                  <div>
                    <div className="text-xs text-[#C4B8A8]">Adresse</div>
                    <div className="text-sm">{venue.address}</div>
                  </div>
                </div>
              )}
              {venue.city && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-[#C4B8A8] mt-0.5" />
                  <div>
                    <div className="text-xs text-[#C4B8A8]">Ville</div>
                    <div className="text-sm">{venue.city}</div>
                  </div>
                </div>
              )}
              {venue.type && (
                <div>
                  <div className="text-xs text-[#C4B8A8]">Type</div>
                  <div className="text-sm">{venue.type}</div>
                </div>
              )}
              {venue.capacity && (
                <div className="flex items-start gap-2">
                  <Users className="h-4 w-4 text-[#C4B8A8] mt-0.5" />
                  <div>
                    <div className="text-xs text-[#C4B8A8]">Capacite</div>
                    <div className="text-sm">{venue.capacity} personnes</div>
                  </div>
                </div>
              )}
              {venue.contactName && (
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-[#C4B8A8] mt-0.5" />
                  <div>
                    <div className="text-xs text-[#C4B8A8]">Contact</div>
                    <div className="text-sm">{venue.contactName}{venue.contactPhone ? ` - ${venue.contactPhone}` : ''}</div>
                  </div>
                </div>
              )}
              {venue.contactEmail && (
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-[#C4B8A8] mt-0.5" />
                  <div>
                    <div className="text-xs text-[#C4B8A8]">Email</div>
                    <div className="text-sm">{venue.contactEmail}</div>
                  </div>
                </div>
              )}
              {venue.notes && (
                <div className="col-span-2">
                  <div className="text-xs text-[#C4B8A8] mb-1">Notes</div>
                  <div className="text-sm bg-[#E8E0D5]/30 rounded-lg p-3">{venue.notes}</div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Events Section */}
      <Card>
        <CardHeader><CardTitle>Evenements ({venue.events?.length || 0})</CardTitle></CardHeader>
        <CardContent className="p-0">
          {!venue.events?.length ? (
            <div className="text-center py-6 text-[#C4B8A8]">Aucun evenement dans cette salle</div>
          ) : (
            <div className="divide-y divide-[#E8E0D5]">
              {venue.events.map((evt) => (
                <Link key={evt.id} href={`/dashboard/events/${evt.id}`}>
                  <div className="flex items-center justify-between px-4 py-3 hover:bg-[#E8E0D5]/20 transition-colors">
                    <div>
                      <div className="text-sm font-medium">{evt.name}</div>
                      <div className="text-xs text-[#C4B8A8] mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(evt.date)}
                          {evt.client && <> - {evt.client.name}</>}
                        </span>
                      </div>
                    </div>
                    {evt.status && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${EVENT_STATUS_COLORS[evt.status] || 'bg-gray-100 text-gray-800'}`}>
                        {EVENT_STATUSES[evt.status] || evt.status}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Photo Gallery */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Galerie photos ({venue.photos?.length || 0})</CardTitle>
          <label className="cursor-pointer">
            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-[#E8E0D5] rounded-md hover:bg-[#FAFAFA] transition-colors">
              <Upload className="h-4 w-4" /> {uploading ? 'Envoi...' : 'Ajouter'}
            </span>
          </label>
        </CardHeader>
        <CardContent>
          {!venue.photos?.length ? (
            <div className="text-center py-6 text-[#C4B8A8]">Aucune photo</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {venue.photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <div className="aspect-square rounded-md overflow-hidden bg-[#E8E0D5]/30">
                    <img src={photo.url} alt={photo.caption || ''} className="w-full h-full object-cover" />
                  </div>
                  <button
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </button>
                  <div className="mt-1">
                    {photo.eventName && (
                      <div className="text-xs font-medium text-[#0A0A0A] truncate">{photo.eventName}</div>
                    )}
                    {photo.caption && (
                      <div className="text-xs text-[#C4B8A8] truncate">{photo.caption}</div>
                    )}
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
