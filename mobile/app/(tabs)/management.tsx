import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { BrandHeader } from '@/components/BrandHeader';
import { EntityCard } from '@/components/EntityCard';
import { ResponsiveScreen } from '@/components/ResponsiveScreen';
import { SearchInput } from '@/components/SearchInput';
import { getEntity } from '@/api/flowerk';
import { colors } from '@/theme/colors';
import type { EntityKind } from '@/types/flowerk';

const sections: { kind: EntityKind; label: string; placeholder: string }[] = [
  { kind: 'events', label: 'Événements', placeholder: 'Rechercher un événement...' },
  { kind: 'stock', label: 'Stock', placeholder: 'Rechercher dans le stock...' },
  { kind: 'clients', label: 'Clients', placeholder: 'Rechercher un client...' },
  { kind: 'suppliers', label: 'Fournisseurs', placeholder: 'Rechercher un fournisseur...' },
  { kind: 'transporters', label: 'Transporteurs', placeholder: 'Rechercher un transporteur...' },
  { kind: 'recipes', label: 'Compositions', placeholder: 'Rechercher une composition...' },
  { kind: 'templates', label: 'Templates', placeholder: 'Rechercher un template...' }
];

export default function ManagementScreen() {
  const [active, setActive] = useState<EntityKind>('events');
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const { width } = useWindowDimensions();
  const current = sections.find((section) => section.kind === active) ?? sections[0];
  const isTablet = width >= 768;

  useEffect(() => {
    setQuery('');
    void getEntity(active).then((data) => setItems(Array.isArray(data) ? data : []));
  }, [active]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return items;

    return items.filter((item) => JSON.stringify(item).toLowerCase().includes(normalized));
  }, [items, query]);

  return (
    <ResponsiveScreen>
      <BrandHeader title={current.label} subtitle={`${filtered.length} élément(s)`} />
      <View style={styles.chips}>
        {sections.map((section) => (
          <Pressable
            key={section.kind}
            onPress={() => setActive(section.kind)}
            style={[styles.chip, active === section.kind && styles.chipActive]}
          >
            <Text style={[styles.chipText, active === section.kind && styles.chipTextActive]}>{section.label}</Text>
          </Pressable>
        ))}
      </View>

      <SearchInput value={query} onChangeText={setQuery} placeholder={current.placeholder} />

      <View style={[styles.list, isTablet && styles.gridList]}>
        {filtered.map((item) => (
          <View key={item.id} style={isTablet ? styles.gridItem : undefined}>
            <EntityCard kind={active} item={item} />
          </View>
        ))}
      </View>
    </ResponsiveScreen>
  );
}

const styles = StyleSheet.create({
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  chip: {
    backgroundColor: colors.linen,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9
  },
  chipActive: {
    backgroundColor: colors.ink
  },
  chipText: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '700'
  },
  chipTextActive: {
    color: colors.white
  },
  list: {
    gap: 12
  },
  gridList: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  gridItem: {
    width: '48.5%'
  }
});
