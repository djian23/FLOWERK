'use client'

import { useState, useEffect } from 'react'
import { BarChart2, TrendingUp, Calendar, Award, Users, Package, ClipboardList, Receipt } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, EVENT_STATUSES, EVENT_STATUS_COLORS } from '@/lib/utils'

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analytics')
      .then((r) => r.json())
      .then((d) => { setData(d && !d.error ? d : null); setLoading(false) })
  }, [])

  if (loading) return <div className="text-center py-12 text-[#C4B8A8]">Chargement des analytiques...</div>
  if (!data) return <div className="text-center py-12 text-[#C4B8A8]">Erreur de chargement</div>

  const currentYear = new Date().getFullYear()
  const thisYearEvents = (data.eventsByMonth || [])
    .filter((m: any) => m.month.startsWith(String(currentYear)))
    .reduce((sum: number, m: any) => sum + m.count, 0)

  const maxRevenue = (data.revenueByMonth || []).length > 0 ? Math.max(...data.revenueByMonth.map((m: any) => m.revenue)) : 1
  const maxEventCount = (data.eventsByType || []).length > 0 ? Math.max(...data.eventsByType.map((t: any) => t.count)) : 1

  function formatMonthLabel(month: string) {
    const [year, m] = month.split('-')
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
    return `${months[parseInt(m) - 1]} ${year}`
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-3xl text-[#0A0A0A]">Analytiques</h2>
        <p className="text-[#C4B8A8] text-sm mt-1">Vue d&apos;ensemble de votre activité</p>
      </div>

      {/* Key Metrics Row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-[#E8E0D5]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-[#C4B8A8]" />
              <div className="text-xs text-[#C4B8A8]">Événements {currentYear}</div>
            </div>
            <div className="text-2xl font-bold text-[#0A0A0A]">{thisYearEvents}</div>
            <div className="text-xs text-[#C4B8A8] mt-1">{data.totalEvents} au total</div>
          </CardContent>
        </Card>
        <Card className="border border-[#E8E0D5]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-[#C4B8A8]" />
              <div className="text-xs text-[#C4B8A8]">Clients</div>
            </div>
            <div className="text-2xl font-bold text-[#0A0A0A]">{data.totalClients}</div>
          </CardContent>
        </Card>
        <Card className="border border-[#E8E0D5]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-4 w-4 text-[#C4B8A8]" />
              <div className="text-xs text-[#C4B8A8]">Articles en stock</div>
            </div>
            <div className="text-2xl font-bold text-[#0A0A0A]">{data.totalStockItems}</div>
          </CardContent>
        </Card>
        <Card className="border border-[#E8E0D5]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <ClipboardList className="h-4 w-4 text-[#C4B8A8]" />
              <div className="text-xs text-[#C4B8A8]">Devis</div>
            </div>
            <div className="text-2xl font-bold text-[#0A0A0A]">{data.totalQuotes}</div>
            <div className="text-xs text-[#C4B8A8] mt-1">{data.acceptedQuotes} accepté(s) · {data.pendingQuotes} en cours</div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="border border-[#E8E0D5]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-[#C4B8A8]" />
              <div className="text-xs text-[#C4B8A8]">CA encaissé (factures payées)</div>
            </div>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(data.totalRevenuePaid)}</div>
          </CardContent>
        </Card>
        <Card className="border border-[#E8E0D5]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Receipt className="h-4 w-4 text-[#C4B8A8]" />
              <div className="text-xs text-[#C4B8A8]">CA total facturé</div>
            </div>
            <div className="text-2xl font-bold text-[#0A0A0A]">{formatCurrency(data.totalRevenueAll)}</div>
          </CardContent>
        </Card>
        <Card className="border border-[#E8E0D5]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-[#C4B8A8]" />
              <div className="text-xs text-[#C4B8A8]">Valeur totale devis</div>
            </div>
            <div className="text-2xl font-bold text-[#0A0A0A]">{formatCurrency(data.totalQuotesValue)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by month */}
      <Card className="border border-[#E8E0D5]">
        <CardHeader>
          <CardTitle>Chiffre d&apos;affaires par mois</CardTitle>
        </CardHeader>
        <CardContent>
          {(data.revenueByMonth || []).length === 0 ? (
            <div className="text-center py-8 text-[#C4B8A8]">Créez des factures pour voir le CA par mois</div>
          ) : (
            <div className="space-y-2">
              {data.revenueByMonth.slice(-12).map((m: any) => (
                <div key={m.month} className="flex items-center gap-3">
                  <div className="w-16 text-xs text-[#C4B8A8] shrink-0">{formatMonthLabel(m.month)}</div>
                  <div className="flex-1 bg-[#F5F0EA] rounded-full h-7 overflow-hidden">
                    <div
                      className="h-full bg-[#0A0A0A] rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                      style={{ width: `${Math.max(2, (m.revenue / maxRevenue) * 100)}%` }}
                    >
                      <span className="text-[10px] text-white font-medium">{formatCurrency(m.revenue)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Event status breakdown */}
      {(data.eventsByStatus || []).length > 0 && (
        <Card className="border border-[#E8E0D5]">
          <CardHeader><CardTitle>Événements par statut</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {data.eventsByStatus.map((s: any) => (
                <div key={s.status} className={`px-3 py-2 rounded-lg text-sm font-medium ${EVENT_STATUS_COLORS[s.status] || 'bg-gray-100 text-gray-800'}`}>
                  {EVENT_STATUSES[s.status] || s.status}: {s.count}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Events by type */}
        <Card className="border border-[#E8E0D5]">
          <CardHeader><CardTitle>Événements par type</CardTitle></CardHeader>
          <CardContent>
            {(data.eventsByType || []).length === 0 ? (
              <div className="text-center py-8 text-[#C4B8A8]">Aucun événement</div>
            ) : (
              <div className="space-y-2">
                {data.eventsByType.map((t: any) => (
                  <div key={t.type} className="flex items-center gap-3">
                    <div className="w-24 text-xs text-[#C4B8A8] shrink-0 truncate">{t.type}</div>
                    <div className="flex-1 bg-[#F5F0EA] rounded-full h-6 overflow-hidden">
                      <div
                        className="h-full bg-[#C4B8A8] rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${Math.max(5, (t.count / maxEventCount) * 100)}%` }}
                      >
                        <span className="text-[10px] text-white font-medium">{t.count}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top events by revenue */}
        <Card className="border border-[#E8E0D5]">
          <CardHeader><CardTitle>Top événements par CA</CardTitle></CardHeader>
          <CardContent>
            {(data.topRevenueEvents || []).length === 0 ? (
              <div className="text-center py-8 text-[#C4B8A8]">Aucune facture</div>
            ) : (
              <div className="space-y-3">
                {data.topRevenueEvents.map((e: any, i: number) => (
                  <div key={e.id} className="flex items-center justify-between py-2 border-b border-[#E8E0D5]/50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#E8E0D5] flex items-center justify-center text-xs font-bold text-[#0A0A0A]">
                        {i + 1}
                      </div>
                      <div className="text-sm font-medium text-[#0A0A0A] truncate max-w-[180px]">{e.name}</div>
                    </div>
                    <div className="text-sm font-bold text-[#0A0A0A]">{formatCurrency(e.revenue)}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Most used stock */}
        <Card className="border border-[#E8E0D5]">
          <CardHeader><CardTitle>Articles les plus réservés</CardTitle></CardHeader>
          <CardContent>
            {(data.mostUsedStock || []).length === 0 ? (
              <div className="text-center py-8 text-[#C4B8A8]">Aucune réservation de stock</div>
            ) : (
              <div className="space-y-2">
                {data.mostUsedStock.slice(0, 5).map((s: any, i: number) => (
                  <div key={s.id} className="flex items-center justify-between py-2 border-b border-[#E8E0D5]/50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#E8E0D5] flex items-center justify-center text-xs font-bold text-[#0A0A0A]">{i + 1}</div>
                      <div className="text-sm text-[#0A0A0A] truncate max-w-[180px]">{s.name}</div>
                    </div>
                    <div className="text-sm font-semibold text-[#C4B8A8]">{s.count} unités</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Avg margin by type */}
        <Card className="border border-[#E8E0D5]">
          <CardHeader><CardTitle>Marge moyenne par type</CardTitle></CardHeader>
          <CardContent>
            {(data.avgMarginByType || []).length === 0 ? (
              <div className="text-center py-8 text-[#C4B8A8]">Remplissez les coûts des événements pour voir les marges</div>
            ) : (
              <div className="space-y-2">
                {data.avgMarginByType.map((t: any) => (
                  <div key={t.type} className="flex items-center justify-between py-2 border-b border-[#E8E0D5]/50 last:border-0">
                    <div className="text-sm text-[#0A0A0A]">{t.type}</div>
                    <div className={`text-sm font-semibold ${t.avgMargin >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {t.avgMargin}%
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
