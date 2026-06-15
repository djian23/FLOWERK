'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Edit, Save, X, Plus, Trash2, Upload, FileText, Image, Film, Package,
  Truck, DollarSign, Eye, Calendar, User, MapPin, Phone, Tag, ListChecks, Flower, History
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  formatDate,
  formatCurrency,
  EVENT_STATUSES,
  EVENT_STATUS_COLORS,
  PREVIEW_TYPES,
  PREVIEW_STATUSES,
  DOCUMENT_TYPES,
  MEDIA_TYPES,
  calculateTotalCost,
  calculateMargin,
} from '@/lib/utils'
import { Event, StockItem, Reservation, Transporter, Preview, MediaItem, Document, EventCost } from '@/types'

const ALL_STATUSES = Object.entries(EVENT_STATUSES).map(([value, label]) => ({ value, label }))

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [event, setEvent] = useState<Event & {
    reservations: Reservation[]
    logistics: any
    previews: Preview[]
    gallery: MediaItem[]
    documents: Document[]
    costs: EventCost | null
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState<any>({})
  const [clients, setClients] = useState<any[]>([])
  const [stockItems, setStockItems] = useState<StockItem[]>([])
  const [transporters, setTransporters] = useState<Transporter[]>([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const fetchEvent = useCallback(async () => {
    const res = await fetch(`/api/events/${id}`)
    if (!res.ok) { router.push('/dashboard/events'); return }
    const data = await res.json()
    setEvent(data && !data.error ? data : null)
    setEditForm({
      name: data.name,
      clientId: data.clientId || '',
      date: data.date ? new Date(data.date).toISOString().slice(0, 16) : '',
      address: data.address || '',
      phone: data.phone || '',
      budget: data.budget || '',
      description: data.description || '',
      status: data.status,
      type: data.type || '',
      style: data.style || '',
      theme: data.theme || '',
      colorPalette: data.colorPalette || '',
      isOutdoor: data.isOutdoor ?? false,
      guestCount: data.guestCount ? String(data.guestCount) : '',
      roundTables: data.roundTables ? String(data.roundTables) : '',
      rectTables: data.rectTables ? String(data.rectTables) : '',
      squareTables: data.squareTables ? String(data.squareTables) : '',
      centerpieces: data.centerpieces ? String(data.centerpieces) : '',
      ceremonyCompositions: data.ceremonyCompositions ? String(data.ceremonyCompositions) : '',
      roomWidth: data.roomWidth ? String(data.roomWidth) : '',
      roomLength: data.roomLength ? String(data.roomLength) : '',
      roomHeight: data.roomHeight ? String(data.roomHeight) : '',
      setupStartTime: data.setupStartTime ? new Date(data.setupStartTime).toISOString().slice(0, 16) : '',
      setupEndTime: data.setupEndTime ? new Date(data.setupEndTime).toISOString().slice(0, 16) : '',
      dismantlingTime: data.dismantlingTime ? new Date(data.dismantlingTime).toISOString().slice(0, 16) : '',
      weddingPlannerName: data.weddingPlannerName || '',
      weddingPlannerPhone: data.weddingPlannerPhone || '',
      catererName: data.catererName || '',
      photographerName: data.photographerName || '',
      onSiteContactName: data.onSiteContactName || '',
      onSiteContactPhone: data.onSiteContactPhone || '',
    })
    setLoading(false)
  }, [id, router])

  useEffect(() => {
    fetchEvent()
    fetch('/api/clients').then((r) => r.json()).then(d => setClients(Array.isArray(d) ? d : []))
    fetch('/api/stock').then((r) => r.json()).then(d => setStockItems(Array.isArray(d) ? d : []))
    fetch('/api/transporters').then((r) => r.json()).then(d => setTransporters(Array.isArray(d) ? d : []))
  }, [fetchEvent])

  async function handleSave() {
    setSaving(true)
    const res = await fetch(`/api/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    })
    if (res.ok) {
      await fetchEvent()
      setEditing(false)
    }
    setSaving(false)
  }

  async function handleDelete() {
    if (!confirm('Supprimer cet événement ? Cette action est irréversible.')) return
    await fetch(`/api/events/${id}`, { method: 'DELETE' })
    router.push('/dashboard/events')
  }

  async function handleUpload(file: File): Promise<string | null> {
    const fd = new FormData()
    fd.append('file', file)
    setUploading(true)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    setUploading(false)
    if (!res.ok) return null
    const { url } = await res.json()
    return url
  }

  // Reservations
  const [newReservation, setNewReservation] = useState({ stockItemId: '', quantity: '1', notes: '' })
  async function addReservation(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newReservation, eventId: id }),
    })
    setNewReservation({ stockItemId: '', quantity: '1', notes: '' })
    fetchEvent()
  }
  async function removeReservation(resId: string) {
    await fetch(`/api/reservations/${resId}`, { method: 'DELETE' })
    fetchEvent()
  }

  // Logistics
  const [logisticsForm, setLogisticsForm] = useState<any>({})
  const [editingLogistics, setEditingLogistics] = useState(false)
  useEffect(() => {
    if (event?.logistics) {
      setLogisticsForm({
        transporterId: event.logistics.transporterId || '',
        pickupDate: event.logistics.pickupDate ? new Date(event.logistics.pickupDate).toISOString().slice(0, 16) : '',
        deliveryDate: event.logistics.deliveryDate ? new Date(event.logistics.deliveryDate).toISOString().slice(0, 16) : '',
        returnDate: event.logistics.returnDate ? new Date(event.logistics.returnDate).toISOString().slice(0, 16) : '',
        status: event.logistics.status || '',
        notes: event.logistics.notes || '',
      })
    } else {
      setLogisticsForm({ transporterId: '', pickupDate: '', deliveryDate: '', returnDate: '', status: '', notes: '' })
    }
  }, [event?.logistics])

  async function saveLogistics(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/logistics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...logisticsForm, eventId: id }),
    })
    setEditingLogistics(false)
    fetchEvent()
  }

  // Costs
  const [costsForm, setCostsForm] = useState({
    flowers: '0', materials: '0', labor: '0', delivery: '0', subcontracting: '0', misc: '0', invoicedPrice: '0', notes: ''
  })
  const [editingCosts, setEditingCosts] = useState(false)
  useEffect(() => {
    if (event?.costs) {
      setCostsForm({
        flowers: String(event.costs.flowers),
        materials: String(event.costs.materials),
        labor: String(event.costs.labor),
        delivery: String(event.costs.delivery),
        subcontracting: String(event.costs.subcontracting),
        misc: String(event.costs.misc),
        invoicedPrice: String(event.costs.invoicedPrice),
        notes: event.costs.notes || '',
      })
    }
  }, [event?.costs])

  async function saveCosts(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/costs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...costsForm, eventId: id }),
    })
    setEditingCosts(false)
    fetchEvent()
  }

  // Preview upload
  async function handlePreviewUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await handleUpload(file)
    if (!url) return
    await fetch('/api/previews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId: id, url, type: 'MOODBOARD', status: 'BROUILLON' }),
    })
    fetchEvent()
  }

  async function deletePreview(previewId: string) {
    await fetch(`/api/previews/${previewId}`, { method: 'DELETE' })
    fetchEvent()
  }

  async function updatePreviewStatus(previewId: string, status: string) {
    await fetch(`/api/previews/${previewId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchEvent()
  }

  // Gallery upload
  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await handleUpload(file)
    if (!url) return
    const isVideo = file.type.startsWith('video/')
    await fetch('/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId: id, url, type: isVideo ? 'VIDEO' : 'PHOTO' }),
    })
    fetchEvent()
  }

  async function deleteMedia(mediaId: string) {
    await fetch(`/api/gallery/${mediaId}`, { method: 'DELETE' })
    fetchEvent()
  }

  // Document upload
  async function handleDocumentUpload(e: React.ChangeEvent<HTMLInputElement>, type: string) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await handleUpload(file)
    if (!url) return
    await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId: id, url, name: file.name, type }),
    })
    fetchEvent()
  }

  async function deleteDocument(docId: string) {
    await fetch(`/api/documents/${docId}`, { method: 'DELETE' })
    fetchEvent()
  }

  if (loading) return <div className="text-center py-12 text-[#C4B8A8]">Chargement...</div>
  if (!event) return null

  const totalCost = event.costs ? calculateTotalCost(event.costs) : 0
  const margin = event.costs ? calculateMargin(event.costs.invoicedPrice, totalCost) : 0

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/events">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          </Link>
          {editing ? (
            <Input
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="font-serif text-2xl h-auto py-1 border-0 border-b-2 border-[#E8E0D5] rounded-none focus:ring-0"
            />
          ) : (
            <h2 className="font-serif text-2xl text-[#0A0A0A]">{event.name}</h2>
          )}
          <span className={`text-xs px-2 py-1 rounded-full ${EVENT_STATUS_COLORS[event.status] || 'bg-gray-100 text-gray-800'}`}>
            {EVENT_STATUSES[event.status] || event.status}
          </span>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <Button onClick={() => setEditing(false)} variant="outline" size="sm" className="gap-1">
                <X className="h-3 w-3" /> Annuler
              </Button>
              <Button onClick={handleSave} disabled={saving} size="sm" className="bg-[#0A0A0A] text-white gap-1">
                <Save className="h-3 w-3" /> {saving ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setEditing(true)} variant="outline" size="sm" className="gap-1">
                <Edit className="h-3 w-3" /> Modifier
              </Button>
              <Button onClick={handleDelete} variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 gap-1">
                <Trash2 className="h-3 w-3" /> Supprimer
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="flex flex-wrap gap-1 h-auto">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="reservations">Réservations ({event.reservations?.length || 0})</TabsTrigger>
          <TabsTrigger value="logistics">Logistique</TabsTrigger>
          <TabsTrigger value="previews">Previews ({event.previews?.length || 0})</TabsTrigger>
          <TabsTrigger value="gallery">Galerie ({event.gallery?.length || 0})</TabsTrigger>
          <TabsTrigger value="documents">Documents ({event.documents?.length || 0})</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
          <TabsTrigger value="freshflowers">Fleurs fraîches</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        {/* GENERAL TAB */}
        <TabsContent value="general">
          <Card>
            <CardContent className="p-6">
              {editing ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Client</Label>
                    <select
                      value={editForm.clientId}
                      onChange={(e) => setEditForm({ ...editForm, clientId: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border border-[#E8E0D5] rounded-md text-sm bg-[#FAFAFA]"
                    >
                      <option value="">— Aucun client —</option>
                      {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label>Statut</Label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border border-[#E8E0D5] rounded-md text-sm bg-[#FAFAFA]"
                    >
                      {ALL_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input type="datetime-local" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} className="mt-1" />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Input value={editForm.type} onChange={(e) => setEditForm({ ...editForm, type: e.target.value })} className="mt-1" placeholder="Mariage, Anniversaire..." />
                  </div>
                  <div>
                    <Label>Budget (€)</Label>
                    <Input type="number" value={editForm.budget} onChange={(e) => setEditForm({ ...editForm, budget: e.target.value })} className="mt-1" />
                  </div>
                  <div>
                    <Label>Téléphone</Label>
                    <Input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="mt-1" />
                  </div>
                  <div className="col-span-2">
                    <Label>Adresse</Label>
                    <Input value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} className="mt-1" />
                  </div>
                  <div className="col-span-2">
                    <Label>Description</Label>
                    <Textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="mt-1" rows={4} />
                  </div>

                  {/* Décoration section */}
                  <div className="col-span-2 border-t border-[#E8E0D5] pt-4 mt-2">
                    <div className="text-sm font-medium text-[#0A0A0A] mb-3">Décoration</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Style</Label>
                        <Input value={editForm.style || ''} onChange={(e) => setEditForm({ ...editForm, style: e.target.value })} className="mt-1" placeholder="Champêtre, Moderne..." />
                      </div>
                      <div>
                        <Label>Thème</Label>
                        <Input value={editForm.theme || ''} onChange={(e) => setEditForm({ ...editForm, theme: e.target.value })} className="mt-1" placeholder="Botanique, Romantique..." />
                      </div>
                      <div>
                        <Label>Palette de couleurs</Label>
                        <Input value={editForm.colorPalette || ''} onChange={(e) => setEditForm({ ...editForm, colorPalette: e.target.value })} className="mt-1" placeholder="Blanc, Or, Rose poudré..." />
                      </div>
                      <div>
                        <Label>Nombre d&apos;invités</Label>
                        <Input type="number" value={editForm.guestCount || ''} onChange={(e) => setEditForm({ ...editForm, guestCount: e.target.value })} className="mt-1" />
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <input type="checkbox" id="isOutdoor" checked={editForm.isOutdoor || false} onChange={(e) => setEditForm({ ...editForm, isOutdoor: e.target.checked })} className="h-4 w-4 rounded" />
                        <Label htmlFor="isOutdoor">En extérieur</Label>
                      </div>
                      <div />
                      <div>
                        <Label>Tables rondes</Label>
                        <Input type="number" value={editForm.roundTables || ''} onChange={(e) => setEditForm({ ...editForm, roundTables: e.target.value })} className="mt-1" />
                      </div>
                      <div>
                        <Label>Tables rectangulaires</Label>
                        <Input type="number" value={editForm.rectTables || ''} onChange={(e) => setEditForm({ ...editForm, rectTables: e.target.value })} className="mt-1" />
                      </div>
                      <div>
                        <Label>Tables carrées</Label>
                        <Input type="number" value={editForm.squareTables || ''} onChange={(e) => setEditForm({ ...editForm, squareTables: e.target.value })} className="mt-1" />
                      </div>
                      <div>
                        <Label>Centres de table</Label>
                        <Input type="number" value={editForm.centerpieces || ''} onChange={(e) => setEditForm({ ...editForm, centerpieces: e.target.value })} className="mt-1" />
                      </div>
                      <div>
                        <Label>Compositions cérémonie</Label>
                        <Input type="number" value={editForm.ceremonyCompositions || ''} onChange={(e) => setEditForm({ ...editForm, ceremonyCompositions: e.target.value })} className="mt-1" />
                      </div>
                      <div />
                      <div>
                        <Label>Largeur salle (m)</Label>
                        <Input type="number" step="0.1" value={editForm.roomWidth || ''} onChange={(e) => setEditForm({ ...editForm, roomWidth: e.target.value })} className="mt-1" />
                      </div>
                      <div>
                        <Label>Longueur salle (m)</Label>
                        <Input type="number" step="0.1" value={editForm.roomLength || ''} onChange={(e) => setEditForm({ ...editForm, roomLength: e.target.value })} className="mt-1" />
                      </div>
                      <div>
                        <Label>Hauteur salle (m)</Label>
                        <Input type="number" step="0.1" value={editForm.roomHeight || ''} onChange={(e) => setEditForm({ ...editForm, roomHeight: e.target.value })} className="mt-1" />
                      </div>
                    </div>
                  </div>

                  {/* Planning section */}
                  <div className="col-span-2 border-t border-[#E8E0D5] pt-4 mt-2">
                    <div className="text-sm font-medium text-[#0A0A0A] mb-3">Planning</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Début installation</Label>
                        <Input type="datetime-local" value={editForm.setupStartTime || ''} onChange={(e) => setEditForm({ ...editForm, setupStartTime: e.target.value })} className="mt-1" />
                      </div>
                      <div>
                        <Label>Fin installation</Label>
                        <Input type="datetime-local" value={editForm.setupEndTime || ''} onChange={(e) => setEditForm({ ...editForm, setupEndTime: e.target.value })} className="mt-1" />
                      </div>
                      <div>
                        <Label>Démontage</Label>
                        <Input type="datetime-local" value={editForm.dismantlingTime || ''} onChange={(e) => setEditForm({ ...editForm, dismantlingTime: e.target.value })} className="mt-1" />
                      </div>
                    </div>
                  </div>

                  {/* Intervenants section */}
                  <div className="col-span-2 border-t border-[#E8E0D5] pt-4 mt-2">
                    <div className="text-sm font-medium text-[#0A0A0A] mb-3">Intervenants</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Wedding Planner</Label>
                        <Input value={editForm.weddingPlannerName || ''} onChange={(e) => setEditForm({ ...editForm, weddingPlannerName: e.target.value })} className="mt-1" />
                      </div>
                      <div>
                        <Label>Tél. Wedding Planner</Label>
                        <Input value={editForm.weddingPlannerPhone || ''} onChange={(e) => setEditForm({ ...editForm, weddingPlannerPhone: e.target.value })} className="mt-1" />
                      </div>
                      <div>
                        <Label>Traiteur</Label>
                        <Input value={editForm.catererName || ''} onChange={(e) => setEditForm({ ...editForm, catererName: e.target.value })} className="mt-1" />
                      </div>
                      <div>
                        <Label>Photographe</Label>
                        <Input value={editForm.photographerName || ''} onChange={(e) => setEditForm({ ...editForm, photographerName: e.target.value })} className="mt-1" />
                      </div>
                      <div>
                        <Label>Contact sur site</Label>
                        <Input value={editForm.onSiteContactName || ''} onChange={(e) => setEditForm({ ...editForm, onSiteContactName: e.target.value })} className="mt-1" />
                      </div>
                      <div>
                        <Label>Tél. contact site</Label>
                        <Input value={editForm.onSiteContactPhone || ''} onChange={(e) => setEditForm({ ...editForm, onSiteContactPhone: e.target.value })} className="mt-1" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6">
                  {event.client && (
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 text-[#C4B8A8] mt-0.5" />
                      <div>
                        <div className="text-xs text-[#C4B8A8]">Client</div>
                        <Link href={`/dashboard/clients/${event.client.id}`} className="text-sm font-medium text-[#0A0A0A] hover:underline">
                          {event.client.name}
                        </Link>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-[#C4B8A8] mt-0.5" />
                    <div>
                      <div className="text-xs text-[#C4B8A8]">Date</div>
                      <div className="text-sm font-medium">{formatDate(event.date)}</div>
                    </div>
                  </div>
                  {event.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-[#C4B8A8] mt-0.5" />
                      <div>
                        <div className="text-xs text-[#C4B8A8]">Adresse</div>
                        <div className="text-sm">{event.address}</div>
                      </div>
                    </div>
                  )}
                  {event.phone && (
                    <div className="flex items-start gap-2">
                      <Phone className="h-4 w-4 text-[#C4B8A8] mt-0.5" />
                      <div>
                        <div className="text-xs text-[#C4B8A8]">Téléphone</div>
                        <div className="text-sm">{event.phone}</div>
                      </div>
                    </div>
                  )}
                  {event.type && (
                    <div className="flex items-start gap-2">
                      <Tag className="h-4 w-4 text-[#C4B8A8] mt-0.5" />
                      <div>
                        <div className="text-xs text-[#C4B8A8]">Type</div>
                        <div className="text-sm">{event.type}</div>
                      </div>
                    </div>
                  )}
                  {event.budget && (
                    <div className="flex items-start gap-2">
                      <DollarSign className="h-4 w-4 text-[#C4B8A8] mt-0.5" />
                      <div>
                        <div className="text-xs text-[#C4B8A8]">Budget</div>
                        <div className="text-sm font-medium">{formatCurrency(event.budget)}</div>
                      </div>
                    </div>
                  )}
                  {event.description && (
                    <div className="col-span-2">
                      <div className="text-xs text-[#C4B8A8] mb-1">Description</div>
                      <div className="text-sm bg-[#E8E0D5]/30 rounded-lg p-3">{event.description}</div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* RESERVATIONS TAB */}
        <TabsContent value="reservations">
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Ajouter une réservation</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={addReservation} className="flex gap-3 flex-wrap">
                  <select
                    value={newReservation.stockItemId}
                    onChange={(e) => setNewReservation({ ...newReservation, stockItemId: e.target.value })}
                    className="flex-1 px-3 py-2 border border-[#E8E0D5] rounded-md text-sm bg-[#FAFAFA] min-w-[200px]"
                    required
                  >
                    <option value="">— Sélectionner un article —</option>
                    {stockItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} {item.availableQuantity !== undefined ? `(dispo: ${item.availableQuantity})` : ''}
                      </option>
                    ))}
                  </select>
                  <Input
                    type="number"
                    min="1"
                    value={newReservation.quantity}
                    onChange={(e) => setNewReservation({ ...newReservation, quantity: e.target.value })}
                    className="w-20"
                    placeholder="Qté"
                    required
                  />
                  <Input
                    value={newReservation.notes}
                    onChange={(e) => setNewReservation({ ...newReservation, notes: e.target.value })}
                    className="flex-1 min-w-[150px]"
                    placeholder="Notes (optionnel)"
                  />
                  <Button type="submit" className="bg-[#0A0A0A] text-white">
                    <Plus className="h-4 w-4 mr-1" /> Ajouter
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-0">
                {!event.reservations?.length ? (
                  <div className="text-center py-8 text-[#C4B8A8]">Aucune réservation</div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-[#E8E0D5]/30">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-medium text-[#C4B8A8]">Article</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-[#C4B8A8]">Catégorie</th>
                        <th className="text-center px-4 py-3 text-xs font-medium text-[#C4B8A8]">Qté</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-[#C4B8A8]">Notes</th>
                        <th className="text-right px-4 py-3 text-xs font-medium text-[#C4B8A8]">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {event.reservations.map((r: any) => (
                        <tr key={r.id} className="border-t border-[#E8E0D5]">
                          <td className="px-4 py-3 text-sm font-medium">{r.stockItem?.name}</td>
                          <td className="px-4 py-3 text-sm text-[#C4B8A8]">{r.stockItem?.category?.name || '—'}</td>
                          <td className="px-4 py-3 text-sm text-center">
                            <span className="font-semibold">{r.quantity}</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-[#C4B8A8]">{r.notes || '—'}</td>
                          <td className="px-4 py-3 text-right">
                            <Button variant="ghost" size="sm" onClick={() => removeReservation(r.id)} className="text-red-400 hover:text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* LOGISTICS TAB */}
        <TabsContent value="logistics">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Logistique</CardTitle>
              {!editingLogistics && (
                <Button variant="outline" size="sm" onClick={() => setEditingLogistics(true)}>
                  <Edit className="h-4 w-4 mr-1" /> Modifier
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {editingLogistics ? (
                <form onSubmit={saveLogistics} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Transporteur</Label>
                      <select
                        value={logisticsForm.transporterId}
                        onChange={(e) => setLogisticsForm({ ...logisticsForm, transporterId: e.target.value })}
                        className="mt-1 w-full px-3 py-2 border border-[#E8E0D5] rounded-md text-sm bg-[#FAFAFA]"
                      >
                        <option value="">— Aucun transporteur —</option>
                        {transporters.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label>Statut logistique</Label>
                      <Input value={logisticsForm.status} onChange={(e) => setLogisticsForm({ ...logisticsForm, status: e.target.value })} className="mt-1" placeholder="En attente, Confirmé..." />
                    </div>
                    <div>
                      <Label>Date d&apos;enlèvement</Label>
                      <Input type="datetime-local" value={logisticsForm.pickupDate} onChange={(e) => setLogisticsForm({ ...logisticsForm, pickupDate: e.target.value })} className="mt-1" />
                    </div>
                    <div>
                      <Label>Date de livraison</Label>
                      <Input type="datetime-local" value={logisticsForm.deliveryDate} onChange={(e) => setLogisticsForm({ ...logisticsForm, deliveryDate: e.target.value })} className="mt-1" />
                    </div>
                    <div>
                      <Label>Date de retour</Label>
                      <Input type="datetime-local" value={logisticsForm.returnDate} onChange={(e) => setLogisticsForm({ ...logisticsForm, returnDate: e.target.value })} className="mt-1" />
                    </div>
                    <div className="col-span-2">
                      <Label>Notes</Label>
                      <Textarea value={logisticsForm.notes} onChange={(e) => setLogisticsForm({ ...logisticsForm, notes: e.target.value })} className="mt-1" rows={3} />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={() => setEditingLogistics(false)}>Annuler</Button>
                    <Button type="submit" className="bg-[#0A0A0A] text-white">Enregistrer</Button>
                  </div>
                </form>
              ) : event.logistics ? (
                <div className="grid grid-cols-2 gap-6">
                  {event.logistics.transporter && (
                    <div>
                      <div className="text-xs text-[#C4B8A8]">Transporteur</div>
                      <div className="text-sm font-medium mt-1">{event.logistics.transporter.name}</div>
                    </div>
                  )}
                  {event.logistics.pickupDate && (
                    <div>
                      <div className="text-xs text-[#C4B8A8]">Enlèvement</div>
                      <div className="text-sm mt-1">{formatDate(event.logistics.pickupDate)}</div>
                    </div>
                  )}
                  {event.logistics.deliveryDate && (
                    <div>
                      <div className="text-xs text-[#C4B8A8]">Livraison</div>
                      <div className="text-sm mt-1">{formatDate(event.logistics.deliveryDate)}</div>
                    </div>
                  )}
                  {event.logistics.returnDate && (
                    <div>
                      <div className="text-xs text-[#C4B8A8]">Retour</div>
                      <div className="text-sm mt-1">{formatDate(event.logistics.returnDate)}</div>
                    </div>
                  )}
                  {event.logistics.status && (
                    <div>
                      <div className="text-xs text-[#C4B8A8]">Statut</div>
                      <div className="text-sm mt-1">{event.logistics.status}</div>
                    </div>
                  )}
                  {event.logistics.notes && (
                    <div className="col-span-2">
                      <div className="text-xs text-[#C4B8A8]">Notes</div>
                      <div className="text-sm bg-[#E8E0D5]/30 rounded p-3 mt-1">{event.logistics.notes}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-[#C4B8A8]">
                  Aucune logistique définie.{' '}
                  <button onClick={() => setEditingLogistics(true)} className="text-[#0A0A0A] underline">Ajouter</button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* PREVIEWS TAB */}
        <TabsContent value="previews">
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-[#E8E0D5] rounded-lg hover:border-[#C4B8A8] transition-colors">
                      <Upload className="h-4 w-4 text-[#C4B8A8]" />
                      <span className="text-sm text-[#C4B8A8]">{uploading ? 'Upload...' : 'Ajouter une image de preview'}</span>
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handlePreviewUpload} disabled={uploading} />
                  </label>
                </div>
              </CardContent>
            </Card>

            {event.previews?.length === 0 ? (
              <div className="text-center py-8 text-[#C4B8A8]">Aucune preview</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {event.previews?.map((preview: Preview) => (
                  <Card key={preview.id} className="overflow-hidden group">
                    <div className="relative aspect-square">
                      <img src={preview.url} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button size="sm" variant="secondary" onClick={() => window.open(preview.url, '_blank')} className="h-7 w-7 p-0">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" onClick={() => deletePreview(preview.id)} className="h-7 w-7 p-0 bg-red-500 hover:bg-red-600 text-white">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-2">
                      <div className="text-xs text-[#C4B8A8] mb-1">{PREVIEW_TYPES[preview.type] || preview.type}</div>
                      <select
                        value={preview.status}
                        onChange={(e) => updatePreviewStatus(preview.id, e.target.value)}
                        className="w-full text-xs px-1.5 py-1 border border-[#E8E0D5] rounded bg-[#FAFAFA]"
                      >
                        {Object.entries(PREVIEW_STATUSES).map(([v, l]) => (
                          <option key={v} value={v}>{l}</option>
                        ))}
                      </select>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* GALLERY TAB */}
        <TabsContent value="gallery">
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <label className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-[#E8E0D5] rounded-lg hover:border-[#C4B8A8] transition-colors">
                    <Upload className="h-4 w-4 text-[#C4B8A8]" />
                    <span className="text-sm text-[#C4B8A8]">{uploading ? 'Upload...' : 'Ajouter photo / vidéo'}</span>
                  </div>
                  <input type="file" accept="image/*,video/*" className="hidden" onChange={handleGalleryUpload} disabled={uploading} />
                </label>
              </CardContent>
            </Card>

            {event.gallery?.length === 0 ? (
              <div className="text-center py-8 text-[#C4B8A8]">Aucun média dans la galerie</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {event.gallery?.map((media: MediaItem) => (
                  <Card key={media.id} className="overflow-hidden group">
                    <div className="relative aspect-square bg-[#E8E0D5]/30">
                      {media.type === 'VIDEO' || media.type === 'REEL' ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film className="h-12 w-12 text-[#C4B8A8]" />
                        </div>
                      ) : (
                        <img src={media.url} alt="Gallery" className="w-full h-full object-cover" />
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button size="sm" variant="secondary" onClick={() => window.open(media.url, '_blank')} className="h-7 w-7 p-0">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" onClick={() => deleteMedia(media.id)} className="h-7 w-7 p-0 bg-red-500 hover:bg-red-600 text-white">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-2 text-xs text-[#C4B8A8]">{MEDIA_TYPES[media.type] || media.type}</div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* DOCUMENTS TAB */}
        <TabsContent value="documents">
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Ajouter un document</CardTitle></CardHeader>
              <CardContent>
                <div className="flex gap-3 flex-wrap">
                  {Object.entries(DOCUMENT_TYPES).map(([type, label]) => (
                    <label key={type} className="cursor-pointer">
                      <div className="flex items-center gap-1.5 px-3 py-2 border border-[#E8E0D5] rounded-lg hover:bg-[#E8E0D5]/30 transition-colors text-sm">
                        <FileText className="h-4 w-4 text-[#C4B8A8]" />
                        {uploading ? 'Upload...' : label}
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => handleDocumentUpload(e, type)}
                        disabled={uploading}
                      />
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-0">
                {event.documents?.length === 0 ? (
                  <div className="text-center py-8 text-[#C4B8A8]">Aucun document</div>
                ) : (
                  <div className="divide-y divide-[#E8E0D5]">
                    {event.documents?.map((doc: Document) => (
                      <div key={doc.id} className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-[#C4B8A8]" />
                          <div>
                            <div className="text-sm font-medium">{doc.name}</div>
                            <div className="text-xs text-[#C4B8A8]">{DOCUMENT_TYPES[doc.type] || doc.type} • {formatDate(doc.createdAt)}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <a href={doc.url} target="_blank" rel="noreferrer">
                            <Button variant="outline" size="sm">Ouvrir</Button>
                          </a>
                          <Button variant="ghost" size="sm" onClick={() => deleteDocument(doc.id)} className="text-red-400 hover:text-red-600">
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
        </TabsContent>

        {/* FINANCE TAB */}
        <TabsContent value="finance">
          <div className="space-y-4">
            {/* Summary Cards */}
            {event.costs && (
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-xs text-[#C4B8A8] mb-1">Coût total</div>
                    <div className="text-xl font-bold text-[#0A0A0A]">{formatCurrency(totalCost)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-xs text-[#C4B8A8] mb-1">Prix facturé</div>
                    <div className="text-xl font-bold text-[#0A0A0A]">{formatCurrency(event.costs.invoicedPrice)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-xs text-[#C4B8A8] mb-1">Marge</div>
                    <div className={`text-xl font-bold ${margin >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {margin.toFixed(1)}%
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Détail des coûts</CardTitle>
                {!editingCosts && (
                  <Button variant="outline" size="sm" onClick={() => setEditingCosts(true)}>
                    <Edit className="h-4 w-4 mr-1" /> Modifier
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {editingCosts ? (
                  <form onSubmit={saveCosts} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { key: 'flowers', label: 'Fleurs' },
                        { key: 'materials', label: 'Matériaux' },
                        { key: 'labor', label: 'Main d\'œuvre' },
                        { key: 'delivery', label: 'Livraison' },
                        { key: 'subcontracting', label: 'Sous-traitance' },
                        { key: 'misc', label: 'Divers' },
                        { key: 'invoicedPrice', label: 'Prix facturé' },
                      ].map(({ key, label }) => (
                        <div key={key} className={key === 'invoicedPrice' ? 'col-span-2 border-t border-[#E8E0D5] pt-4' : ''}>
                          <Label>{label} (€)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={(costsForm as any)[key]}
                            onChange={(e) => setCostsForm({ ...costsForm, [key]: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                      ))}
                      <div className="col-span-2">
                        <Label>Notes</Label>
                        <Textarea value={costsForm.notes} onChange={(e) => setCostsForm({ ...costsForm, notes: e.target.value })} className="mt-1" rows={2} />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button type="button" variant="outline" onClick={() => setEditingCosts(false)}>Annuler</Button>
                      <Button type="submit" className="bg-[#0A0A0A] text-white">Enregistrer</Button>
                    </div>
                  </form>
                ) : event.costs ? (
                  <div className="space-y-2">
                    {[
                      { label: 'Fleurs', value: event.costs.flowers },
                      { label: 'Matériaux', value: event.costs.materials },
                      { label: 'Main d\'œuvre', value: event.costs.labor },
                      { label: 'Livraison', value: event.costs.delivery },
                      { label: 'Sous-traitance', value: event.costs.subcontracting },
                      { label: 'Divers', value: event.costs.misc },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between py-2 border-b border-[#E8E0D5]/50">
                        <span className="text-sm text-[#C4B8A8]">{label}</span>
                        <span className="text-sm font-medium">{formatCurrency(value)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between py-2 font-semibold">
                      <span className="text-sm">Total coûts</span>
                      <span className="text-sm">{formatCurrency(totalCost)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-t-2 border-[#0A0A0A]">
                      <span className="text-sm font-semibold">Prix facturé</span>
                      <span className="text-sm font-semibold">{formatCurrency(event.costs.invoicedPrice)}</span>
                    </div>
                    {event.costs.notes && (
                      <div className="mt-3 text-sm text-[#C4B8A8] bg-[#E8E0D5]/30 rounded p-3">{event.costs.notes}</div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-[#C4B8A8]">
                    Aucune donnée financière.{' '}
                    <button onClick={() => setEditingCosts(true)} className="text-[#0A0A0A] underline">Ajouter</button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* CHECKLIST TAB */}
        <TabsContent value="checklist">
          <div className="text-center py-8">
            <Link href={`/dashboard/events/${id}/checklist`}>
              <Button className="bg-[#0A0A0A] text-white gap-2">
                <ListChecks className="h-4 w-4" />
                Ouvrir la checklist
              </Button>
            </Link>
            <p className="text-sm text-[#C4B8A8] mt-2">
              {(event as any).checklist?.length || 0} tâche(s) •{' '}
              {(event as any).checklist?.filter((i: any) => i.done).length || 0} complétée(s)
            </p>
          </div>
        </TabsContent>

        {/* FRESH FLOWERS TAB */}
        <TabsContent value="freshflowers">
          <div className="text-center py-8">
            <Link href={`/dashboard/events/${id}/fresh-flowers`}>
              <Button className="bg-[#0A0A0A] text-white gap-2">
                <Flower className="h-4 w-4" />
                Gérer les fleurs fraîches
              </Button>
            </Link>
            <p className="text-sm text-[#C4B8A8] mt-2">
              {(event as any).freshFlowers?.length || 0} commande(s) de fleurs
            </p>
          </div>
        </TabsContent>

        {/* TIMELINE TAB */}
        <TabsContent value="timeline">
          <div className="text-center py-8">
            <Link href={`/dashboard/events/${id}/timeline`}>
              <Button className="bg-[#0A0A0A] text-white gap-2">
                <History className="h-4 w-4" />
                Voir la timeline
              </Button>
            </Link>
            <p className="text-sm text-[#C4B8A8] mt-2">
              {(event as any).timeline?.length || 0} entrée(s) dans la timeline
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
