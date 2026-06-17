import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { colors } from '@/theme/colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.taupe,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          height: 66,
          paddingBottom: 10,
          paddingTop: 8
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700'
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="management"
        options={{
          title: 'Gestion',
          tabBarIcon: ({ color, size }) => <Ionicons name="folder-open-outline" color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendrier',
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Recherche',
          tabBarIcon: ({ color, size }) => <Ionicons name="search-outline" color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="guide"
        options={{
          title: 'Guide',
          tabBarIcon: ({ color, size }) => <Ionicons name="book-outline" color={color} size={size} />
        }}
      />
    </Tabs>
  );
}
