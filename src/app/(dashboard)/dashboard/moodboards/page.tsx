'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Palette, Eye, Trash2, Calendar, User, Image } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'

export default function AllMoodboardsPage() {
  const [moodboards, setMoodboards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/moodboards')
      .then(r => r.json())
      .then(data => { setMoodboards(Array.isArray(data) ? data : []); setLoading(false) })
  }, [])

  async function handleDelete(mbId: string) {
    if (!confirm('Supprimer ce moodboard ?')) return
    await fetch(`/api/moodboards/${mbId}`, { method: 'DELETE' })
    setMoodboards(moodboards.filter(m => m.id !== mbId))
  }

  if (loading) return <div className="text-center py-12 text-[#C4B8A8]">Chargement...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl text-[#0A0A0A]">Tous les moodboards</h2>
      </div>

      {moodboards.length === 0 ? (
        <div className="text-center py-16 text-[#C4B8A8]">
          <Palette className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-semibold">Aucun moodboard</p>
          <p className="mt-1">Les moodboards se créent depuis la page d&apos;un événement</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {moodboards.map((mb) => (
            <Card key={mb.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-[4/3] bg-[#E8E0D5]/30">
                {mb.items?.length > 0 ? (
                  <div className="grid grid-cols-2 grid-rows-2 h-full gap-0.5 p-0.5">
                    {mb.items.slice(0, 4).map((item: any, i: number) => (
                      <div key={item.id} className={`overflow-hidden ${mb.items.length === 1 ? 'col-span-2 row-span-2' : mb.items.length === 2 ? 'row-span-2' : mb.items.length === 3 && i === 0 ? 'row-span-2' : ''}`}>
                        <img src={item.url} alt={item.title || ''} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="h-12 w-12 text-[#C4B8A8]/50" />
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-[#0A0A0A]">{mb.title}</h3>
                <div className="flex items-center gap-3 mt-2 text-sm text-[#C4B8A8]">
                  {mb.event && (
                    <>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {mb.event.name}
                      </span>
                      {mb.event.client && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" /> {mb.event.client.name}
                        </span>
                      )}
                    </>
                  )}
                </div>
                <p className="text-xs text-[#C4B8A8] mt-1">
                  {mb.items?.length || 0} photo(s) — {formatDate(mb.createdAt)}
                </p>
                <div className="flex gap-2 mt-3">
                  {mb.event && (
                    <>
                      <Link href={`/dashboard/events/${mb.eventId}/moodboards/${mb.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">Modifier</Button>
                      </Link>
                      <Link href={`/dashboard/events/${mb.eventId}/moodboards/${mb.id}/view`} className="flex-1">
                        <Button size="sm" className="w-full bg-[#0A0A0A] text-white gap-1">
                          <Eye className="h-3 w-3" /> Présenter
                        </Button>
                      </Link>
                    </>
                  )}
                  <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-600 h-8 w-8 p-0" onClick={() => handleDelete(mb.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
