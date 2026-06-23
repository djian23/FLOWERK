'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Logistics, Transporter } from '@/types'
import { ArrowLeft, Upload, Trash2, Check } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { uploadFile } from '@/lib/upload'

export default function LogisticsPage({ params }: { params: { id: string } }) {
  const [logistics, setLogistics] = useState<Logistics | null>(null)
  const [transporters, setTransporters] = useState<Transporter[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    transporterId: '', pickupDate: '', deliveryDate: '', returnDate: '', status: '', notes: ''
  })

  const load = useCallback(async () => {
    const [evRes, trRes] = await Promise.all([
      fetch(`/api/events/${params.id}`),
      fetch('/api/transporters')
    ])
    const [evData, trData] = await Promise.all([evRes.json(), trRes.json()])
    setTransporters(trData)
    if (evData.logistics) {
      const lg = evData.logistics
      setLogistics(lg)
      setForm({
        transporterId: lg.transporterId || '',
        pickupDate: lg.pickupDate ? lg.pickupDate.slice(0,16) : '',
        deliveryDate: lg.deliveryDate ? lg.deliveryDate.slice(0,16) : '',
        returnDate: lg.returnDate ? lg.returnDate.slice(0,16) : '',
        status: lg.status || '',
        notes: lg.notes || '',
      })
    }
    setLoading(false)
  }, [params.id])

  useEffect(() => { load() }, [load])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const url = logistics ? `/api/logistics/${logistics.id}` : '/api/logistics'
    const method = logistics ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, eventId: params.id })
    })
    if (res.ok) {
      await load()
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
    setSaving(false)
  }

  async function handleDocUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !logistics) return
    setUploading(true)
    const url = await uploadFile(file)
    await fetch('/api/logistics/' + logistics.id + '/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, name: file.name })
    })
    await load()
    setUploading(false)
  }

  if (loading) return <div className="animate-pulse h-96 bg-[#E8E0D5] rounded-lg" />

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/dashboard/events/${params.id}`} className="text-[#C4B8A8] hover:text-[#0A0A0A]"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="font-serif text-2xl text-[#0A0A0A]">Logistique</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSave} className="space-y-5">
            <div className="space-y-2">
              <Label>Transporteur</Label>
              <select value={form.transporterId} onChange={e => setForm({...form, transporterId: e.target.value})}
                className="h-10 w-full rounded-md border border-[#E8E0D5] bg-[#FAFAFA] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4B8A8]">
                <option value="">Sans transporteur</option>
                {transporters.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Date d'enlèvement</Label><Input type="datetime-local" value={form.pickupDate} onChange={e => setForm({...form, pickupDate: e.target.value})} /></div>
              <div className="space-y-2"><Label>Date de livraison</Label><Input type="datetime-local" value={form.deliveryDate} onChange={e => setForm({...form, deliveryDate: e.target.value})} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Date de retour</Label><Input type="datetime-local" value={form.returnDate} onChange={e => setForm({...form, returnDate: e.target.value})} /></div>
              <div className="space-y-2"><Label>Statut logistique</Label><Input value={form.status} onChange={e => setForm({...form, status: e.target.value})} placeholder="En préparation..." /></div>
            </div>
            <div className="space-y-2"><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={3} /></div>
            <Button type="submit" disabled={saving} className={`gap-2 ${saved ? 'bg-green-600 hover:bg-green-700' : 'bg-[#0A0A0A] hover:bg-[#1a1a1a]'}`}>
              {saved ? <><Check className="h-4 w-4" /> Sauvegardé</> : saving ? 'Sauvegarde...' : 'Enregistrer'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {logistics && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Documents logistiques</CardTitle>
            <label className="cursor-pointer">
              <input type="file" onChange={handleDocUpload} className="hidden" />
              <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-[#E8E0D5] rounded-md hover:bg-[#FAFAFA]">
                <Upload className="h-4 w-4" /> {uploading ? 'Envoi...' : 'Ajouter'}
              </span>
            </label>
          </CardHeader>
          <CardContent>
            {logistics.documents && logistics.documents.length > 0 ? (
              <ul className="divide-y divide-[#E8E0D5]">
                {logistics.documents.map(doc => (
                  <li key={doc.id} className="py-3 flex items-center justify-between">
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-sm text-[#0A0A0A] hover:underline">{doc.name}</a>
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-[#C4B8A8]">Aucun document</p>}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
