import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Package, Users, Truck, TrendingUp, Clock } from 'lucide-react'
import Link from 'next/link'
import { formatDate, formatCurrency, EVENT_STATUSES, EVENT_STATUS_COLORS } from '@/lib/utils'

export default async function DashboardPage() {
  const [
    totalEvents,
    totalClients,
    totalStockItems,
    totalTransporters,
    upcomingEvents,
    recentEvents,
    financialData,
  ] = await Promise.all([
    prisma.event.count(),
    prisma.client.count(),
    prisma.stockItem.count(),
    prisma.transporter.count(),
    prisma.event.findMany({
      where: {
        date: { gte: new Date() },
        status: { not: 'CLOTURE' },
      },
      orderBy: { date: 'asc' },
      take: 5,
      include: { client: true },
    }),
    prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { client: true },
    }),
    prisma.eventCost.findMany({
      include: { event: true },
    }),
  ])

  const totalRevenue = financialData.reduce((sum, cost) => sum + cost.invoicedPrice, 0)
  const totalCosts = financialData.reduce(
    (sum, cost) =>
      sum + cost.flowers + cost.materials + cost.labor + cost.delivery + cost.subcontracting + cost.misc,
    0
  )

  const stats = [
    {
      label: 'Événements totaux',
      value: totalEvents,
      icon: Calendar,
      href: '/dashboard/events',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Clients',
      value: totalClients,
      icon: Users,
      href: '/dashboard/clients',
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Articles en stock',
      value: totalStockItems,
      icon: Package,
      href: '/dashboard/stock',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Transporteurs',
      value: totalTransporters,
      icon: Truck,
      href: '/dashboard/transporters',
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-3xl text-[#0A0A0A] mb-1">Bienvenue</h2>
        <p className="text-[#C4B8A8] text-sm">Voici un aperçu de votre activité</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg ${stat.bg}`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-[#0A0A0A] mb-1">{stat.value}</div>
                  <div className="text-sm text-[#C4B8A8]">{stat.label}</div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#E8E0D5] rounded-lg">
                <TrendingUp className="h-5 w-5 text-[#0A0A0A]" />
              </div>
              <span className="text-sm font-medium text-[#C4B8A8]">Chiffre d&apos;affaires total</span>
            </div>
            <div className="text-2xl font-bold text-[#0A0A0A]">{formatCurrency(totalRevenue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-red-500" />
              </div>
              <span className="text-sm font-medium text-[#C4B8A8]">Coûts totaux</span>
            </div>
            <div className="text-2xl font-bold text-[#0A0A0A]">{formatCurrency(totalCosts)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <span className="text-sm font-medium text-[#C4B8A8]">Marge brute</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue - totalCosts)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Prochains événements</CardTitle>
            <Link href="/dashboard/events" className="text-sm text-[#C4B8A8] hover:text-[#0A0A0A] transition-colors">
              Voir tout
            </Link>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-[#C4B8A8] py-4 text-center">Aucun événement à venir</p>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <Link key={event.id} href={`/dashboard/events/${event.id}`}>
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[#E8E0D5]/30 transition-colors">
                      <div>
                        <div className="text-sm font-medium text-[#0A0A0A]">{event.name}</div>
                        <div className="text-xs text-[#C4B8A8] mt-0.5">
                          {event.client?.name} • {formatDate(event.date)}
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          EVENT_STATUS_COLORS[event.status] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {EVENT_STATUSES[event.status] || event.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Événements récents</CardTitle>
            <div className="flex items-center gap-1 text-xs text-[#C4B8A8]">
              <Clock className="h-3 w-3" />
              Derniers créés
            </div>
          </CardHeader>
          <CardContent>
            {recentEvents.length === 0 ? (
              <p className="text-sm text-[#C4B8A8] py-4 text-center">Aucun événement</p>
            ) : (
              <div className="space-y-3">
                {recentEvents.map((event) => (
                  <Link key={event.id} href={`/dashboard/events/${event.id}`}>
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[#E8E0D5]/30 transition-colors">
                      <div>
                        <div className="text-sm font-medium text-[#0A0A0A]">{event.name}</div>
                        <div className="text-xs text-[#C4B8A8] mt-0.5">
                          {event.client?.name} • {event.budget ? formatCurrency(event.budget) : 'Budget non défini'}
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          EVENT_STATUS_COLORS[event.status] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {EVENT_STATUSES[event.status] || event.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
