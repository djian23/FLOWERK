'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Calendar, Users, Truck, Search, Folder, Store, FileText, BarChart2, Flower2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const gestionItems = [
  { href: '/dashboard/events', label: 'Événements', icon: Folder },
  { href: '/dashboard/stock', label: 'Stock', icon: Package },
  { href: '/dashboard/clients', label: 'Clients', icon: Users },
  { href: '/dashboard/suppliers', label: 'Fournisseurs', icon: Store },
  { href: '/dashboard/transporters', label: 'Transporteurs', icon: Truck },
]

const outilsItems = [
  { href: '/dashboard/recipes', label: 'Compositions', icon: Flower2 },
  { href: '/dashboard/templates', label: 'Templates', icon: FileText },
]

const vuesItems = [
  { href: '/dashboard/analytics', label: 'Analytiques', icon: BarChart2 },
  { href: '/dashboard/calendar', label: 'Calendrier', icon: Calendar },
  { href: '/dashboard/search', label: 'Recherche', icon: Search },
]

function NavItem({ item, pathname }: { item: { href: string; label: string; icon: any }; pathname: string }) {
  const Icon = item.icon
  const isActive = pathname === item.href ||
    (item.href !== '/dashboard' && pathname.startsWith(item.href))
  return (
    <li>
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
}

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
          {/* Dashboard */}
          <li>
            <Link
              href="/dashboard"
              className={cn(
                'flex items-center gap-3 px-2 lg:px-3 py-2.5 rounded-md text-sm transition-colors',
                pathname === '/dashboard'
                  ? 'bg-[#E8E0D5] text-[#0A0A0A] font-medium'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              )}
              title="Tableau de bord"
            >
              <LayoutDashboard className="h-4 w-4 shrink-0 mx-auto lg:mx-0" />
              <span className="hidden lg:inline">Tableau de bord</span>
            </Link>
          </li>

          {/* Gestion section */}
          <li className="hidden lg:block pt-3 pb-1">
            <span className="px-3 text-[10px] text-white/30 uppercase tracking-wider">Gestion</span>
          </li>
          {gestionItems.map((item) => (
            <NavItem key={item.href} item={item} pathname={pathname} />
          ))}

          {/* Outils section */}
          <li className="hidden lg:block pt-3 pb-1">
            <span className="px-3 text-[10px] text-white/30 uppercase tracking-wider">Outils</span>
          </li>
          {outilsItems.map((item) => (
            <NavItem key={item.href} item={item} pathname={pathname} />
          ))}

          {/* Vues section */}
          <li className="hidden lg:block pt-3 pb-1">
            <span className="px-3 text-[10px] text-white/30 uppercase tracking-wider">Vues</span>
          </li>
          {vuesItems.map((item) => (
            <NavItem key={item.href} item={item} pathname={pathname} />
          ))}
        </ul>
      </nav>
    </aside>
  )
}
