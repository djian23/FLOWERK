import { StyleSheet, Text } from 'react-native';
import { colors } from '@/theme/colors';

interface Props {
  label: string;
  tone?: 'neutral' | 'green' | 'blue' | 'orange' | 'red' | 'purple';
}

const toneColors = {
  neutral: { backgroundColor: colors.mist, color: colors.ink },
  green: { backgroundColor: '#DCFCE7', color: colors.green },
  blue: { backgroundColor: '#DBEAFE', color: colors.blue },
  orange: { backgroundColor: '#FFEDD5', color: colors.orange },
  red: { backgroundColor: '#FEE2E2', color: colors.red },
  purple: { backgroundColor: '#EDE9FE', color: colors.purple }
};

export function Badge({ label, tone = 'neutral' }: Props) {
  return <Text style={[styles.badge, toneColors[tone]]}>{label}</Text>;
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    fontSize: 11,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: 9,
    paddingVertical: 5
  }
});
