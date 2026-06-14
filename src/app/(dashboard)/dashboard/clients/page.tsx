'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Search, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Client } from '@/types'
import { formatDate } from '@/lib/utils'

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchClients = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    const res = await fetch(`/api/clients?${params}`)
    const data = await res.json()
    setClients(data)
    setLoading(false)
  }, [search])

  useEffect(() => {
    const timer = setTimeout(fetchClients, 300)
    return () => clearTimeout(timer)
  }, [fetchClients])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl text-[#0A0A0A]">Clients</h2>
          <p className="text-[#C4B8A8] text-sm mt-1">{clients.length} client(s)</p>
        </div>
        <Link href="/dashboard/clients/new">
          <Button className="bg-[#0A0A0A] hover:bg-[#1a1a1a] text-white gap-2">
            <Plus className="h-4 w-4" />
            Nouveau client
          </Button>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C4B8A8]" />
        <Input
          placeholder="Rechercher un client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#C4B8A8]">Chargement...</div>
      ) : clients.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-[#E8E0D5] mx-auto mb-4" />
          <p className="text-[#C4B8A8]">Aucun client trouvé</p>
          <Link href="/dashboard/clients/new" className="mt-3 inline-block text-sm text-[#0A0A0A] underline">
            Ajouter le premier client
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client) => (
            <Link key={client.id} href={`/dashboard/clients/${client.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#E8E0D5] flex items-center justify-center flex-shrink-0">
                      <span className="text-[#0A0A0A] font-semibold text-sm">
                        {client.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {client._count && (
                      <span className="text-xs text-[#C4B8A8]">{client._count.events} événement(s)</span>
                    )}
                  </div>
                  <h3 className="font-medium text-[#0A0A0A] mb-1">{client.name}</h3>
                  {client.email && <div className="text-sm text-[#C4B8A8] truncate">{client.email}</div>}
                  {client.phone && <div className="text-sm text-[#C4B8A8]">{client.phone}</div>}
                  {client.address && <div className="text-xs text-[#C4B8A8] mt-1 truncate">{client.address}</div>}
                  <div className="text-xs text-[#C4B8A8] mt-2">Créé le {formatDate(client.createdAt)}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
