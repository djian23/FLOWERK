import type { Client, DashboardSummary, Event, Recipe, StockItem, Supplier, Template, Transporter } from '@/types/flowerk';

export const demoClients: Client[] = [
  {
    id: 'client-1',
    name: 'Camille Durand',
    email: 'camille@exemple.fr',
    phone: '06 11 22 33 44',
    address: 'Paris',
    createdAt: '2026-05-20',
    _count: { events: 2 }
  },
  {
    id: 'client-2',
    name: 'Maison Bellecour',
    email: 'events@bellecour.fr',
    phone: '04 72 00 00 00',
    address: 'Lyon',
    createdAt: '2026-04-12',
    _count: { events: 1 }
  }
];

export const demoEvents: Event[] = [
  {
    id: 'event-1',
    name: 'Mariage Camille & Hugo',
    client: demoClients[0],
    date: '2026-07-18T14:00:00.000Z',
    address: 'Domaine des Saules',
    budget: 8200,
    status: 'PREPARATION_EN_COURS',
    type: 'Mariage',
    _count: { reservations: 18, documents: 4, previews: 3, gallery: 0 }
  },
  {
    id: 'event-2',
    name: 'Dîner floral Bellecour',
    client: demoClients[1],
    date: '2026-06-29T18:00:00.000Z',
    address: 'Lyon 2e',
    budget: 3600,
    status: 'CONFIRME',
    type: 'Corporate',
    _count: { reservations: 7, documents: 2, previews: 1, gallery: 0 }
  },
  {
    id: 'event-3',
    name: 'Scénographie showroom été',
    client: demoClients[0],
    date: '2026-08-03T08:00:00.000Z',
    address: 'Atelier FLOWERK',
    budget: 2400,
    status: 'DEVIS_EN_COURS',
    type: 'Showroom',
    _count: { reservations: 0, documents: 1, previews: 0, gallery: 0 }
  }
];

export const demoStock: StockItem[] = [
  {
    id: 'stock-1',
    name: 'Vases cylindres transparents',
    category: { id: 'cat-1', name: 'Vases' },
    color: 'Transparent',
    totalQuantity: 48,
    reservedQuantity: 18,
    availableQuantity: 30,
    purchasePrice: 12,
    storageLocation: 'Étagère A2',
    condition: 'BON_ETAT'
  },
  {
    id: 'stock-2',
    name: 'Arche métal modulable',
    category: { id: 'cat-2', name: 'Structures' },
    color: 'Noir',
    totalQuantity: 2,
    reservedQuantity: 1,
    availableQuantity: 1,
    purchasePrice: 280,
    storageLocation: 'Zone arches',
    condition: 'BON_ETAT'
  },
  {
    id: 'stock-3',
    name: 'Bougeoirs laiton',
    category: { id: 'cat-3', name: 'Décoration' },
    color: 'Laiton',
    totalQuantity: 64,
    reservedQuantity: 40,
    availableQuantity: 24,
    purchasePrice: 8,
    storageLocation: 'Bacs B1',
    condition: 'A_REPARER'
  }
];

export const demoSuppliers: Supplier[] = [
  { id: 'supplier-1', name: 'Holland Flowers', specialty: 'Fleurs fraîches', phone: '+31 20 000 000', email: 'orders@holland.example' },
  { id: 'supplier-2', name: 'Atelier Métal Sud', specialty: 'Structures sur mesure', phone: '04 00 00 00 00' }
];

export const demoTransporters: Transporter[] = [
  { id: 'transporter-1', name: 'Express Floral', phone: '06 44 55 66 77', email: 'contact@expressfloral.fr' },
  { id: 'transporter-2', name: 'Logistique Événementielle K', phone: '06 88 00 11 22' }
];

export const demoRecipes: Recipe[] = [
  { id: 'recipe-1', name: 'Centre de table blanc et sauge', prepTime: 35, estimatedCost: 68, description: 'Rose, lisianthus, eucalyptus et feuillage fin.' },
  { id: 'recipe-2', name: 'Bouquet cérémonie pêche', prepTime: 50, estimatedCost: 92, description: 'Palette pêche, crème et touches abricot.' }
];

export const demoTemplates: Template[] = [
  { id: 'template-1', name: 'Mariage domaine champêtre', type: 'Mariage', style: 'Naturel', description: 'Checklist et inspirations pour domaines extérieurs.' },
  { id: 'template-2', name: 'Dîner corporate premium', type: 'Corporate', style: 'Minimal', description: 'Trame rapide pour tables longues et accueil.' }
];

export const demoDashboard: DashboardSummary = {
  events: demoEvents.length,
  clients: demoClients.length,
  stock: demoStock.length,
  transporters: demoTransporters.length,
  revenue: 14200,
  costs: 7900
};
