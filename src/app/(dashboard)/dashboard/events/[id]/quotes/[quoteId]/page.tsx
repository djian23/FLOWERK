'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Save, Download, FileText, Edit, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatCurrency, QUOTE_STATUSES, QUOTE_STATUS_COLORS } from '@/lib/utils'
import { downloadQuotePDF } from '@/lib/pdf-utils'

interface QuoteLine {
  id?: string
  prestation: string
  description: string
  quantity: number
  unitPrice: number
  order: number
}

export default function QuoteDetailPage() {
  const { id, quoteId } = useParams<{ id: string; quoteId: string }>()
  const router = useRouter()

  const [quote, setQuote] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  // Edit fields
  const [lines, setLines] = useState<QuoteLine[]>([])
  const [validUntil, setValidUntil] = useState('')
  const [conditions, setConditions] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    async function fetchQuote() {
      try {
        const res = await fetch(`/api/quotes/${quoteId}`)
        if (!res.ok) {
          router.push(`/dashboard/events/${id}/quotes`)
          return
        }
        const data = await res.json()
        if (data.error) {
          router.push(`/dashboard/events/${id}/quotes`)
          return
        }
        setQuote(data)
        populateEditFields(data)
      } catch {
        router.push(`/dashboard/events/${id}/quotes`)
      } finally {
        setLoading(false)
      }
    }
    fetchQuote()
  }, [quoteId, id, router])

  function populateEditFields(data: any) {
    setLines(
      (data.lines || []).map((l: any) => ({
        id: l.id,
        prestation: l.prestation || '',
        description: l.description || '',
        quantity: l.quantity,
        unitPrice: l.unitPrice,
        order: l.order,
      }))
    )
    setValidUntil(data.validUntil ? new Date(data.validUntil).toISOString().slice(0, 10) : '')
    setConditions(data.conditions || '')
    setNotes(data.notes || '')
  }

  function addLine() {
    setLines([
      ...lines,
      { prestation: '', description: '', quantity: 1, unitPrice: 0, order: lines.length + 1 },
    ])
  }

  function updateLine(index: number, field: keyof QuoteLine, value: string | number) {
    const updated = [...lines]
    updated[index] = { ...updated[index], [field]: value }
    setLines(updated)
  }

  function removeLine(index: number) {
    setLines(lines.filter((_, i) => i !== index))
  }

  const grandTotal = lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0)

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch(`/api/quotes/${quoteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          validUntil: validUntil || null,
          conditions,
          notes,
          lines: lines.map((l, i) => ({
            prestation: l.prestation,
            description: l.description,
            quantity: l.quantity,
            unitPrice: l.unitPrice,
            order: i + 1,
          })),
        }),
      })
      if (res.ok) {
        const updated = await res.json()
        setQuote(updated)
        populateEditFields(updated)
        setEditing(false)
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleStatusChange(newStatus: string) {
    const res = await fetch(`/api/quotes/${quoteId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) {
      const updated = await res.json()
      setQuote(updated)
    }
  }

  async function handleGenerateInvoice() {
    const res = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quoteId }),
    })
    if (res.ok) {
      const data = await res.json()
      router.push(`/dashboard/events/${id}/invoices/${data.id}`)
    }
  }

  async function handleDelete() {
    if (!confirm('Supprimer ce devis ? Cette action est irreversible.')) return
    const res = await fetch(`/api/quotes/${quoteId}`, { method: 'DELETE' })
    if (res.ok) {
      router.push(`/dashboard/events/${id}/quotes`)
    }
  }

  function cancelEdit() {
    if (quote) populateEditFields(quote)
    setEditing(false)
  }

  if (loading) {
    return <div className="animate-pulse h-96 bg-[#E8E0D5] rounded-lg" />
  }

  if (!quote) return null

  const viewTotal = (quote.lines || []).reduce(
    (sum: number, l: any) => sum + l.quantity * l.unitPrice,
    0
  )

  // ----- EDIT MODE -----
  if (editing) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={cancelEdit} className="text-[#C4B8A8] hover:text-[#0A0A0A]">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-serif text-2xl text-[#0A0A0A]">
              Modifier {quote.quoteNumber}
            </h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={cancelEdit} className="gap-1">
              <X className="h-4 w-4" /> Annuler
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#0A0A0A] text-white gap-1"
            >
              <Save className="h-4 w-4" /> {saving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </div>

        {/* Lines */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Lignes du devis</CardTitle>
            <Button variant="outline" size="sm" onClick={addLine} className="gap-1">
              <Plus className="h-4 w-4" /> Ajouter une ligne
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {lines.length === 0 ? (
              <div className="text-center py-8 text-[#C4B8A8]">
                Aucune ligne. Cliquez sur &quot;Ajouter une ligne&quot; pour commencer.
              </div>
            ) : (
              lines.map((line, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-3 items-end border-b border-[#E8E0D5] pb-4"
                >
                  <div className="col-span-3 space-y-1">
                    <Label className="text-xs">Prestation</Label>
                    <Input
                      value={line.prestation}
                      onChange={(e) => updateLine(index, 'prestation', e.target.value)}
                      placeholder="Nom de la prestation"
                    />
                  </div>
                  <div className="col-span-3 space-y-1">
                    <Label className="text-xs">Description</Label>
                    <Input
                      value={line.description}
                      onChange={(e) => updateLine(index, 'description', e.target.value)}
                      placeholder="Description"
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label className="text-xs">Quantite</Label>
                    <Input
                      type="number"
                      min="1"
                      value={line.quantity}
                      onChange={(e) => updateLine(index, 'quantity', parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label className="text-xs">Prix unitaire</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={line.unitPrice}
                      onChange={(e) =>
                        updateLine(index, 'unitPrice', parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                  <div className="col-span-1 text-right text-sm font-medium pt-5">
                    {formatCurrency(line.quantity * line.unitPrice)}
                  </div>
                  <div className="col-span-1 flex justify-end pt-5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLine(index)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}

            {lines.length > 0 && (
              <div className="flex justify-end pt-4 border-t-2 border-[#0A0A0A]">
                <div className="text-right">
                  <span className="text-sm text-[#C4B8A8] mr-4">Total HT</span>
                  <span className="text-xl font-bold text-[#0A0A0A]">
                    {formatCurrency(grandTotal)}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Valide jusqu&apos;au</Label>
              <Input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Conditions</Label>
              <Textarea
                value={conditions}
                onChange={(e) => setConditions(e.target.value)}
                rows={3}
                placeholder="Conditions de paiement, modalites..."
              />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Notes internes..."
              />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ----- VIEW MODE -----
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/events/${id}/quotes`}
            className="text-[#C4B8A8] hover:text-[#0A0A0A]"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-serif text-2xl text-[#0A0A0A]">{quote.quoteNumber}</h1>
          <Badge
            className={QUOTE_STATUS_COLORS[quote.status] || 'bg-gray-100 text-gray-800'}
          >
            {QUOTE_STATUSES[quote.status] || quote.status}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="gap-1">
            <Edit className="h-4 w-4" /> Modifier
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadQuotePDF(quote)}
            className="gap-1"
          >
            <Download className="h-4 w-4" /> Telecharger PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="text-red-500 border-red-200 hover:bg-red-50 gap-1"
          >
            <Trash2 className="h-4 w-4" /> Supprimer
          </Button>
        </div>
      </div>

      {/* Event Info Card */}
      {quote.event && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informations de l&apos;evenement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-[#C4B8A8]">Evenement</div>
                <div className="text-sm font-medium text-[#0A0A0A] mt-1">
                  {quote.event.name}
                </div>
              </div>
              {quote.event.client && (
                <div>
                  <div className="text-xs text-[#C4B8A8]">Client</div>
                  <div className="text-sm font-medium text-[#0A0A0A] mt-1">
                    {quote.event.client.name}
                  </div>
                </div>
              )}
              <div>
                <div className="text-xs text-[#C4B8A8]">Date</div>
                <div className="text-sm mt-1">{formatDate(quote.event.date)}</div>
              </div>
              {quote.event.address && (
                <div>
                  <div className="text-xs text-[#C4B8A8]">Adresse</div>
                  <div className="text-sm mt-1">{quote.event.address}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lines Table */}
      <Card>
        <CardContent className="p-0">
          {(!quote.lines || quote.lines.length === 0) ? (
            <div className="text-center py-8 text-[#C4B8A8]">Aucune ligne dans ce devis</div>
          ) : (
            <>
              <table className="w-full">
                <thead className="bg-[#E8E0D5]/30">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-[#C4B8A8]">
                      Prestation
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-[#C4B8A8]">
                      Description
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-[#C4B8A8]">
                      Qte
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-[#C4B8A8]">
                      Prix unitaire
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-[#C4B8A8]">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {quote.lines.map((line: any) => (
                    <tr key={line.id} className="border-t border-[#E8E0D5]">
                      <td className="px-4 py-3 text-sm font-medium">{line.prestation}</td>
                      <td className="px-4 py-3 text-sm text-[#C4B8A8]">
                        {line.description || '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">{line.quantity}</td>
                      <td className="px-4 py-3 text-sm text-right">
                        {formatCurrency(line.unitPrice)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium">
                        {formatCurrency(line.quantity * line.unitPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end px-4 py-4 border-t-2 border-[#0A0A0A]">
                <div className="text-right">
                  <span className="text-sm text-[#C4B8A8] mr-4">Total HT</span>
                  <span className="text-xl font-bold text-[#0A0A0A]">
                    {formatCurrency(viewTotal)}
                  </span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Details Section */}
      {(quote.validUntil || quote.conditions || quote.notes) && (
        <Card>
          <CardContent className="p-6 space-y-4">
            {quote.validUntil && (
              <div>
                <div className="text-xs text-[#C4B8A8] mb-1">Valide jusqu&apos;au</div>
                <div className="text-sm">{formatDate(quote.validUntil)}</div>
              </div>
            )}
            {quote.conditions && (
              <div>
                <div className="text-xs text-[#C4B8A8] mb-1">Conditions</div>
                <div className="text-sm bg-[#E8E0D5]/30 rounded-lg p-3 whitespace-pre-wrap">
                  {quote.conditions}
                </div>
              </div>
            )}
            {quote.notes && (
              <div>
                <div className="text-xs text-[#C4B8A8] mb-1">Notes</div>
                <div className="text-sm bg-[#E8E0D5]/30 rounded-lg p-3 whitespace-pre-wrap">
                  {quote.notes}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Status Actions & Generate Invoice */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-3">
            {/* Status change buttons */}
            {quote.status === 'BROUILLON' && (
              <Button
                onClick={() => handleStatusChange('ENVOYE')}
                className="bg-blue-600 hover:bg-blue-700 text-white gap-1"
              >
                <FileText className="h-4 w-4" /> Marquer comme envoye
              </Button>
            )}
            {quote.status === 'ENVOYE' && (
              <>
                <Button
                  onClick={() => handleStatusChange('ACCEPTE')}
                  className="bg-green-600 hover:bg-green-700 text-white gap-1"
                >
                  Marquer comme accepte
                </Button>
                <Button
                  onClick={() => handleStatusChange('REFUSE')}
                  variant="outline"
                  className="text-red-500 border-red-200 hover:bg-red-50 gap-1"
                >
                  Marquer comme refuse
                </Button>
              </>
            )}

            {/* Generate invoice button */}
            {quote.status === 'ACCEPTE' && !quote.invoice && (
              <Button
                onClick={handleGenerateInvoice}
                className="bg-[#0A0A0A] hover:bg-[#1a1a1a] text-white gap-1"
              >
                <FileText className="h-4 w-4" /> Generer la facture
              </Button>
            )}

            {/* Link to invoice if it exists */}
            {quote.invoice && (
              <Link href={`/dashboard/events/${id}/invoices/${quote.invoice.id}`}>
                <Button variant="outline" className="gap-1">
                  <FileText className="h-4 w-4" /> Voir la facture ({quote.invoice.invoiceNumber})
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
