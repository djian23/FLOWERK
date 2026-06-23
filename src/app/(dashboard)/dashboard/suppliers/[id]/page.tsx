'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, Save, X, Trash2, Store, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate, formatCurrency } from '@/lib/utils'
import { uploadFile } from '@/lib/upload'

export default function SupplierDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [supplier, setSupplier] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', phone: '', email: '', address: '', specialty: '', notes: '' })

  const fetchSupplier = useCallback(async () => {
    const res = await fetch(`/api/suppliers/${id}`)
    if (!res.ok) { router.push('/dashboard/suppliers'); return }
    const data = await res.json()
    setSupplier(data && !data.error ? data : null)
    if (data && !data.error) {
      setEditForm({
        name: data.name || '',
        phone: data.phone || '',
        email: data.email || '',
        address: data.address || '',
        specialty: data.specialty || '',
        notes: data.notes || '',
      })
    }
    setLoading(false)
  }, [id, router])

  useEffect(() => { fetchSupplier() }, [fetchSupplier])

  async function handleSave() {
    setSaving(true)
    await fetch(`/api/suppliers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    })
    await fetchSupplier()
    setEditing(false)
    setSaving(false)
  }

  async function handleDelete() {
    if (!confirm('Supprimer ce fournisseur ?')) return
    await fetch(`/api/suppliers/${id}`, { method: 'DELETE' })
    router.push('/dashboard/suppliers')
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const url = await uploadFile(file)
    await fetch(`/api/suppliers/${id}/photos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    })
    await fetchSupplier()
    setUploading(false)
  }

  async function handleDeletePhoto(photoId: string) {
    await fetch(`/api/suppliers/${id}/photos/${photoId}`, { method: 'DELETE' })
    await fetchSupplier()
  }

  if (loading) return <div className="text-center py-12 text-[#C4B8A8]">Chargement...</div>
  if (!supplier) return null

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/suppliers">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          </Link>
          <div className="w-10 h-10 rounded-full bg-[#E8E0D5] flex items-center justify-center">
            <Store className="h-5 w-5 text-[#0A0A0A]" />
          </div>
          <h2 className="font-serif text-2xl text-[#0A0A0A]">{supplier.name}</h2>
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

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <Card className="border border-[#E8E0D5]">
            <CardHeader><CardTitle>Informations</CardTitle></CardHeader>
            <CardContent>
              {editing ? (
                <div className="space-y-4">
                  <div><Label>Nom</Label><Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="mt-1" /></div>
                  <div><Label>Spécialité</Label><Input value={editForm.specialty} onChange={(e) => setEditForm({ ...editForm, specialty: e.target.value })} className="mt-1" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Téléphone</Label><Input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="mt-1" /></div>
                    <div><Label>Email</Label><Input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="mt-1" /></div>
                  </div>
                  <div><Label>Adresse</Label><Input value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} className="mt-1" /></div>
                  <div><Label>Notes</Label><Textarea value={editForm.notes} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} className="mt-1" rows={3} /></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {supplier.specialty && <div><div className="text-xs text-[#C4B8A8]">Spécialité</div><div className="text-sm font-medium">{supplier.specialty}</div></div>}
                  {supplier.phone && <div><div className="text-xs text-[#C4B8A8]">Téléphone</div><div className="text-sm">{supplier.phone}</div></div>}
                  {supplier.email && <div><div className="text-xs text-[#C4B8A8]">Email</div><div className="text-sm">{supplier.email}</div></div>}
                  {supplier.address && <div><div className="text-xs text-[#C4B8A8]">Adresse</div><div className="text-sm">{supplier.address}</div></div>}
                  {supplier.notes && <div><div className="text-xs text-[#C4B8A8]">Notes</div><div className="text-sm bg-[#E8E0D5]/30 rounded p-3 mt-1">{supplier.notes}</div></div>}
                  {!supplier.specialty && !supplier.phone && !supplier.email && !supplier.address && !supplier.notes && <p className="text-sm text-[#C4B8A8]">Aucune information supplémentaire</p>}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-[#E8E0D5]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Photos</CardTitle>
              <label className="cursor-pointer">
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-[#E8E0D5] rounded-md hover:bg-[#FAFAFA] transition-colors">
                  <Upload className="h-4 w-4" /> {uploading ? 'Envoi...' : 'Ajouter'}
                </span>
              </label>
            </CardHeader>
            <CardContent>
              {supplier.photos && supplier.photos.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {supplier.photos.map((photo: any) => (
                    <div key={photo.id} className="relative group">
                      <img src={photo.url} alt="" className="w-full h-32 object-cover rounded-md" />
                      <button onClick={() => handleDeletePhoto(photo.id)} className="absolute top-2 right-2 p-1 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity">
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

          <Card className="border border-[#E8E0D5]">
            <CardHeader><CardTitle>Commandes de fleurs ({supplier.freshFlowers?.length || 0})</CardTitle></CardHeader>
            <CardContent className="p-0">
              {!supplier.freshFlowers?.length ? (
                <div className="text-center py-6 text-[#C4B8A8]">Aucune commande</div>
              ) : (
                <div className="divide-y divide-[#E8E0D5]">
                  {supplier.freshFlowers.map((order: any) => (
                    <Link key={order.id} href={`/dashboard/events/${order.event?.id}/fresh-flowers`}>
                      <div className="flex items-center justify-between px-4 py-3 hover:bg-[#E8E0D5]/20 transition-colors">
                        <div>
                          <div className="text-sm font-medium">{order.species}</div>
                          <div className="text-xs text-[#C4B8A8] mt-0.5">
                            {order.quantity} {order.unit} • {order.event?.name || '—'}
                          </div>
                        </div>
                        <div className="text-right">
                          {order.unitPrice && <div className="text-sm font-medium">{formatCurrency(order.unitPrice * order.quantity)}</div>}
                          <div className={`text-xs ${order.received ? 'text-green-600' : 'text-orange-500'}`}>
                            {order.received ? 'Reçu' : 'En attente'}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border border-[#E8E0D5]">
            <CardContent className="p-4 text-center">
              <div className="w-16 h-16 rounded-full bg-[#E8E0D5] flex items-center justify-center mx-auto mb-3">
                <Store className="h-8 w-8 text-[#0A0A0A]" />
              </div>
              <div className="font-semibold text-[#0A0A0A]">{supplier.name}</div>
              {supplier.specialty && <div className="text-xs text-[#C4B8A8] mt-1">{supplier.specialty}</div>}
              <div className="text-xs text-[#C4B8A8] mt-1">Depuis {formatDate(supplier.createdAt)}</div>
              <div className="mt-3 pt-3 border-t border-[#E8E0D5]">
                <div className="text-2xl font-bold text-[#0A0A0A]">{supplier.freshFlowers?.length || 0}</div>
                <div className="text-xs text-[#C4B8A8]">commande(s)</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
