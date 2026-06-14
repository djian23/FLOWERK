'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MediaItem } from '@/types'
import { MEDIA_TYPES } from '@/lib/utils'
import { ArrowLeft, Upload, Trash2, Film } from 'lucide-react'

export default function GalleryPage({ params }: { params: { id: string } }) {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [filterType, setFilterType] = useState('')

  const load = useCallback(async () => {
    const res = await fetch(`/api/gallery?eventId=${params.id}`)
    const _i = await res.json(); setItems(Array.isArray(_i) ? _i : [])
    setLoading(false)
  }, [params.id])

  useEffect(() => { load() }, [load])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>, type: string) {
    const files = e.target.files
    if (!files) return
    setUploading(true)
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', file)
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd })
      const { url } = await uploadRes.json()
      const isReel = type === 'REEL'
      await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: params.id, url, type, isReel })
      })
    }
    await load()
    setUploading(false)
  }

  async function handleDelete(id: string) {
    await fetch(`/api/gallery/${id}`, { method: 'DELETE' })
    await load()
  }

  const filtered = filterType ? items.filter(i => i.type === filterType) : items

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/events/${params.id}`} className="text-[#C4B8A8] hover:text-[#0A0A0A]"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="font-serif text-2xl text-[#0A0A0A]">Galerie résultats</h1>
        </div>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(MEDIA_TYPES).map(([k, v]) => (
            <label key={k} className="cursor-pointer">
              <input type="file" accept={k === 'VIDEO' || k === 'REEL' ? 'video/*,image/*' : 'image/*'} multiple className="hidden" onChange={e => handleUpload(e, k)} />
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[#E8E0D5] rounded-md hover:bg-[#E8E0D5] transition-colors cursor-pointer">
                <Upload className="h-3 w-3" /> {v}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilterType('')} className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${!filterType ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' : 'border-[#E8E0D5]'}`}>
          Tout ({items.length})
        </button>
        {Object.entries(MEDIA_TYPES).map(([k, v]) => (
          <button key={k} onClick={() => setFilterType(k)} className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${filterType === k ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' : 'border-[#E8E0D5]'}`}>
            {v} ({items.filter(i => i.type === k).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-4 gap-3">{[...Array(8)].map((_, i) => <div key={i} className="h-40 bg-[#E8E0D5] rounded-lg animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12"><p className="text-[#C4B8A8]">Aucun média</p></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map(item => (
            <div key={item.id} className="group relative">
              {item.type === 'VIDEO' || item.type === 'REEL' ? (
                <video src={item.url} className="w-full h-40 object-cover rounded-lg" />
              ) : (
                <img src={item.url} alt="" className="w-full h-40 object-cover rounded-lg" />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors rounded-lg" />
              <div className="absolute top-2 left-2 flex gap-1">
                <span className="text-xs bg-white/90 px-1.5 py-0.5 rounded">{MEDIA_TYPES[item.type]}</span>
                {item.isReel && <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-1.5 py-0.5 rounded flex items-center gap-1"><Film className="h-2 w-2" /> Reel</span>}
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-3 w-3" />
              </button>
              {item.notes && <p className="text-xs text-[#C4B8A8] mt-1 px-1">{item.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
