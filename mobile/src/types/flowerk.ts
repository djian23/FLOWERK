export type EntityKind =
  | 'events'
  | 'stock'
  | 'clients'
  | 'suppliers'
  | 'transporters'
  | 'recipes'
  | 'templates';

export interface Client {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  createdAt: string;
  _count?: {
    events: number;
  };
}

export interface Event {
  id: string;
  name: string;
  client?: Client | null;
  date: string;
  address?: string | null;
  budget?: number | null;
  description?: string | null;
  status: string;
  type?: string | null;
  _count?: {
    reservations: number;
    documents: number;
    previews: number;
    gallery: number;
  };
}

export interface StockCategory {
  id: string;
  name: string;
}

export interface StockItem {
  id: string;
  name: string;
  category?: StockCategory | null;
  color?: string | null;
  totalQuantity: number;
  purchasePrice?: number | null;
  storageLocation?: string | null;
  condition: string;
  availableQuantity?: number;
  reservedQuantity?: number;
}

export interface Supplier {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  specialty?: string | null;
}

export interface Transporter {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
}

export interface Recipe {
  id: string;
  name: string;
  description?: string | null;
  prepTime?: number | null;
  estimatedCost?: number | null;
}

export interface Template {
  id: string;
  name: string;
  type?: string | null;
  style?: string | null;
  description?: string | null;
}

export interface DashboardSummary {
  events: number;
  clients: number;
  stock: number;
  transporters: number;
  revenue: number;
  costs: number;
}
