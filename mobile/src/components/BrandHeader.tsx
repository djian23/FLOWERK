import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';

interface Props {
  title: string;
  subtitle?: string;
}

export function BrandHeader({ title, subtitle }: Props) {
  return (
    <View style={styles.container}>
      <View>
        <View style={styles.logo}>
          <Text style={styles.logoText}>FK</Text>
        </View>
        <Text style={styles.kicker}>Administration</Text>
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16
  },
  logo: {
    alignItems: 'center',
    backgroundColor: colors.ink,
    borderColor: colors.linen,
    borderWidth: 1,
    width: 64,
    height: 64,
    borderRadius: 6,
    justifyContent: 'center'
  },
  logoText: {
    color: colors.linen,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1
  },
  kicker: {
    marginTop: 6,
    color: colors.taupe,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  copy: {
    flex: 1
  },
  title: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '700'
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 4
  }
});
