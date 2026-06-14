'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Transporter } from '@/types'
import { Plus, Truck, Phone, Mail } from 'lucide-react'

export default function TransportersPage() {
  const [transporters, setTransporters] = useState<Transporter[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/transporters').then(r => r.json()).then(data => {
      setTransporters(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-[#0A0A0A]">Transporteurs</h1>
          <p className="text-sm text-[#C4B8A8] mt-0.5">{transporters.length} transporteur{transporters.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/dashboard/transporters/new">
          <Button className="gap-2 bg-[#0A0A0A] hover:bg-[#1a1a1a]"><Plus className="h-4 w-4" /> Nouveau</Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-[#E8E0D5] rounded-lg animate-pulse" />)}</div>
      ) : transporters.length === 0 ? (
        <div className="text-center py-16"><Truck className="h-12 w-12 text-[#E8E0D5] mx-auto mb-4" /><p className="text-[#C4B8A8]">Aucun transporteur</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {transporters.map(t => (
            <Link key={t.id} href={`/dashboard/transporters/${t.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-5">
                  <h3 className="font-medium text-[#0A0A0A] mb-2">{t.name}</h3>
                  <div className="space-y-1">
                    {t.phone && <div className="flex items-center gap-2 text-xs text-[#C4B8A8]"><Phone className="h-3 w-3" />{t.phone}</div>}
                    {t.email && <div className="flex items-center gap-2 text-xs text-[#C4B8A8]"><Mail className="h-3 w-3" />{t.email}</div>}
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
