import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';

interface Props extends PropsWithChildren {
  padded?: boolean;
}

export function ResponsiveScreen({ children, padded = true }: Props) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={[styles.scroll, padded && styles.padded]}>
        <View style={[styles.content, isTablet && styles.tabletContent]}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.paper
  },
  scroll: {
    flexGrow: 1
  },
  padded: {
    padding: 16,
    paddingBottom: 32
  },
  content: {
    width: '100%',
    gap: 16
  },
  tabletContent: {
    maxWidth: 980,
    alignSelf: 'center'
  }
});
