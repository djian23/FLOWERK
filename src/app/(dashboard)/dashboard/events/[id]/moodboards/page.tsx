'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Image, Eye, Calendar, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'

export default function MoodboardsListPage() {
  const { id } = useParams<{ id: string }>()
  const [event, setEvent] = useState<any>(null)
  const [moodboards, setMoodboards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`/api/events/${id}`).then(r => r.json()),
      fetch(`/api/moodboards?eventId=${id}`).then(r => r.json()),
    ]).then(([ev, mbs]) => {
      setEvent(ev)
      setMoodboards(Array.isArray(mbs) ? mbs : [])
      setLoading(false)
    })
  }, [id])

  async function handleDelete(mbId: string) {
    if (!confirm('Supprimer ce moodboard ?')) return
    await fetch(`/api/moodboards/${mbId}`, { method: 'DELETE' })
    setMoodboards(moodboards.filter(m => m.id !== mbId))
  }

  if (loading) return <div className="text-center py-12 text-[#C4B8A8]">Chargement...</div>

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/events/${id}`}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Retour
            </Button>
          </Link>
          <h2 className="font-serif text-2xl text-[#0A0A0A]">Moodboards</h2>
        </div>
        <Link href={`/dashboard/events/${id}/moodboards/new`}>
          <Button className="bg-[#0A0A0A] text-white gap-2">
            <Plus className="h-4 w-4" /> Nouveau moodboard
          </Button>
        </Link>
      </div>

      {event && (
        <Card>
          <CardContent className="p-4 flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#C4B8A8]" />
              <span className="font-semibold">{event.name}</span>
              <span className="text-[#C4B8A8]">— {formatDate(event.date)}</span>
            </div>
            {event.client && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-[#C4B8A8]" />
                <span>{event.client.name}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {moodboards.length === 0 ? (
        <div className="text-center py-16 text-[#C4B8A8]">
          <Image className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-semibold">Aucun moodboard</p>
          <p className="mt-1">Créez votre premier moodboard pour ce client</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {moodboards.map((mb) => (
            <Card key={mb.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
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
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-[#0A0A0A]">{mb.title}</h3>
                    <p className="text-sm text-[#C4B8A8] mt-1">
                      {mb.items?.length || 0} photo(s) — {formatDate(mb.createdAt)}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Link href={`/dashboard/events/${id}/moodboards/${mb.id}/view`}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Présenter">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:text-red-600" onClick={() => handleDelete(mb.id)} title="Supprimer">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Link href={`/dashboard/events/${id}/moodboards/${mb.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">Modifier</Button>
                  </Link>
                  <Link href={`/dashboard/events/${id}/moodboards/${mb.id}/view`} className="flex-1">
                    <Button size="sm" className="w-full bg-[#0A0A0A] text-white">Présenter</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
