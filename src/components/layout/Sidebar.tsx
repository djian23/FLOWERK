'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Calendar, Users, Truck, Search, Folder } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/dashboard/stock', label: 'Stock', icon: Package },
  { href: '/dashboard/events', label: 'Événements', icon: Folder },
  { href: '/dashboard/clients', label: 'Clients', icon: Users },
  { href: '/dashboard/transporters', label: 'Transporteurs', icon: Truck },
  { href: '/dashboard/calendar', label: 'Calendrier', icon: Calendar },
  { href: '/dashboard/search', label: 'Recherche', icon: Search },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 w-14 lg:w-64 bg-[#0A0A0A] flex flex-col z-50 transition-all">
      {/* Logo — hidden on mobile */}
      <div className="hidden lg:flex px-4 py-6 border-b border-white/10 flex-col items-center">
        <Image src="/logo.jpeg" alt="Flower K" width={140} height={140} className="rounded-sm object-contain" priority />
        <p className="text-[#C4B8A8] text-xs tracking-[0.2em] mt-3 uppercase">Administration</p>
      </div>

      {/* Mobile logo */}
      <div className="flex lg:hidden items-center justify-center py-3 border-b border-white/10">
        <Image src="/logo.jpeg" alt="Flower K" width={40} height={40} className="rounded-sm object-contain" priority />
      </div>

      <nav className="flex-1 py-4 px-1 lg:px-3 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-2 lg:px-3 py-2.5 rounded-md text-sm transition-colors',
                    isActive
                      ? 'bg-[#E8E0D5] text-[#0A0A0A] font-medium'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  )}
                  title={item.label}
                >
                  <Icon className="h-4 w-4 shrink-0 mx-auto lg:mx-0" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
