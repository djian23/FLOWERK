import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // ============================================================
  // 1. DELETE ALL DATA in reverse dependency order
  // ============================================================
  await prisma.inspiration.deleteMany();
  await prisma.moodboardItem.deleteMany();
  await prisma.moodboard.deleteMany();
  await prisma.eventTimeline.deleteMany();
  await prisma.quoteLine.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.floralIngredient.deleteMany();
  await prisma.recipePhoto.deleteMany();
  await prisma.floralRecipe.deleteMany();
  await prisma.templateChecklistItem.deleteMany();
  await prisma.templatePhoto.deleteMany();
  await prisma.eventTemplate.deleteMany();
  await prisma.freshFlowerOrder.deleteMany();
  await prisma.supplierPhoto.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.checklistItem.deleteMany();
  await prisma.eventCost.deleteMany();
  await prisma.document.deleteMany();
  await prisma.mediaItem.deleteMany();
  await prisma.preview.deleteMany();
  await prisma.logisticsDocument.deleteMany();
  await prisma.logistics.deleteMany();
  await prisma.transporterPhoto.deleteMany();
  await prisma.transporter.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.stockPhoto.deleteMany();
  await prisma.stockItem.deleteMany();
  await prisma.stockSubCategory.deleteMany();
  await prisma.stockCategory.deleteMany();
  await prisma.venuePhoto.deleteMany();
  await prisma.clientPhoto.deleteMany();
  await prisma.event.deleteMany();
  await prisma.venue.deleteMany();
  await prisma.client.deleteMany();

  console.log('All data deleted.');

  // ============================================================
  // 2. CREATE CLIENTS
  // ============================================================
  const clientDubois = await prisma.client.create({
    data: {
      name: 'Sophie & Thomas Dubois',
      email: 'sophie.dubois@email.fr',
      phone: '06 12 34 56 78',
      address: '15 rue du Faubourg Saint-Honoré, 75008 Paris',
      source: 'Instagram',
      clientType: 'Particulier',
      preferredStyle: 'Romantique champêtre',
      isVip: true,
    },
  });

  const clientLuxe = await prisma.client.create({
    data: {
      name: 'Entreprise Luxe Paris',
      email: 'events@luxeparis.fr',
      phone: '01 42 56 78 90',
      address: '8 avenue Montaigne, 75008 Paris',
      source: 'Recommandation',
      clientType: 'Entreprise',
      preferredStyle: 'Élégant moderne',
    },
  });

  const clientFontaine = await prisma.client.create({
    data: {
      name: 'Marie-Claire Fontaine',
      email: 'mc.fontaine@gmail.com',
      phone: '06 98 76 54 32',
      address: '42 boulevard Haussmann, 75009 Paris',
      source: 'Bouche à oreille',
      clientType: 'Particulier',
      preferredStyle: 'Classique raffiné',
    },
  });

  const clientMeurice = await prisma.client.create({
    data: {
      name: 'Hôtel Le Meurice',
      email: 'events@lemeurice.com',
      phone: '01 44 58 10 10',
      address: '228 rue de Rivoli, 75001 Paris',
      source: 'Contact direct',
      clientType: 'Entreprise',
      preferredStyle: 'Luxe parisien',
    },
  });

  const clientMartin = await prisma.client.create({
    data: {
      name: 'Amélie & Lucas Martin',
      email: 'amelie.lucas@gmail.com',
      phone: '06 45 67 89 01',
      address: '22 rue de la Paix, 75002 Paris',
      source: 'Wedding planner',
      clientType: 'Particulier',
      preferredStyle: 'Bohème chic',
    },
  });

  const clientPerrin = await prisma.client.create({
    data: {
      name: 'Nathalie Perrin',
      email: 'n.perrin@outlook.fr',
      phone: '06 23 45 67 89',
      address: '5 rue des Rosiers, 75004 Paris',
      source: 'Instagram',
      clientType: 'Particulier',
      preferredStyle: 'Doux pastel',
    },
  });

  console.log('Clients created.');

  // ============================================================
  // 3. STOCK CATEGORIES, SUBCATEGORIES & ITEMS
  // ============================================================

  // --- Category: Vases & Contenants ---
  const catVases = await prisma.stockCategory.create({
    data: { name: 'Vases & Contenants' },
  });

  const itemVaseCylindrique = await prisma.stockItem.create({
    data: {
      name: 'Vase cylindrique transparent',
      categoryId: catVases.id,
      totalQuantity: 20,
      color: 'Transparent',
      purchasePrice: 12.50,
      storageLocation: 'Étagère A1',
    },
  });

  const itemVaseBoule = await prisma.stockItem.create({
    data: {
      name: 'Vase boule doré',
      categoryId: catVases.id,
      totalQuantity: 15,
      color: 'Doré',
      purchasePrice: 18.90,
      storageLocation: 'Étagère A2',
    },
  });

  await prisma.stockItem.create({
    data: {
      name: 'Coupe en cristal',
      categoryId: catVases.id,
      totalQuantity: 8,
      color: 'Transparent',
      purchasePrice: 45.00,
      storageLocation: 'Étagère A3',
    },
  });

  await prisma.stockItem.create({
    data: {
      name: 'Pot en terre cuite',
      categoryId: catVases.id,
      totalQuantity: 25,
      color: 'Terracotta',
      purchasePrice: 8.50,
      storageLocation: 'Étagère A4',
    },
  });

  await prisma.stockItem.create({
    data: {
      name: 'Vase Médicis blanc',
      categoryId: catVases.id,
      totalQuantity: 10,
      color: 'Blanc',
      purchasePrice: 35.00,
      storageLocation: 'Étagère A5',
    },
  });

  // --- Category: Structures & Arches ---
  const catStructures = await prisma.stockCategory.create({
    data: { name: 'Structures & Arches' },
  });

  const itemArcheDoree = await prisma.stockItem.create({
    data: {
      name: 'Arche métallique dorée',
      categoryId: catStructures.id,
      totalQuantity: 3,
      color: 'Doré',
      purchasePrice: 250.00,
      storageLocation: 'Zone B1',
      assemblyTime: 45,
    },
  });

  await prisma.stockItem.create({
    data: {
      name: 'Colonne romaine blanche',
      categoryId: catStructures.id,
      totalQuantity: 6,
      color: 'Blanc',
      purchasePrice: 85.00,
      storageLocation: 'Zone B2',
    },
  });

  await prisma.stockItem.create({
    data: {
      name: 'Support gâteau fleuri',
      categoryId: catStructures.id,
      totalQuantity: 4,
      color: 'Doré',
      purchasePrice: 45.00,
      storageLocation: 'Zone B3',
    },
  });

  await prisma.stockItem.create({
    data: {
      name: 'Arche en bois flotté',
      categoryId: catStructures.id,
      totalQuantity: 2,
      color: 'Naturel',
      purchasePrice: 180.00,
      storageLocation: 'Zone B4',
      archShape: 'rectangulaire',
    },
  });

  // --- Category: Accessoires de table ---
  const catAccessoires = await prisma.stockCategory.create({
    data: { name: 'Accessoires de table' },
  });

  const itemBougeoirDore = await prisma.stockItem.create({
    data: {
      name: 'Bougeoir doré',
      categoryId: catAccessoires.id,
      totalQuantity: 30,
      color: 'Doré',
      purchasePrice: 15.00,
      storageLocation: 'Étagère C1',
    },
  });

  await prisma.stockItem.create({
    data: {
      name: 'Chemin de table lin',
      categoryId: catAccessoires.id,
      totalQuantity: 15,
      color: 'Naturel',
      purchasePrice: 22.00,
      storageLocation: 'Tiroir C2',
    },
  });

  await prisma.stockItem.create({
    data: {
      name: 'Porte-menu doré',
      categoryId: catAccessoires.id,
      totalQuantity: 40,
      color: 'Doré',
      purchasePrice: 5.50,
      storageLocation: 'Tiroir C3',
    },
  });

  await prisma.stockItem.create({
    data: {
      name: 'Sous-assiette dorée',
      categoryId: catAccessoires.id,
      totalQuantity: 50,
      color: 'Doré',
      purchasePrice: 8.00,
      storageLocation: 'Étagère C4',
    },
  });

  await prisma.stockItem.create({
    data: {
      name: 'Rond de serviette floral',
      categoryId: catAccessoires.id,
      totalQuantity: 60,
      color: 'Mixte',
      purchasePrice: 3.00,
      storageLocation: 'Tiroir C5',
    },
  });

  // --- Category: Éclairage ---
  const catEclairage = await prisma.stockCategory.create({
    data: { name: 'Éclairage' },
  });

  await prisma.stockItem.create({
    data: {
      name: 'Bougie pilier blanche',
      categoryId: catEclairage.id,
      totalQuantity: 50,
      color: 'Blanc',
      purchasePrice: 6.00,
      storageLocation: 'Étagère D1',
      candleType: 'pilier',
      burnTime: 40,
    },
  });

  await prisma.stockItem.create({
    data: {
      name: 'Guirlande LED',
      categoryId: catEclairage.id,
      totalQuantity: 12,
      color: 'Blanc chaud',
      purchasePrice: 18.00,
      storageLocation: 'Étagère D2',
    },
  });

  await prisma.stockItem.create({
    data: {
      name: 'Photophore en verre',
      categoryId: catEclairage.id,
      totalQuantity: 25,
      color: 'Transparent',
      purchasePrice: 9.50,
      storageLocation: 'Étagère D3',
    },
  });

  await prisma.stockItem.create({
    data: {
      name: 'Lanterne vintage',
      categoryId: catEclairage.id,
      totalQuantity: 8,
      color: 'Noir',
      purchasePrice: 28.00,
      storageLocation: 'Étagère D4',
    },
  });

  // --- Category: Textiles ---
  const catTextiles = await prisma.stockCategory.create({
    data: { name: 'Textiles' },
  });

  await prisma.stockItem.create({
    data: {
      name: 'Nappe blanche 300cm',
      categoryId: catTextiles.id,
      totalQuantity: 20,
      color: 'Blanc',
      purchasePrice: 35.00,
      storageLocation: 'Étagère E1',
    },
  });

  await prisma.stockItem.create({
    data: {
      name: 'Voilage ivoire',
      categoryId: catTextiles.id,
      totalQuantity: 10,
      color: 'Ivoire',
      purchasePrice: 28.00,
      storageLocation: 'Étagère E2',
    },
  });

  await prisma.stockItem.create({
    data: {
      name: 'Ruban satin champagne',
      categoryId: catTextiles.id,
      totalQuantity: 100,
      color: 'Champagne',
      purchasePrice: 2.50,
      storageLocation: 'Tiroir E3',
    },
  });

  await prisma.stockItem.create({
    data: {
      name: 'Housse de chaise blanche',
      categoryId: catTextiles.id,
      totalQuantity: 80,
      color: 'Blanc',
      purchasePrice: 4.50,
      storageLocation: 'Étagère E4',
    },
  });

  // --- Category: Outils & Matériel ---
  const catOutils = await prisma.stockCategory.create({
    data: { name: 'Outils & Matériel' },
  });

  await prisma.stockItem.create({
    data: {
      name: 'Mousse florale Oasis',
      categoryId: catOutils.id,
      totalQuantity: 200,
      color: 'Vert',
      purchasePrice: 1.80,
      storageLocation: 'Zone F1',
    },
  });

  await prisma.stockItem.create({
    data: {
      name: 'Fil de fer floral',
      categoryId: catOutils.id,
      totalQuantity: 50,
      color: 'Vert',
      purchasePrice: 3.20,
      storageLocation: 'Tiroir F2',
    },
  });

  await prisma.stockItem.create({
    data: {
      name: 'Sécateur professionnel',
      categoryId: catOutils.id,
      totalQuantity: 5,
      purchasePrice: 25.00,
      storageLocation: 'Tiroir F3',
    },
  });

  await prisma.stockItem.create({
    data: {
      name: 'Pistolet à colle',
      categoryId: catOutils.id,
      totalQuantity: 3,
      purchasePrice: 15.00,
      storageLocation: 'Tiroir F4',
    },
  });

  await prisma.stockItem.create({
    data: {
      name: 'Ruban adhésif floral',
      categoryId: catOutils.id,
      totalQuantity: 30,
      color: 'Vert',
      purchasePrice: 4.50,
      storageLocation: 'Tiroir F5',
    },
  });

  console.log('Stock categories and items created.');

  // ============================================================
  // 4. SUPPLIERS
  // ============================================================
  const supplierRungis = await prisma.supplier.create({
    data: {
      name: 'Rungis Fleurs',
      phone: '01 45 12 34 56',
      email: 'commandes@rungisfleurs.fr',
      address: 'MIN de Rungis, 94150 Rungis',
      specialty: 'Fleurs coupées',
      notes: 'Livraison lundi/mercredi/vendredi',
    },
  });

  const supplierHolland = await prisma.supplier.create({
    data: {
      name: 'Holland Flowers Direct',
      phone: '+31 20 123 4567',
      email: 'orders@hollandflowers.nl',
      address: 'Aalsmeer, Pays-Bas',
      specialty: 'Fleurs importées premium',
      notes: 'Commande minimum 48h à l\'avance',
    },
  });

  const supplierFeuillages = await prisma.supplier.create({
    data: {
      name: 'Feuillages du Sud',
      phone: '04 93 45 67 89',
      email: 'contact@feuillages-sud.fr',
      address: 'Route des Mimosas, 06130 Grasse',
      specialty: 'Feuillages et verdure',
      notes: 'Eucalyptus, olivier, fougères',
    },
  });

  console.log('Suppliers created.');

  // ============================================================
  // 5. TRANSPORTERS
  // ============================================================
  const transporterExpress = await prisma.transporter.create({
    data: {
      name: 'Express Livraison Événements',
      phone: '01 56 78 90 12',
      email: 'dispatch@express-evenements.fr',
      notes: 'Camion réfrigéré disponible',
    },
  });

  const transporterDeco = await prisma.transporter.create({
    data: {
      name: 'Transport Déco IDF',
      phone: '06 78 90 12 34',
      email: 'contact@transport-deco-idf.fr',
      notes: 'Spécialiste décoration événementielle Île-de-France',
    },
  });

  console.log('Transporters created.');

  // ============================================================
  // 6. EVENTS
  // ============================================================
  const eventMariageDubois = await prisma.event.create({
    data: {
      name: 'Mariage Dubois',
      clientId: clientDubois.id,
      status: 'CLOTURE',
      date: new Date('2026-07-12T14:00:00'),
      address: 'Château de Versailles, 78000 Versailles',
      type: 'Mariage',
      style: 'Romantique champêtre',
      budget: 8500,
      guestCount: 150,
      roundTables: 15,
      centerpieces: 15,
      ceremonyCompositions: 4,
      description: 'Mariage champêtre aux tons pastels avec roses, pivoines et eucalyptus',
    },
  });

  const eventGalaLuxe = await prisma.event.create({
    data: {
      name: 'Gala Entreprise Luxe',
      clientId: clientLuxe.id,
      status: 'CONFIRME',
      date: new Date('2026-09-20T19:00:00'),
      address: 'Pavillon Gabriel, 5 avenue Gabriel, 75008 Paris',
      type: 'Gala',
      style: 'Élégant moderne',
      budget: 15000,
      guestCount: 200,
      description: 'Gala annuel avec thème or et blanc',
    },
  });

  const eventMariageMartin = await prisma.event.create({
    data: {
      name: 'Mariage Martin',
      clientId: clientMartin.id,
      status: 'EN_ATTENTE_VALIDATION',
      date: new Date('2026-10-04T15:00:00'),
      address: 'Domaine de Chantilly, 60500 Chantilly',
      type: 'Mariage',
      style: 'Bohème chic',
      budget: 6000,
      guestCount: 100,
      description: 'Mariage bohème avec arche florale et tons neutres',
    },
  });

  const eventAnniversaireFontaine = await prisma.event.create({
    data: {
      name: 'Anniversaire Fontaine',
      clientId: clientFontaine.id,
      status: 'DEVIS_EN_COURS',
      date: new Date('2026-11-15T19:30:00'),
      address: 'Restaurant Le Grand Véfour, 75001 Paris',
      type: 'Anniversaire',
      budget: 3500,
      guestCount: 50,
      description: '50 ans - décoration florale classique et raffinée',
    },
  });

  const eventBabyShower = await prisma.event.create({
    data: {
      name: 'Baby Shower Nathalie',
      clientId: clientPerrin.id,
      status: 'PREPARATION_EN_COURS',
      date: new Date('2026-08-30T14:00:00'),
      address: '5 rue des Rosiers, 75004 Paris',
      type: 'Baby shower',
      style: 'Doux pastel',
      budget: 1500,
      guestCount: 25,
      description: 'Baby shower avec tons roses et blancs, ballons et fleurs',
    },
  });

  const eventNoelMeurice = await prisma.event.create({
    data: {
      name: 'Décoration Noël Meurice',
      clientId: clientMeurice.id,
      status: 'CONFIRME',
      date: new Date('2026-12-01T08:00:00'),
      address: '228 rue de Rivoli, 75001 Paris',
      type: 'Décoration hôtelière',
      style: 'Luxe parisien',
      budget: 25000,
      description: 'Décoration de Noël du hall et des salons',
    },
  });

  console.log('Events created.');

  // ============================================================
  // 6b. VENUES
  // ============================================================
  const venueChateau = await prisma.venue.create({
    data: {
      name: 'Château de Vaux-le-Vicomte',
      address: '77950 Maincy',
      city: 'Maincy',
      type: 'Château',
      capacity: 300,
      contactName: 'Marie Dupont',
      contactPhone: '01 64 14 41 90',
      notes: 'Magnifique château avec jardins à la française. Salle des gardes pour le dîner, orangerie pour le cocktail.',
    },
  });

  const venueDomaine = await prisma.venue.create({
    data: {
      name: 'Domaine de la Butte Ronde',
      address: '78120 Sonchamp',
      city: 'Sonchamp',
      type: 'Domaine',
      capacity: 200,
      contactName: 'Pierre Martin',
      contactPhone: '01 34 85 12 00',
      notes: 'Domaine champêtre avec granges rénovées. Idéal pour mariages bohèmes.',
    },
  });

  const venueHotel = await prisma.venue.create({
    data: {
      name: 'Hôtel Le Meurice - Salon Pompadour',
      address: '228 rue de Rivoli, 75001 Paris',
      city: 'Paris',
      type: 'Hôtel',
      capacity: 150,
      contactName: 'Jean-Luc Petit',
      contactPhone: '01 44 58 10 10',
      contactEmail: 'events@lemeurice.com',
      notes: 'Salon Pompadour avec plafonds dorés. Très luxueux, prévoir compositions hautes.',
    },
  });

  const venueJardin = await prisma.venue.create({
    data: {
      name: 'Jardin des Tuileries - Espace privé',
      address: '113 rue de Rivoli, 75001 Paris',
      city: 'Paris',
      type: 'Jardin',
      capacity: 100,
      contactName: 'Sophie Leclerc',
      contactPhone: '01 40 20 90 43',
      notes: 'Espace privatisable dans les Tuileries. Extérieur uniquement, prévoir plan B pluie.',
    },
  });

  await prisma.event.update({ where: { id: eventMariageDubois.id }, data: { venueId: venueChateau.id } });
  await prisma.event.update({ where: { id: eventGalaLuxe.id }, data: { venueId: venueHotel.id } });
  await prisma.event.update({ where: { id: eventMariageMartin.id }, data: { venueId: venueDomaine.id } });
  await prisma.event.update({ where: { id: eventBabyShower.id }, data: { venueId: venueJardin.id } });

  await prisma.venuePhoto.createMany({
    data: [
      { venueId: venueChateau.id, url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800', eventName: 'Mariage Dubois', caption: 'Décoration table d\'honneur - Salle des gardes' },
      { venueId: venueChateau.id, url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800', eventName: 'Mariage Dubois', caption: 'Allée de cérémonie dans les jardins' },
      { venueId: venueHotel.id, url: 'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800', eventName: 'Gala Prestige', caption: 'Compositions hautes Salon Pompadour' },
      { venueId: venueHotel.id, url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800', eventName: 'Gala Prestige', caption: 'Runner table principale' },
      { venueId: venueDomaine.id, url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800', eventName: 'Mariage Martin', caption: 'Centres de table grange principale' },
      { venueId: venueJardin.id, url: 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?w=800', eventName: 'Baby Shower Rousseau', caption: 'Déco candy bar extérieur' },
    ],
  });
  console.log('Venues and venue photos created.');

  // ============================================================
  // 7. QUOTES with LINE ITEMS
  // ============================================================

  // Quote for Mariage Dubois
  const quoteDuboisTotalHT = 15 * 85.00 + 1 * 250.00 + 4 * 180.00 + 1 * 650.00 + 8 * 25.00;
  const quoteDubois = await prisma.quote.create({
    data: {
      eventId: eventMariageDubois.id,
      quoteNumber: 'D000001',
      status: 'ACCEPTE',
      validUntil: new Date('2026-06-15T23:59:59'),
      totalHT: quoteDuboisTotalHT,
      conditions: 'Acompte de 30% à la signature. Solde 7 jours avant l\'événement.',
    },
  });

  await prisma.quoteLine.create({
    data: {
      quoteId: quoteDubois.id,
      prestation: 'Centre de table champêtre',
      quantity: 15,
      unitPrice: 85.00,
      order: 0,
    },
  });
  await prisma.quoteLine.create({
    data: {
      quoteId: quoteDubois.id,
      prestation: 'Bouquet de mariée',
      quantity: 1,
      unitPrice: 250.00,
      order: 1,
    },
  });
  await prisma.quoteLine.create({
    data: {
      quoteId: quoteDubois.id,
      prestation: 'Compositions cérémonie',
      quantity: 4,
      unitPrice: 180.00,
      order: 2,
    },
  });
  await prisma.quoteLine.create({
    data: {
      quoteId: quoteDubois.id,
      prestation: 'Arche florale cérémonie',
      quantity: 1,
      unitPrice: 650.00,
      order: 3,
    },
  });
  await prisma.quoteLine.create({
    data: {
      quoteId: quoteDubois.id,
      prestation: 'Boutonnières et corsages',
      quantity: 8,
      unitPrice: 25.00,
      order: 4,
    },
  });

  // Quote for Gala Entreprise Luxe
  const quoteGalaTotalHT = 20 * 120.00 + 1 * 800.00 + 2 * 350.00 + 4 * 280.00;
  const quoteGala = await prisma.quote.create({
    data: {
      eventId: eventGalaLuxe.id,
      quoteNumber: 'D000002',
      status: 'ENVOYE',
      validUntil: new Date('2026-08-01T23:59:59'),
      totalHT: quoteGalaTotalHT,
      conditions: 'Devis valable 30 jours. Facture à réception.',
    },
  });

  await prisma.quoteLine.create({
    data: {
      quoteId: quoteGala.id,
      prestation: 'Compositions florales tables',
      quantity: 20,
      unitPrice: 120.00,
      order: 0,
    },
  });
  await prisma.quoteLine.create({
    data: {
      quoteId: quoteGala.id,
      prestation: 'Arrangement scène principale',
      quantity: 1,
      unitPrice: 800.00,
      order: 1,
    },
  });
  await prisma.quoteLine.create({
    data: {
      quoteId: quoteGala.id,
      prestation: 'Décoration buffet',
      quantity: 2,
      unitPrice: 350.00,
      order: 2,
    },
  });
  await prisma.quoteLine.create({
    data: {
      quoteId: quoteGala.id,
      prestation: 'Guirlandes florales suspendues',
      quantity: 4,
      unitPrice: 280.00,
      order: 3,
    },
  });

  // Quote for Anniversaire Fontaine
  const quoteFontaineTotalHT = 5 * 75.00 + 1 * 180.00 + 1 * 120.00 + 6 * 35.00;
  const quoteFontaine = await prisma.quote.create({
    data: {
      eventId: eventAnniversaireFontaine.id,
      quoteNumber: 'D000003',
      status: 'BROUILLON',
      totalHT: quoteFontaineTotalHT,
    },
  });

  await prisma.quoteLine.create({
    data: {
      quoteId: quoteFontaine.id,
      prestation: 'Centre de table classique',
      quantity: 5,
      unitPrice: 75.00,
      order: 0,
    },
  });
  await prisma.quoteLine.create({
    data: {
      quoteId: quoteFontaine.id,
      prestation: 'Composition entrée',
      quantity: 1,
      unitPrice: 180.00,
      order: 1,
    },
  });
  await prisma.quoteLine.create({
    data: {
      quoteId: quoteFontaine.id,
      prestation: 'Décoration gâteau',
      quantity: 1,
      unitPrice: 120.00,
      order: 2,
    },
  });
  await prisma.quoteLine.create({
    data: {
      quoteId: quoteFontaine.id,
      prestation: 'Petits bouquets décoratifs',
      quantity: 6,
      unitPrice: 35.00,
      order: 3,
    },
  });

  console.log('Quotes and quote lines created.');

  // ============================================================
  // 8. INVOICES
  // ============================================================
  await prisma.invoice.create({
    data: {
      quoteId: quoteDubois.id,
      eventId: eventMariageDubois.id,
      invoiceNumber: 'F000001',
      status: 'PAYEE',
      clientName: 'Sophie & Thomas Dubois',
      clientAddress: '15 rue du Faubourg Saint-Honoré, 75008 Paris',
      clientEmail: 'sophie.dubois@email.fr',
      totalHT: quoteDuboisTotalHT,
      issuedDate: new Date('2026-06-20T10:00:00'),
      dueDate: new Date('2026-07-05T23:59:59'),
      paidDate: new Date('2026-06-28T14:30:00'),
    },
  });

  await prisma.invoice.create({
    data: {
      eventId: eventBabyShower.id,
      invoiceNumber: 'F000002',
      status: 'ENVOYEE',
      clientName: 'Nathalie Perrin',
      clientAddress: '5 rue des Rosiers, 75004 Paris',
      clientEmail: 'n.perrin@outlook.fr',
      totalHT: 1200,
      issuedDate: new Date('2026-08-01T10:00:00'),
      dueDate: new Date('2026-08-30T23:59:59'),
    },
  });

  console.log('Invoices created.');

  // ============================================================
  // 9. EVENT COSTS for Mariage Dubois
  // ============================================================
  await prisma.eventCost.create({
    data: {
      eventId: eventMariageDubois.id,
      flowers: 1200,
      freshFlowersCost: 800,
      materials: 350,
      labor: 1500,
      delivery: 300,
      subcontracting: 0,
      misc: 150,
      invoicedPrice: quoteDuboisTotalHT,
      deposit: 2452.50,
      depositDate: new Date('2026-06-25T10:00:00'),
    },
  });

  console.log('Event costs created.');

  // ============================================================
  // 10. RESERVATIONS
  // ============================================================
  await prisma.reservation.create({
    data: {
      eventId: eventMariageDubois.id,
      stockItemId: itemVaseCylindrique.id,
      quantity: 15,
    },
  });

  await prisma.reservation.create({
    data: {
      eventId: eventMariageDubois.id,
      stockItemId: itemBougeoirDore.id,
      quantity: 3,
    },
  });

  await prisma.reservation.create({
    data: {
      eventId: eventMariageDubois.id,
      stockItemId: itemArcheDoree.id,
      quantity: 1,
    },
  });

  console.log('Reservations created.');

  // ============================================================
  // 11. CHECKLISTS
  // ============================================================

  // Mariage Dubois checklist (all done)
  const duboisChecklist = [
    'Confirmer commande fleurs Rungis',
    'Préparer centres de table',
    'Assembler arche florale',
    'Livraison au château',
    'Installation salle',
    'Démontage post-événement',
  ];
  for (let i = 0; i < duboisChecklist.length; i++) {
    await prisma.checklistItem.create({
      data: {
        eventId: eventMariageDubois.id,
        label: duboisChecklist[i],
        done: true,
        order: i,
      },
    });
  }

  // Gala Luxe checklist (partially done)
  const galaChecklist = [
    { label: 'Valider palette de couleurs', done: true },
    { label: 'Commander fleurs importées', done: false },
    { label: 'Préparer compositions', done: false },
    { label: 'Livraison et installation', done: false },
  ];
  for (let i = 0; i < galaChecklist.length; i++) {
    await prisma.checklistItem.create({
      data: {
        eventId: eventGalaLuxe.id,
        label: galaChecklist[i].label,
        done: galaChecklist[i].done,
        order: i,
      },
    });
  }

  console.log('Checklists created.');

  // ============================================================
  // 12. FLORAL RECIPES
  // ============================================================

  // Recipe: Centre de table champêtre
  const recipeCentre = await prisma.floralRecipe.create({
    data: {
      name: 'Centre de table champêtre',
      description: 'Composition ronde dans un vase en verre avec eucalyptus, roses et pivoines',
      prepTime: 30,
      estimatedCost: 35.00,
    },
  });

  await prisma.floralIngredient.create({
    data: { recipeId: recipeCentre.id, name: 'Eucalyptus', quantity: 3, unit: 'branches' },
  });
  await prisma.floralIngredient.create({
    data: { recipeId: recipeCentre.id, name: 'Roses spray', quantity: 5, unit: 'tiges' },
  });
  await prisma.floralIngredient.create({
    data: { recipeId: recipeCentre.id, name: 'Pivoines', quantity: 3, unit: 'tiges' },
  });
  await prisma.floralIngredient.create({
    data: { recipeId: recipeCentre.id, name: 'Gypsophile', quantity: 2, unit: 'branches' },
  });
  await prisma.floralIngredient.create({
    data: { recipeId: recipeCentre.id, name: 'Mousse florale', quantity: 1, unit: 'bloc' },
  });

  // Recipe: Bouquet de mariée classique
  const recipeBouquet = await prisma.floralRecipe.create({
    data: {
      name: 'Bouquet de mariée classique',
      description: 'Bouquet rond classique en roses blanches et gypsophile avec ruban satin',
      prepTime: 45,
      estimatedCost: 65.00,
    },
  });

  await prisma.floralIngredient.create({
    data: { recipeId: recipeBouquet.id, name: 'Roses blanches', quantity: 12, unit: 'tiges' },
  });
  await prisma.floralIngredient.create({
    data: { recipeId: recipeBouquet.id, name: 'Gypsophile', quantity: 5, unit: 'branches' },
  });
  await prisma.floralIngredient.create({
    data: { recipeId: recipeBouquet.id, name: 'Ruban satin', quantity: 1, unit: 'mètre' },
  });
  await prisma.floralIngredient.create({
    data: { recipeId: recipeBouquet.id, name: 'Fil de fer floral', quantity: 2, unit: 'tiges' },
  });

  // Recipe: Arche cérémonie romantique
  const recipeArche = await prisma.floralRecipe.create({
    data: {
      name: 'Arche cérémonie romantique',
      description: 'Décoration d\'arche avec hortensias, lisianthus et feuillage retombant',
      prepTime: 120,
      estimatedCost: 180.00,
    },
  });

  await prisma.floralIngredient.create({
    data: { recipeId: recipeArche.id, name: 'Hortensias', quantity: 8, unit: 'têtes' },
  });
  await prisma.floralIngredient.create({
    data: { recipeId: recipeArche.id, name: 'Lisianthus', quantity: 15, unit: 'tiges' },
  });
  await prisma.floralIngredient.create({
    data: { recipeId: recipeArche.id, name: 'Lierre', quantity: 5, unit: 'branches' },
  });
  await prisma.floralIngredient.create({
    data: { recipeId: recipeArche.id, name: 'Eucalyptus', quantity: 10, unit: 'branches' },
  });
  await prisma.floralIngredient.create({
    data: { recipeId: recipeArche.id, name: 'Mousse florale', quantity: 3, unit: 'blocs' },
  });
  await prisma.floralIngredient.create({
    data: { recipeId: recipeArche.id, name: 'Fil de fer floral', quantity: 5, unit: 'tiges' },
  });

  console.log('Floral recipes created.');

  // ============================================================
  // 13. EVENT TEMPLATES
  // ============================================================

  // Template: Mariage Champêtre
  const templateMariage = await prisma.eventTemplate.create({
    data: {
      name: 'Mariage Champêtre',
      type: 'Mariage',
      style: 'Champêtre',
      description: 'Template pour mariages champêtres avec touches naturelles et rustiques',
    },
  });

  const mariageChecklistLabels = [
    'Rendez-vous client découverte',
    'Proposition moodboard',
    'Validation palette de couleurs',
    'Commande fleurs',
    'Commande matériel',
    'Préparation compositions',
    'Livraison et installation',
    'Démontage et retour matériel',
    'Bilan post-événement',
  ];
  for (let i = 0; i < mariageChecklistLabels.length; i++) {
    await prisma.templateChecklistItem.create({
      data: {
        templateId: templateMariage.id,
        label: mariageChecklistLabels[i],
        order: i,
      },
    });
  }

  // Template: Gala Corporate
  const templateGala = await prisma.eventTemplate.create({
    data: {
      name: 'Gala Corporate',
      type: 'Gala',
      style: 'Élégant',
      description: 'Template pour galas et événements d\'entreprise haut de gamme',
    },
  });

  const galaTemplateLabels = [
    'Brief client et objectifs',
    'Proposition créative',
    'Validation budget et devis',
    'Sourcing fleurs et matériel',
    'Installation jour J',
    'Démontage et facturation',
  ];
  for (let i = 0; i < galaTemplateLabels.length; i++) {
    await prisma.templateChecklistItem.create({
      data: {
        templateId: templateGala.id,
        label: galaTemplateLabels[i],
        order: i,
      },
    });
  }

  console.log('Event templates created.');

  // ============================================================
  // 14. FRESH FLOWER ORDERS for Mariage Dubois
  // ============================================================
  await prisma.freshFlowerOrder.create({
    data: {
      eventId: eventMariageDubois.id,
      supplierId: supplierRungis.id,
      species: 'Roses spray rose poudré',
      quantity: 80,
      unit: 'tiges',
      unitPrice: 1.80,
      orderDate: new Date('2026-07-05T09:00:00'),
      deliveryDate: new Date('2026-07-11T06:00:00'),
      received: true,
    },
  });

  await prisma.freshFlowerOrder.create({
    data: {
      eventId: eventMariageDubois.id,
      supplierId: supplierHolland.id,
      species: 'Pivoines blanches',
      quantity: 45,
      unit: 'tiges',
      unitPrice: 3.50,
      orderDate: new Date('2026-07-03T10:00:00'),
      deliveryDate: new Date('2026-07-10T07:00:00'),
      received: true,
    },
  });

  await prisma.freshFlowerOrder.create({
    data: {
      eventId: eventMariageDubois.id,
      supplierId: supplierFeuillages.id,
      species: 'Eucalyptus cinerea',
      quantity: 30,
      unit: 'branches',
      unitPrice: 2.00,
      orderDate: new Date('2026-07-06T08:00:00'),
      deliveryDate: new Date('2026-07-11T07:00:00'),
      received: true,
    },
  });

  console.log('Fresh flower orders created.');

  // ============================================================
  // 11. MOODBOARDS
  // ============================================================
  const moodboard1 = await prisma.moodboard.create({
    data: {
      eventId: eventMariageDubois.id,
      title: 'Moodboard — Mariage Dubois',
      notes: 'Ambiance champêtre et romantique, tons pastel avec touches de vert eucalyptus. Inspiration jardins anglais.',
    },
  });

  await prisma.moodboardItem.createMany({
    data: [
      { moodboardId: moodboard1.id, url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800', title: 'Centre de table champêtre', description: 'Bouquet rond avec pivoines roses et eucalyptus dans un vase en laiton doré', order: 0 },
      { moodboardId: moodboard1.id, url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', title: 'Arche de cérémonie', description: 'Arche en bois flotté habillée de roses blanches et feuillages retombants', order: 1 },
      { moodboardId: moodboard1.id, url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800', title: 'Décoration allée', description: 'Petits bouquets de lavande et gypsophile le long de l\'allée de cérémonie', order: 2 },
      { moodboardId: moodboard1.id, url: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=800', title: 'Bouquet de mariée', description: 'Bouquet cascade avec roses David Austin, pivoines et renoncules', order: 3 },
    ],
  });

  const moodboard2 = await prisma.moodboard.create({
    data: {
      eventId: eventGalaLuxe.id,
      title: 'Moodboard — Gala Prestige',
      notes: 'Ambiance luxueuse et élégante. Palette or, blanc et vert profond. Grande hauteur pour les compositions.',
    },
  });

  await prisma.moodboardItem.createMany({
    data: [
      { moodboardId: moodboard2.id, url: 'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800', title: 'Composition haute', description: 'Grand vase en cristal avec orchidées blanches et branches de saule', order: 0 },
      { moodboardId: moodboard2.id, url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800', title: 'Table d\'honneur', description: 'Runner de verdure luxuriante avec bougies dorées et roses blanches', order: 1 },
      { moodboardId: moodboard2.id, url: 'https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=800', title: 'Entrée de salle', description: 'Grande urne fleurie avec hortensias blancs et lys à l\'entrée', order: 2 },
    ],
  });

  const moodboard3 = await prisma.moodboard.create({
    data: {
      eventId: eventBabyShower.id,
      title: 'Moodboard — Baby Shower Rousseau',
      notes: 'Doux et féminin, tons rose poudré et crème. Ambiance cosy et chaleureuse.',
    },
  });

  await prisma.moodboardItem.createMany({
    data: [
      { moodboardId: moodboard3.id, url: 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?w=800', title: 'Table sucrée', description: 'Petits bouquets roses et blancs autour du candy bar', order: 0 },
      { moodboardId: moodboard3.id, url: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800', title: 'Guirlande florale', description: 'Guirlande de roses miniatures et gypsophile pour la décoration murale', order: 1 },
    ],
  });

  console.log('Moodboards created.');

  // ============================================================
  // INSPIRATIONS
  // ============================================================
  await prisma.inspiration.createMany({
    data: [
      { url: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800', title: 'Arche florale asymétrique', description: 'Belle arche avec roses garden et feuillages retombants', tags: 'arche,mariage,roses,asymétrique', source: 'Pinterest' },
      { url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800', title: 'Centre de table bas rond', description: 'Composition basse avec pivoines et eucalyptus dans vase doré', tags: 'centre de table,pivoines,eucalyptus,doré', source: 'Instagram @flowerstudio' },
      { url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800', title: 'Runner végétal luxe', description: 'Chemin de table en verdure avec bougies et touches dorées', tags: 'runner,verdure,luxe,bougies,doré', source: 'Magazine Mariée' },
      { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', title: 'Suspension florale plafond', description: 'Installation suspendue avec wisteria et roses blanches', tags: 'suspension,plafond,wisteria,blanc', source: 'Pinterest' },
      { url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800', title: 'Allée de cérémonie lavande', description: 'Petits bouquets de lavande le long des chaises', tags: 'cérémonie,lavande,allée,champêtre', source: 'Blog mariage' },
      { url: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=800', title: 'Bouquet cascade moderne', description: 'Bouquet de mariée cascade avec orchidées et verdure', tags: 'bouquet,cascade,orchidées,moderne', source: 'Instagram @bridalflowers' },
      { url: 'https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=800', title: 'Urne d\'entrée majestueuse', description: 'Grande composition dans urne en pierre à l\'entrée du château', tags: 'urne,entrée,grand format,château', source: 'Salon du mariage' },
      { url: 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?w=800', title: 'Décoration candy bar', description: 'Petits arrangements floraux autour du bar à bonbons', tags: 'candy bar,mignon,pastel,baby shower', source: 'Pinterest' },
    ],
  });
  console.log('Inspirations created.');

  // ============================================================
  // DONE
  // ============================================================
  console.log('Seed completed successfully!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
