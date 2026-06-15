'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, CheckSquare, Square, ChevronUp, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function EventChecklistPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [eventName, setEventName] = useState('')
  const [newLabel, setNewLabel] = useState('')
  const [adding, setAdding] = useState(false)

  const fetchItems = useCallback(async () => {
    const res = await fetch(`/api/checklist?eventId=${id}`)
    const data = await res.json()
    setItems(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [id])

  useEffect(() => {
    fetchItems()
    fetch(`/api/events/${id}`)
      .then((r) => r.json())
      .then((d) => { if (d && !d.error) setEventName(d.name) })
  }, [fetchItems, id])

  async function addItem(e: React.FormEvent) {
    e.preventDefault()
    if (!newLabel.trim()) return
    setAdding(true)
    await fetch('/api/checklist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId: id, label: newLabel, order: items.length }),
    })
    setNewLabel('')
    setAdding(false)
    fetchItems()
  }

  async function toggleItem(itemId: string, done: boolean) {
    await fetch(`/api/checklist/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !done }),
    })
    fetchItems()
  }

  async function deleteItem(itemId: string) {
    await fetch(`/api/checklist/${itemId}`, { method: 'DELETE' })
    fetchItems()
  }

  async function moveItem(index: number, direction: 'up' | 'down') {
    const newItems = [...items]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newItems.length) return
    ;[newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]]
    // Update orders
    await Promise.all([
      fetch(`/api/checklist/${newItems[index].id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: index }),
      }),
      fetch(`/api/checklist/${newItems[targetIndex].id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: targetIndex }),
      }),
    ])
    fetchItems()
  }

  const doneCount = items.filter((i) => i.done).length
  const progress = items.length > 0 ? Math.round((doneCount / items.length) * 100) : 0

  if (loading) return <div className="text-center py-12 text-[#C4B8A8]">Chargement...</div>

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/dashboard/events/${id}`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </Link>
        <div>
          <h2 className="font-serif text-2xl text-[#0A0A0A]">Checklist</h2>
          {eventName && <p className="text-sm text-[#C4B8A8]">{eventName}</p>}
        </div>
      </div>

      {/* Progress */}
      <Card className="border border-[#E8E0D5]">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#0A0A0A]">Progression</span>
            <span className="text-sm font-bold text-[#0A0A0A]">{doneCount}/{items.length} ({progress}%)</span>
          </div>
          <div className="w-full bg-[#E8E0D5] rounded-full h-3">
            <div
              className="bg-[#0A0A0A] h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Add item */}
      <Card className="border border-[#E8E0D5]">
        <CardHeader><CardTitle>Ajouter une tâche</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={addItem} className="flex gap-2">
            <Input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Nouvelle tâche..."
              className="flex-1"
              required
            />
            <Button type="submit" disabled={adding} className="bg-[#0A0A0A] text-white gap-1">
              <Plus className="h-4 w-4" />
              Ajouter
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Items */}
      <Card className="border border-[#E8E0D5]">
        <CardContent className="p-0">
          {items.length === 0 ? (
            <div className="text-center py-12 text-[#C4B8A8]">Aucune tâche. Commencez par en ajouter une.</div>
          ) : (
            <div className="divide-y divide-[#E8E0D5]">
              {items.map((item, index) => (
                <div key={item.id} className={`flex items-center gap-3 px-4 py-3 ${item.done ? 'bg-green-50/50' : ''}`}>
                  <button onClick={() => toggleItem(item.id, item.done)} className="shrink-0">
                    {item.done
                      ? <CheckSquare className="h-5 w-5 text-green-600" />
                      : <Square className="h-5 w-5 text-[#C4B8A8]" />
                    }
                  </button>
                  <span className={`flex-1 text-sm ${item.done ? 'line-through text-[#C4B8A8]' : 'text-[#0A0A0A]'}`}>
                    {item.label}
                  </span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => moveItem(index, 'up')} disabled={index === 0} className="h-7 w-7 p-0">
                      <ChevronUp className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => moveItem(index, 'down')} disabled={index === items.length - 1} className="h-7 w-7 p-0">
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteItem(item.id)} className="h-7 w-7 p-0 text-red-400 hover:text-red-600">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
