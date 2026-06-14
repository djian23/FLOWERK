'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Preview } from '@/types'
import { PREVIEW_TYPES, PREVIEW_STATUSES } from '@/lib/utils'
import { ArrowLeft, Upload, Trash2 } from 'lucide-react'

export default function PreviewsPage({ params }: { params: { id: string } }) {
  const [previews, setPreviews] = useState<Preview[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [filterType, setFilterType] = useState('')

  const load = useCallback(async () => {
    const res = await fetch(`/api/previews?eventId=${params.id}`)
    const _p = await res.json(); setPreviews(Array.isArray(_p) ? _p : [])
    setLoading(false)
  }, [params.id])

  useEffect(() => { load() }, [load])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>, type: string) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd })
    const { url } = await uploadRes.json()
    await fetch('/api/previews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId: params.id, url, type })
    })
    await load()
    setUploading(false)
  }

  async function handleStatusChange(id: string, status: string) {
    await fetch(`/api/previews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, type: previews.find(p => p.id === id)?.type })
    })
    await load()
  }

  async function handleDelete(id: string) {
    await fetch(`/api/previews/${id}`, { method: 'DELETE' })
    await load()
  }

  const filtered = filterType ? previews.filter(p => p.type === filterType) : previews

  const statusColors: Record<string, string> = {
    BROUILLON: 'bg-gray-100 text-gray-700',
    EN_COURS: 'bg-blue-100 text-blue-700',
    VALIDE: 'bg-green-100 text-green-700',
    REJETE: 'bg-red-100 text-red-700',
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/events/${params.id}`} className="text-[#C4B8A8] hover:text-[#0A0A0A]"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="font-serif text-2xl text-[#0A0A0A]">Galerie de previews</h1>
        </div>
        <div className="flex gap-2">
          {Object.entries(PREVIEW_TYPES).map(([k, v]) => (
            <label key={k} className="cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={e => handleUpload(e, k)} />
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[#E8E0D5] rounded-md hover:bg-[#E8E0D5] transition-colors">
                <Upload className="h-3 w-3" /> {v}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilterType('')} className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${!filterType ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' : 'border-[#E8E0D5] hover:border-[#C4B8A8]'}`}>
          Tous ({previews.length})
        </button>
        {Object.entries(PREVIEW_TYPES).map(([k, v]) => {
          const count = previews.filter(p => p.type === k).length
          return (
            <button key={k} onClick={() => setFilterType(k)} className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${filterType === k ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' : 'border-[#E8E0D5] hover:border-[#C4B8A8]'}`}>
              {v} ({count})
            </button>
          )
        })}
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <div key={i} className="h-48 bg-[#E8E0D5] rounded-lg animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12"><p className="text-[#C4B8A8]">Aucune preview</p></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map(preview => (
            <div key={preview.id} className="group relative">
              <img src={preview.url} alt="" className="w-full h-48 object-cover rounded-lg" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors rounded-lg" />
              <div className="absolute top-2 left-2 flex gap-1">
                <span className="text-xs bg-white/90 px-2 py-0.5 rounded">{PREVIEW_TYPES[preview.type]}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${statusColors[preview.status] || 'bg-gray-100'}`}>{PREVIEW_STATUSES[preview.status]}</span>
              </div>
              <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <select
                  value={preview.status}
                  onChange={e => handleStatusChange(preview.id, e.target.value)}
                  className="flex-1 text-xs h-7 rounded border border-white bg-white px-1"
                  onClick={e => e.stopPropagation()}
                >
                  {Object.entries(PREVIEW_STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <button onClick={() => handleDelete(preview.id)} className="p-1 bg-red-500 text-white rounded">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
