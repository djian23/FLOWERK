import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const [events, quotes, invoices, clients, stockItems, reservations] = await Promise.all([
      prisma.event.findMany({ include: { costs: true, client: true, venue: true } }),
      prisma.quote.findMany({ include: { lines: true } }),
      prisma.invoice.findMany(),
      prisma.client.findMany(),
      prisma.stockItem.findMany(),
      prisma.reservation.findMany({ include: { stockItem: true } }),
    ])

    // --- Key metrics ---
    const totalClients = clients.length
    const totalEvents = events.length
    const totalStockItems = stockItems.length

    // Revenue from invoices (paid or all issued)
    const paidInvoices = invoices.filter(i => i.status === 'PAYEE')
    const totalRevenuePaid = paidInvoices.reduce((sum, i) => sum + i.totalHT, 0)
    const totalRevenueAll = invoices.reduce((sum, i) => sum + i.totalHT, 0)

    // Quotes stats
    const totalQuotes = quotes.length
    const acceptedQuotes = quotes.filter(q => q.status === 'ACCEPTE').length
    const pendingQuotes = quotes.filter(q => q.status === 'BROUILLON' || q.status === 'ENVOYE').length
    const totalQuotesValue = quotes.reduce((sum, q) => sum + q.totalHT, 0)

    // --- Events by type ---
    const typeMap: Record<string, number> = {}
    events.forEach((e) => {
      const t = e.type || 'Non défini'
      typeMap[t] = (typeMap[t] || 0) + 1
    })
    const eventsByType = Object.entries(typeMap)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)

    // --- Events by month ---
    const monthMap: Record<string, number> = {}
    events.forEach((e) => {
      const month = new Date(e.date).toISOString().slice(0, 7)
      monthMap[month] = (monthMap[month] || 0) + 1
    })
    const eventsByMonth = Object.entries(monthMap)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month))

    // --- Revenue by month (from invoices) ---
    const revenueMap: Record<string, number> = {}
    invoices.forEach((inv) => {
      const month = new Date(inv.issuedDate).toISOString().slice(0, 7)
      revenueMap[month] = (revenueMap[month] || 0) + inv.totalHT
    })
    const revenueByMonth = Object.entries(revenueMap)
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => a.month.localeCompare(b.month))

    // --- Top events by revenue (from invoices) ---
    const eventRevenueMap: Record<string, { name: string; revenue: number }> = {}
    invoices.forEach((inv) => {
      const evt = events.find(e => e.id === inv.eventId)
      if (evt) {
        if (!eventRevenueMap[evt.id]) eventRevenueMap[evt.id] = { name: evt.name, revenue: 0 }
        eventRevenueMap[evt.id].revenue += inv.totalHT
      }
    })
    const topRevenueEvents = Object.entries(eventRevenueMap)
      .map(([id, { name, revenue }]) => ({ id, name, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    // --- Top margin events (from costs) ---
    const eventsWithMargin = events
      .filter((e) => e.costs && e.costs.invoicedPrice > 0)
      .map((e) => {
        const totalCost = (e.costs!.flowers || 0) + (e.costs!.freshFlowersCost || 0) +
          (e.costs!.materials || 0) + (e.costs!.labor || 0) +
          (e.costs!.delivery || 0) + (e.costs!.subcontracting || 0) + (e.costs!.misc || 0)
        const margin = ((e.costs!.invoicedPrice - totalCost) / e.costs!.invoicedPrice) * 100
        return { id: e.id, name: e.name, margin: Math.round(margin * 10) / 10, invoicedPrice: e.costs!.invoicedPrice }
      })
      .sort((a, b) => b.margin - a.margin)
      .slice(0, 5)

    // --- Most used stock ---
    const stockMap: Record<string, { name: string; count: number }> = {}
    reservations.forEach((r) => {
      const name = r.stockItem?.name || r.stockItemId
      if (!stockMap[r.stockItemId]) stockMap[r.stockItemId] = { name, count: 0 }
      stockMap[r.stockItemId].count += r.quantity
    })
    const mostUsedStock = Object.entries(stockMap)
      .map(([id, { name, count }]) => ({ id, name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // --- Avg margin by type ---
    const typeMarginMap: Record<string, { total: number; count: number }> = {}
    eventsWithMargin.forEach((e) => {
      const event = events.find((ev) => ev.id === e.id)
      const t = event?.type || 'Non défini'
      if (!typeMarginMap[t]) typeMarginMap[t] = { total: 0, count: 0 }
      typeMarginMap[t].total += e.margin
      typeMarginMap[t].count += 1
    })
    const avgMarginByType = Object.entries(typeMarginMap).map(([type, { total, count }]) => ({
      type,
      avgMargin: Math.round((total / count) * 10) / 10,
    }))

    // --- Event status breakdown ---
    const statusMap: Record<string, number> = {}
    events.forEach((e) => {
      statusMap[e.status] = (statusMap[e.status] || 0) + 1
    })
    const eventsByStatus = Object.entries(statusMap)
      .map(([status, count]) => ({ status, count }))

    return NextResponse.json({
      totalClients,
      totalEvents,
      totalStockItems,
      totalQuotes,
      acceptedQuotes,
      pendingQuotes,
      totalQuotesValue,
      totalRevenuePaid,
      totalRevenueAll,
      eventsByType,
      eventsByMonth,
      revenueByMonth,
      topRevenueEvents,
      topMarginEvents: eventsWithMargin,
      mostUsedStock,
      avgMarginByType,
      eventsByStatus,
    })
  } catch (error) {
    console.error('GET /api/analytics error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
