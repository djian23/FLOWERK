import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Badge } from '@/components/Badge';
import { BrandHeader } from '@/components/BrandHeader';
import { Card } from '@/components/Card';
import { EntityCard } from '@/components/EntityCard';
import { ResponsiveScreen } from '@/components/ResponsiveScreen';
import { StatGrid } from '@/components/StatGrid';
import { getDashboardSummary, getEvents, isUsingDemoData } from '@/api/flowerk';
import { formatCurrency } from '@/data/constants';
import { colors } from '@/theme/colors';
import type { DashboardSummary, Event } from '@/types/flowerk';

export default function HomeScreen() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    void Promise.all([getDashboardSummary(), getEvents()]).then(([nextSummary, nextEvents]) => {
      setSummary(nextSummary);
      setEvents(nextEvents.slice(0, 3));
    });
  }, []);

  const revenue = summary?.revenue ?? 0;
  const costs = summary?.costs ?? 0;

  return (
    <ResponsiveScreen>
      <BrandHeader title="Bienvenue" subtitle="Vue mobile de votre activité FLOWERK" />
      {isUsingDemoData ? <Badge label="Mode démo · ajoute EXPO_PUBLIC_FLOWERK_API_URL pour brancher le site" /> : null}

      <StatGrid
        stats={[
          { label: 'Événements', value: summary?.events ?? 0, icon: 'calendar-outline', tone: 'blue' },
          { label: 'Clients', value: summary?.clients ?? 0, icon: 'people-outline', tone: 'green' },
          { label: 'Stock', value: summary?.stock ?? 0, icon: 'cube-outline', tone: 'purple' },
          { label: 'Transporteurs', value: summary?.transporters ?? 0, icon: 'car-outline', tone: 'orange' }
        ]}
      />

      <View style={styles.financeRow}>
        <Card style={styles.financeCard}>
          <Text style={styles.financeLabel}>Chiffre d'affaires</Text>
          <Text style={styles.financeValue}>{formatCurrency(revenue)}</Text>
        </Card>
        <Card style={styles.financeCard}>
          <Text style={styles.financeLabel}>Marge brute</Text>
          <Text style={[styles.financeValue, { color: colors.green }]}>{formatCurrency(revenue - costs)}</Text>
        </Card>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Prochains événements</Text>
        <Text style={styles.sectionMeta}>{events.length} affichés</Text>
      </View>
      {events.map((event) => (
        <EntityCard key={event.id} kind="events" item={event} />
      ))}
    </ResponsiveScreen>
  );
}

const styles = StyleSheet.create({
  financeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  financeCard: {
    flex: 1,
    minWidth: 160
  },
  financeLabel: {
    color: colors.taupe,
    fontSize: 12,
    fontWeight: '700'
  },
  financeValue: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '800',
    marginTop: 10
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '800'
  },
  sectionMeta: {
    color: colors.taupe,
    fontSize: 12
  }
});
