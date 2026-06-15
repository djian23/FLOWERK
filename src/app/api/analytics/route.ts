import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const events = await prisma.event.findMany({
      include: {
        costs: true,
        reservations: { include: { stockItem: true } },
      },
    })

    // Events by type
    const typeMap: Record<string, number> = {}
    events.forEach((e) => {
      const t = e.type || 'Non défini'
      typeMap[t] = (typeMap[t] || 0) + 1
    })
    const eventsByType = Object.entries(typeMap).map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count)

    // Events by month
    const monthMap: Record<string, number> = {}
    events.forEach((e) => {
      const month = new Date(e.date).toISOString().slice(0, 7)
      monthMap[month] = (monthMap[month] || 0) + 1
    })
    const eventsByMonth = Object.entries(monthMap).map(([month, count]) => ({ month, count })).sort((a, b) => a.month.localeCompare(b.month))

    // Revenue by month
    const revenueMap: Record<string, number> = {}
    events.forEach((e) => {
      if (e.costs?.invoicedPrice) {
        const month = new Date(e.date).toISOString().slice(0, 7)
        revenueMap[month] = (revenueMap[month] || 0) + e.costs.invoicedPrice
      }
    })
    const revenueByMonth = Object.entries(revenueMap).map(([month, revenue]) => ({ month, revenue })).sort((a, b) => a.month.localeCompare(b.month))

    // Top margin events
    const eventsWithMargin = events
      .filter((e) => e.costs && e.costs.invoicedPrice > 0)
      .map((e) => {
        const totalCost = (e.costs!.flowers || 0) + (e.costs!.materials || 0) + (e.costs!.labor || 0) +
          (e.costs!.delivery || 0) + (e.costs!.subcontracting || 0) + (e.costs!.misc || 0)
        const margin = ((e.costs!.invoicedPrice - totalCost) / e.costs!.invoicedPrice) * 100
        return { id: e.id, name: e.name, margin: Math.round(margin * 10) / 10, invoicedPrice: e.costs!.invoicedPrice }
      })
      .sort((a, b) => b.margin - a.margin)
      .slice(0, 5)
    const topMarginEvents = eventsWithMargin

    // Most used stock
    const stockMap: Record<string, { name: string; count: number }> = {}
    events.forEach((e) => {
      e.reservations.forEach((r) => {
        const name = r.stockItem?.name || r.stockItemId
        if (!stockMap[r.stockItemId]) stockMap[r.stockItemId] = { name, count: 0 }
        stockMap[r.stockItemId].count += r.quantity
      })
    })
    const mostUsedStock = Object.entries(stockMap)
      .map(([id, { name, count }]) => ({ id, name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Avg margin by type
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

    return NextResponse.json({ eventsByType, eventsByMonth, topMarginEvents, mostUsedStock, revenueByMonth, avgMarginByType })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
