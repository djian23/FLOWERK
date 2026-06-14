'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Search, Calendar, Filter } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Event } from '@/types'
import { formatDate, formatCurrency, EVENT_STATUSES, EVENT_STATUS_COLORS } from '@/lib/utils'

const STATUS_OPTIONS = [
  { value: '', label: 'Tous les statuts' },
  { value: 'DEVIS_EN_COURS', label: 'Devis en cours' },
  { value: 'EN_ATTENTE_VALIDATION', label: 'En attente de validation' },
  { value: 'CONFIRME', label: 'Confirmé' },
  { value: 'PREPARATION_EN_COURS', label: 'Préparation en cours' },
  { value: 'PRET_A_PARTIR', label: 'Prêt à partir' },
  { value: 'ENLEVE_TRANSPORTEUR', label: 'Enlevé par transporteur' },
  { value: 'EN_ROUTE', label: 'En route' },
  { value: 'INSTALLE', label: 'Installé' },
  { value: 'EVENEMENT_TERMINE', label: 'Événement terminé' },
  { value: 'RETOUR_PREVU', label: 'Retour prévu' },
  { value: 'RETOUR_EN_COURS', label: 'Retour en cours' },
  { value: 'VERIFICATION_MATERIEL', label: 'Vérification du matériel' },
  { value: 'CLOTURE', label: 'Clôturé' },
]

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (statusFilter) params.set('status', statusFilter)
    const res = await fetch(`/api/events?${params}`)
    const data = await res.json()
    setEvents(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [search, statusFilter])

  useEffect(() => {
    const timer = setTimeout(fetchEvents, 300)
    return () => clearTimeout(timer)
  }, [fetchEvents])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl text-[#0A0A0A]">Événements</h2>
          <p className="text-[#C4B8A8] text-sm mt-1">{events.length} événement(s)</p>
        </div>
        <Link href="/dashboard/events/new">
          <Button className="bg-[#0A0A0A] hover:bg-[#1a1a1a] text-white gap-2">
            <Plus className="h-4 w-4" />
            Nouvel événement
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C4B8A8]" />
          <Input
            placeholder="Rechercher un événement..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-[#E8E0D5] rounded-md text-sm bg-[#FAFAFA] focus:outline-none focus:ring-2 focus:ring-[#C4B8A8]"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Events List */}
      {loading ? (
        <div className="text-center py-12 text-[#C4B8A8]">Chargement...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-[#E8E0D5] mx-auto mb-4" />
          <p className="text-[#C4B8A8]">Aucun événement trouvé</p>
          <Link href="/dashboard/events/new" className="mt-3 inline-block text-sm text-[#0A0A0A] underline">
            Créer le premier événement
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <Link key={event.id} href={`/dashboard/events/${event.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-medium text-[#0A0A0A] truncate">{event.name}</h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${
                            EVENT_STATUS_COLORS[event.status] || 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {EVENT_STATUSES[event.status] || event.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#C4B8A8]">
                        {event.client && <span>{event.client.name}</span>}
                        <span>{formatDate(event.date)}</span>
                        {event.address && <span className="truncate">{event.address}</span>}
                        {event.budget && <span className="text-[#0A0A0A] font-medium">{formatCurrency(event.budget)}</span>}
                      </div>
                    </div>
                    {event._count && (
                      <div className="flex items-center gap-2 ml-4">
                        {event._count.reservations > 0 && (
                          <Badge variant="secondary">{event._count.reservations} résa.</Badge>
                        )}
                        {event._count.documents > 0 && (
                          <Badge variant="outline">{event._count.documents} docs</Badge>
                        )}
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
