'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Receipt, Calendar, User, Eye, Trash2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate, formatCurrency, INVOICE_STATUSES, INVOICE_STATUS_COLORS } from '@/lib/utils'
import { downloadInvoicePDF } from '@/lib/pdf-utils'

export default function AllInvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/invoices')
      .then(r => r.json())
      .then(data => { setInvoices(Array.isArray(data) ? data : []); setLoading(false) })
  }, [])

  async function handleDelete(invoiceId: string) {
    if (!confirm('Supprimer cette facture ?')) return
    await fetch(`/api/invoices/${invoiceId}`, { method: 'DELETE' })
    setInvoices(invoices.filter(i => i.id !== invoiceId))
  }

  async function handleDownloadPDF(invoice: any) {
    const res = await fetch(`/api/invoices/${invoice.id}`)
    const fullInvoice = await res.json()
    await downloadInvoicePDF(fullInvoice)
  }

  if (loading) return <div className="text-center py-12 text-[#C4B8A8]">Chargement...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl text-[#0A0A0A]">Toutes les factures</h2>
      </div>

      {invoices.length === 0 ? (
        <div className="text-center py-16 text-[#C4B8A8]">
          <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-semibold">Aucune facture</p>
          <p className="mt-1">Les factures se créent à partir d&apos;un devis validé</p>
          <Link href="/dashboard/quotes">
            <Button variant="outline" className="mt-4">Voir les devis</Button>
          </Link>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-[#E8E0D5]/30">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-bold text-[#C4B8A8]">N° Facture</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-[#C4B8A8]">Client</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-[#C4B8A8]">Événement</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-[#C4B8A8]">Total HT</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-[#C4B8A8]">Statut</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-[#C4B8A8]">Émission</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-[#C4B8A8]">Échéance</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-[#C4B8A8]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice: any) => (
                  <tr key={invoice.id} className="border-t border-[#E8E0D5] hover:bg-[#E8E0D5]/10">
                    <td className="px-4 py-3 text-sm font-bold">{invoice.invoiceNumber}</td>
                    <td className="px-4 py-3 text-sm font-medium">{invoice.clientName}</td>
                    <td className="px-4 py-3 text-sm">
                      {invoice.event ? (
                        <Link href={`/dashboard/events/${invoice.eventId}`} className="hover:underline">
                          {invoice.event.name}
                        </Link>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-right">{formatCurrency(invoice.totalHT)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-1 rounded-full font-bold ${INVOICE_STATUS_COLORS[invoice.status] || 'bg-gray-100 text-gray-800'}`}>
                        {INVOICE_STATUSES[invoice.status] || invoice.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#C4B8A8]">{formatDate(invoice.issuedDate)}</td>
                    <td className="px-4 py-3 text-sm text-[#C4B8A8]">{invoice.dueDate ? formatDate(invoice.dueDate) : '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Link href={`/dashboard/events/${invoice.eventId}/invoices/${invoice.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDownloadPDF(invoice)} title="Télécharger PDF">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:text-red-600" onClick={() => handleDelete(invoice.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
