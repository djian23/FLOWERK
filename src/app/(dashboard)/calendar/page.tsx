'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Event } from '@/types'
import { EVENT_STATUSES, EVENT_STATUS_COLORS, formatDate } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/events').then(r => r.json()).then(data => {
      setEvents(data)
      setLoading(false)
    })
  }, [])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDay = new Date(firstDay)
  startDay.setDate(startDay.getDate() - (firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1))

  const days: Date[] = []
  const current = new Date(startDay)
  while (current <= lastDay || days.length % 7 !== 0) {
    days.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

  function getEventsForDay(day: Date) {
    return events.filter(e => {
      const d = new Date(e.date)
      return d.getDate() === day.getDate() && d.getMonth() === day.getMonth() && d.getFullYear() === day.getFullYear()
    })
  }

  const upcomingEvents = events
    .filter(e => new Date(e.date) >= new Date() && e.status !== 'CLOTURE')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 10)

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl text-[#0A0A0A]">Calendrier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-lg text-[#0A0A0A]">{monthNames[month]} {year}</h2>
                <div className="flex gap-2">
                  <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-2 rounded-md hover:bg-[#E8E0D5] transition-colors">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 text-xs border border-[#E8E0D5] rounded-md hover:bg-[#E8E0D5] transition-colors">
                    Aujourd'hui
                  </button>
                  <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-2 rounded-md hover:bg-[#E8E0D5] transition-colors">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-px bg-[#E8E0D5] rounded-lg overflow-hidden">
                {dayNames.map(d => (
                  <div key={d} className="bg-[#FAFAFA] text-center py-2 text-xs font-medium text-[#C4B8A8]">{d}</div>
                ))}
                {days.map((day, i) => {
                  const dayEvents = getEventsForDay(day)
                  const isCurrentMonth = day.getMonth() === month
                  const isToday = day.toDateString() === new Date().toDateString()
                  return (
                    <div key={i} className={`bg-white min-h-20 p-1.5 ${!isCurrentMonth ? 'opacity-40' : ''}`}>
                      <div className={`text-xs font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-[#0A0A0A] text-white' : 'text-[#0A0A0A]'}`}>
                        {day.getDate()}
                      </div>
                      <div className="space-y-0.5">
                        {dayEvents.slice(0, 2).map(e => (
                          <Link key={e.id} href={`/dashboard/events/${e.id}`}>
                            <div className={`text-[10px] px-1 py-0.5 rounded truncate leading-tight ${EVENT_STATUS_COLORS[e.status] || 'bg-gray-100 text-gray-800'}`}>
                              {e.name}
                            </div>
                          </Link>
                        ))}
                        {dayEvents.length > 2 && <div className="text-[10px] text-[#C4B8A8] pl-1">+{dayEvents.length - 2}</div>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader><CardTitle className="text-base">Prochains événements</CardTitle></CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-[#E8E0D5] rounded animate-pulse" />)}</div>
              ) : upcomingEvents.length === 0 ? (
                <p className="text-sm text-[#C4B8A8]">Aucun événement à venir</p>
              ) : (
                <ul className="space-y-3">
                  {upcomingEvents.map(e => (
                    <li key={e.id}>
                      <Link href={`/dashboard/events/${e.id}`} className="block hover:bg-[#FAFAFA] -mx-2 px-2 py-1.5 rounded transition-colors">
                        <p className="text-sm font-medium text-[#0A0A0A] truncate">{e.name}</p>
                        <div className="flex items-center justify-between mt-0.5">
                          <p className="text-xs text-[#C4B8A8]">{formatDate(e.date)}</p>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${EVENT_STATUS_COLORS[e.status] || 'bg-gray-100'}`}>
                            {EVENT_STATUSES[e.status]?.split(' ')[0]}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
