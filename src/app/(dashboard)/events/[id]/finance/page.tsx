'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { EventCost } from '@/types'
import { formatCurrency, calculateTotalCost, calculateMargin } from '@/lib/utils'
import { ArrowLeft, Check, TrendingUp, TrendingDown } from 'lucide-react'

export default function FinancePage({ params }: { params: { id: string } }) {
  const [costs, setCosts] = useState<EventCost | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    flowers: '0', materials: '0', labor: '0', delivery: '0',
    subcontracting: '0', misc: '0', invoicedPrice: '0', notes: ''
  })

  const load = useCallback(async () => {
    const res = await fetch(`/api/events/${params.id}`)
    const data = await res.json()
    if (data.costs) {
      const c = data.costs
      setCosts(c)
      setForm({
        flowers: String(c.flowers), materials: String(c.materials), labor: String(c.labor),
        delivery: String(c.delivery), subcontracting: String(c.subcontracting), misc: String(c.misc),
        invoicedPrice: String(c.invoicedPrice), notes: c.notes || ''
      })
    }
    setLoading(false)
  }, [params.id])

  useEffect(() => { load() }, [load])

  const formCosts = {
    flowers: parseFloat(form.flowers) || 0,
    materials: parseFloat(form.materials) || 0,
    labor: parseFloat(form.labor) || 0,
    delivery: parseFloat(form.delivery) || 0,
    subcontracting: parseFloat(form.subcontracting) || 0,
    misc: parseFloat(form.misc) || 0,
  }
  const totalCost = calculateTotalCost(formCosts)
  const invoicedPrice = parseFloat(form.invoicedPrice) || 0
  const profit = invoicedPrice - totalCost
  const margin = calculateMargin(invoicedPrice, totalCost)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const url = costs ? `/api/costs/${costs.id}` : '/api/costs'
    const method = costs ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, eventId: params.id })
    })
    if (res.ok) {
      await load()
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
    setSaving(false)
  }

  if (loading) return <div className="animate-pulse h-96 bg-[#E8E0D5] rounded-lg" />

  const costFields = [
    { key: 'flowers', label: 'Fleurs' },
    { key: 'materials', label: 'Matériaux' },
    { key: 'labor', label: 'Main d\'œuvre' },
    { key: 'delivery', label: 'Livraison' },
    { key: 'subcontracting', label: 'Sous-traitance' },
    { key: 'misc', label: 'Divers' },
  ]

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/dashboard/events/${params.id}`} className="text-[#C4B8A8] hover:text-[#0A0A0A]"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="font-serif text-2xl text-[#0A0A0A]">Finance</h1>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 text-center">
            <div className="text-2xl font-bold text-[#0A0A0A]">{formatCurrency(totalCost)}</div>
            <div className="text-xs text-[#C4B8A8] mt-1">Coût total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <div className="text-2xl font-bold text-[#0A0A0A]">{formatCurrency(invoicedPrice)}</div>
            <div className="text-xs text-[#C4B8A8] mt-1">Prix facturé</div>
          </CardContent>
        </Card>
        <Card className={profit >= 0 ? 'border-green-200' : 'border-red-200'}>
          <CardContent className="p-5 text-center">
            <div className={`text-2xl font-bold flex items-center justify-center gap-1 ${profit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {profit >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
              {formatCurrency(profit)}
            </div>
            <div className="text-xs text-[#C4B8A8] mt-1">
              Bénéfice {margin !== 0 && `(${margin.toFixed(1)}%)`}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Détail des coûts</CardTitle></CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {costFields.map(({ key, label }) => (
                <div key={key} className="space-y-2">
                  <Label>{label} (€)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form[key as keyof typeof form]}
                    onChange={e => setForm({...form, [key]: e.target.value})}
                  />
                </div>
              ))}
            </div>

            <div className="border-t border-[#E8E0D5] pt-4">
              <div className="flex items-center justify-between text-sm mb-4">
                <span className="font-medium text-[#0A0A0A]">Total des coûts:</span>
                <span className="font-bold text-[#0A0A0A]">{formatCurrency(totalCost)}</span>
              </div>
              <div className="space-y-2">
                <Label>Prix facturé au client (€)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.invoicedPrice}
                  onChange={e => setForm({...form, invoicedPrice: e.target.value})}
                  className="text-lg font-semibold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={2} />
            </div>

            <Button type="submit" disabled={saving} className={`gap-2 ${saved ? 'bg-green-600 hover:bg-green-700' : 'bg-[#0A0A0A] hover:bg-[#1a1a1a]'}`}>
              {saved ? <><Check className="h-4 w-4" /> Sauvegardé</> : saving ? 'Sauvegarde...' : 'Enregistrer'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
