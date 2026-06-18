'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, Trash2, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatCurrency, INVOICE_STATUSES, INVOICE_STATUS_COLORS } from '@/lib/utils'
import { downloadInvoicePDF } from '@/lib/pdf-utils'

export default function InvoiceDetailPage() {
  const { id, invoiceId } = useParams<{ id: string; invoiceId: string }>()
  const router = useRouter()
  const [invoice, setInvoice] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    async function fetchInvoice() {
      try {
        const res = await fetch(`/api/invoices/${invoiceId}`)
        if (!res.ok) {
          router.push(`/dashboard/events/${id}/invoices`)
          return
        }
        const data = await res.json()
        setInvoice(data)
      } catch {
        router.push(`/dashboard/events/${id}/invoices`)
      } finally {
        setLoading(false)
      }
    }
    fetchInvoice()
  }, [invoiceId, id, router])

  async function updateStatus(status: string) {
    setUpdating(true)
    try {
      const res = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        const data = await res.json()
        setInvoice(data)
      }
    } finally {
      setUpdating(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Supprimer cette facture ? Cette action est irréversible.')) return
    setDeleting(true)
    try {
      await fetch(`/api/invoices/${invoiceId}`, { method: 'DELETE' })
      router.push(`/dashboard/events/${id}/invoices`)
    } catch {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl space-y-6">
        <div className="h-8 w-48 bg-[#E8E0D5] rounded animate-pulse" />
        <div className="h-64 bg-[#E8E0D5] rounded-lg animate-pulse" />
        <div className="h-48 bg-[#E8E0D5] rounded-lg animate-pulse" />
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-[#E8E0D5] mx-auto mb-4" />
        <p className="text-[#C4B8A8]">Facture introuvable</p>
        <Link href={`/dashboard/events/${id}/invoices`} className="text-sm text-[#C4B8A8] hover:text-[#0A0A0A] underline mt-2 inline-block">
          Retour aux factures
        </Link>
      </div>
    )
  }

  const event = invoice.event
  const client = event?.client
  const quote = invoice.quote
  const lines = quote?.lines || []
  const grandTotal = lines.reduce((sum: number, line: any) => sum + (line.quantity * line.unitPrice), 0)

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/events/${id}/invoices`}
            className="text-[#C4B8A8] hover:text-[#0A0A0A] transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl text-[#0A0A0A]">
              {invoice.invoiceNumber || 'Facture'}
            </h1>
          </div>
        </div>
        <Badge className={INVOICE_STATUS_COLORS[invoice.status] || 'bg-gray-100 text-gray-800'}>
          {INVOICE_STATUSES[invoice.status] || invoice.status}
        </Badge>
      </div>

      {/* Invoice details - 2 column grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informations de la facture</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Client info */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-[#0A0A0A] uppercase tracking-wide">Client</h3>
              {client ? (
                <div className="space-y-1 text-sm text-[#0A0A0A]">
                  <p className="font-medium">{client.name}</p>
                  {client.address && <p className="text-[#C4B8A8]">{client.address}</p>}
                  {client.email && <p className="text-[#C4B8A8]">{client.email}</p>}
                  {client.phone && <p className="text-[#C4B8A8]">{client.phone}</p>}
                </div>
              ) : (
                <p className="text-sm text-[#C4B8A8]">Aucun client associé</p>
              )}
            </div>

            {/* Right: Invoice dates */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-[#0A0A0A] uppercase tracking-wide">Dates</h3>
              <div className="space-y-2 text-sm">
                {invoice.issuedDate && (
                  <div className="flex justify-between">
                    <span className="text-[#C4B8A8]">Date d&apos;émission</span>
                    <span className="text-[#0A0A0A]">{formatDate(invoice.issuedDate)}</span>
                  </div>
                )}
                {invoice.dueDate && (
                  <div className="flex justify-between">
                    <span className="text-[#C4B8A8]">Date d&apos;échéance</span>
                    <span className="text-[#0A0A0A]">{formatDate(invoice.dueDate)}</span>
                  </div>
                )}
                {invoice.status === 'PAYEE' && invoice.paidDate && (
                  <div className="flex justify-between">
                    <span className="text-[#C4B8A8]">Date de paiement</span>
                    <span className="text-green-600 font-medium">{formatDate(invoice.paidDate)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event info card */}
      {event && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Événement associé</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-1 text-sm">
              <p className="font-medium text-[#0A0A0A]">{event.name}</p>
              {event.date && (
                <p className="text-[#C4B8A8]">{formatDate(event.date)}</p>
              )}
              {event.address && (
                <p className="text-[#C4B8A8]">{event.address}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lines table */}
      {lines.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Détail des prestations</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#E8E0D5]/30">
                    <th className="text-left px-6 py-3 font-medium text-[#0A0A0A]">Prestation</th>
                    <th className="text-left px-6 py-3 font-medium text-[#0A0A0A]">Description</th>
                    <th className="text-right px-6 py-3 font-medium text-[#0A0A0A]">Quantité</th>
                    <th className="text-right px-6 py-3 font-medium text-[#0A0A0A]">Prix unitaire (EUR)</th>
                    <th className="text-right px-6 py-3 font-medium text-[#0A0A0A]">Total (EUR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E0D5]">
                  {lines.map((line: any, index: number) => (
                    <tr key={line.id || index} className="hover:bg-[#FAFAFA] transition-colors">
                      <td className="px-6 py-3 text-[#0A0A0A]">{line.label || line.name || '-'}</td>
                      <td className="px-6 py-3 text-[#C4B8A8]">{line.description || '-'}</td>
                      <td className="px-6 py-3 text-right text-[#0A0A0A]">{line.quantity}</td>
                      <td className="px-6 py-3 text-right text-[#0A0A0A]">{formatCurrency(line.unitPrice)}</td>
                      <td className="px-6 py-3 text-right font-medium text-[#0A0A0A]">
                        {formatCurrency(line.quantity * line.unitPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-[#C4B8A8]">
                    <td colSpan={4} className="px-6 py-4 text-right font-semibold text-[#0A0A0A]">
                      Total
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-lg text-[#0A0A0A]">
                      {formatCurrency(grandTotal)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legal mention */}
      <Card className="bg-[#FAFAFA] border-[#E8E0D5]">
        <CardContent className="p-4">
          <p className="text-xs text-[#C4B8A8] text-center">
            TVA non applicable, art. 293B du CGI
          </p>
          <p className="text-xs text-[#C4B8A8] text-center mt-1">
            Flower K - SIRET: 993 329 259 00010
          </p>
        </CardContent>
      </Card>

      {/* Notes section */}
      {invoice.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notes</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-sm text-[#0A0A0A] whitespace-pre-wrap">{invoice.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status management buttons */}
        {invoice.status === 'BROUILLON' && (
          <Button
            onClick={() => updateStatus('ENVOYEE')}
            disabled={updating}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {updating ? 'Mise à jour...' : 'Marquer comme envoyée'}
          </Button>
        )}

        {invoice.status === 'ENVOYEE' && (
          <>
            <Button
              onClick={() => updateStatus('PAYEE')}
              disabled={updating}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {updating ? 'Mise à jour...' : 'Marquer comme payée'}
            </Button>
            <Button
              onClick={() => updateStatus('EN_RETARD')}
              disabled={updating}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              {updating ? 'Mise à jour...' : 'Marquer en retard'}
            </Button>
          </>
        )}

        {invoice.status === 'EN_RETARD' && (
          <Button
            onClick={() => updateStatus('PAYEE')}
            disabled={updating}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {updating ? 'Mise à jour...' : 'Marquer comme payée'}
          </Button>
        )}

        {/* Download PDF button */}
        <Button
          onClick={() => downloadInvoicePDF(invoice)}
          variant="outline"
          className="gap-2 border-[#C4B8A8] text-[#0A0A0A] hover:bg-[#E8E0D5]/30"
        >
          <Download className="h-4 w-4" />
          Télécharger PDF
        </Button>

        {/* Delete button */}
        <Button
          onClick={handleDelete}
          disabled={deleting}
          variant="outline"
          className="gap-2 border-red-300 text-red-600 hover:bg-red-50 ml-auto"
        >
          <Trash2 className="h-4 w-4" />
          {deleting ? 'Suppression...' : 'Supprimer'}
        </Button>
      </div>
    </div>
  )
}
