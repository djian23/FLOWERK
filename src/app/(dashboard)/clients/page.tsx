'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Client } from '@/types'
import { Plus, Search, Users, Phone, Mail } from 'lucide-react'

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    fetch(`/api/clients?${params}`).then(r => r.json()).then(data => {
      setClients(data)
      setLoading(false)
    })
  }, [search])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-[#0A0A0A]">Clients</h1>
          <p className="text-sm text-[#C4B8A8] mt-0.5">{clients.length} client{clients.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/dashboard/clients/new">
          <Button className="gap-2 bg-[#0A0A0A] hover:bg-[#1a1a1a]"><Plus className="h-4 w-4" /> Nouveau client</Button>
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C4B8A8]" />
        <Input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-[#E8E0D5] rounded-lg animate-pulse" />)}</div>
      ) : clients.length === 0 ? (
        <div className="text-center py-16">
          <Users className="h-12 w-12 text-[#E8E0D5] mx-auto mb-4" />
          <p className="text-[#C4B8A8]">Aucun client trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clients.map(client => (
            <Link key={client.id} href={`/dashboard/clients/${client.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium text-[#0A0A0A]">{client.name}</h3>
                    <Badge variant="secondary">{client._count?.events || 0} événement{(client._count?.events || 0) !== 1 ? 's' : ''}</Badge>
                  </div>
                  <div className="space-y-1.5">
                    {client.email && <div className="flex items-center gap-2 text-xs text-[#C4B8A8]"><Mail className="h-3 w-3" />{client.email}</div>}
                    {client.phone && <div className="flex items-center gap-2 text-xs text-[#C4B8A8]"><Phone className="h-3 w-3" />{client.phone}</div>}
                    {client.address && <p className="text-xs text-[#C4B8A8] truncate">{client.address}</p>}
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
