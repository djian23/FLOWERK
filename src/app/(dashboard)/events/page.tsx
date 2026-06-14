'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Event } from '@/types'
import { EVENT_STATUSES, EVENT_STATUS_COLORS, formatDate, formatCurrency } from '@/lib/utils'
import { Plus, Search, Folder, Calendar } from 'lucide-react'

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (filterStatus) params.set('status', filterStatus)
    fetch(`/api/events?${params}`).then(r => r.json()).then(data => {
      setEvents(data)
      setLoading(false)
    })
  }, [search, filterStatus])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-[#0A0A0A]">Événements</h1>
          <p className="text-sm text-[#C4B8A8] mt-0.5">{events.length} événement{events.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/dashboard/events/new">
          <Button className="gap-2 bg-[#0A0A0A] hover:bg-[#1a1a1a]">
            <Plus className="h-4 w-4" /> Nouvel événement
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C4B8A8]" />
          <Input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="h-10 rounded-md border border-[#E8E0D5] bg-[#FAFAFA] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4B8A8]"
        >
          <option value="">Tous les statuts</option>
          {Object.entries(EVENT_STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-20 bg-[#E8E0D5] rounded-lg animate-pulse" />)}</div>
      ) : events.length === 0 ? (
        <div className="text-center py-16">
          <Folder className="h-12 w-12 text-[#E8E0D5] mx-auto mb-4" />
          <p className="text-[#C4B8A8]">Aucun événement trouvé</p>
          <Link href="/dashboard/events/new" className="mt-3 inline-block text-sm text-[#0A0A0A] underline">Créer un événement</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map(event => (
            <Link key={event.id} href={`/dashboard/events/${event.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-medium text-[#0A0A0A] truncate">{event.name}</h3>
                        <span className={`shrink-0 text-xs px-2.5 py-0.5 rounded-full font-medium ${EVENT_STATUS_COLORS[event.status] || 'bg-gray-100 text-gray-800'}`}>
                          {EVENT_STATUSES[event.status] || event.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-[#C4B8A8]">
                        {event.client && <span>Client: {event.client.name}</span>}
                        {event.type && <span>Type: {event.type}</span>}
                        {event.address && <span className="truncate">{event.address}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#C4B8A8] shrink-0">
                      <Calendar className="h-4 w-4" />
                      {formatDate(event.date)}
                    </div>
                    {event.budget && (
                      <div className="text-sm font-medium text-[#0A0A0A] shrink-0">
                        {formatCurrency(event.budget)}
                      </div>
                    )}
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
