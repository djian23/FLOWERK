'use client'

import { usePathname } from 'next/navigation'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Tableau de bord',
  '/dashboard/stock': 'Stock',
  '/dashboard/events': 'Événements',
  '/dashboard/clients': 'Clients',
  '/dashboard/transporters': 'Transporteurs',
  '/dashboard/suppliers': 'Fournisseurs',
  '/dashboard/recipes': 'Compositions florales',
  '/dashboard/templates': 'Templates',
  '/dashboard/analytics': 'Analytiques',
  '/dashboard/calendar': 'Calendrier',
  '/dashboard/search': 'Recherche',
}

export function Header() {
  const pathname = usePathname()

  const title = Object.entries(pageTitles).find(([key]) =>
    key === pathname || (key !== '/dashboard' && pathname.startsWith(key))
  )?.[1] || 'FLOWER K'

  return (
    <header className="h-16 border-b border-[#E8E0D5] bg-white flex items-center px-4 lg:px-8">
      <h2 className="text-lg font-medium text-[#0A0A0A]">{title}</h2>
    </header>
  )
}
