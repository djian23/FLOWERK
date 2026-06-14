'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Edit2, Check, X, Trash2 } from 'lucide-react'

export default function TransporterDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [transporter, setTransporter] = useState<any>(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', notes: '' })

  const load = useCallback(async () => {
    const res = await fetch('/api/transporters')
    const all = await res.json()
    const t = all.find((x: any) => x.id === params.id)
    if (t) {
      setTransporter(t)
      setForm({ name: t.name || '', phone: t.phone || '', email: t.email || '', notes: t.notes || '' })
    }
    setLoading(false)
  }, [params.id])

  useEffect(() => { load() }, [load])

  async function handleSave() {
    setSaving(true)
    const res = await fetch(`/api/transporters/${params.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
    })
    if (res.ok) { await load(); setEditing(false) }
    setSaving(false)
  }

  async function handleDelete() {
    if (!confirm('Supprimer ce transporteur ?')) return
    await fetch(`/api/transporters/${params.id}`, { method: 'DELETE' })
    router.push('/dashboard/transporters')
  }

  if (loading) return <div className="animate-pulse h-48 bg-[#E8E0D5] rounded-lg" />

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/transporters" className="text-[#C4B8A8] hover:text-[#0A0A0A]"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="font-serif text-2xl text-[#0A0A0A]">{transporter?.name}</h1>
        </div>
        <div className="flex gap-2">
          {!editing ? (
            <>
              <Button variant="outline" onClick={() => setEditing(true)} className="gap-2"><Edit2 className="h-4 w-4" /> Modifier</Button>
              <Button variant="outline" onClick={handleDelete} className="gap-2 text-red-600 border-red-200 hover:bg-red-50"><Trash2 className="h-4 w-4" /> Supprimer</Button>
            </>
          ) : (
            <>
              <Button onClick={handleSave} disabled={saving} className="bg-[#0A0A0A] hover:bg-[#1a1a1a] gap-2"><Check className="h-4 w-4" />{saving ? 'Sauvegarde...' : 'Enregistrer'}</Button>
              <Button variant="outline" onClick={() => setEditing(false)} className="gap-2"><X className="h-4 w-4" /> Annuler</Button>
            </>
          )}
        </div>
      </div>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2"><Label>Nom *</Label>{editing ? <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} /> : <p className="text-sm text-[#0A0A0A]">{transporter?.name}</p>}</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Téléphone</Label>{editing ? <Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /> : <p className="text-sm text-[#0A0A0A]">{transporter?.phone || '—'}</p>}</div>
            <div className="space-y-2"><Label>Email</Label>{editing ? <Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /> : <p className="text-sm text-[#0A0A0A]">{transporter?.email || '—'}</p>}</div>
          </div>
          <div className="space-y-2"><Label>Notes</Label>{editing ? <Textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={3} /> : <p className="text-sm text-[#0A0A0A]">{transporter?.notes || '—'}</p>}</div>
        </CardContent>
      </Card>
    </div>
  )
}
