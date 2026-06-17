import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BrandHeader } from '@/components/BrandHeader';
import { Card } from '@/components/Card';
import { ResponsiveScreen } from '@/components/ResponsiveScreen';
import { SearchInput } from '@/components/SearchInput';
import { getClients, getEvents, getRecipes, getStock } from '@/api/flowerk';
import { colors } from '@/theme/colors';

interface SearchResult {
  id: string;
  kind: string;
  title: string;
  subtitle: string;
}

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    void Promise.all([getEvents(), getClients(), getStock(), getRecipes()]).then(([events, clients, stock, recipes]) => {
      setResults([
        ...events.map((event) => ({
          id: event.id,
          kind: 'Événement',
          title: event.name,
          subtitle: `${event.client?.name ?? 'Sans client'} · ${event.address ?? 'Adresse n/a'}`
        })),
        ...clients.map((client) => ({
          id: client.id,
          kind: 'Client',
          title: client.name,
          subtitle: client.email ?? client.phone ?? 'Contact à compléter'
        })),
        ...stock.map((item) => ({
          id: item.id,
          kind: 'Stock',
          title: item.name,
          subtitle: `${item.category?.name ?? 'Sans catégorie'} · ${item.availableQuantity ?? 0} disponible(s)`
        })),
        ...recipes.map((recipe) => ({
          id: recipe.id,
          kind: 'Composition',
          title: recipe.name,
          subtitle: recipe.description ?? 'Recette florale'
        }))
      ]);
    });
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return results.slice(0, 8);
    return results.filter((item) => `${item.kind} ${item.title} ${item.subtitle}`.toLowerCase().includes(normalized));
  }, [query, results]);

  return (
    <ResponsiveScreen>
      <BrandHeader title="Recherche" subtitle="Retrouver vite un événement, client, stock ou composition" />
      <SearchInput value={query} onChangeText={setQuery} placeholder="Rechercher dans FLOWERK..." />
      <View style={styles.list}>
        {filtered.map((item) => (
          <Card key={`${item.kind}-${item.id}`}>
            <Text style={styles.kind}>{item.kind}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </Card>
        ))}
      </View>
    </ResponsiveScreen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12
  },
  kind: {
    color: colors.taupe,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase'
  },
  title: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '800',
    marginTop: 6
  },
  subtitle: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 4
  }
});
