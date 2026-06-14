'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Calendar, Users, Truck, Search, Folder, X } from 'lucide-react'
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

interface SidebarProps {
  open?: boolean
  onClose?: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()

  const content = (
    <aside className="h-full w-64 bg-[#0A0A0A] flex flex-col">
      <div className="px-4 py-6 border-b border-white/10 flex flex-col items-center relative">
        {onClose && (
          <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white lg:hidden">
            <X className="h-5 w-5" />
          </button>
        )}
        <Image src="/logo.jpeg" alt="Flower K" width={140} height={140} className="rounded-sm object-contain" priority />
        <p className="text-[#C4B8A8] text-xs tracking-[0.2em] mt-3 uppercase">Administration</p>
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
                  onClick={onClose}
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
    </aside>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 z-50">
        {content}
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={onClose} />
          <div className="relative z-10 w-64 flex-shrink-0">
            {content}
          </div>
        </div>
      )}
    </>
  )
}
