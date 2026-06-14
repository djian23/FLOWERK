'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Client } from '@/types'
import { EVENT_STATUSES } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'

export default function NewEventPage() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', clientId: '', date: '', address: '', phone: '',
    budget: '', description: '', status: 'DEVIS_EN_COURS', type: ''
  })

  useEffect(() => {
    fetch('/api/clients').then(r => r.json()).then(setClients)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    if (res.ok) {
      const event = await res.json()
      router.push(`/dashboard/events/${event.id}`)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/events" className="text-[#C4B8A8] hover:text-[#0A0A0A] transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-serif text-2xl text-[#0A0A0A]">Nouvel événement</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de l'événement *</Label>
              <Input id="name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Client</Label>
                <select value={form.clientId} onChange={e => setForm({...form, clientId: e.target.value})}
                  className="h-10 w-full rounded-md border border-[#E8E0D5] bg-[#FAFAFA] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4B8A8]">
                  <option value="">Sans client</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input id="date" type="datetime-local" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type d'événement</Label>
                <Input value={form.type} onChange={e => setForm({...form, type: e.target.value})} placeholder="Mariage, Corporate..." />
              </div>
              <div className="space-y-2">
                <Label>Statut</Label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                  className="h-10 w-full rounded-md border border-[#E8E0D5] bg-[#FAFAFA] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4B8A8]">
                  {Object.entries(EVENT_STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input id="address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Budget (€)</Label>
                <Input id="budget" type="number" step="0.01" value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading} className="bg-[#0A0A0A] hover:bg-[#1a1a1a]">
                {loading ? 'Création...' : 'Créer l\'événement'}
              </Button>
              <Link href="/dashboard/events">
                <Button type="button" variant="outline">Annuler</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
