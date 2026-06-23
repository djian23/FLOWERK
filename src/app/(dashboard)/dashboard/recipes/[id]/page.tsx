'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, Save, X, Trash2, Flower2, Plus, Clock, DollarSign, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate, formatCurrency } from '@/lib/utils'
import { uploadFile } from '@/lib/upload'

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [recipe, setRecipe] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', description: '', prepTime: '', estimatedCost: '' })
  const [editIngredients, setEditIngredients] = useState<any[]>([])

  const fetchRecipe = useCallback(async () => {
    const res = await fetch(`/api/recipes/${id}`)
    if (!res.ok) { router.push('/dashboard/recipes'); return }
    const data = await res.json()
    setRecipe(data && !data.error ? data : null)
    if (data && !data.error) {
      setEditForm({
        name: data.name || '',
        description: data.description || '',
        prepTime: data.prepTime ? String(data.prepTime) : '',
        estimatedCost: data.estimatedCost ? String(data.estimatedCost) : '',
      })
      setEditIngredients(data.ingredients?.map((i: any) => ({ ...i, quantity: String(i.quantity) })) || [])
    }
    setLoading(false)
  }, [id, router])

  useEffect(() => { fetchRecipe() }, [fetchRecipe])

  function addIngredient() {
    setEditIngredients([...editIngredients, { name: '', quantity: '1', unit: 'tiges', notes: '' }])
  }
  function removeIngredient(index: number) {
    setEditIngredients(editIngredients.filter((_: any, i: number) => i !== index))
  }
  function updateIngredient(index: number, field: string, value: string) {
    setEditIngredients(editIngredients.map((ing: any, i: number) => i === index ? { ...ing, [field]: value } : ing))
  }

  async function handleSave() {
    setSaving(true)
    await fetch(`/api/recipes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editForm, ingredients: editIngredients.filter((i: any) => i.name.trim()) }),
    })
    await fetchRecipe()
    setEditing(false)
    setSaving(false)
  }

  async function handleDelete() {
    if (!confirm('Supprimer cette composition ?')) return
    await fetch(`/api/recipes/${id}`, { method: 'DELETE' })
    router.push('/dashboard/recipes')
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const url = await uploadFile(file)
    await fetch(`/api/recipes/${id}/photos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    })
    await fetchRecipe()
    setUploading(false)
  }

  async function handleDeletePhoto(photoId: string) {
    await fetch(`/api/recipes/${id}/photos/${photoId}`, { method: 'DELETE' })
    await fetchRecipe()
  }

  if (loading) return <div className="text-center py-12 text-[#C4B8A8]">Chargement...</div>
  if (!recipe) return null

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/recipes">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          </Link>
          <div className="w-10 h-10 rounded-full bg-[#E8E0D5] flex items-center justify-center">
            <Flower2 className="h-5 w-5 text-[#0A0A0A]" />
          </div>
          <h2 className="font-serif text-2xl text-[#0A0A0A]">{recipe.name}</h2>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <Button onClick={() => setEditing(false)} variant="outline" size="sm"><X className="h-3 w-3 mr-1" /> Annuler</Button>
              <Button onClick={handleSave} disabled={saving} size="sm" className="bg-[#0A0A0A] text-white">
                <Save className="h-3 w-3 mr-1" /> {saving ? '...' : 'Enregistrer'}
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setEditing(true)} variant="outline" size="sm"><Edit className="h-3 w-3 mr-1" /> Modifier</Button>
              <Button onClick={handleDelete} variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
                <Trash2 className="h-3 w-3 mr-1" /> Supprimer
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <Card className="border border-[#E8E0D5]">
            <CardHeader><CardTitle>Informations</CardTitle></CardHeader>
            <CardContent>
              {editing ? (
                <div className="space-y-4">
                  <div><Label>Nom</Label><Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="mt-1" /></div>
                  <div><Label>Description</Label><Textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="mt-1" rows={3} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Temps de préparation (min)</Label><Input type="number" value={editForm.prepTime} onChange={(e) => setEditForm({ ...editForm, prepTime: e.target.value })} className="mt-1" /></div>
                    <div><Label>Coût estimé (€)</Label><Input type="number" step="0.01" value={editForm.estimatedCost} onChange={(e) => setEditForm({ ...editForm, estimatedCost: e.target.value })} className="mt-1" /></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {recipe.description && <div><div className="text-xs text-[#C4B8A8]">Description</div><div className="text-sm bg-[#E8E0D5]/30 rounded p-3 mt-1">{recipe.description}</div></div>}
                  <div className="flex gap-6">
                    {recipe.prepTime && <div><div className="text-xs text-[#C4B8A8]">Préparation</div><div className="text-sm font-medium flex items-center gap-1 mt-1"><Clock className="h-3 w-3" />{recipe.prepTime} min</div></div>}
                    {recipe.estimatedCost && <div><div className="text-xs text-[#C4B8A8]">Coût estimé</div><div className="text-sm font-medium flex items-center gap-1 mt-1"><DollarSign className="h-3 w-3" />{formatCurrency(recipe.estimatedCost)}</div></div>}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-[#E8E0D5]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Ingrédients ({editing ? editIngredients.length : recipe.ingredients?.length || 0})</CardTitle>
              {editing && <Button type="button" variant="outline" size="sm" onClick={addIngredient}><Plus className="h-3 w-3 mr-1" />Ajouter</Button>}
            </CardHeader>
            <CardContent>
              {editing ? (
                <div className="space-y-3">
                  {editIngredients.map((ing: any, index: number) => (
                    <div key={index} className="flex gap-2 items-start">
                      <div className="flex-1">
                        <Input value={ing.name} onChange={(e) => updateIngredient(index, 'name', e.target.value)} placeholder="Fleur / Verdure..." className="mb-1" />
                        <div className="flex gap-2">
                          <Input type="number" value={ing.quantity} onChange={(e) => updateIngredient(index, 'quantity', e.target.value)} className="w-20" />
                          <select value={ing.unit} onChange={(e) => updateIngredient(index, 'unit', e.target.value)} className="px-2 py-2 border border-[#E8E0D5] rounded-md text-sm bg-[#FAFAFA]">
                            <option value="tiges">tiges</option><option value="bouquets">bouquets</option><option value="branches">branches</option><option value="feuilles">feuilles</option><option value="pots">pots</option><option value="pièces">pièces</option>
                          </select>
                          <Input value={ing.notes || ''} onChange={(e) => updateIngredient(index, 'notes', e.target.value)} placeholder="Notes..." className="flex-1" />
                        </div>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeIngredient(index)} className="text-red-400 hover:text-red-600 mt-1"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </div>
              ) : !recipe.ingredients?.length ? (
                <p className="text-sm text-[#C4B8A8]">Aucun ingrédient</p>
              ) : (
                <div className="divide-y divide-[#E8E0D5]">
                  {recipe.ingredients.map((ing: any) => (
                    <div key={ing.id} className="flex items-center justify-between py-3">
                      <div>
                        <div className="text-sm font-medium">{ing.name}</div>
                        {ing.notes && <div className="text-xs text-[#C4B8A8]">{ing.notes}</div>}
                      </div>
                      <div className="text-sm font-semibold text-[#0A0A0A]">{ing.quantity} {ing.unit}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Photos */}
          <Card className="border border-[#E8E0D5]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Photos</CardTitle>
              <label className="cursor-pointer">
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-[#E8E0D5] rounded-md hover:bg-[#FAFAFA] transition-colors">
                  <Upload className="h-4 w-4" /> {uploading ? 'Envoi...' : 'Ajouter'}
                </span>
              </label>
            </CardHeader>
            <CardContent>
              {recipe.photos && recipe.photos.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {recipe.photos.map((photo: any) => (
                    <div key={photo.id} className="relative group">
                      <img src={photo.url} alt="" className="w-full h-32 object-cover rounded-md" />
                      <button onClick={() => handleDeletePhoto(photo.id)} className="absolute top-2 right-2 p-1 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#C4B8A8]">Aucune photo</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border border-[#E8E0D5]">
            <CardContent className="p-4 text-center">
              <div className="w-16 h-16 rounded-full bg-[#E8E0D5] flex items-center justify-center mx-auto mb-3">
                <Flower2 className="h-8 w-8 text-[#0A0A0A]" />
              </div>
              <div className="font-semibold text-[#0A0A0A]">{recipe.name}</div>
              <div className="text-xs text-[#C4B8A8] mt-1">Créé le {formatDate(recipe.createdAt)}</div>
              <div className="mt-3 pt-3 border-t border-[#E8E0D5] space-y-2">
                <div><div className="text-2xl font-bold text-[#0A0A0A]">{recipe.ingredients?.length || 0}</div><div className="text-xs text-[#C4B8A8]">ingrédient(s)</div></div>
                {recipe.prepTime && <div><div className="text-lg font-bold text-[#0A0A0A]">{recipe.prepTime} min</div><div className="text-xs text-[#C4B8A8]">préparation</div></div>}
                {recipe.estimatedCost && <div><div className="text-lg font-bold text-[#0A0A0A]">{formatCurrency(recipe.estimatedCost)}</div><div className="text-xs text-[#C4B8A8]">coût estimé</div></div>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
