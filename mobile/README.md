# FLOWERK Mobile

Application Expo Go du dashboard FLOWERK.

## Lancer l'app

```bash
cd mobile
npm install
npm run start
```

Scanne ensuite le QR code avec Expo Go.

## Brancher l'API du site

Par défaut, l'app utilise des données de démonstration pour être testable tout de suite. Pour utiliser le backend Next.js existant, ajoute l'URL publique du site:

```bash
EXPO_PUBLIC_FLOWERK_API_URL=https://ton-site.com npm run start
```

L'app appelle les routes existantes du site: `/api/events`, `/api/clients`, `/api/stock`, `/api/suppliers`, `/api/transporters`, `/api/recipes`, `/api/templates` et `/api/analytics`.
