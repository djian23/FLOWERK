'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, FileText } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/templates')
      .then((r) => r.json())
      .then((data) => { setTemplates(Array.isArray(data) ? data : []); setLoading(false) })
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl text-[#0A0A0A]">Templates d&apos;événements</h2>
          <p className="text-[#C4B8A8] text-sm mt-1">{templates.length} template(s)</p>
        </div>
        <Link href="/dashboard/templates/new">
          <Button className="bg-[#0A0A0A] hover:bg-[#1a1a1a] text-white gap-2">
            <Plus className="h-4 w-4" />
            Nouveau template
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#C4B8A8]">Chargement...</div>
      ) : templates.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-[#E8E0D5] mx-auto mb-4" />
          <p className="text-[#C4B8A8]">Aucun template</p>
          <Link href="/dashboard/templates/new" className="mt-3 inline-block text-sm text-[#0A0A0A] underline">
            Créer le premier template
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Link key={template.id} href={`/dashboard/templates/${template.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer border border-[#E8E0D5] h-full">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#E8E0D5] flex items-center justify-center">
                      <FileText className="h-5 w-5 text-[#0A0A0A]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#0A0A0A]">{template.name}</h3>
                      <div className="text-xs text-[#C4B8A8]">{template._count?.checklist || template.checklist?.length || 0} tâche(s)</div>
                    </div>
                  </div>
                  {template.type && <div className="text-xs text-[#C4B8A8] mb-1">Type: {template.type}</div>}
                  {template.style && <div className="text-xs text-[#C4B8A8] mb-1">Style: {template.style}</div>}
                  {template.description && <p className="text-sm text-[#C4B8A8] line-clamp-2">{template.description}</p>}
                  <div className="text-xs text-[#C4B8A8] mt-2">Créé le {formatDate(template.createdAt)}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
