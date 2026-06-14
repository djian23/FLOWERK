'use client'

import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Tableau de bord',
  '/dashboard/stock': 'Stock',
  '/dashboard/events': 'Événements',
  '/dashboard/clients': 'Clients',
  '/dashboard/transporters': 'Transporteurs',
  '/dashboard/calendar': 'Calendrier',
  '/dashboard/search': 'Recherche',
}

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname()

  const title = Object.entries(pageTitles).find(([key]) =>
    key === pathname || (key !== '/dashboard' && pathname.startsWith(key))
  )?.[1] || 'FLOWER K'

  return (
    <header className="h-16 border-b border-[#E8E0D5] bg-white flex items-center px-4 lg:px-8 gap-4">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-md text-[#0A0A0A] hover:bg-[#E8E0D5] transition-colors"
      >
        <Menu className="h-5 w-5" />
      </button>
      <h2 className="text-lg font-medium text-[#0A0A0A]">{title}</h2>
    </header>
  )
}
