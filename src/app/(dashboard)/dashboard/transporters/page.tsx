'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Truck } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Transporter } from '@/types'
import { formatDate } from '@/lib/utils'

export default function TransportersPage() {
  const [transporters, setTransporters] = useState<Transporter[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/transporters')
      .then((r) => r.json())
      .then((data) => { setTransporters(data); setLoading(false) })
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl text-[#0A0A0A]">Transporteurs</h2>
          <p className="text-[#C4B8A8] text-sm mt-1">{transporters.length} transporteur(s)</p>
        </div>
        <Link href="/dashboard/transporters/new">
          <Button className="bg-[#0A0A0A] hover:bg-[#1a1a1a] text-white gap-2">
            <Plus className="h-4 w-4" />
            Nouveau transporteur
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#C4B8A8]">Chargement...</div>
      ) : transporters.length === 0 ? (
        <div className="text-center py-12">
          <Truck className="h-12 w-12 text-[#E8E0D5] mx-auto mb-4" />
          <p className="text-[#C4B8A8]">Aucun transporteur</p>
          <Link href="/dashboard/transporters/new" className="mt-3 inline-block text-sm text-[#0A0A0A] underline">
            Ajouter le premier transporteur
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {transporters.map((transporter) => (
            <Link key={transporter.id} href={`/dashboard/transporters/${transporter.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#E8E0D5] flex items-center justify-center">
                      <Truck className="h-5 w-5 text-[#0A0A0A]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#0A0A0A]">{transporter.name}</h3>
                      <div className="text-xs text-[#C4B8A8]">
                        {(transporter as any)._count?.logistics || 0} mission(s)
                      </div>
                    </div>
                  </div>
                  {transporter.phone && <div className="text-sm text-[#C4B8A8]">{transporter.phone}</div>}
                  {transporter.email && <div className="text-sm text-[#C4B8A8] truncate">{transporter.email}</div>}
                  <div className="text-xs text-[#C4B8A8] mt-2">Créé le {formatDate(transporter.createdAt)}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
