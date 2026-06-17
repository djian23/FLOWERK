import {
  demoClients,
  demoDashboard,
  demoEvents,
  demoRecipes,
  demoStock,
  demoSuppliers,
  demoTemplates,
  demoTransporters
} from '@/data/demo';
import type { Client, DashboardSummary, EntityKind, Event, Recipe, StockItem, Supplier, Template, Transporter } from '@/types/flowerk';

const baseUrl = process.env.EXPO_PUBLIC_FLOWERK_API_URL?.replace(/\/$/, '');

async function getJson<T>(path: string, fallback: T): Promise<T> {
  if (!baseUrl) {
    return fallback;
  }

  try {
    const response = await fetch(`${baseUrl}${path}`);
    if (!response.ok) {
      throw new Error(`FLOWERK API ${response.status}`);
    }

    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export function getDashboardSummary(): Promise<DashboardSummary> {
  return getJson('/api/analytics', demoDashboard);
}

export function getEvents(): Promise<Event[]> {
  return getJson('/api/events', demoEvents);
}

export function getClients(): Promise<Client[]> {
  return getJson('/api/clients', demoClients);
}

export function getStock(): Promise<StockItem[]> {
  return getJson('/api/stock', demoStock);
}

export function getSuppliers(): Promise<Supplier[]> {
  return getJson('/api/suppliers', demoSuppliers);
}

export function getTransporters(): Promise<Transporter[]> {
  return getJson('/api/transporters', demoTransporters);
}

export function getRecipes(): Promise<Recipe[]> {
  return getJson('/api/recipes', demoRecipes);
}

export function getTemplates(): Promise<Template[]> {
  return getJson('/api/templates', demoTemplates);
}

export async function getEntity(kind: EntityKind) {
  const loaders = {
    events: getEvents,
    stock: getStock,
    clients: getClients,
    suppliers: getSuppliers,
    transporters: getTransporters,
    recipes: getRecipes,
    templates: getTemplates
  };

  return loaders[kind]();
}

export const isUsingDemoData = !baseUrl;
