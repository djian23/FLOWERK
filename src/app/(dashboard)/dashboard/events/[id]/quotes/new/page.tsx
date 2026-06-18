'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

interface QuoteLine {
  prestation: string
  description: string
  quantity: number
  unitPrice: number
}

export default function NewQuotePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [event, setEvent] = useState<any | null>(null)
  const [lines, setLines] = useState<QuoteLine[]>([
    { prestation: '', description: '', quantity: 1, unitPrice: 0 },
  ])
  const [validUntil, setValidUntil] = useState('')
  const [conditions, setConditions] = useState(
    'Devis valable 30 jours. Acompte de 30% à la signature.'
  )
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function fetchEvent() {
      const res = await fetch(`/api/events/${id}`)
      if (res.ok) {
        const data = await res.json()
        setEvent(data)
      }
    }
    fetchEvent()
  }, [id])

  function addLine() {
    setLines([...lines, { prestation: '', description: '', quantity: 1, unitPrice: 0 }])
  }

  function removeLine(index: number) {
    if (lines.length <= 1) return
    setLines(lines.filter((_, i) => i !== index))
  }

  function updateLine(index: number, field: keyof QuoteLine, value: string | number) {
    setLines(lines.map((line, i) => (i === index ? { ...line, [field]: value } : line)))
  }

  const grandTotal = lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: id,
          validUntil,
          conditions,
          notes,
          lines: lines.map((l, i) => ({ ...l, order: i })),
        }),
      })
      if (res.ok) {
        const data = await res.json()
        router.push(`/dashboard/events/${id}/quotes/${data.id}`)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/dashboard/events/${id}/quotes`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </Link>
        <h1 className="font-serif text-2xl text-[#0A0A0A]">Nouveau devis</h1>
      </div>

      {event && (
        <Card className="border border-[#E8E0D5]">
          <CardContent className="p-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-[#C4B8A8]">Client</span>
                <p className="font-medium text-[#0A0A0A]">{event.client?.name || '—'}</p>
              </div>
              <div>
                <span className="text-[#C4B8A8]">Événement</span>
                <p className="font-medium text-[#0A0A0A]">{event.name || '—'}</p>
              </div>
              <div>
                <span className="text-[#C4B8A8]">Date</span>
                <p className="font-medium text-[#0A0A0A]">
                  {event.date
                    ? new Date(event.date).toLocaleDateString('fr-FR')
                    : '—'}
                </p>
              </div>
              <div>
                <span className="text-[#C4B8A8]">Adresse</span>
                <p className="font-medium text-[#0A0A0A]">{event.address || '—'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border border-[#E8E0D5]">
          <CardHeader>
            <CardTitle>Lignes du devis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#E8E0D5]/30">
                    <th className="text-left p-3 border border-[#E8E0D5] font-medium text-[#0A0A0A]">
                      Prestation
                    </th>
                    <th className="text-left p-3 border border-[#E8E0D5] font-medium text-[#0A0A0A]">
                      Description
                    </th>
                    <th className="text-left p-3 border border-[#E8E0D5] font-medium text-[#0A0A0A] w-24">
                      Quantité
                    </th>
                    <th className="text-left p-3 border border-[#E8E0D5] font-medium text-[#0A0A0A] w-32">
                      Prix unitaire
                    </th>
                    <th className="text-right p-3 border border-[#E8E0D5] font-medium text-[#0A0A0A] w-28">
                      Total
                    </th>
                    <th className="text-center p-3 border border-[#E8E0D5] font-medium text-[#0A0A0A] w-16">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line, index) => (
                    <tr key={index}>
                      <td className="p-2 border border-[#E8E0D5]">
                        <Input
                          value={line.prestation}
                          onChange={(e) => updateLine(index, 'prestation', e.target.value)}
                          placeholder="Ex: Centre de table"
                          className="border-0 shadow-none focus-visible:ring-0"
                        />
                      </td>
                      <td className="p-2 border border-[#E8E0D5]">
                        <Input
                          value={line.description}
                          onChange={(e) => updateLine(index, 'description', e.target.value)}
                          placeholder="Détails..."
                          className="border-0 shadow-none focus-visible:ring-0"
                        />
                      </td>
                      <td className="p-2 border border-[#E8E0D5]">
                        <Input
                          type="number"
                          min={1}
                          value={line.quantity}
                          onChange={(e) =>
                            updateLine(index, 'quantity', parseInt(e.target.value) || 1)
                          }
                          className="border-0 shadow-none focus-visible:ring-0"
                        />
                      </td>
                      <td className="p-2 border border-[#E8E0D5]">
                        <Input
                          type="number"
                          step="0.01"
                          min={0}
                          value={line.unitPrice}
                          onChange={(e) =>
                            updateLine(index, 'unitPrice', parseFloat(e.target.value) || 0)
                          }
                          className="border-0 shadow-none focus-visible:ring-0"
                        />
                      </td>
                      <td className="p-2 border border-[#E8E0D5] text-right font-medium text-[#0A0A0A]">
                        {formatCurrency(line.quantity * line.unitPrice)}
                      </td>
                      <td className="p-2 border border-[#E8E0D5] text-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLine(index)}
                          disabled={lines.length <= 1}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLine}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Ajouter une ligne
              </Button>
              <div className="text-right">
                <span className="text-sm text-[#C4B8A8] mr-3">Total HT :</span>
                <span className="text-lg font-bold text-[#0A0A0A]">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="validUntil">Valide jusqu&apos;au</Label>
            <Input
              id="validUntil"
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="conditions">Conditions</Label>
            <Textarea
              id="conditions"
              value={conditions}
              onChange={(e) => setConditions(e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Notes internes..."
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={saving}
            className="gap-2 bg-[#0A0A0A] hover:bg-[#1a1a1a] text-white"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Création...' : 'Créer le devis'}
          </Button>
        </div>
      </form>
    </div>
  )
}
