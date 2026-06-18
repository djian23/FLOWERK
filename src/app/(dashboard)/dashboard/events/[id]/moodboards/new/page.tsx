'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'

export default function NewMoodboardPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [event, setEvent] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch(`/api/events/${id}`).then(r => r.json()).then(ev => {
      setEvent(ev)
      if (ev.client) {
        setTitle(`Moodboard — ${ev.client.name}`)
      } else {
        setTitle(`Moodboard — ${ev.name}`)
      }
    })
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/moodboards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: id, title, notes: notes || null }),
      })
      if (res.ok) {
        const data = await res.json()
        router.push(`/dashboard/events/${id}/moodboards/${data.id}`)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href={`/dashboard/events/${id}/moodboards`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Retour
          </Button>
        </Link>
        <h2 className="font-serif text-2xl text-[#0A0A0A]">Nouveau moodboard</h2>
      </div>

      {event && (
        <Card>
          <CardContent className="p-4 flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#C4B8A8]" />
              <span className="font-semibold">{event.name}</span>
              <span className="text-[#C4B8A8]">— {formatDate(event.date)}</span>
            </div>
            {event.client && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-[#C4B8A8]" />
                <span>{event.client.name}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Informations</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Titre du moodboard</Label>
              <Input
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="mt-1"
                placeholder="ex: Moodboard — Mariage Dupont"
                required
              />
            </div>
            <div>
              <Label>Notes (optionnel)</Label>
              <Textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="mt-1"
                rows={3}
                placeholder="Notes sur le style, les inspirations..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Link href={`/dashboard/events/${id}/moodboards`}>
                <Button type="button" variant="outline">Annuler</Button>
              </Link>
              <Button type="submit" disabled={saving || !title.trim()} className="bg-[#0A0A0A] text-white">
                {saving ? 'Création...' : 'Créer et ajouter des photos'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
