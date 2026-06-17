import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Card } from '@/components/Card';
import { colors } from '@/theme/colors';

interface Stat {
  label: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  tone: 'blue' | 'green' | 'purple' | 'orange' | 'neutral';
}

const toneColors = {
  blue: colors.blue,
  green: colors.green,
  purple: colors.purple,
  orange: colors.orange,
  neutral: colors.ink
};

export function StatGrid({ stats }: { stats: Stat[] }) {
  const { width } = useWindowDimensions();
  const columns = width >= 900 ? 4 : width >= 600 ? 2 : 2;

  return (
    <View style={styles.grid}>
      {stats.map((stat) => (
        <Card key={stat.label} style={[styles.item, { width: `${100 / columns - 2}%` }]}>
          <View style={[styles.iconWrap, { backgroundColor: `${toneColors[stat.tone]}18` }]}>
            <Ionicons name={stat.icon} size={18} color={toneColors[stat.tone]} />
          </View>
          <Text style={styles.value}>{stat.value}</Text>
          <Text style={styles.label}>{stat.label}</Text>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  item: {
    minWidth: 150
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: 8,
    height: 34,
    justifyContent: 'center',
    marginBottom: 16,
    width: 34
  },
  value: {
    color: colors.ink,
    fontSize: 26,
    fontWeight: '800'
  },
  label: {
    color: colors.taupe,
    fontSize: 12,
    marginTop: 4
  }
});
