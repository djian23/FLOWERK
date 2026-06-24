import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { eventStatuses, formatCurrency, formatDate, stockConditions } from '@/data/constants';
import { colors } from '@/theme/colors';
import type { Client, EntityKind, Event, Recipe, StockItem, Supplier, Template, Transporter } from '@/types/flowerk';

type Item = Event | StockItem | Client | Supplier | Transporter | Recipe | Template;

interface Props {
  kind: EntityKind;
  item: Item;
}

function statusTone(status: string) {
  if (status.includes('CONFIRME') || status.includes('INSTALLE')) return 'green';
  if (status.includes('DEVIS') || status.includes('ATTENTE')) return 'orange';
  if (status.includes('PREPARATION')) return 'purple';
  if (status.includes('CLOTURE')) return 'neutral';
  return 'blue';
}

export function EntityCard({ kind, item }: Props) {
  if (kind === 'events') {
    const event = item as Event;
    return (
      <Card>
        <View style={styles.rowBetween}>
          <View style={styles.titleGroup}>
            <Text style={styles.title}>{event.name}</Text>
            <Text style={styles.meta}>
              {event.client?.name ? `${event.client.name} · ` : ''}
              {formatDate(event.date)}
            </Text>
          </View>
          <Badge label={eventStatuses[event.status] ?? event.status} tone={statusTone(event.status)} />
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={15} color={colors.taupe} />
          <Text style={styles.detail}>{event.address ?? 'Adresse à préciser'}</Text>
        </View>
        <View style={styles.footerRow}>
          <Text style={styles.strong}>{formatCurrency(event.budget ?? 0)}</Text>
          <Text style={styles.meta}>{event._count?.reservations ?? 0} résa. · {event._count?.documents ?? 0} docs</Text>
        </View>
      </Card>
    );
  }

  if (kind === 'stock') {
    const stock = item as StockItem;
    return (
      <Card>
        <View style={styles.rowBetween}>
          <View style={styles.titleGroup}>
            <Text style={styles.title}>{stock.name}</Text>
            <Text style={styles.meta}>{stock.category?.name ?? 'Sans catégorie'} · {stock.color ?? 'Couleur n/a'}</Text>
          </View>
          <Badge label={stockConditions[stock.condition] ?? stock.condition} tone={stock.condition === 'BON_ETAT' ? 'green' : 'orange'} />
        </View>
        <View style={styles.stockGrid}>
          <Quantity label="Total" value={stock.totalQuantity} />
          <Quantity label="Réservé" value={stock.reservedQuantity ?? 0} tone={colors.orange} />
          <Quantity label="Disponible" value={stock.availableQuantity ?? 0} tone={colors.green} />
        </View>
        <Text style={styles.meta}>{stock.storageLocation ?? 'Emplacement non renseigné'} · {formatCurrency(stock.purchasePrice ?? 0)}</Text>
      </Card>
    );
  }

  const generic = item as Client | Supplier | Transporter | Recipe | Template;
  const secondary =
    'email' in generic && generic.email
      ? generic.email
      : 'specialty' in generic && generic.specialty
        ? generic.specialty
        : 'description' in generic && generic.description
          ? generic.description
          : 'type' in generic && generic.type
            ? generic.type
            : 'phone' in generic && generic.phone
              ? generic.phone
              : 'À compléter';

  return (
    <Card>
      <View style={styles.rowBetween}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{generic.name.charAt(0).toUpperCase()}</Text>
        </View>
        {'_count' in generic && generic._count ? <Badge label={`${generic._count.events} événement(s)`} /> : null}
      </View>
      <Text style={[styles.title, styles.genericTitle]}>{generic.name}</Text>
      <Text style={styles.meta}>{secondary}</Text>
      {'phone' in generic && generic.phone ? <Text style={styles.detail}>{generic.phone}</Text> : null}
      {'estimatedCost' in generic && generic.estimatedCost ? <Text style={styles.strong}>{formatCurrency(generic.estimatedCost)}</Text> : null}
    </Card>
  );
}

function Quantity({ label, value, tone = colors.ink }: { label: string; value: number; tone?: string }) {
  return (
    <View style={styles.quantity}>
      <Text style={styles.meta}>{label}</Text>
      <Text style={[styles.quantityValue, { color: tone }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  rowBetween: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between'
  },
  titleGroup: {
    flex: 1,
    gap: 4
  },
  title: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700'
  },
  genericTitle: {
    marginTop: 12
  },
  meta: {
    color: colors.taupe,
    fontSize: 12,
    lineHeight: 18
  },
  detailRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginTop: 14
  },
  detail: {
    color: colors.muted,
    flex: 1,
    fontSize: 13
  },
  footerRow: {
    alignItems: 'center',
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 14
  },
  strong: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 10
  },
  stockGrid: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 14,
    paddingTop: 14
  },
  quantity: {
    alignItems: 'center',
    flex: 1
  },
  quantityValue: {
    fontSize: 17,
    fontWeight: '800',
    marginTop: 2
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.linen,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40
  },
  avatarText: {
    color: colors.ink,
    fontWeight: '800'
  }
});
