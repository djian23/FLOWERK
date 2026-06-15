'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Clock, Zap, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function formatDateTime(date: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(new Date(date))
}

export default function EventTimelinePage() {
  const { id } = useParams<{ id: string }>()
  const [entries, setEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [eventName, setEventName] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ action: '', details: '' })
  const [submitting, setSubmitting] = useState(false)

  const fetchEntries = useCallback(async () => {
    const res = await fetch(`/api/timeline?eventId=${id}`)
    const data = await res.json()
    setEntries(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [id])

  useEffect(() => {
    fetchEntries()
    fetch(`/api/events/${id}`).then((r) => r.json()).then((d) => { if (d && !d.error) setEventName(d.name) })
  }, [fetchEntries, id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    await fetch('/api/timeline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, eventId: id, automatic: false }),
    })
    setForm({ action: '', details: '' })
    setShowForm(false)
    setSubmitting(false)
    fetchEntries()
  }

  if (loading) return <div className="text-center py-12 text-[#C4B8A8]">Chargement...</div>

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/events/${id}`}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          </Link>
          <div>
            <h2 className="font-serif text-2xl text-[#0A0A0A]">Timeline</h2>
            {eventName && <p className="text-sm text-[#C4B8A8]">{eventName}</p>}
          </div>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-[#0A0A0A] text-white gap-2">
          <Plus className="h-4 w-4" />
          Ajouter
        </Button>
      </div>

      {showForm && (
        <Card className="border border-[#E8E0D5]">
          <CardHeader><CardTitle>Nouvelle entrée</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Action *</Label>
                <Input value={form.action} onChange={(e) => setForm({ ...form, action: e.target.value })} required className="mt-1" placeholder="Appel client, Commande passée..." />
              </div>
              <div>
                <Label>Détails</Label>
                <Textarea value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} className="mt-1" rows={3} placeholder="Informations complémentaires..." />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Annuler</Button>
                <Button type="submit" disabled={submitting} className="bg-[#0A0A0A] text-white">{submitting ? 'Ajout...' : 'Ajouter'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {entries.length === 0 ? (
        <Card className="border border-[#E8E0D5]">
          <CardContent className="py-12 text-center text-[#C4B8A8]">
            <Clock className="h-12 w-12 text-[#E8E0D5] mx-auto mb-4" />
            <p>Aucune entrée dans la timeline</p>
          </CardContent>
        </Card>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#E8E0D5]" />

          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="relative flex gap-4 pl-10">
                {/* Dot */}
                <div className={`absolute left-2.5 top-2 w-3 h-3 rounded-full border-2 border-white ${entry.automatic ? 'bg-[#C4B8A8]' : 'bg-[#0A0A0A]'}`} />

                <Card className="flex-1 border border-[#E8E0D5]">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          {entry.automatic
                            ? <Zap className="h-3 w-3 text-[#C4B8A8]" />
                            : <User className="h-3 w-3 text-[#0A0A0A]" />
                          }
                          <span className="text-sm font-medium text-[#0A0A0A]">{entry.action}</span>
                          {entry.automatic && (
                            <span className="text-[10px] bg-[#E8E0D5] text-[#C4B8A8] px-1.5 py-0.5 rounded">Auto</span>
                          )}
                        </div>
                        {entry.details && <p className="text-sm text-[#C4B8A8] mt-1">{entry.details}</p>}
                      </div>
                      <span className="text-xs text-[#C4B8A8] whitespace-nowrap">{formatDateTime(entry.createdAt)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
