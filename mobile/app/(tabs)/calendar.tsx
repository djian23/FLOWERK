import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BrandHeader } from '@/components/BrandHeader';
import { Card } from '@/components/Card';
import { ResponsiveScreen } from '@/components/ResponsiveScreen';
import { getEvents } from '@/api/flowerk';
import { eventStatuses, formatDate } from '@/data/constants';
import { colors } from '@/theme/colors';
import type { Event } from '@/types/flowerk';

export default function CalendarScreen() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    void getEvents().then(setEvents);
  }, []);

  const sorted = useMemo(
    () => [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [events]
  );

  return (
    <ResponsiveScreen>
      <BrandHeader title="Calendrier" subtitle="Planning des événements et installations" />
      {sorted.map((event, index) => (
        <View key={event.id} style={styles.timelineRow}>
          <View style={styles.timeline}>
            <View style={styles.dot} />
            {index < sorted.length - 1 ? <View style={styles.line} /> : null}
          </View>
          <Card style={styles.card}>
            <Text style={styles.date}>{formatDate(event.date)}</Text>
            <Text style={styles.title}>{event.name}</Text>
            <Text style={styles.meta}>{event.client?.name ?? 'Client à préciser'} · {eventStatuses[event.status] ?? event.status}</Text>
            <Text style={styles.address}>{event.address ?? 'Adresse non renseignée'}</Text>
          </Card>
        </View>
      ))}
    </ResponsiveScreen>
  );
}

const styles = StyleSheet.create({
  timelineRow: {
    flexDirection: 'row',
    gap: 12
  },
  timeline: {
    alignItems: 'center',
    width: 18
  },
  dot: {
    backgroundColor: colors.ink,
    borderRadius: 6,
    height: 12,
    marginTop: 20,
    width: 12
  },
  line: {
    backgroundColor: colors.border,
    flex: 1,
    marginTop: 4,
    width: 2
  },
  card: {
    flex: 1
  },
  date: {
    color: colors.taupe,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase'
  },
  title: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '800',
    marginTop: 6
  },
  meta: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 4
  },
  address: {
    color: colors.taupe,
    fontSize: 12,
    marginTop: 10
  }
});
