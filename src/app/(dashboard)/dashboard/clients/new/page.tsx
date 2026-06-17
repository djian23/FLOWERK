'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function NewClientPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
    source: '',
    clientType: '',
    preferredStyle: '',
    avoidedColors: '',
    floralAllergies: '',
    usualBudget: '',
    isVip: false,
  })

  function handleAddPhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    setPhotoFiles(prev => [...prev, ...files])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = () => setPhotoPreviews(prev => [...prev, reader.result as string])
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  function removePhoto(index: number) {
    setPhotoFiles(prev => prev.filter((_, i) => i !== index))
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const client = await res.json()
      if (res.ok) {
        for (const file of photoFiles) {
          const fd = new FormData()
          fd.append('file', file)
          const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd })
          const { url } = await uploadRes.json()
          await fetch(`/api/clients/${client.id}/photos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
          })
        }
        router.push(`/dashboard/clients/${client.id}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/clients">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </Link>
        <h2 className="font-serif text-2xl text-[#0A0A0A]">Nouveau client</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border border-[#E8E0D5]">
          <CardHeader><CardTitle>Informations du client</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nom complet *</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="mt-1" placeholder="Marie Dupont" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1" placeholder="marie@exemple.fr" />
              </div>
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1" placeholder="+33 6 00 00 00 00" />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Adresse</Label>
              <Input id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="mt-1" placeholder="123 rue de la Paix, 75001 Paris" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Source</Label>
                <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} className="mt-1 w-full px-3 py-2 border border-[#E8E0D5] rounded-md text-sm bg-[#FAFAFA]">
                  <option value="">— Sélectionner —</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Bouche-à-oreille">Bouche-à-oreille</option>
                  <option value="Google">Google</option>
                  <option value="Agence">Agence</option>
                  <option value="Site web">Site web</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <div>
                <Label>Type de client</Label>
                <select value={form.clientType} onChange={(e) => setForm({ ...form, clientType: e.target.value })} className="mt-1 w-full px-3 py-2 border border-[#E8E0D5] rounded-md text-sm bg-[#FAFAFA]">
                  <option value="">— Sélectionner —</option>
                  <option value="Particulier">Particulier</option>
                  <option value="Professionnel">Professionnel</option>
                  <option value="Agence">Agence</option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="usualBudget">Budget habituel (€)</Label>
              <Input id="usualBudget" type="number" step="0.01" value={form.usualBudget} onChange={(e) => setForm({ ...form, usualBudget: e.target.value })} className="mt-1" placeholder="2000" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isVip" checked={form.isVip} onChange={(e) => setForm({ ...form, isVip: e.target.checked })} className="h-4 w-4 rounded" />
              <Label htmlFor="isVip">Client VIP</Label>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#E8E0D5]">
          <CardHeader><CardTitle>Préférences florales</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="preferredStyle">Style préféré</Label>
              <Input id="preferredStyle" value={form.preferredStyle} onChange={(e) => setForm({ ...form, preferredStyle: e.target.value })} className="mt-1" placeholder="Champêtre, Moderne, Romantique..." />
            </div>
            <div>
              <Label htmlFor="avoidedColors">Couleurs à éviter</Label>
              <Input id="avoidedColors" value={form.avoidedColors} onChange={(e) => setForm({ ...form, avoidedColors: e.target.value })} className="mt-1" placeholder="Rouge vif, Jaune..." />
            </div>
            <div>
              <Label htmlFor="floralAllergies">Allergies florales</Label>
              <Input id="floralAllergies" value={form.floralAllergies} onChange={(e) => setForm({ ...form, floralAllergies: e.target.value })} className="mt-1" placeholder="Pollen, Lys..." />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="mt-1" rows={3} placeholder="Notes sur ce client..." />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#E8E0D5]">
          <CardHeader><CardTitle>Photos</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {photoPreviews.map((src, i) => (
                <div key={i} className="relative w-24 h-24">
                  <img src={src} alt="" className="w-full h-full object-cover rounded-md" />
                  <button type="button" onClick={() => removePhoto(i)} className="absolute -top-2 -right-2 p-0.5 bg-white rounded-full shadow border border-[#E8E0D5]">
                    <X className="h-3 w-3 text-red-500" />
                  </button>
                </div>
              ))}
              <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-[#E8E0D5] rounded-md cursor-pointer hover:border-[#C4B8A8] transition-colors">
                <Upload className="h-5 w-5 text-[#C4B8A8]" />
                <span className="text-[10px] text-[#C4B8A8] mt-1">Ajouter</span>
                <input type="file" accept="image/*" multiple onChange={handleAddPhotos} className="hidden" />
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end pt-2">
          <Link href="/dashboard/clients">
            <Button type="button" variant="outline">Annuler</Button>
          </Link>
          <Button type="submit" disabled={loading} className="bg-[#0A0A0A] hover:bg-[#1a1a1a] text-white">
            {loading ? 'Création...' : 'Créer le client'}
          </Button>
        </div>
      </form>
    </div>
  )
}
