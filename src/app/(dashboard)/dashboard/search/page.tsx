'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Search, Calendar, Users, Package } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Event, Client, StockItem } from '@/types'
import { formatDate, formatCurrency, EVENT_STATUSES, EVENT_STATUS_COLORS, STOCK_CONDITIONS } from '@/lib/utils'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ events: Event[]; clients: Client[]; stock: StockItem[] } | null>(null)
  const [loading, setLoading] = useState(false)

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) { setResults(null); return }
    setLoading(true)
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
    const data = await res.json()
    setResults(data)
    setLoading(false)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value
    setQuery(q)
    const timer = setTimeout(() => doSearch(q), 300)
    return () => clearTimeout(timer)
  }

  const totalResults = results ? results.events.length + results.clients.length + results.stock.length : 0

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="font-serif text-3xl text-[#0A0A0A]">Recherche</h2>
        <p className="text-[#C4B8A8] text-sm mt-1">Recherche globale dans tous les événements, clients et articles</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#C4B8A8]" />
        <Input
          placeholder="Rechercher..."
          value={query}
          onChange={handleChange}
          className="pl-12 h-12 text-base"
          autoFocus
        />
      </div>

      {query.length > 0 && query.length < 2 && (
        <p className="text-sm text-[#C4B8A8] text-center">Entrez au moins 2 caractères...</p>
      )}

      {loading && (
        <div className="text-center py-6 text-[#C4B8A8]">Recherche en cours...</div>
      )}

      {results && !loading && (
        <>
          <p className="text-sm text-[#C4B8A8]">
            {totalResults === 0 ? 'Aucun résultat trouvé' : `${totalResults} résultat(s) pour "${query}"`}
          </p>

          {/* Events */}
          {results.events.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Événements ({results.events.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-[#E8E0D5]">
                  {results.events.map((event) => (
                    <Link key={event.id} href={`/dashboard/events/${event.id}`}>
                      <div className="flex items-center justify-between px-4 py-3 hover:bg-[#E8E0D5]/20 transition-colors">
                        <div>
                          <div className="text-sm font-medium text-[#0A0A0A]">{event.name}</div>
                          <div className="text-xs text-[#C4B8A8] mt-0.5">
                            {event.client?.name}
                            {event.date && ` • ${formatDate(event.date)}`}
                            {event.budget && ` • ${formatCurrency(event.budget)}`}
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${EVENT_STATUS_COLORS[event.status] || 'bg-gray-100 text-gray-800'}`}>
                          {EVENT_STATUSES[event.status] || event.status}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Clients */}
          {results.clients.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Clients ({results.clients.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-[#E8E0D5]">
                  {results.clients.map((client) => (
                    <Link key={client.id} href={`/dashboard/clients/${client.id}`}>
                      <div className="flex items-center gap-3 px-4 py-3 hover:bg-[#E8E0D5]/20 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-[#E8E0D5] flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold">{client.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-[#0A0A0A]">{client.name}</div>
                          <div className="text-xs text-[#C4B8A8]">
                            {[client.email, client.phone].filter(Boolean).join(' • ')}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stock */}
          {results.stock.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Stock ({results.stock.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-[#E8E0D5]">
                  {results.stock.map((item) => (
                    <Link key={item.id} href={`/dashboard/stock/${item.id}`}>
                      <div className="flex items-center justify-between px-4 py-3 hover:bg-[#E8E0D5]/20 transition-colors">
                        <div>
                          <div className="text-sm font-medium text-[#0A0A0A]">{item.name}</div>
                          <div className="text-xs text-[#C4B8A8] mt-0.5">
                            {item.category?.name}
                            {item.color && ` • ${item.color}`}
                            {item.purchasePrice && ` • ${formatCurrency(item.purchasePrice)}/unité`}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{item.totalQuantity} unité(s)</Badge>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            item.condition === 'BON_ETAT' ? 'bg-green-100 text-green-800' :
                            item.condition === 'A_REPARER' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {STOCK_CONDITIONS[item.condition] || item.condition}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {totalResults === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-[#E8E0D5] mx-auto mb-4" />
              <p className="text-[#C4B8A8]">Aucun résultat pour &quot;{query}&quot;</p>
              <p className="text-xs text-[#C4B8A8] mt-1">Essayez avec d&apos;autres mots-clés</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
