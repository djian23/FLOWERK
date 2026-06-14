export interface Client {
  id: string
  name: string
  email?: string | null
  phone?: string | null
  address?: string | null
  notes?: string | null
  createdAt: string
  updatedAt: string
  _count?: {
    events: number
  }
}

export interface Event {
  id: string
  name: string
  clientId?: string | null
  client?: Client | null
  date: string
  address?: string | null
  phone?: string | null
  budget?: number | null
  description?: string | null
  status: string
  type?: string | null
  createdAt: string
  updatedAt: string
  _count?: {
    reservations: number
    documents: number
    previews: number
    gallery: number
  }
}

export interface StockCategory {
  id: string
  name: string
  subCategories?: StockSubCategory[]
  _count?: {
    items: number
  }
}

export interface StockSubCategory {
  id: string
  name: string
  categoryId: string
  category?: StockCategory
}

export interface StockItem {
  id: string
  name: string
  categoryId?: string | null
  category?: StockCategory | null
  subCategoryId?: string | null
  subCategory?: StockSubCategory | null
  color?: string | null
  description?: string | null
  totalQuantity: number
  purchasePrice?: number | null
  storageLocation?: string | null
  condition: string
  notes?: string | null
  photos?: StockPhoto[]
  reservations?: Reservation[]
  createdAt: string
  updatedAt: string
  availableQuantity?: number
  reservedQuantity?: number
}

export interface StockPhoto {
  id: string
  url: string
  stockItemId: string
  createdAt: string
}

export interface Reservation {
  id: string
  eventId: string
  event?: Event
  stockItemId: string
  stockItem?: StockItem
  quantity: number
  notes?: string | null
  createdAt: string
  updatedAt: string
}

export interface Transporter {
  id: string
  name: string
  phone?: string | null
  email?: string | null
  notes?: string | null
  createdAt: string
}

export interface Logistics {
  id: string
  eventId: string
  event?: Event
  transporterId?: string | null
  transporter?: Transporter | null
  pickupDate?: string | null
  deliveryDate?: string | null
  returnDate?: string | null
  status?: string | null
  notes?: string | null
  documents?: LogisticsDocument[]
  createdAt: string
  updatedAt: string
}

export interface LogisticsDocument {
  id: string
  url: string
  name: string
  logisticsId: string
  createdAt: string
}

export interface Preview {
  id: string
  eventId: string
  url: string
  type: string
  status: string
  notes?: string | null
  createdAt: string
}

export interface MediaItem {
  id: string
  eventId: string
  url: string
  type: string
  isReel: boolean
  notes?: string | null
  createdAt: string
}

export interface Document {
  id: string
  eventId: string
  url: string
  name: string
  type: string
  createdAt: string
}

export interface EventCost {
  id: string
  eventId: string
  flowers: number
  materials: number
  labor: number
  delivery: number
  subcontracting: number
  misc: number
  invoicedPrice: number
  notes?: string | null
  createdAt: string
  updatedAt: string
}
