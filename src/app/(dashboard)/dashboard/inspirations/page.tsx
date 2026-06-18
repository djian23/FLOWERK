'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Sparkles, Upload, Trash2, Pencil, X, Search, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

interface Inspiration {
  id: string
  url: string
  title: string | null
  description: string | null
  tags: string | null
  source: string | null
  createdAt: string
}

export default function InspirationsPage() {
  const [inspirations, setInspirations] = useState<Inspiration[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ title: '', description: '', tags: '', source: '' })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchInspirations = useCallback(async () => {
    const res = await fetch('/api/inspirations')
    const data = await res.json()
    setInspirations(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchInspirations()
  }, [fetchInspirations])

  // Extract all unique tags
  const allTags = Array.from(
    new Set(
      inspirations
        .flatMap((i) => (i.tags ? i.tags.split(',').map((t) => t.trim()) : []))
        .filter(Boolean)
    )
  ).sort()

  // Filter inspirations
  const filtered = inspirations.filter((i) => {
    const matchSearch =
      !searchText ||
      (i.title && i.title.toLowerCase().includes(searchText.toLowerCase())) ||
      (i.description && i.description.toLowerCase().includes(searchText.toLowerCase())) ||
      (i.tags && i.tags.toLowerCase().includes(searchText.toLowerCase()))

    const matchTag =
      !selectedTag ||
      (i.tags &&
        i.tags
          .split(',')
          .map((t) => t.trim())
          .includes(selectedTag))

    return matchSearch && matchTag
  })

  async function handleUpload(files: FileList) {
    setUploading(true)
    try {
      for (let idx = 0; idx < files.length; idx++) {
        const file = files[idx]
        const formData = new FormData()
        formData.append('file', file)
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
        const uploadData = await uploadRes.json()
        if (uploadData.url) {
          await fetch('/api/inspirations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: uploadData.url }),
          })
        }
      }
      await fetchInspirations()
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cette inspiration ?')) return
    await fetch(`/api/inspirations/${id}`, { method: 'DELETE' })
    setInspirations(inspirations.filter((i) => i.id !== id))
  }

  function startEdit(insp: Inspiration) {
    setEditingId(insp.id)
    setEditForm({
      title: insp.title || '',
      description: insp.description || '',
      tags: insp.tags || '',
      source: insp.source || '',
    })
  }

  async function saveEdit(id: string) {
    await fetch(`/api/inspirations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    })
    setEditingId(null)
    await fetchInspirations()
  }

  if (loading) return <div className="text-center py-12 text-[#C4B8A8]">Chargement...</div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl text-[#0A0A0A]">Mes Inspirations</h2>
        <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'Upload en cours...' : 'Ajouter des photos'}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files && handleUpload(e.target.files)}
        />
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C4B8A8]" />
          <Input
            placeholder="Rechercher par titre, description, tags..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Tag className="h-4 w-4 text-[#C4B8A8] shrink-0" />
          <button
            onClick={() => setSelectedTag('')}
            className={`px-2.5 py-0.5 rounded-full text-sm font-bold border transition-colors ${
              !selectedTag
                ? 'bg-[#0A0A0A] text-white border-transparent'
                : 'bg-white text-[#0A0A0A] border-[#E8E0D5] hover:bg-[#E8E0D5]'
            }`}
          >
            Tous
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? '' : tag)}
              className={`px-2.5 py-0.5 rounded-full text-sm font-bold border transition-colors ${
                selectedTag === tag
                  ? 'bg-[#0A0A0A] text-white border-transparent'
                  : 'bg-white text-[#0A0A0A] border-[#E8E0D5] hover:bg-[#E8E0D5]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-[#C4B8A8]">
          <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-semibold">Aucune inspiration</p>
          <p className="mt-1">Ajoutez des photos pour commencer votre mood board personnel</p>
        </div>
      ) : (
        /* Grid */
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {filtered.map((insp) => (
            <Card key={insp.id} className="overflow-hidden break-inside-avoid group">
              {/* Image */}
              <div
                className="relative cursor-pointer"
                onClick={() => setLightboxUrl(insp.url)}
              >
                <img
                  src={insp.url}
                  alt={insp.title || 'Inspiration'}
                  className="w-full aspect-auto object-cover"
                />
                {/* Hover overlay with delete */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-start justify-end p-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(insp.id)
                    }}
                    className="p-1.5 rounded-md bg-white/90 hover:bg-red-50 text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <CardContent className="p-4">
                {editingId === insp.id ? (
                  /* Edit mode */
                  <div className="space-y-2">
                    <Input
                      placeholder="Titre"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    />
                    <Input
                      placeholder="Description"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    />
                    <Input
                      placeholder="Tags (ex: mariage,roses,arche)"
                      value={editForm.tags}
                      onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                    />
                    <Input
                      placeholder="Source (ex: Pinterest)"
                      value={editForm.source}
                      onChange={(e) => setEditForm({ ...editForm, source: e.target.value })}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => saveEdit(insp.id)}>
                        Enregistrer
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                        Annuler
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Display mode */
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        {insp.title && (
                          <h3 className="font-bold text-[#0A0A0A] truncate">{insp.title}</h3>
                        )}
                        {insp.description && (
                          <p className="text-sm text-[#C4B8A8] mt-1 line-clamp-2">
                            {insp.description}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => startEdit(insp)}
                        className="p-1.5 rounded-md hover:bg-[#E8E0D5] text-[#C4B8A8] hover:text-[#0A0A0A] transition-colors shrink-0"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Tags */}
                    {insp.tags && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {insp.tags.split(',').map((tag) => (
                          <Badge
                            key={tag.trim()}
                            variant="secondary"
                            className="text-xs cursor-pointer"
                            onClick={() => setSelectedTag(tag.trim())}
                          >
                            {tag.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Source & date */}
                    <div className="flex items-center gap-2 mt-2 text-xs text-[#C4B8A8]">
                      {insp.source && <span>{insp.source}</span>}
                      {insp.source && <span>-</span>}
                      <span>{formatDate(insp.createdAt)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            onClick={() => setLightboxUrl(null)}
          >
            <X className="h-6 w-6" />
          </button>
          <img
            src={lightboxUrl}
            alt="Inspiration"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
