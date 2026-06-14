'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Event } from '@/types'
import { EVENT_STATUS_COLORS, EVENT_STATUSES } from '@/lib/utils'

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
]

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/events')
      .then((r) => r.json())
      .then((data) => { setEvents(data); setLoading(false) })
  }, [])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  // Get day of week (Mon=0, Sun=6)
  let startDow = firstDay.getDay() - 1
  if (startDow < 0) startDow = 6

  const daysInMonth = lastDay.getDate()
  const totalCells = Math.ceil((startDow + daysInMonth) / 7) * 7

  const cells: (number | null)[] = []
  for (let i = 0; i < startDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length < totalCells) cells.push(null)

  function getEventsForDay(day: number) {
    return events.filter((e) => {
      const d = new Date(e.date)
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day
    })
  }

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const today = new Date()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl text-[#0A0A0A]">Calendrier</h2>
        <p className="text-[#C4B8A8] text-sm mt-1">{events.length} événement(s) au total</p>
      </div>

      <Card>
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="outline" size="sm" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="font-serif text-xl text-[#0A0A0A]">
              {MONTHS[month]} {year}
            </h3>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Days header */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-xs font-medium text-[#C4B8A8] py-2">{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          {loading ? (
            <div className="text-center py-12 text-[#C4B8A8]">Chargement...</div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, idx) => {
                const dayEvents = day ? getEventsForDay(day) : []
                const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()

                return (
                  <div
                    key={idx}
                    className={`min-h-[80px] p-1.5 rounded-md border ${
                      day ? 'border-[#E8E0D5] bg-white' : 'border-transparent bg-transparent'
                    } ${isToday ? 'border-[#0A0A0A] border-2' : ''}`}
                  >
                    {day && (
                      <>
                        <div className={`text-xs font-medium mb-1 ${isToday ? 'text-[#0A0A0A] font-bold' : 'text-[#C4B8A8]'}`}>
                          {day}
                        </div>
                        <div className="space-y-0.5">
                          {dayEvents.slice(0, 3).map((event) => (
                            <Link key={event.id} href={`/dashboard/events/${event.id}`}>
                              <div
                                className={`text-xs px-1 py-0.5 rounded truncate cursor-pointer hover:opacity-80 transition-opacity ${
                                  EVENT_STATUS_COLORS[event.status] || 'bg-gray-100 text-gray-800'
                                }`}
                                title={event.name}
                              >
                                {event.name}
                              </div>
                            </Link>
                          ))}
                          {dayEvents.length > 3 && (
                            <div className="text-xs text-[#C4B8A8]">+{dayEvents.length - 3}</div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming events */}
      <div>
        <h3 className="font-semibold text-[#0A0A0A] mb-3">Événements ce mois-ci</h3>
        <div className="space-y-2">
          {events
            .filter((e) => {
              const d = new Date(e.date)
              return d.getFullYear() === year && d.getMonth() === month
            })
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((event) => {
              const d = new Date(event.date)
              return (
                <Link key={event.id} href={`/dashboard/events/${event.id}`}>
                  <Card className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="text-center w-12 flex-shrink-0">
                        <div className="text-xl font-bold text-[#0A0A0A]">{d.getDate()}</div>
                        <div className="text-xs text-[#C4B8A8]">{MONTHS[d.getMonth()].slice(0, 3)}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-[#0A0A0A] truncate">{event.name}</div>
                        <div className="text-xs text-[#C4B8A8] mt-0.5">
                          {event.client?.name}
                          {event.address && ` • ${event.address}`}
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${EVENT_STATUS_COLORS[event.status] || 'bg-gray-100 text-gray-800'}`}>
                        {EVENT_STATUSES[event.status] || event.status}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          {events.filter((e) => {
            const d = new Date(e.date)
            return d.getFullYear() === year && d.getMonth() === month
          }).length === 0 && (
            <p className="text-sm text-[#C4B8A8] text-center py-4">Aucun événement ce mois-ci</p>
          )}
        </div>
      </div>
    </div>
  )
}
