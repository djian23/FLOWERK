'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, ClipboardList, Calendar, User, Eye, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatCurrency, QUOTE_STATUSES, QUOTE_STATUS_COLORS } from '@/lib/utils'

export default function AllQuotesPage() {
  const [quotes, setQuotes] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/quotes').then(r => r.json()),
      fetch('/api/events').then(r => r.json()),
    ]).then(([q, e]) => {
      setQuotes(Array.isArray(q) ? q : [])
      setEvents(Array.isArray(e) ? e : [])
      setLoading(false)
    })
  }, [])

  async function handleDelete(quoteId: string) {
    if (!confirm('Supprimer ce devis ?')) return
    await fetch(`/api/quotes/${quoteId}`, { method: 'DELETE' })
    setQuotes(quotes.filter(q => q.id !== quoteId))
  }

  if (loading) return <div className="text-center py-12 text-[#C4B8A8]">Chargement...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl text-[#0A0A0A]">Tous les devis</h2>
      </div>

      {quotes.length === 0 ? (
        <div className="text-center py-16 text-[#C4B8A8]">
          <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-semibold">Aucun devis</p>
          <p className="mt-1">Les devis se créent depuis la page d&apos;un événement</p>
          {events.length > 0 && (
            <div className="mt-4">
              <p className="text-sm mb-2">Créer un devis pour :</p>
              <div className="flex flex-wrap justify-center gap-2">
                {events.slice(0, 6).map((ev: any) => (
                  <Link key={ev.id} href={`/dashboard/events/${ev.id}/quotes/new`}>
                    <Button variant="outline" size="sm">{ev.name}</Button>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {/* Quick create links */}
          {events.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <p className="text-sm font-semibold mb-2">Créer un devis pour :</p>
                <div className="flex flex-wrap gap-2">
                  {events.map((ev: any) => (
                    <Link key={ev.id} href={`/dashboard/events/${ev.id}/quotes/new`}>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Plus className="h-3 w-3" /> {ev.name}
                      </Button>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quotes list */}
          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="bg-[#E8E0D5]/30">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-bold text-[#C4B8A8]">N° Devis</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-[#C4B8A8]">Événement</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-[#C4B8A8]">Client</th>
                    <th className="text-right px-4 py-3 text-xs font-bold text-[#C4B8A8]">Total HT</th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-[#C4B8A8]">Statut</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-[#C4B8A8]">Date</th>
                    <th className="text-right px-4 py-3 text-xs font-bold text-[#C4B8A8]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quotes.map((quote: any) => (
                    <tr key={quote.id} className="border-t border-[#E8E0D5] hover:bg-[#E8E0D5]/10">
                      <td className="px-4 py-3 text-sm font-bold">{quote.quoteNumber}</td>
                      <td className="px-4 py-3 text-sm">
                        {quote.event ? (
                          <Link href={`/dashboard/events/${quote.eventId}`} className="hover:underline font-medium">
                            {quote.event.name}
                          </Link>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#C4B8A8]">
                        {quote.event?.client?.name || '—'}
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-right">{formatCurrency(quote.totalHT)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${QUOTE_STATUS_COLORS[quote.status] || 'bg-gray-100 text-gray-800'}`}>
                          {QUOTE_STATUSES[quote.status] || quote.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#C4B8A8]">{formatDate(quote.createdAt)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Link href={`/dashboard/events/${quote.eventId}/quotes/${quote.id}`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:text-red-600" onClick={() => handleDelete(quote.id)}>
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
        </div>
      )}
    </div>
  )
}
