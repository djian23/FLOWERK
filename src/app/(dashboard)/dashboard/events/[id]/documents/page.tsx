'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Document } from '@/types'
import { DOCUMENT_TYPES, formatDate } from '@/lib/utils'
import { ArrowLeft, Upload, Trash2, FileText, ExternalLink } from 'lucide-react'
import { uploadFile } from '@/lib/upload'

export default function DocumentsPage({ params }: { params: { id: string } }) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [filterType, setFilterType] = useState('')

  const load = useCallback(async () => {
    const res = await fetch(`/api/documents?eventId=${params.id}`)
    const _doc = await res.json(); setDocuments(Array.isArray(_doc) ? _doc : [])
    setLoading(false)
  }, [params.id])

  useEffect(() => { load() }, [load])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>, type: string) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const url = await uploadFile(file)
    await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId: params.id, url, name: file.name, type })
    })
    await load()
    setUploading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer ce document ?')) return
    await fetch(`/api/documents/${id}`, { method: 'DELETE' })
    await load()
  }

  const filtered = filterType ? documents.filter(d => d.type === filterType) : documents

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/events/${params.id}`} className="text-[#C4B8A8] hover:text-[#0A0A0A]"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="font-serif text-2xl text-[#0A0A0A]">Documents</h1>
        </div>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(DOCUMENT_TYPES).map(([k, v]) => (
            <label key={k} className="cursor-pointer">
              <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png" className="hidden" onChange={e => handleUpload(e, k)} />
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[#E8E0D5] rounded-md hover:bg-[#E8E0D5] transition-colors">
                <Upload className="h-3 w-3" /> {v}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilterType('')} className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${!filterType ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' : 'border-[#E8E0D5]'}`}>
          Tous ({documents.length})
        </button>
        {Object.entries(DOCUMENT_TYPES).map(([k, v]) => (
          <button key={k} onClick={() => setFilterType(k)} className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${filterType === k ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' : 'border-[#E8E0D5]'}`}>
            {v} ({documents.filter(d => d.type === k).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-[#E8E0D5] rounded-lg animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-[#E8E0D5] mx-auto mb-4" />
          <p className="text-[#C4B8A8]">Aucun document</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(doc => (
            <div key={doc.id} className="flex items-center justify-between p-4 bg-white border border-[#E8E0D5] rounded-lg hover:border-[#C4B8A8] transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-[#C4B8A8]" />
                <div>
                  <p className="text-sm font-medium text-[#0A0A0A]">{doc.name}</p>
                  <p className="text-xs text-[#C4B8A8]">{formatDate(doc.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{DOCUMENT_TYPES[doc.type] || doc.type}</Badge>
                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="p-2 text-[#C4B8A8] hover:text-[#0A0A0A] transition-colors">
                  <ExternalLink className="h-4 w-4" />
                </a>
                <button onClick={() => handleDelete(doc.id)} className="p-2 text-[#C4B8A8] hover:text-red-500 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
