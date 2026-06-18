'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Minus, Plus, Type } from 'lucide-react'

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
  '/dashboard/guide': 'Guide d\'utilisation',
  '/dashboard/moodboards': 'Moodboards',
  '/dashboard/quotes': 'Devis',
  '/dashboard/invoices': 'Factures',
  '/dashboard/inspirations': 'Inspirations',
}

const FONT_SCALES = [1, 1.15, 1.3, 1.45]
const FONT_LABELS = ['Normal', 'Grand', 'Très grand', 'Maximum']

export function Header() {
  const pathname = usePathname()
  const [scaleIndex, setScaleIndex] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem('flowerk-font-scale')
    if (saved) {
      const idx = FONT_SCALES.indexOf(parseFloat(saved))
      if (idx >= 0) {
        setScaleIndex(idx)
        document.documentElement.style.setProperty('--font-scale', saved)
      }
    }
  }, [])

  function changeScale(delta: number) {
    const next = Math.max(0, Math.min(FONT_SCALES.length - 1, scaleIndex + delta))
    setScaleIndex(next)
    const val = String(FONT_SCALES[next])
    document.documentElement.style.setProperty('--font-scale', val)
    localStorage.setItem('flowerk-font-scale', val)
  }

  const title = Object.entries(pageTitles).find(([key]) =>
    key === pathname || (key !== '/dashboard' && pathname.startsWith(key))
  )?.[1] || 'FLOWER K'

  return (
    <header className="h-16 border-b border-[#E8E0D5] bg-white flex items-center justify-between px-4 lg:px-8">
      <h2 className="text-xl font-bold text-[#0A0A0A]">{title}</h2>
      <div className="flex items-center gap-1">
        <Type className="h-4 w-4 text-[#C4B8A8] mr-1 hidden sm:block" />
        <button
          onClick={() => changeScale(-1)}
          disabled={scaleIndex === 0}
          className="p-1.5 rounded-md hover:bg-[#E8E0D5] disabled:opacity-30 transition-colors"
          title="Réduire la taille"
        >
          <Minus className="h-4 w-4 text-[#0A0A0A]" />
        </button>
        <span className="text-xs font-bold text-[#0A0A0A] min-w-[70px] text-center hidden sm:inline">{FONT_LABELS[scaleIndex]}</span>
        <button
          onClick={() => changeScale(1)}
          disabled={scaleIndex === FONT_SCALES.length - 1}
          className="p-1.5 rounded-md hover:bg-[#E8E0D5] disabled:opacity-30 transition-colors"
          title="Augmenter la taille"
        >
          <Plus className="h-4 w-4 text-[#0A0A0A]" />
        </button>
      </div>
    </header>
  )
}
