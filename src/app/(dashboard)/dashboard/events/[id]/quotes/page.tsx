'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatCurrency, QUOTE_STATUSES, QUOTE_STATUS_COLORS } from '@/lib/utils'

export default function QuotesPage() {
  const { id } = useParams<{ id: string }>()
  const [quotes, setQuotes] = useState<any[]>([])
  const [eventName, setEventName] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchQuotes = useCallback(async () => {
    const res = await fetch(`/api/quotes?eventId=${id}`)
    const data = await res.json()
    setQuotes(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [id])

  useEffect(() => {
    fetchQuotes()
    fetch(`/api/events/${id}`).then((r) => r.json()).then((d) => { if (d && !d.error) setEventName(d.name) })
  }, [fetchQuotes, id])

  if (loading) {
    return <div className="animate-pulse h-96 bg-[#E8E0D5] rounded-lg" />
  }

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
          <div>
            <h1 className="font-serif text-2xl text-[#0A0A0A]">Devis</h1>
            {eventName && <p className="text-sm text-[#C4B8A8]">{eventName}</p>}
          </div>
        </div>
        <Link href={`/dashboard/events/${id}/quotes/new`}>
          <Button className="bg-[#0A0A0A] text-white gap-2">
            <Plus className="h-4 w-4" />
            Nouveau devis
          </Button>
        </Link>
      </div>

      {quotes.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-[#E8E0D5] mx-auto mb-4" />
          <p className="text-[#C4B8A8]">Aucun devis pour cet événement</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quotes.map((quote) => (
            <Link key={quote.id} href={`/dashboard/events/${id}/quotes/${quote.id}`}>
              <Card className="hover:border-[#C4B8A8] transition-colors cursor-pointer">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#0A0A0A]">{quote.number}</span>
                    <Badge className={QUOTE_STATUS_COLORS[quote.status] || 'bg-gray-100 text-gray-800'}>
                      {QUOTE_STATUSES[quote.status] || quote.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#C4B8A8]">{formatDate(quote.createdAt)}</span>
                    <span className="font-bold text-[#0A0A0A]">{formatCurrency(quote.total)}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
