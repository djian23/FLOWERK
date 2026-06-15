'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Store, Search } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatDate } from '@/lib/utils'

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      fetch(`/api/suppliers?search=${encodeURIComponent(search)}`)
        .then((r) => r.json())
        .then((data) => { setSuppliers(Array.isArray(data) ? data : []); setLoading(false) })
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl text-[#0A0A0A]">Fournisseurs</h2>
          <p className="text-[#C4B8A8] text-sm mt-1">{suppliers.length} fournisseur(s)</p>
        </div>
        <Link href="/dashboard/suppliers/new">
          <Button className="bg-[#0A0A0A] hover:bg-[#1a1a1a] text-white gap-2">
            <Plus className="h-4 w-4" />
            Nouveau fournisseur
          </Button>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C4B8A8]" />
        <Input
          placeholder="Rechercher un fournisseur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 border-[#E8E0D5] bg-white"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#C4B8A8]">Chargement...</div>
      ) : suppliers.length === 0 ? (
        <div className="text-center py-12">
          <Store className="h-12 w-12 text-[#E8E0D5] mx-auto mb-4" />
          <p className="text-[#C4B8A8]">Aucun fournisseur</p>
          <Link href="/dashboard/suppliers/new" className="mt-3 inline-block text-sm text-[#0A0A0A] underline">
            Ajouter le premier fournisseur
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suppliers.map((supplier) => (
            <Link key={supplier.id} href={`/dashboard/suppliers/${supplier.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer border border-[#E8E0D5]">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#E8E0D5] flex items-center justify-center">
                      <Store className="h-5 w-5 text-[#0A0A0A]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#0A0A0A]">{supplier.name}</h3>
                      <div className="text-xs text-[#C4B8A8]">
                        {supplier._count?.freshFlowers || 0} commande(s)
                      </div>
                    </div>
                  </div>
                  {supplier.specialty && <div className="text-xs font-medium text-[#C4B8A8] mb-1">{supplier.specialty}</div>}
                  {supplier.phone && <div className="text-sm text-[#C4B8A8]">{supplier.phone}</div>}
                  {supplier.email && <div className="text-sm text-[#C4B8A8] truncate">{supplier.email}</div>}
                  <div className="text-xs text-[#C4B8A8] mt-2">Créé le {formatDate(supplier.createdAt)}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
