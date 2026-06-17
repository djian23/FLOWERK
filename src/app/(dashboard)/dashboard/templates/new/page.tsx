'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function NewTemplatePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])
  const [form, setForm] = useState({ name: '', type: '', style: '', description: '' })
  const [checklistItems, setChecklistItems] = useState([{ label: '' }])

  function addItem() {
    setChecklistItems([...checklistItems, { label: '' }])
  }
  function removeItem(index: number) {
    setChecklistItems(checklistItems.filter((_, i) => i !== index))
  }
  function updateItem(index: number, value: string) {
    setChecklistItems(checklistItems.map((item, i) => i === index ? { label: value } : item))
  }

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
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          checklist: checklistItems.filter((i) => i.label.trim()).map((item, order) => ({ ...item, order })),
        }),
      })
      const t = await res.json()
      if (res.ok) {
        for (const file of photoFiles) {
          const fd = new FormData()
          fd.append('file', file)
          const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd })
          const { url } = await uploadRes.json()
          await fetch(`/api/templates/${t.id}/photos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
          })
        }
        router.push(`/dashboard/templates/${t.id}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/templates">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </Link>
        <h2 className="font-serif text-2xl text-[#0A0A0A]">Nouveau template</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border border-[#E8E0D5]">
          <CardHeader><CardTitle>Informations</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nom *</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="mt-1" placeholder="Template Mariage..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type d&apos;événement</Label>
                <Input id="type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="mt-1" placeholder="Mariage, Anniversaire..." />
              </div>
              <div>
                <Label htmlFor="style">Style</Label>
                <Input id="style" value={form.style} onChange={(e) => setForm({ ...form, style: e.target.value })} className="mt-1" placeholder="Champêtre, Moderne..." />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1" rows={3} />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#E8E0D5]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Checklist par défaut</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addItem} className="gap-1">
              <Plus className="h-3 w-3" /> Ajouter
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {checklistItems.map((item, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  value={item.label}
                  onChange={(e) => updateItem(index, e.target.value)}
                  placeholder={`Tâche ${index + 1}...`}
                  className="flex-1"
                />
                <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(index)} className="text-red-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
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

        <div className="flex gap-3 justify-end">
          <Link href="/dashboard/templates">
            <Button type="button" variant="outline">Annuler</Button>
          </Link>
          <Button type="submit" disabled={loading} className="bg-[#0A0A0A] hover:bg-[#1a1a1a] text-white">
            {loading ? 'Création...' : 'Créer'}
          </Button>
        </div>
      </form>
    </div>
  )
}
