'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft } from 'lucide-react'

export default function NewTransporterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', notes: '' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/transporters', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
    })
    if (res.ok) { const t = await res.json(); router.push(`/dashboard/transporters/${t.id}`) }
    setLoading(false)
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/transporters" className="text-[#C4B8A8] hover:text-[#0A0A0A]"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="font-serif text-2xl text-[#0A0A0A]">Nouveau transporteur</h1>
      </div>
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><Label htmlFor="name">Nom *</Label><Input id="name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="phone">Téléphone</Label><Input id="phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
              <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
            </div>
            <div className="space-y-2"><Label htmlFor="notes">Notes</Label><Textarea id="notes" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={2} /></div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading} className="bg-[#0A0A0A] hover:bg-[#1a1a1a]">{loading ? 'Création...' : 'Créer'}</Button>
              <Link href="/dashboard/transporters"><Button type="button" variant="outline">Annuler</Button></Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
