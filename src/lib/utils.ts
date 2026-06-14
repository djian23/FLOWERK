import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const EVENT_STATUSES: Record<string, string> = {
  DEVIS_EN_COURS: 'Devis en cours',
  EN_ATTENTE_VALIDATION: 'En attente de validation',
  CONFIRME: 'Confirmé',
  PREPARATION_EN_COURS: 'Préparation en cours',
  PRET_A_PARTIR: 'Prêt à partir',
  ENLEVE_TRANSPORTEUR: 'Enlevé par le transporteur',
  EN_ROUTE: 'En route',
  INSTALLE: 'Installé',
  EVENEMENT_TERMINE: 'Événement terminé',
  RETOUR_PREVU: 'Retour prévu',
  RETOUR_EN_COURS: 'Retour en cours',
  VERIFICATION_MATERIEL: 'Vérification du matériel',
  CLOTURE: 'Clôturé',
}

export const EVENT_STATUS_COLORS: Record<string, string> = {
  DEVIS_EN_COURS: 'bg-yellow-100 text-yellow-800',
  EN_ATTENTE_VALIDATION: 'bg-orange-100 text-orange-800',
  CONFIRME: 'bg-blue-100 text-blue-800',
  PREPARATION_EN_COURS: 'bg-purple-100 text-purple-800',
  PRET_A_PARTIR: 'bg-indigo-100 text-indigo-800',
  ENLEVE_TRANSPORTEUR: 'bg-cyan-100 text-cyan-800',
  EN_ROUTE: 'bg-sky-100 text-sky-800',
  INSTALLE: 'bg-green-100 text-green-800',
  EVENEMENT_TERMINE: 'bg-teal-100 text-teal-800',
  RETOUR_PREVU: 'bg-amber-100 text-amber-800',
  RETOUR_EN_COURS: 'bg-orange-100 text-orange-800',
  VERIFICATION_MATERIEL: 'bg-rose-100 text-rose-800',
  CLOTURE: 'bg-gray-100 text-gray-800',
}

export const STOCK_CONDITIONS: Record<string, string> = {
  BON_ETAT: 'Bon état',
  A_REPARER: 'À réparer',
  HORS_SERVICE: 'Hors service',
}

export const PREVIEW_TYPES: Record<string, string> = {
  MOODBOARD: 'Moodboard',
  INSPIRATION: 'Inspiration',
  ESQUISSE: 'Esquisse',
  VALIDATION: 'Validation client',
}

export const PREVIEW_STATUSES: Record<string, string> = {
  BROUILLON: 'Brouillon',
  EN_COURS: 'En cours',
  VALIDE: 'Validé',
  REJETE: 'Rejeté',
}

export const DOCUMENT_TYPES: Record<string, string> = {
  DEVIS: 'Devis',
  CONTRAT: 'Contrat',
  FACTURE: 'Facture',
  BON_COMMANDE: 'Bon de commande',
  AUTRE: 'Autre',
}

export const MEDIA_TYPES: Record<string, string> = {
  PHOTO: 'Photo',
  VIDEO: 'Vidéo',
  REEL: 'Reel Instagram',
  AVANT_APRES: 'Avant/Après',
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

export function calculateMargin(invoicedPrice: number, totalCost: number): number {
  if (invoicedPrice === 0) return 0
  const profit = invoicedPrice - totalCost
  return (profit / invoicedPrice) * 100
}

export function calculateTotalCost(costs: {
  flowers: number
  materials: number
  labor: number
  delivery: number
  subcontracting: number
  misc: number
}): number {
  return (
    costs.flowers +
    costs.materials +
    costs.labor +
    costs.delivery +
    costs.subcontracting +
    costs.misc
  )
}
