'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const VENUE_TYPES = [
  'Chateau',
  'Domaine',
  'Hotel',
  'Restaurant',
  'Salle de reception',
  'Jardin',
  'Plage',
  'Loft',
  'Autre',
]

export default function NewVenuePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    type: '',
    capacity: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    notes: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/venues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const venue = await res.json()
      if (res.ok) {
        router.push(`/dashboard/venues/${venue.id}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/venues">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </Link>
        <h2 className="font-serif text-2xl text-[#0A0A0A]">Nouvelle salle</h2>
      </div>

      <Card>
        <CardHeader><CardTitle>Informations de la salle</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nom *</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="mt-1" placeholder="Chateau de..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="address">Adresse</Label>
                <Input id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="city">Ville</Label>
                <Input id="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-[#E8E0D5] rounded-md text-sm bg-[#FAFAFA]"
                >
                  <option value="">-- Choisir --</option>
                  {VENUE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <Label htmlFor="capacity">Capacite</Label>
                <Input id="capacity" type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} className="mt-1" placeholder="150" />
              </div>
            </div>

            <div className="border-t border-[#E8E0D5] pt-4">
              <div className="text-sm font-medium text-[#0A0A0A] mb-3">Contact</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactName">Nom du contact</Label>
                  <Input id="contactName" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Telephone</Label>
                  <Input id="contactPhone" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} className="mt-1" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="contactEmail">Email</Label>
                  <Input id="contactEmail" type="email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} className="mt-1" />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="mt-1" rows={3} placeholder="Informations utiles sur le lieu..." />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Link href="/dashboard/venues">
                <Button type="button" variant="outline">Annuler</Button>
              </Link>
              <Button type="submit" disabled={loading} className="bg-[#0A0A0A] hover:bg-[#1a1a1a] text-white">
                {loading ? 'Creation...' : 'Creer'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
