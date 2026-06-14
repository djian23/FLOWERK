'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, Package, Calendar, Users, Truck, Search, LogOut, Image, Folder
} from 'lucide-react'
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
    <aside className="fixed inset-y-0 left-0 w-64 bg-[#0A0A0A] flex flex-col z-50">
      <div className="px-6 py-8 border-b border-white/10">
        <h1 className="font-serif text-2xl text-white tracking-widest">FLOWER K</h1>
        <p className="text-[#C4B8A8] text-xs tracking-[0.2em] mt-1 uppercase">Administration</p>
      </div>

      <nav className="flex-1 py-6 px-3 overflow-y-auto">
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
                    'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors',
                    isActive
                      ? 'bg-[#E8E0D5] text-[#0A0A0A] font-medium'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
