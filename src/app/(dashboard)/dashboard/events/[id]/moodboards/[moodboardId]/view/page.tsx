'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, Edit, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { downloadMoodboardPDF } from '@/lib/pdf-utils'

export default function MoodboardViewPage() {
  const { id, moodboardId } = useParams<{ id: string; moodboardId: string }>()
  const [moodboard, setMoodboard] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/moodboards/${moodboardId}`)
      .then(r => r.json())
      .then(data => { setMoodboard(data); setLoading(false) })
  }, [moodboardId])

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  async function handlePrint() {
    window.print()
  }

  async function handleDownloadPDF() {
    if (!moodboard) return
    await downloadMoodboardPDF(moodboard)
  }

  if (loading) return <div className="text-center py-12 text-[#C4B8A8]">Chargement...</div>
  if (!moodboard) return null

  const items = moodboard.items || []
  const clientName = moodboard.event?.client?.name
  const eventDate = moodboard.event?.date

  return (
    <>
      {/* Action bar — hidden on print */}
      <div className="print:hidden flex items-center justify-between mb-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/events/${id}/moodboards/${moodboardId}`}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Modifier
            </Button>
          </Link>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1">
            <Printer className="h-4 w-4" /> Imprimer
          </Button>
          <Button size="sm" onClick={handleDownloadPDF} className="bg-[#0A0A0A] text-white gap-1">
            <Download className="h-4 w-4" /> PDF
          </Button>
          <Link href={`/dashboard/events/${id}/moodboards/${moodboardId}`}>
            <Button variant="outline" size="sm" className="gap-1">
              <Edit className="h-4 w-4" /> Modifier
            </Button>
          </Link>
        </div>
      </div>

      {/* Presentable moodboard */}
      <div className="max-w-4xl mx-auto bg-white print:shadow-none shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[#0A0A0A] text-white px-8 py-10 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img src="/logo.jpeg" alt="Flower K" className="h-16 w-16 rounded-sm object-contain" />
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-wide">{moodboard.title}</h1>
          <div className="flex items-center justify-center gap-6 mt-4 text-white/70 text-sm">
            {clientName && <span>Client : {clientName}</span>}
            {eventDate && <span>{formatDate(eventDate)}</span>}
            {moodboard.event?.name && <span>{moodboard.event.name}</span>}
          </div>
          {moodboard.notes && (
            <p className="mt-4 text-white/60 text-sm max-w-xl mx-auto italic">{moodboard.notes}</p>
          )}
        </div>

        {/* Photos grid */}
        <div className="p-8">
          {items.length === 0 ? (
            <div className="text-center py-16 text-[#C4B8A8]">Aucune photo dans ce moodboard</div>
          ) : (
            <div className="space-y-10">
              {items.map((item: any, i: number) => (
                <div key={item.id} className="break-inside-avoid">
                  <div className="rounded-lg overflow-hidden shadow-md">
                    <img
                      src={item.url}
                      alt={item.title || ''}
                      className="w-full max-h-[500px] object-cover"
                    />
                  </div>
                  {(item.title || item.description) && (
                    <div className="mt-3 px-2">
                      {item.title && (
                        <h3 className="font-bold text-lg text-[#0A0A0A]">{item.title}</h3>
                      )}
                      {item.description && (
                        <p className="text-[#C4B8A8] mt-1">{item.description}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#E8E0D5] px-8 py-6 text-center text-sm text-[#C4B8A8]">
          <p className="font-semibold text-[#0A0A0A]">Flower K</p>
          <p>127, avenue de Gravelle — 94410 Saint-Maurice</p>
          <p className="mt-1 text-xs">Ce moodboard est un document de travail pour discussion avec le client</p>
        </div>
      </div>
    </>
  )
}
