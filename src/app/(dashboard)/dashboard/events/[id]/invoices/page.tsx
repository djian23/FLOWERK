'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatCurrency, INVOICE_STATUSES, INVOICE_STATUS_COLORS } from '@/lib/utils'

export default function EventInvoicesPage() {
  const { id } = useParams<{ id: string }>()
  const [invoices, setInvoices] = useState<any[]>([])
  const [eventName, setEventName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/invoices?eventId=${id}`)
      .then((r) => r.json())
      .then((data) => {
        setInvoices(Array.isArray(data) ? data : [])
        setLoading(false)
      })
    fetch(`/api/events/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d && !d.error) setEventName(d.name)
      })
  }, [id])

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/events/${id}`}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          </Link>
          <h1 className="font-serif text-2xl text-[#0A0A0A]">
            Factures{eventName ? ` — ${eventName}` : ''}
          </h1>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-[#E8E0D5] rounded-lg animate-pulse" />
          ))}
        </div>
      ) : invoices.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-[#E8E0D5] mx-auto mb-4" />
          <p className="text-[#C4B8A8]">
            Aucune facture pour cet événement. Les factures sont générées depuis les devis acceptés.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {invoices.map((invoice) => (
            <Link key={invoice.id} href={`/dashboard/events/${id}/invoices/${invoice.id}`}>
              <Card className="hover:border-[#C4B8A8] transition-colors cursor-pointer">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#0A0A0A]">
                      {invoice.invoiceNumber}
                    </span>
                    <Badge className={INVOICE_STATUS_COLORS[invoice.status] || 'bg-gray-100 text-gray-800'}>
                      {INVOICE_STATUSES[invoice.status] || invoice.status}
                    </Badge>
                  </div>

                  {invoice.client?.name && (
                    <p className="text-sm text-[#C4B8A8]">{invoice.client.name}</p>
                  )}

                  <div className="text-sm text-[#C4B8A8] space-y-1">
                    {invoice.issuedAt && (
                      <p>Émise le {formatDate(invoice.issuedAt)}</p>
                    )}
                    {invoice.dueDate && (
                      <p>Échéance : {formatDate(invoice.dueDate)}</p>
                    )}
                  </div>

                  <div className="text-lg font-bold text-[#0A0A0A]">
                    {formatCurrency(invoice.total ?? 0)}
                  </div>

                  {invoice.quote?.quoteNumber && (
                    <p className="text-xs text-[#C4B8A8]">
                      Devis : {invoice.quote.quoteNumber}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
