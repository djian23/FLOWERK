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
import { uploadFile } from '@/lib/upload'

export default function NewRecipePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])
  const [form, setForm] = useState({ name: '', description: '', prepTime: '', estimatedCost: '' })
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '1', unit: 'tiges', notes: '' }])

  function addIngredient() {
    setIngredients([...ingredients, { name: '', quantity: '1', unit: 'tiges', notes: '' }])
  }

  function removeIngredient(index: number) {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  function updateIngredient(index: number, field: string, value: string) {
    setIngredients(ingredients.map((ing, i) => i === index ? { ...ing, [field]: value } : ing))
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
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, ingredients: ingredients.filter((i) => i.name.trim()) }),
      })
      const r = await res.json()
      if (res.ok) {
        for (const file of photoFiles) {
          const url = await uploadFile(file)
          await fetch(`/api/recipes/${r.id}/photos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
          })
        }
        router.push(`/dashboard/recipes/${r.id}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/recipes">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </Link>
        <h2 className="font-serif text-2xl text-[#0A0A0A]">Nouvelle composition</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border border-[#E8E0D5]">
          <CardHeader><CardTitle>Informations</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nom *</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="mt-1" placeholder="Bouquet de mariée, Centre de table..." />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prepTime">Temps de préparation (min)</Label>
                <Input id="prepTime" type="number" value={form.prepTime} onChange={(e) => setForm({ ...form, prepTime: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="estimatedCost">Coût estimé (€)</Label>
                <Input id="estimatedCost" type="number" step="0.01" value={form.estimatedCost} onChange={(e) => setForm({ ...form, estimatedCost: e.target.value })} className="mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#E8E0D5]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Ingrédients</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addIngredient} className="gap-1">
              <Plus className="h-3 w-3" /> Ajouter
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {ingredients.map((ing, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-1">
                  <Input
                    value={ing.name}
                    onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                    placeholder="Nom de la fleur / verdure..."
                    className="mb-1"
                  />
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={ing.quantity}
                      onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                      className="w-20"
                      placeholder="Qté"
                    />
                    <select
                      value={ing.unit}
                      onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                      className="px-2 py-2 border border-[#E8E0D5] rounded-md text-sm bg-[#FAFAFA]"
                    >
                      <option value="tiges">tiges</option>
                      <option value="bouquets">bouquets</option>
                      <option value="branches">branches</option>
                      <option value="feuilles">feuilles</option>
                      <option value="pots">pots</option>
                      <option value="pièces">pièces</option>
                    </select>
                    <Input
                      value={ing.notes}
                      onChange={(e) => updateIngredient(index, 'notes', e.target.value)}
                      placeholder="Notes..."
                      className="flex-1"
                    />
                  </div>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeIngredient(index)} className="text-red-400 hover:text-red-600 mt-1">
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
          <Link href="/dashboard/recipes">
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
