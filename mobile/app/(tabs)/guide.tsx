import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { BrandHeader } from '@/components/BrandHeader';
import { Card } from '@/components/Card';
import { ResponsiveScreen } from '@/components/ResponsiveScreen';
import { colors } from '@/theme/colors';

const steps = [
  {
    icon: 'phone-portrait-outline',
    title: 'Tester dans Expo Go',
    body: 'Lance npm run start dans mobile, puis scanne le QR code avec Expo Go.'
  },
  {
    icon: 'cloud-outline',
    title: 'Brancher le backend',
    body: 'Définis EXPO_PUBLIC_FLOWERK_API_URL avec l’URL publique du site Next.js pour charger tes vraies données.'
  },
  {
    icon: 'albums-outline',
    title: 'Gérer l’activité',
    body: 'Les onglets Accueil, Gestion, Calendrier et Recherche reprennent les usages principaux du dashboard.'
  },
  {
    icon: 'construct-outline',
    title: 'Prochaine étape',
    body: 'Ajouter les formulaires de création/modification et les fiches détaillées si tu veux une parité complète avec le site.'
  }
] as const;

export default function GuideScreen() {
  return (
    <ResponsiveScreen>
      <BrandHeader title="Guide" subtitle="Mise en route de l’app mobile FLOWERK" />
      <View style={styles.list}>
        {steps.map((step) => (
          <Card key={step.title}>
            <View style={styles.row}>
              <View style={styles.iconWrap}>
                <Ionicons name={step.icon} size={20} color={colors.ink} />
              </View>
              <View style={styles.copy}>
                <Text style={styles.title}>{step.title}</Text>
                <Text style={styles.body}>{step.body}</Text>
              </View>
            </View>
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
  row: {
    flexDirection: 'row',
    gap: 14
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: colors.linen,
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    width: 40
  },
  copy: {
    flex: 1
  },
  title: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '800'
  },
  body: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 4
  }
});
