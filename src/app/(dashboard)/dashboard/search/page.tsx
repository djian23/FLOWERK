'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { EVENT_STATUSES, EVENT_STATUS_COLORS, formatDate, STOCK_CONDITIONS } from '@/lib/utils'
import { Search, Folder, Users, Package } from 'lucide-react'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ events: any[], clients: any[], stock: any[] }>({ events: [], clients: [], stock: [] })
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    if (query.length < 2) {
      setResults({ events: [], clients: [], stock: [] })
      setSearched(false)
      return
    }
    const t = setTimeout(async () => {
      setLoading(true)
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      setResults(await res.json())
      setLoading(false)
      setSearched(true)
    }, 400)
    return () => clearTimeout(t)
  }, [query])

  const total = results.events.length + results.clients.length + results.stock.length

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="font-serif text-2xl text-[#0A0A0A]">Recherche</h1>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#C4B8A8]" />
        <Input
          placeholder="Rechercher événements, clients, articles de stock..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="pl-12 h-12 text-base"
          autoFocus
        />
      </div>

      {loading && (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-[#E8E0D5] rounded-lg animate-pulse" />)}</div>
      )}

      {!loading && searched && total === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-[#E8E0D5] mx-auto mb-4" />
          <p className="text-[#C4B8A8]">Aucun résultat pour « {query} »</p>
        </div>
      )}

      {!loading && results.events.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Folder className="h-4 w-4 text-[#C4B8A8]" /> Événements ({results.events.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-[#E8E0D5]">
              {results.events.map((e: any) => (
                <li key={e.id} className="py-3">
                  <Link href={`/dashboard/events/${e.id}`} className="flex items-center justify-between group">
                    <div>
                      <p className="text-sm font-medium text-[#0A0A0A] group-hover:underline">{e.name}</p>
                      <p className="text-xs text-[#C4B8A8]">{e.client?.name || 'Sans client'} · {formatDate(e.date)}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${EVENT_STATUS_COLORS[e.status] || 'bg-gray-100'}`}>
                      {EVENT_STATUSES[e.status]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {!loading && results.clients.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-[#C4B8A8]" /> Clients ({results.clients.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-[#E8E0D5]">
              {results.clients.map((c: any) => (
                <li key={c.id} className="py-3">
                  <Link href={`/dashboard/clients/${c.id}`} className="flex items-center justify-between group">
                    <div>
                      <p className="text-sm font-medium text-[#0A0A0A] group-hover:underline">{c.name}</p>
                      <p className="text-xs text-[#C4B8A8]">{c.email || ''} {c.phone ? `· ${c.phone}` : ''}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {!loading && results.stock.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4 text-[#C4B8A8]" /> Stock ({results.stock.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-[#E8E0D5]">
              {results.stock.map((s: any) => (
                <li key={s.id} className="py-3">
                  <Link href={`/dashboard/stock/${s.id}`} className="flex items-center justify-between group">
                    <div>
                      <p className="text-sm font-medium text-[#0A0A0A] group-hover:underline">{s.name}</p>
                      <p className="text-xs text-[#C4B8A8]">{s.category?.name || ''} {s.color ? `· ${s.color}` : ''}</p>
                    </div>
                    <Badge variant="secondary">{s.totalQuantity} unités</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
