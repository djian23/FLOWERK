'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Building2, MapPin, Calendar, Image } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Venue {
  id: string
  name: string
  city?: string | null
  type?: string | null
  photos: { url: string }[]
  _count: { photos: number; events: number }
}

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/venues')
      .then((r) => r.json())
      .then((data) => { setVenues(Array.isArray(data) ? data : []); setLoading(false) })
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl text-[#0A0A0A]">Salles & Lieux</h2>
          <p className="text-[#C4B8A8] text-sm mt-1">{venues.length} salle(s)</p>
        </div>
        <Link href="/dashboard/venues/new">
          <Button className="bg-[#0A0A0A] hover:bg-[#1a1a1a] text-white gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle salle
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#C4B8A8]">Chargement...</div>
      ) : venues.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-[#E8E0D5] mx-auto mb-4" />
          <p className="text-[#C4B8A8]">Aucune salle</p>
          <Link href="/dashboard/venues/new" className="mt-3 inline-block text-sm text-[#0A0A0A] underline">
            Ajouter la premiere salle
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {venues.map((venue) => (
            <Link key={venue.id} href={`/dashboard/venues/${venue.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
                <div className="aspect-video bg-[#E8E0D5]/30 relative">
                  {venue.photos && venue.photos.length > 0 ? (
                    <img src={venue.photos[0].url} alt={venue.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="h-12 w-12 text-[#E8E0D5]" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-[#0A0A0A] truncate">{venue.name}</h3>
                  <div className="flex items-center gap-4 mt-2 text-xs text-[#C4B8A8]">
                    {venue.city && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {venue.city}
                      </span>
                    )}
                    {venue.type && (
                      <span>{venue.type}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-[#C4B8A8]">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {venue._count.events} evenement(s)
                    </span>
                    <span className="flex items-center gap-1">
                      <Image className="h-3 w-3" />
                      {venue._count.photos} photo(s)
                    </span>
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
