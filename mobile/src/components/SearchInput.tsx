import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TextInput, View } from 'react-native';
import { colors } from '@/theme/colors';

interface Props {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
}

export function SearchInput({ value, onChangeText, placeholder }: Props) {
  return (
    <View style={styles.wrapper}>
      <Ionicons name="search" size={18} color={colors.taupe} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.taupe}
        style={styles.input}
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 48,
    paddingHorizontal: 14
  },
  input: {
    color: colors.ink,
    flex: 1,
    fontSize: 15
  }
});
