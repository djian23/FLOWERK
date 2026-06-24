export const eventStatuses: Record<string, string> = {
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
  CLOTURE: 'Clôturé'
};

export const stockConditions: Record<string, string> = {
  BON_ETAT: 'Bon état',
  A_REPARER: 'À réparer',
  HORS_SERVICE: 'Hors service'
};

export function formatDate(value: string | Date) {
  const date = typeof value === 'string' ? new Date(value) : value;
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export function formatCurrency(amount = 0) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(amount);
}
