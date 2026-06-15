'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, Save, X, Trash2, FileText, Plus, CheckSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'

export default function TemplateDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [template, setTemplate] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', type: '', style: '', description: '' })
  const [editChecklist, setEditChecklist] = useState<any[]>([])

  const fetchTemplate = useCallback(async () => {
    const res = await fetch(`/api/templates/${id}`)
    if (!res.ok) { router.push('/dashboard/templates'); return }
    const data = await res.json()
    setTemplate(data && !data.error ? data : null)
    if (data && !data.error) {
      setEditForm({ name: data.name || '', type: data.type || '', style: data.style || '', description: data.description || '' })
      setEditChecklist(data.checklist || [])
    }
    setLoading(false)
  }, [id, router])

  useEffect(() => { fetchTemplate() }, [fetchTemplate])

  function addItem() { setEditChecklist([...editChecklist, { label: '', order: editChecklist.length }]) }
  function removeItem(i: number) { setEditChecklist(editChecklist.filter((_: any, idx: number) => idx !== i)) }
  function updateItem(i: number, value: string) { setEditChecklist(editChecklist.map((item: any, idx: number) => idx === i ? { ...item, label: value } : item)) }

  async function handleSave() {
    setSaving(true)
    await fetch(`/api/templates/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editForm, checklist: editChecklist.filter((i: any) => i.label.trim()).map((item: any, order: number) => ({ ...item, order })) }),
    })
    await fetchTemplate()
    setEditing(false)
    setSaving(false)
  }

  async function handleDelete() {
    if (!confirm('Supprimer ce template ?')) return
    await fetch(`/api/templates/${id}`, { method: 'DELETE' })
    router.push('/dashboard/templates')
  }

  if (loading) return <div className="text-center py-12 text-[#C4B8A8]">Chargement...</div>
  if (!template) return null

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/templates">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          </Link>
          <div className="w-10 h-10 rounded-full bg-[#E8E0D5] flex items-center justify-center">
            <FileText className="h-5 w-5 text-[#0A0A0A]" />
          </div>
          <h2 className="font-serif text-2xl text-[#0A0A0A]">{template.name}</h2>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <Button onClick={() => setEditing(false)} variant="outline" size="sm"><X className="h-3 w-3 mr-1" />Annuler</Button>
              <Button onClick={handleSave} disabled={saving} size="sm" className="bg-[#0A0A0A] text-white"><Save className="h-3 w-3 mr-1" />{saving ? '...' : 'Enregistrer'}</Button>
            </>
          ) : (
            <>
              <Button onClick={() => setEditing(true)} variant="outline" size="sm"><Edit className="h-3 w-3 mr-1" />Modifier</Button>
              <Button onClick={handleDelete} variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50"><Trash2 className="h-3 w-3 mr-1" />Supprimer</Button>
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
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Type</Label><Input value={editForm.type} onChange={(e) => setEditForm({ ...editForm, type: e.target.value })} className="mt-1" placeholder="Mariage..." /></div>
                    <div><Label>Style</Label><Input value={editForm.style} onChange={(e) => setEditForm({ ...editForm, style: e.target.value })} className="mt-1" placeholder="Champêtre..." /></div>
                  </div>
                  <div><Label>Description</Label><Textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="mt-1" rows={3} /></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {template.type && <div><div className="text-xs text-[#C4B8A8]">Type</div><div className="text-sm">{template.type}</div></div>}
                  {template.style && <div><div className="text-xs text-[#C4B8A8]">Style</div><div className="text-sm">{template.style}</div></div>}
                  {template.description && <div><div className="text-xs text-[#C4B8A8]">Description</div><div className="text-sm bg-[#E8E0D5]/30 rounded p-3 mt-1">{template.description}</div></div>}
                  {!template.type && !template.style && !template.description && <p className="text-sm text-[#C4B8A8]">Aucune information supplémentaire</p>}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-[#E8E0D5]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Checklist ({editing ? editChecklist.length : template.checklist?.length || 0} tâches)</CardTitle>
              {editing && <Button type="button" variant="outline" size="sm" onClick={addItem}><Plus className="h-3 w-3 mr-1" />Ajouter</Button>}
            </CardHeader>
            <CardContent>
              {editing ? (
                <div className="space-y-2">
                  {editChecklist.map((item: any, index: number) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input value={item.label} onChange={(e) => updateItem(index, e.target.value)} placeholder={`Tâche ${index + 1}...`} className="flex-1" />
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(index)} className="text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </div>
              ) : !template.checklist?.length ? (
                <p className="text-sm text-[#C4B8A8]">Aucune tâche</p>
              ) : (
                <div className="space-y-2">
                  {template.checklist.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3 py-2 border-b border-[#E8E0D5]/50 last:border-0">
                      <CheckSquare className="h-4 w-4 text-[#C4B8A8]" />
                      <span className="text-sm">{item.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border border-[#E8E0D5]">
            <CardContent className="p-4 text-center">
              <div className="w-16 h-16 rounded-full bg-[#E8E0D5] flex items-center justify-center mx-auto mb-3">
                <FileText className="h-8 w-8 text-[#0A0A0A]" />
              </div>
              <div className="font-semibold text-[#0A0A0A]">{template.name}</div>
              <div className="text-xs text-[#C4B8A8] mt-1">Créé le {formatDate(template.createdAt)}</div>
              <div className="mt-3 pt-3 border-t border-[#E8E0D5]">
                <div className="text-2xl font-bold text-[#0A0A0A]">{template.checklist?.length || 0}</div>
                <div className="text-xs text-[#C4B8A8]">tâche(s)</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
