'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Upload, Eye, Edit, Save, X, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'

interface MoodboardItem {
  id: string
  url: string
  title: string | null
  description: string | null
  order: number
}

export default function MoodboardDetailPage() {
  const { id, moodboardId } = useParams<{ id: string; moodboardId: string }>()
  const router = useRouter()
  const [moodboard, setMoodboard] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleForm, setTitleForm] = useState({ title: '', notes: '' })
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [itemForm, setItemForm] = useState({ title: '', description: '' })

  const fetchMoodboard = useCallback(async () => {
    const res = await fetch(`/api/moodboards/${moodboardId}`)
    if (!res.ok) { router.push(`/dashboard/events/${id}/moodboards`); return }
    const data = await res.json()
    setMoodboard(data)
    setTitleForm({ title: data.title, notes: data.notes || '' })
    setLoading(false)
  }, [moodboardId, id, router])

  useEffect(() => { fetchMoodboard() }, [fetchMoodboard])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files?.length) return
    setUploading(true)

    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', file)
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!uploadRes.ok) continue
      const { url } = await uploadRes.json()

      await fetch(`/api/moodboards/${moodboardId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, title: file.name.replace(/\.[^.]+$/, '') }),
      })
    }

    setUploading(false)
    e.target.value = ''
    fetchMoodboard()
  }

  async function handleDeleteItem(itemId: string) {
    await fetch(`/api/moodboards/${moodboardId}/items/${itemId}`, { method: 'DELETE' })
    fetchMoodboard()
  }

  async function handleSaveTitle() {
    await fetch(`/api/moodboards/${moodboardId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(titleForm),
    })
    setEditingTitle(false)
    fetchMoodboard()
  }

  async function handleSaveItem(itemId: string) {
    await fetch(`/api/moodboards/${moodboardId}/items/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemForm),
    })
    setEditingItem(null)
    fetchMoodboard()
  }

  function startEditItem(item: MoodboardItem) {
    setEditingItem(item.id)
    setItemForm({ title: item.title || '', description: item.description || '' })
  }

  async function handleDelete() {
    if (!confirm('Supprimer ce moodboard et toutes ses photos ?')) return
    await fetch(`/api/moodboards/${moodboardId}`, { method: 'DELETE' })
    router.push(`/dashboard/events/${id}/moodboards`)
  }

  if (loading) return <div className="text-center py-12 text-[#C4B8A8]">Chargement...</div>
  if (!moodboard) return null

  const items: MoodboardItem[] = moodboard.items || []

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/events/${id}/moodboards`}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Retour
            </Button>
          </Link>
          {editingTitle ? (
            <div className="flex items-center gap-2">
              <Input
                value={titleForm.title}
                onChange={e => setTitleForm({ ...titleForm, title: e.target.value })}
                className="font-serif text-2xl h-auto py-1 w-80"
              />
              <Button size="sm" onClick={handleSaveTitle} className="bg-[#0A0A0A] text-white"><Save className="h-3 w-3" /></Button>
              <Button size="sm" variant="outline" onClick={() => setEditingTitle(false)}><X className="h-3 w-3" /></Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-2xl text-[#0A0A0A]">{moodboard.title}</h2>
              <Button variant="ghost" size="sm" onClick={() => setEditingTitle(true)} className="h-7 w-7 p-0">
                <Edit className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/events/${id}/moodboards/${moodboardId}/view`}>
            <Button variant="outline" size="sm" className="gap-1">
              <Eye className="h-4 w-4" /> Présenter
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 gap-1" onClick={handleDelete}>
            <Trash2 className="h-3 w-3" /> Supprimer
          </Button>
        </div>
      </div>

      {/* Event info */}
      {moodboard.event && (
        <Card>
          <CardContent className="p-4 flex flex-wrap items-center gap-4 text-sm">
            <span className="font-semibold">{moodboard.event.name}</span>
            <span className="text-[#C4B8A8]">{formatDate(moodboard.event.date)}</span>
            {moodboard.event.client && (
              <span className="text-[#C4B8A8]">Client : {moodboard.event.client.name}</span>
            )}
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {editingTitle && (
        <Card>
          <CardContent className="p-4">
            <Label>Notes</Label>
            <Textarea
              value={titleForm.notes}
              onChange={e => setTitleForm({ ...titleForm, notes: e.target.value })}
              className="mt-1"
              rows={2}
              placeholder="Notes sur le style, les inspirations..."
            />
          </CardContent>
        </Card>
      )}
      {!editingTitle && moodboard.notes && (
        <Card>
          <CardContent className="p-4 text-sm text-[#C4B8A8]">{moodboard.notes}</CardContent>
        </Card>
      )}

      {/* Upload area */}
      <Card>
        <CardContent className="p-4">
          <label className="cursor-pointer">
            <div className="flex items-center justify-center gap-3 px-6 py-8 border-2 border-dashed border-[#E8E0D5] rounded-lg hover:border-[#C4B8A8] transition-colors">
              <Upload className="h-6 w-6 text-[#C4B8A8]" />
              <span className="text-[#C4B8A8] font-semibold">
                {uploading ? 'Upload en cours...' : 'Ajouter des photos au moodboard'}
              </span>
            </div>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </CardContent>
      </Card>

      {/* Items grid */}
      {items.length === 0 ? (
        <div className="text-center py-12 text-[#C4B8A8]">
          <p className="text-lg font-semibold">Aucune photo</p>
          <p className="mt-1">Ajoutez des photos d&apos;inspiration pour ce moodboard</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative aspect-[4/3] bg-[#E8E0D5]/30">
                <img src={item.url} alt={item.title || ''} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-7 w-7 p-0 bg-white/90 hover:bg-white"
                    onClick={() => startEditItem(item)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    className="h-7 w-7 p-0 bg-red-500/90 hover:bg-red-500 text-white"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                {editingItem === item.id ? (
                  <div className="space-y-3">
                    <div>
                      <Label>Titre</Label>
                      <Input
                        value={itemForm.title}
                        onChange={e => setItemForm({ ...itemForm, title: e.target.value })}
                        className="mt-1"
                        placeholder="Titre de la photo"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={itemForm.description}
                        onChange={e => setItemForm({ ...itemForm, description: e.target.value })}
                        className="mt-1"
                        rows={2}
                        placeholder="Description, inspiration..."
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="outline" onClick={() => setEditingItem(null)}>Annuler</Button>
                      <Button size="sm" className="bg-[#0A0A0A] text-white" onClick={() => handleSaveItem(item.id)}>Enregistrer</Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4 className="font-bold text-[#0A0A0A]">{item.title || 'Sans titre'}</h4>
                    {item.description && (
                      <p className="text-sm text-[#C4B8A8] mt-1">{item.description}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
