'use client'

import { useState } from 'react'

const SECTIONS = [
  { id: 'intro', label: '👋 Introduction', group: null },
  { id: 'dashboard', label: 'Tableau de bord', group: 'Vues globales' },
  { id: 'analytics', label: 'Analytiques', group: 'Vues globales' },
  { id: 'calendar', label: 'Calendrier', group: 'Vues globales' },
  { id: 'search', label: 'Recherche', group: 'Vues globales' },
  { id: 'events', label: 'Événements', group: 'Gestion' },
  { id: 'events-reservations', label: '↳ Réservations', group: 'Gestion' },
  { id: 'events-logistics', label: '↳ Logistique', group: 'Gestion' },
  { id: 'events-previews', label: '↳ Previews', group: 'Gestion' },
  { id: 'events-gallery', label: '↳ Galerie finale', group: 'Gestion' },
  { id: 'events-documents', label: '↳ Documents', group: 'Gestion' },
  { id: 'events-finance', label: '↳ Finance', group: 'Gestion' },
  { id: 'events-checklist', label: '↳ Checklist', group: 'Gestion' },
  { id: 'events-fresh', label: '↳ Fleurs fraîches', group: 'Gestion' },
  { id: 'events-timeline', label: '↳ Timeline', group: 'Gestion' },
  { id: 'stock', label: 'Stock', group: 'Gestion' },
  { id: 'clients', label: 'Clients', group: 'Gestion' },
  { id: 'suppliers', label: 'Fournisseurs', group: 'Gestion' },
  { id: 'transporters', label: 'Transporteurs', group: 'Gestion' },
  { id: 'recipes', label: 'Compositions florales', group: 'Outils' },
  { id: 'templates', label: 'Templates', group: 'Outils' },
]

const STATUS_LIST = [
  { label: 'Devis en cours', color: 'bg-yellow-100 text-yellow-800', desc: 'Premier contact, devis en préparation.' },
  { label: 'En attente de validation', color: 'bg-orange-100 text-orange-800', desc: 'Devis envoyé, on attend la réponse du client.' },
  { label: 'Confirmé', color: 'bg-blue-100 text-blue-800', desc: 'Le client a validé, l\'événement est acté.' },
  { label: 'Préparation en cours', color: 'bg-purple-100 text-purple-800', desc: 'Tu prépares le matériel, tu commandes les fleurs.' },
  { label: 'Prêt à partir', color: 'bg-indigo-100 text-indigo-800', desc: 'Tout est prêt, en attente du transporteur.' },
  { label: 'Enlevé par le transporteur', color: 'bg-cyan-100 text-cyan-800', desc: 'Le matériel est parti de chez toi.' },
  { label: 'En route', color: 'bg-sky-100 text-sky-800', desc: 'Le transporteur est en chemin vers le lieu.' },
  { label: 'Installé', color: 'bg-green-100 text-green-800', desc: 'La décoration est en place sur le lieu.' },
  { label: 'Événement terminé', color: 'bg-teal-100 text-teal-800', desc: 'L\'événement s\'est déroulé.' },
  { label: 'Retour prévu', color: 'bg-amber-100 text-amber-800', desc: 'Le retour du matériel est planifié.' },
  { label: 'Retour en cours', color: 'bg-orange-100 text-orange-800', desc: 'Le transporteur ramène le matériel.' },
  { label: 'Vérification du matériel', color: 'bg-rose-100 text-rose-800', desc: 'Tu vérifies l\'état du matériel au retour.' },
  { label: 'Clôturé', color: 'bg-gray-100 text-gray-800', desc: 'Événement terminé, matériel rangé, tout est réglé.' },
]

function Tag({ children, color = 'bg-[#D4C9A8] text-[#3D4A2E]' }: { children: string; color?: string }) {
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${color}`}>{children}</span>
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-serif text-[#3D4A2E] mb-1 flex items-center gap-2">
        <span>{icon}</span> {title}
      </h2>
      <div className="h-px bg-[#C9BC98] mb-6" />
      <div className="space-y-5 text-[#4A5240] leading-relaxed">{children}</div>
    </div>
  )
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-base font-semibold text-[#3D4A2E] mb-2">{title}</h3>
      <div className="space-y-2 text-sm text-[#4A5240] leading-relaxed">{children}</div>
    </div>
  )
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#EDE8D8] border border-[#C9BC98] rounded-lg p-4 text-sm text-[#3D4A2E]">
      {children}
    </div>
  )
}

function TipBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#E8EDE0] border border-[#AEBB94] rounded-lg p-4 text-sm text-[#3D4A2E]">
      <span className="font-semibold">💡 Astuce — </span>{children}
    </div>
  )
}

function Field({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="flex gap-3 items-start py-1.5 border-b border-[#E8E0C8] last:border-0">
      <span className="font-medium text-[#3D4A2E] w-40 shrink-0 text-sm">{name}</span>
      <span className="text-sm text-[#5A6250]">{desc}</span>
    </div>
  )
}

const CONTENT: Record<string, React.ReactNode> = {
  intro: (
    <div className="space-y-6">
      <div className="bg-[#EDE8D8] border border-[#C9BC98] rounded-xl p-8">
        <h2 className="font-serif text-3xl text-[#3D4A2E] mb-3">Bienvenue dans FLOWER K</h2>
        <p className="text-[#4A5240] text-base leading-relaxed max-w-2xl">
          Cette application a été créée spécialement pour toi. Elle centralise toute ton activité de décoratrice événementielle florale : de la première prise de contact avec un client jusqu'à la clôture complète d'un événement.
        </p>
      </div>
      <Section title="Ce que l'app remplace" icon="📦">
        <div className="grid grid-cols-2 gap-3">
          {[
            ['❌ Avant', 'WhatsApp pour tout communiquer', 'bg-red-50 border-red-100'],
            ['❌ Avant', 'PDF éparpillés partout', 'bg-red-50 border-red-100'],
            ['❌ Avant', 'Mémoire pour le stock dispo', 'bg-red-50 border-red-100'],
            ['❌ Avant', 'Notes téléphone pour les coûts', 'bg-red-50 border-red-100'],
            ['✅ Maintenant', 'Événements avec tous les détails', 'bg-[#E8EDE0] border-[#AEBB94]'],
            ['✅ Maintenant', 'Documents rangés par événement', 'bg-[#E8EDE0] border-[#AEBB94]'],
            ['✅ Maintenant', 'Stock calculé automatiquement', 'bg-[#E8EDE0] border-[#AEBB94]'],
            ['✅ Maintenant', 'Finance, marges et acomptes', 'bg-[#E8EDE0] border-[#AEBB94]'],
          ].map(([label, text, cls], i) => (
            <div key={i} className={`rounded-lg border p-3 text-sm ${cls}`}>
              <span className="font-medium text-[#3D4A2E]">{label}</span><br />
              <span className="text-[#4A5240]">{text}</span>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Structure de l'app" icon="🗂️">
        <p>La navigation se fait via la barre noire à gauche. Elle est divisée en 3 groupes :</p>
        <div className="space-y-2 mt-3">
          {[
            ['Gestion', 'Le cœur opérationnel : Événements, Stock, Clients, Fournisseurs, Transporteurs'],
            ['Outils', 'Les ressources réutilisables : Compositions florales, Templates d\'événements'],
            ['Vues', 'La vision globale : Analytiques, Calendrier, Recherche'],
          ].map(([g, d]) => (
            <div key={g} className="flex gap-3 items-start">
              <span className="w-28 shrink-0 font-semibold text-[#6B7A5E] text-sm">{g}</span>
              <span className="text-sm">{d}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  ),

  dashboard: (
    <Section title="Tableau de bord" icon="📊">
      <p>C'est la première page que tu vois en arrivant. Elle te donne un état de la situation en un coup d'œil, sans avoir à naviguer ailleurs.</p>
      <SubSection title="Les 4 compteurs">
        <p>En haut de page, 4 cartes cliquables :</p>
        <div className="space-y-1 mt-2">
          {[
            ['Événements totaux', 'Toutes les prestations créées dans l\'app, tous statuts confondus.'],
            ['Clients', 'Nombre de fiches clients enregistrées.'],
            ['Articles en stock', 'Nombre d\'articles différents dans ton inventaire (pas les quantités).'],
            ['Transporteurs', 'Nombre de transporteurs dans ton carnet.'],
          ].map(([n, d]) => <Field key={n} name={n} desc={d} />)}
        </div>
      </SubSection>
      <SubSection title="Résumé financier">
        <p>3 cartes financières :</p>
        <div className="space-y-1 mt-2">
          {[
            ['Chiffre d\'affaires total', 'Somme de tous les prix facturés saisis dans la section Finance de chaque événement.'],
            ['Coûts totaux', 'Somme de tous les coûts (fleurs, matériel, main d\'œuvre, livraison, sous-traitance, divers).'],
            ['Marge brute', 'CA total − Coûts totaux. En vert si positif.'],
          ].map(([n, d]) => <Field key={n} name={n} desc={d} />)}
        </div>
        <InfoBox>Ces chiffres ne se mettent à jour que si tu remplis bien la section Finance de chaque événement.</InfoBox>
      </SubSection>
      <SubSection title="Listes d'événements">
        <p><strong>Prochains événements</strong> — les 5 événements à venir les plus proches dans le temps (hors clôturés).</p>
        <p><strong>Événements récents</strong> — les 5 derniers événements créés dans l'app.</p>
        <p>Clique sur n'importe quel événement pour accéder à sa fiche complète.</p>
      </SubSection>
    </Section>
  ),

  analytics: (
    <Section title="Analytiques" icon="📈">
      <p>Vue statistique de toute ton activité. Elle se construit automatiquement à partir des données que tu as saisies.</p>
      <SubSection title="Indicateurs clés (KPIs)">
        {[
          ['Marge moyenne', 'Moyenne de la marge (%) sur tous les événements ayant une finance complète.'],
          ['Meilleur mois', 'Le mois où tu as généré le plus de chiffre d\'affaires.'],
          ['Événements cette année', 'Nombre de prestations sur l\'année en cours.'],
          ['Matériel le plus utilisé', 'L\'article de stock réservé le plus souvent.'],
        ].map(([n, d]) => <Field key={n} name={n} desc={d} />)}
      </SubSection>
      <SubSection title="Graphiques">
        <p><strong>Revenus par mois</strong> — barres horizontales proportionnelles, un mois par ligne.</p>
        <p><strong>Événements par type</strong> — répartition (mariage, anniversaire, corporate...) sous forme de barres.</p>
        <p><strong>Top événements par marge</strong> — les 5 prestations les plus rentables.</p>
        <p><strong>Stock le plus utilisé</strong> — les 5 articles réservés le plus souvent.</p>
      </SubSection>
      <TipBox>Plus tu remplis les sections Finance de chaque événement, plus ces graphiques sont précis et utiles.</TipBox>
    </Section>
  ),

  calendar: (
    <Section title="Calendrier" icon="📅">
      <p>Vue mensuelle de tous tes événements. Permet de voir les chevauchements, les périodes chargées et de planifier.</p>
      <SubSection title="Navigation">
        <p>Flèches gauche/droite pour changer de mois. Chaque jour avec un événement affiche un point coloré (couleur = statut de l'événement).</p>
      </SubSection>
      <SubSection title="Sidebar du calendrier">
        <p>À droite (ou en dessous sur mobile) : liste des prochains événements à venir avec leur date, client et statut. Clique dessus pour accéder directement à la fiche.</p>
      </SubSection>
      <InfoBox>Le calendrier affiche la DATE de l'événement, pas les dates d'installation ou de transport. Garde ça en tête pour la planification.</InfoBox>
    </Section>
  ),

  search: (
    <Section title="Recherche" icon="🔍">
      <p>Moteur de recherche global dans toute l'app. Pratique pour retrouver rapidement n'importe quelle information.</p>
      <SubSection title="Comment ça marche">
        <p>Tape au moins <strong>2 caractères</strong> dans la barre de recherche. Les résultats apparaissent automatiquement après 400ms, sans appuyer sur Entrée.</p>
      </SubSection>
      <SubSection title="Ce que ça cherche">
        {[
          ['Événements', 'Par nom, description, adresse.'],
          ['Clients', 'Par nom, email, téléphone.'],
          ['Stock', 'Par nom d\'article, description, couleur, catégorie.'],
        ].map(([n, d]) => <Field key={n} name={n} desc={d} />)}
      </SubSection>
      <SubSection title="Cas d\'usage typiques">
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Retrouver tous les événements d'un client spécifique → tape son nom</li>
          <li>Savoir quels événements ont utilisé une arche ronde → tape "arche ronde" dans stock, puis regarde ses réservations</li>
          <li>Retrouver un événement dont tu ne te souviens plus du nom → tape la ville ou une description</li>
        </ul>
      </SubSection>
    </Section>
  ),

  events: (
    <div>
      <Section title="Événements" icon="🌸">
        <p>C'est le module central de l'app. Chaque prestation que tu fais devient un événement. Tout y est rattaché : le matériel réservé, la logistique, les photos, les documents, les coûts.</p>
        <SubSection title="Liste des événements">
          <p>Par défaut, tous les événements sont affichés du plus récent au plus ancien. Tu peux filtrer par statut grâce aux boutons en haut de page.</p>
          <p>Chaque carte affiche : nom de l'événement, client, date, statut (badge coloré).</p>
        </SubSection>
        <SubSection title="Créer un événement">
          <p>Clique sur <strong>"Nouvel événement"</strong> (bouton noir en haut à droite). Le formulaire est divisé en 4 sections :</p>
        </SubSection>
        <SubSection title="Section 1 — Infos générales">
          <div className="space-y-1">
            {[
              ['Nom', 'Donne un nom clair. Ex : "Mariage Martin - Château de Vaux"'],
              ['Client', 'Associe cet événement à un client existant (optionnel).'],
              ['Date', 'La date de l\'événement (jour J).'],
              ['Adresse', 'Lieu exact de la prestation.'],
              ['Téléphone', 'Numéro de contact principal pour cet événement.'],
              ['Budget', 'Budget estimé/accordé par le client (€).'],
              ['Type', 'Mariage, anniversaire, baptême, corporate, pop-up...'],
              ['Statut', 'Commence toujours à "Devis en cours". Change au fil de l\'avancement.'],
              ['Description', 'Notes libres sur l\'événement.'],
            ].map(([n, d]) => <Field key={n} name={n} desc={d} />)}
          </div>
        </SubSection>
        <SubSection title="Section 2 — Décoration">
          <div className="space-y-1">
            {[
              ['Style', 'Bohème, champêtre, luxe, moderne, minimaliste, baroque...'],
              ['Thème', 'Description libre du thème (ex: "Forêt enchantée").'],
              ['Palette de couleurs', 'Les couleurs dominantes de la décoration.'],
              ['Intérieur / extérieur', 'Cochez si l\'événement est en extérieur.'],
              ['Tables rondes', 'Nombre de tables rondes à décorer.'],
              ['Tables rectangulaires', 'Nombre de tables rectangulaires.'],
              ['Tables carrées', 'Nombre de tables carrées.'],
              ['Invités', 'Nombre total d\'invités attendus.'],
              ['Centres de table', 'Nombre de compositions pour les tables.'],
              ['Compositions cérémonie', 'Nombre de compositions pour l\'espace cérémonie.'],
              ['Dimensions salle', 'Largeur × Longueur × Hauteur en mètres.'],
            ].map(([n, d]) => <Field key={n} name={n} desc={d} />)}
          </div>
        </SubSection>
        <SubSection title="Section 3 — Planning">
          <div className="space-y-1">
            {[
              ['Début installation', 'L\'heure à laquelle tu commences à installer la décoration.'],
              ['Fin installation', 'L\'heure à laquelle tout doit être en place.'],
              ['Démontage', 'Le créneau prévu pour récupérer le matériel après l\'événement.'],
            ].map(([n, d]) => <Field key={n} name={n} desc={d} />)}
          </div>
        </SubSection>
        <SubSection title="Section 4 — Intervenants">
          <div className="space-y-1">
            {[
              ['Wedding planner', 'Nom + téléphone du/de la wedding planner si présent(e).'],
              ['Traiteur', 'Nom du traiteur (utile pour la coordination sur place).'],
              ['Photographe', 'Nom du photographe (pour lui envoyer tes photos demander les siennes).'],
              ['Contact sur place', 'La personne à appeler le jour J sur le lieu (différent du client).'],
            ].map(([n, d]) => <Field key={n} name={n} desc={d} />)}
          </div>
        </SubSection>
        <SubSection title="Les statuts d'un événement">
          <p className="mb-3">Le statut reflète exactement où en est la prestation. Change-le au fur et à mesure — chaque changement est automatiquement enregistré dans la Timeline.</p>
          <div className="space-y-2">
            {STATUS_LIST.map(s => (
              <div key={s.label} className="flex items-start gap-3">
                <Tag color={s.color}>{s.label}</Tag>
                <span className="text-sm text-[#4A5240]">{s.desc}</span>
              </div>
            ))}
          </div>
        </SubSection>
      </Section>
    </div>
  ),

  'events-reservations': (
    <Section title="Réservations de matériel" icon="📦">
      <p>Cet onglet te permet de réserver du matériel de ton stock pour cet événement. C'est le lien entre un événement et ton inventaire.</p>
      <SubSection title="Comment ça fonctionne">
        <p>Le stock a une quantité totale. Plusieurs événements peuvent réserver des articles du même stock en même temps. L'app calcule automatiquement ce qui reste disponible.</p>
        <InfoBox>
          <strong>Exemple :</strong> Tu as 20 vases blancs. Tu en réserves 12 pour un mariage et 5 pour un anniversaire. L'app affiche : Total 20 — Réservé 17 — Disponible 3.
        </InfoBox>
      </SubSection>
      <SubSection title="Ajouter une réservation">
        <p>1. Cherche l'article dans la liste de stock (filtre par nom).<br />
        2. Indique la quantité à réserver.<br />
        3. Ajoute une note si besoin (ex: "2 de remplacement au cas où").<br />
        4. Clique "Réserver".</p>
      </SubSection>
      <SubSection title="Modifier ou supprimer">
        <p>Chaque réservation affiche la quantité réservée. Tu peux la supprimer si l'article n'est plus nécessaire — le stock est immédiatement libéré.</p>
      </SubSection>
      <TipBox>Les articles réservés pour des événements <Tag color="bg-gray-100 text-gray-800">Clôturés</Tag> ne comptent plus dans le calcul de disponibilité. Le stock se libère automatiquement à la clôture.</TipBox>
    </Section>
  ),

  'events-logistics': (
    <Section title="Logistique" icon="🚚">
      <p>Suivi du transport du matériel : qui le transporte, quand, depuis où, et dans quel état.</p>
      <SubSection title="Champs disponibles">
        <div className="space-y-1">
          {[
            ['Transporteur', 'Sélectionne un transporteur de ton carnet ou laisse vide si tu assures toi-même.'],
            ['Date d\'enlèvement', 'Quand le transporteur vient récupérer le matériel chez toi.'],
            ['Date de livraison', 'Quand le matériel arrive sur le lieu de l\'événement.'],
            ['Date de retour', 'Quand le matériel est ramené chez toi après l\'événement.'],
            ['Statut transport', 'En attente, Confirmé, En cours, Livré, Retourné...'],
            ['Type de véhicule', 'Camionnette, van, remorque, autre. Pour anticiper le volume.'],
            ['Nombre de trajets', 'Si le matériel nécessite plusieurs allers-retours.'],
            ['Volume estimé', 'Description libre du volume (ex: "1 palette + 3 cartons").'],
            ['Adresse de départ', 'Ton atelier / entrepôt (pré-rempli si toujours le même).'],
            ['Notes de chargement', 'Ordre de chargement, précautions particulières.'],
            ['Articles fragiles', 'Coche si le chargement contient des éléments fragiles.'],
            ['Notes', 'Tout ce qui ne rentre pas ailleurs.'],
          ].map(([n, d]) => <Field key={n} name={n} desc={d} />)}
        </div>
      </SubSection>
      <SubSection title="Documents de transport">
        <p>Tu peux joindre des documents spécifiques à la logistique (bon de livraison, ordre de mission...) directement dans cette section.</p>
      </SubSection>
    </Section>
  ),

  'events-previews': (
    <Section title="Previews" icon="🖼️">
      <p>Galerie des visuels que tu prépares AVANT l'événement pour montrer au client ce que tu envisages de créer.</p>
      <SubSection title="Types de previews">
        {[
          ['Moodboard', 'Planche d\'inspiration avec ambiance générale, couleurs, textures.'],
          ['Inspiration', 'Image trouvée sur Pinterest, Instagram ou ailleurs pour illustrer une idée.'],
          ['Esquisse', 'Croquis dessiné à la main ou numérique.'],
          ['Validation client', 'L\'image finale présentée au client pour approbation.'],
        ].map(([n, d]) => <Field key={n} name={n} desc={d} />)}
      </SubSection>
      <SubSection title="Statuts d'une preview">
        {[
          ['Brouillon', 'Tu travailles dessus, pas encore présentée.'],
          ['Envoyée au client', 'Tu l\'as partagée (par WhatsApp ou email), elle est visible ici pour référence.'],
          ['Validée', 'Le client a approuvé — c\'est cette version qui sera réalisée.'],
        ].map(([n, d]) => <Field key={n} name={n} desc={d} />)}
      </SubSection>
      <SubSection title="Zone et version">
        <p><strong>Zone</strong> : précise à quelle partie de l'événement cette preview correspond (ex: "Table d'honneur", "Arc cérémonie", "Entrée de salle").</p>
        <p><strong>Version</strong> : numéro de version (1, 2, 3...) pour suivre les révisions suite aux retours client.</p>
      </SubSection>
      <TipBox>Même si le client valide par WhatsApp, télécharge le visuel ici et passe-le en "Validée". Tu gardes une trace sans chercher dans tes conversations.</TipBox>
    </Section>
  ),

  'events-gallery': (
    <Section title="Galerie finale" icon="📷">
      <p>Photos et vidéos du résultat réel, prises APRÈS ou PENDANT l'événement. C'est ton portfolio, ton historique de réalisations.</p>
      <SubSection title="Types de médias">
        {[
          ['Photo', 'Clichés de la décoration installée.'],
          ['Vidéo', 'Vidéos de l\'ambiance, de l\'installation...'],
          ['Avant / Après', 'Comparaison entre le lieu vide et la décoration installée.'],
        ].map(([n, d]) => <Field key={n} name={n} desc={d} />)}
      </SubSection>
      <SubSection title="Reel Instagram">
        <p>Coche la case "Reel Instagram" pour marquer les vidéos que tu as publiées ou qui sont destinées à l'être. Pratique pour savoir ce qui est déjà sur ton compte.</p>
      </SubSection>
      <SubSection title="Notes">
        <p>Ajoute une note à chaque média : nom du photographe, détail de la composition visible, retour client...</p>
      </SubSection>
      <InfoBox>Ces photos ne sont pas publiées publiquement. Elles restent dans l'app, privées, pour ta mémoire et ton historique.</InfoBox>
    </Section>
  ),

  'events-documents': (
    <Section title="Documents" icon="📄">
      <p>Tous les fichiers liés à cet événement, au même endroit. Plus besoin de chercher dans tes emails ou ton téléphone.</p>
      <SubSection title="Types de documents">
        {[
          ['Devis', 'PDF du devis envoyé au client.'],
          ['Contrat', 'Contrat de prestation signé.'],
          ['Facture', 'Facture finale.'],
          ['Plan', 'Plan de salle, plan de table, plan d\'installation.'],
          ['Présentation', 'Présentation PowerPoint ou PDF du projet.'],
          ['Autre', 'Tout autre document utile.'],
        ].map(([n, d]) => <Field key={n} name={n} desc={d} />)}
      </SubSection>
      <SubSection title="Uploader un document">
        <p>Clique sur "Ajouter un document", sélectionne le fichier, choisis son type, et il est automatiquement rattaché à cet événement.</p>
      </SubSection>
      <TipBox>Nomme bien tes fichiers avant de les uploader. "Devis_Mariage_Martin_v2.pdf" est bien plus facile à retrouver que "Document1.pdf".</TipBox>
    </Section>
  ),

  'events-finance': (
    <Section title="Finance" icon="💰">
      <p>Suivi financier complet de la prestation. C'est ici que tu vois si l'événement est rentable.</p>
      <SubSection title="Coûts à saisir">
        <div className="space-y-1">
          {[
            ['Fleurs (stock permanent)', 'Amortissement ou valeur des compositions florales en matériel permanent.'],
            ['Fleurs fraîches', 'Coût des fleurs fraîches achetées spécifiquement pour cet événement (se remplit automatiquement depuis l\'onglet Fleurs fraîches).'],
            ['Matériel acheté', 'Achats ponctuels de matériel non récupérable.'],
            ['Main d\'œuvre', 'Ton temps + éventuels assistants.'],
            ['Livraison', 'Coût du transport / transporteur.'],
            ['Sous-traitance', 'Prestataires extérieurs (fleuriste partenaire, location...).'],
            ['Divers', 'Tout ce qui ne rentre pas dans les catégories ci-dessus.'],
            ['Frais post-événement', 'Casse, remplacement de matériel abîmé, nettoyage...'],
          ].map(([n, d]) => <Field key={n} name={n} desc={d} />)}
        </div>
      </SubSection>
      <SubSection title="Facturation">
        <div className="space-y-1">
          {[
            ['Prix facturé', 'Ce que tu factures au client (TTC ou HT selon ton régime).'],
            ['Remise accordée', 'En %, appliquée automatiquement sur le total.'],
            ['Acompte versé', 'Montant déjà reçu du client.'],
            ['Date acompte', 'Date à laquelle tu as reçu l\'acompte.'],
            ['Date solde', 'Échéance du paiement du solde restant.'],
            ['Mode de paiement', 'Virement, chèque, espèces, Lydia...'],
          ].map(([n, d]) => <Field key={n} name={n} desc={d} />)}
        </div>
      </SubSection>
      <SubSection title="Calculs automatiques">
        <InfoBox>
          L'app calcule automatiquement :<br /><br />
          <strong>Coût total</strong> = somme de tous les postes de coût<br />
          <strong>Bénéfice</strong> = Prix facturé − Coût total<br />
          <strong>Marge</strong> = (Bénéfice / Prix facturé) × 100<br />
          <strong>Solde restant</strong> = Prix facturé − Acompte versé
        </InfoBox>
      </SubSection>
    </Section>
  ),

  'events-checklist': (
    <Section title="Checklist" icon="✅">
      <p>Liste de tâches à accomplir avant, pendant et après l'événement. Elle remplace les listes de WhatsApp ou les notes téléphone.</p>
      <SubSection title="Utilisation">
        <p>Clique sur <strong>"Ajouter une tâche"</strong>, tape le nom de la tâche, appuie sur Entrée. La tâche apparaît dans la liste.</p>
        <p>Coche la case quand c'est fait. La barre de progression en haut se met à jour automatiquement.</p>
      </SubSection>
      <SubSection title="Exemples de tâches">
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Fleurs fraîches commandées chez le fournisseur</li>
          <li>Arche ronde vérifiée et nettoyée</li>
          <li>20 vases blancs lavés et séchés</li>
          <li>Camionnette réservée</li>
          <li>Plan de salle demandé au traiteur</li>
          <li>Preview validée par le client</li>
          <li>Devis signé reçu</li>
          <li>Acompte reçu</li>
          <li>Matériel vérifié au retour</li>
        </ul>
      </SubSection>
      <SubSection title="Réordonnancement">
        <p>Utilise les boutons ↑ ↓ pour changer l'ordre des tâches et organiser ta liste logiquement.</p>
      </SubSection>
      <TipBox>Crée un Template avec une checklist standard pour tes mariages, et copie-la à chaque nouvel événement similaire pour ne rien oublier.</TipBox>
    </Section>
  ),

  'events-fresh': (
    <Section title="Fleurs fraîches" icon="🌷">
      <p>Suivi des commandes de fleurs fraîches spécifiquement pour cet événement. Contrairement au stock permanent, les fleurs fraîches sont achetées et consommées à chaque prestation.</p>
      <SubSection title="Ajouter une commande">
        <div className="space-y-1">
          {[
            ['Espèce / Variété', 'Ex: Pivoine blanche, Rose garden spray, Eucalyptus...'],
            ['Quantité', 'Nombre de tiges, bouquets ou bottes.'],
            ['Unité', 'Tiges, bouquets, bottes, pièces...'],
            ['Prix unitaire', 'Pour calculer automatiquement le coût total de cette ligne.'],
            ['Fournisseur', 'Sélectionne dans ton carnet de fournisseurs.'],
            ['Date de commande', 'Quand tu as passé la commande.'],
            ['Date de livraison', 'Quand tu prévois de les recevoir (idéalement 1-2 jours avant).'],
            ['Notes', 'Couleur exacte, degré d\'ouverture souhaité, alternatives...'],
          ].map(([n, d]) => <Field key={n} name={n} desc={d} />)}
        </div>
      </SubSection>
      <SubSection title="Marquer comme reçu">
        <p>Quand tu reçois les fleurs, coche "Reçu". Ça te permet de suivre ce qui est arrivé et ce qui est encore en attente.</p>
      </SubSection>
      <SubSection title="Lien avec la Finance">
        <p>Le coût total de toutes tes commandes de fleurs fraîches remonte automatiquement dans la section Finance de l'événement.</p>
      </SubSection>
      <InfoBox>Chaque commande est aussi visible sur la fiche du fournisseur correspondant, pour avoir l'historique complet de tes achats par fournisseur.</InfoBox>
    </Section>
  ),

  'events-timeline': (
    <Section title="Timeline" icon="📋">
      <p>Journal chronologique de tout ce qui s'est passé sur cet événement. C'est la mémoire de la prestation.</p>
      <SubSection title="Entrées automatiques">
        <p>Chaque fois que tu changes le statut d'un événement, une entrée est automatiquement créée dans la timeline avec la date, l'heure et le nouveau statut.</p>
        <p>Exemple : <em>"Statut changé → Confirmé"</em> — enregistré le 12 mars à 14h32.</p>
      </SubSection>
      <SubSection title="Entrées manuelles">
        <p>Tu peux ajouter tes propres notes : appel client, accord verbal, problème rencontré, décision prise...</p>
        <p>Chaque note manuelle affiche la date et est distinguée des entrées automatiques.</p>
      </SubSection>
      <SubSection title="Pourquoi c'est utile">
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Retrouver quand tu as confirmé un devis</li>
          <li>Savoir exactement quand le matériel est parti et revenu</li>
          <li>En cas de litige, avoir une trace de toutes les étapes</li>
          <li>Voir le temps moyen entre devis et confirmation</li>
        </ul>
      </SubSection>
    </Section>
  ),

  stock: (
    <Section title="Stock" icon="🏺">
      <p>Inventaire complet de tout ton matériel réutilisable : vases, arches, bougies, textiles, structures... Chaque article a sa fiche.</p>
      <SubSection title="Informations de base">
        <div className="space-y-1">
          {[
            ['Nom', 'Nom clair et précis. Ex: "Vase cylindrique transparent H40" plutôt que "Vase".'],
            ['Catégorie', 'Regroupe les articles similaires. Tu peux créer tes propres catégories.'],
            ['Sous-catégorie', 'Subdivision de la catégorie (optionnel).'],
            ['Couleur', 'La couleur dominante de l\'article.'],
            ['Description', 'Tout ce qui aide à l\'identifier ou à l\'utiliser correctement.'],
            ['Quantité totale', 'Combien d\'unités tu possèdes EN TOUT.'],
            ['Prix d\'achat', 'Ce que tu as payé l\'unité. Utile pour les calculs de rentabilité.'],
            ['Emplacement', 'Où il est rangé dans ton atelier/entrepôt. Ex: "Étagère B, bac 3".'],
            ['État', 'Bon état / À réparer / Hors service.'],
            ['Notes', 'Particularités, précautions, historique de casse...'],
          ].map(([n, d]) => <Field key={n} name={n} desc={d} />)}
        </div>
      </SubSection>
      <SubSection title="Attributs spécifiques (section dépliable)">
        <p>Selon la nature de l'article, des champs supplémentaires sont disponibles :</p>
        <div className="space-y-1 mt-2">
          {[
            ['Matière', 'Verre, métal, céramique, bois, tissu...'],
            ['Dimensions', 'Longueur × largeur × hauteur en cm. Ex: "30x30x80cm".'],
            ['Poids', 'En kg. Important pour la logistique.'],
            ['Capacité', 'Pour les contenants. Ex: "50cl".'],
            ['Forme', 'Cylindrique, évasé, carré, organique...'],
            ['Pliable', 'Cocher si l\'article se démonte pour le transport.'],
            ['Nb de pièces', 'Si l\'article est composé de plusieurs éléments.'],
            ['Espèce', 'Pour les fleurs artificielles : rose, pivoine, eucalyptus...'],
            ['Longueur tige', 'En cm, pour les fleurs et végétaux.'],
            ['Forme arche', 'Ronde, rectangulaire, asymétrique, tunnel...'],
            ['Temps assemblage', 'En minutes. Pour planifier le temps de préparation.'],
            ['Type bougie', 'Pilier, chauffe-plat, LED, votive...'],
            ['Durée combustion', 'En heures.'],
          ].map(([n, d]) => <Field key={n} name={n} desc={d} />)}
        </div>
      </SubSection>
      <SubSection title="Photos">
        <p>Ajoute autant de photos que tu veux à chaque article. Pratique pour retrouver un article ou montrer quelque chose à un client.</p>
      </SubSection>
      <SubSection title="Disponibilité en temps réel">
        <InfoBox>
          Sur chaque fiche article :<br /><br />
          <strong>Total</strong> = ce que tu possèdes<br />
          <strong>Réservé</strong> = réservé pour des événements non clôturés<br />
          <strong>Disponible</strong> = Total − Réservé<br /><br />
          Ces chiffres se mettent à jour instantanément quand tu ajoutes ou supprimes une réservation.
        </InfoBox>
      </SubSection>
      <SubSection title="Filtres de la liste">
        <p>En haut de la liste de stock : filtre par catégorie, état, disponibilité (disponible / tout), et recherche par nom.</p>
      </SubSection>
      <TipBox>Utilise l'emplacement de stockage rigoureusement. "Allée 2, étagère haute, bac rouge" permet à quelqu'un d'autre de trouver un article sans toi.</TipBox>
    </Section>
  ),

  clients: (
    <Section title="Clients" icon="👤">
      <p>Carnet d'adresses clients enrichi. Chaque client peut être lié à plusieurs événements.</p>
      <SubSection title="Informations de contact">
        <div className="space-y-1">
          {[
            ['Nom', 'Nom complet (ou nom d\'entreprise pour les professionnels).'],
            ['Email', 'Pour retrouver les échanges facilement.'],
            ['Téléphone', 'Numéro principal.'],
            ['Adresse', 'Adresse personnelle ou professionnelle.'],
          ].map(([n, d]) => <Field key={n} name={n} desc={d} />)}
        </div>
      </SubSection>
      <SubSection title="Informations CRM">
        <div className="space-y-1">
          {[
            ['Source', 'Comment ce client t\'a trouvée : Instagram, bouche-à-oreille, Google, mariage d\'un ami, agence événementielle...'],
            ['Type', 'Particulier (mariage, anniversaire...), professionnel (entreprise), agence (wedding planner, agence events).'],
            ['Style préféré', 'Bohème, luxe, minimaliste... pour anticiper ses goûts.'],
            ['Couleurs à éviter', 'Couleurs qu\'il ou elle n\'aime pas ou qui sont mal vues (deuil, superstition...).'],
            ['Allergies florales', 'Très important pour les événements où les fleurs sont proches des invités.'],
            ['Budget habituel', 'Pour estimer rapidement si une nouvelle demande est dans ses cordes.'],
            ['VIP', 'Marque tes clients fidèles ou importants avec une étoile. Ils apparaissent mis en valeur dans la liste.'],
          ].map(([n, d]) => <Field key={n} name={n} desc={d} />)}
        </div>
      </SubSection>
      <SubSection title="Historique">
        <p>La page détail d'un client affiche tous ses événements passés et en cours. En un coup d'œil, tu vois combien de fois tu as travaillé avec lui.</p>
      </SubSection>
      <TipBox>Renseigne la "Source" systématiquement. Sur le long terme, tu sauras quels canaux t'amènent le plus de clients et pourras concentrer tes efforts marketing.</TipBox>
    </Section>
  ),

  suppliers: (
    <Section title="Fournisseurs" icon="🌿">
      <p>Carnet de tous tes fournisseurs de fleurs et matériel. Lié directement aux commandes de fleurs fraîches.</p>
      <SubSection title="Informations">
        <div className="space-y-1">
          {[
            ['Nom', 'Nom du fournisseur ou de l\'enseigne.'],
            ['Téléphone', 'Numéro pour passer commande.'],
            ['Email', 'Pour les commandes par email ou les factures.'],
            ['Adresse', 'Adresse du marché aux fleurs, entrepôt ou boutique.'],
            ['Spécialité', 'Ce qu\'il vend principalement : roses, végétaux, fleurs tropicales, matériel...'],
            ['Notes', 'Jours d\'ouverture, délais de livraison habituels, conditions de paiement...'],
          ].map(([n, d]) => <Field key={n} name={n} desc={d} />)}
        </div>
      </SubSection>
      <SubSection title="Historique des commandes">
        <p>Sur la fiche de chaque fournisseur, tu vois toutes les commandes de fleurs fraîches que tu lui as passées (depuis tous tes événements). Pratique pour négocier des tarifs ou faire une commande groupée.</p>
      </SubSection>
    </Section>
  ),

  transporters: (
    <Section title="Transporteurs" icon="🚛">
      <p>Carnet de tes transporteurs. Simples à gérer — l'essentiel est de les avoir disponibles pour les assigner à la logistique de chaque événement.</p>
      <SubSection title="Informations">
        <div className="space-y-1">
          {[
            ['Nom', 'Nom du transporteur ou de la société.'],
            ['Téléphone', 'Numéro direct.'],
            ['Email', 'Pour les confirmations écrites.'],
            ['Notes', 'Type de véhicule habituel, tarifs, disponibilités, fiabilité...'],
          ].map(([n, d]) => <Field key={n} name={n} desc={d} />)}
        </div>
      </SubSection>
      <SubSection title="Utilisation">
        <p>Une fois créé, le transporteur apparaît dans la liste déroulante de l'onglet Logistique de chaque événement. Sélectionne-le pour lui attribuer la mission.</p>
      </SubSection>
    </Section>
  ),

  recipes: (
    <Section title="Compositions florales" icon="💐">
      <p>Bibliothèque de tes "recettes" de compositions. Si tu réalises souvent le même type de centre de table, d'arche ou de composition, enregistre-le ici pour standardiser et estimer rapidement le coût.</p>
      <SubSection title="Créer une composition">
        <div className="space-y-1">
          {[
            ['Nom', 'Ex: "Centre de table bohème pivoine/eucalyptus", "Arche fleurie cérémonie standard"...'],
            ['Description', 'Comment elle est construite, quel effet visuel, pour quel type d\'événement.'],
            ['Temps de préparation', 'En minutes. Pour calculer ton temps de travail total sur un événement.'],
            ['Coût estimé', 'Coût moyen de réalisation de cette composition.'],
          ].map(([n, d]) => <Field key={n} name={n} desc={d} />)}
        </div>
      </SubSection>
      <SubSection title="Liste des ingrédients">
        <p>Ajoute chaque élément nécessaire à la composition :</p>
        <div className="space-y-1 mt-2">
          {[
            ['Nom', 'Pivoine blanche, mousse florale, fil de fer...'],
            ['Quantité', 'Nombre d\'unités nécessaires pour UNE composition.'],
            ['Unité', 'Tiges, pièces, cm, branches, bottes...'],
            ['Notes', 'Précisions sur la variété, le degré d\'ouverture, la couleur exacte...'],
          ].map(([n, d]) => <Field key={n} name={n} desc={d} />)}
        </div>
      </SubSection>
      <TipBox>Si tu as 8 tables à garnir et ta recette indique 5 pivoines par composition, tu sais immédiatement qu'il te faut 40 pivoines à commander pour cet événement.</TipBox>
    </Section>
  ),

  templates: (
    <Section title="Templates" icon="📋">
      <p>Modèles d'événements réutilisables. Si tu organises souvent des mariages champêtres ou des anniversaires avec le même setup de base, crée un template pour gagner du temps.</p>
      <SubSection title="Créer un template">
        <div className="space-y-1">
          {[
            ['Nom', 'Ex: "Mariage champêtre standard", "Anniversaire luxe", "Corporate minimaliste".'],
            ['Type', 'Mariage, anniversaire, corporate, baptême...'],
            ['Style', 'Bohème, champêtre, luxe, moderne...'],
            ['Description', 'Description de ce que ce template inclut typiquement.'],
          ].map(([n, d]) => <Field key={n} name={n} desc={d} />)}
        </div>
      </SubSection>
      <SubSection title="Checklist du template">
        <p>Ajoute toutes les tâches récurrentes pour ce type d'événement. Ces tâches serviront de base quand tu créeras la checklist d'un nouvel événement similaire.</p>
        <p className="mt-2">Exemples pour un mariage :</p>
        <ul className="list-disc list-inside space-y-1 text-sm mt-1">
          <li>Devis envoyé</li>
          <li>Contrat signé</li>
          <li>Acompte reçu</li>
          <li>Visite du lieu</li>
          <li>Preview validée</li>
          <li>Fleurs fraîches commandées</li>
          <li>Arches préparées</li>
          <li>Vases lavés</li>
          <li>Transport confirmé</li>
          <li>Matériel chargé</li>
          <li>Installation terminée</li>
          <li>Photos faites</li>
          <li>Retour vérifié</li>
          <li>Solde reçu</li>
          <li>Galerie finale uploadée</li>
        </ul>
      </SubSection>
      <InfoBox>Les templates ne créent pas automatiquement des événements. Tu les consultes et t'en inspires manuellement. Une prochaine version pourrait permettre de "dupliquer" un template en événement.</InfoBox>
    </Section>
  ),
}

export default function GuidePage() {
  const [active, setActive] = useState('intro')
  const [showContent, setShowContent] = useState(false)

  const groups = Array.from(new Set(SECTIONS.map(s => s.group).filter(Boolean))) as string[]

  function navigate(id: string) {
    setActive(id)
    setShowContent(true)
  }

  return (
    <div className="flex gap-0 -m-4 lg:-m-8 min-h-[calc(100vh-4rem)]">
      {/* Guide sidebar — full width on mobile when not showing content, fixed width on desktop */}
      <aside className={`${showContent ? 'hidden' : 'flex'} lg:flex flex-col w-full lg:w-60 shrink-0 bg-[#EDE8D8] border-r border-[#C9BC98] overflow-y-auto`}>
        <div className="p-4 border-b border-[#C9BC98]">
          <p className="text-xs font-semibold text-[#6B7A5E] uppercase tracking-widest">Guide d'utilisation</p>
        </div>
        <nav className="py-3 px-2">
          <button
            onClick={() => navigate('intro')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors mb-1 ${
              active === 'intro' ? 'bg-[#7C8B6E] text-white font-medium' : 'text-[#3D4A2E] hover:bg-[#DDD5BE]'
            }`}
          >
            👋 Introduction
          </button>

          {groups.map(group => (
            <div key={group} className="mt-4 mb-1">
              <p className="px-3 text-[10px] font-bold text-[#8B9D77] uppercase tracking-widest mb-1">{group}</p>
              {SECTIONS.filter(s => s.group === group).map(s => (
                <button
                  key={s.id}
                  onClick={() => navigate(s.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                    active === s.id ? 'bg-[#7C8B6E] text-white font-medium' : 'text-[#3D4A2E] hover:bg-[#DDD5BE]'
                  } ${s.label.startsWith('↳') ? 'pl-5 text-xs' : ''}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* Content — full width on mobile when showing content, flex-1 on desktop */}
      <main className={`${showContent ? 'flex' : 'hidden'} lg:flex flex-col flex-1 overflow-y-auto bg-[#FAF7F2] p-6 lg:p-10`}>
        <button
          onClick={() => setShowContent(false)}
          className="lg:hidden mb-5 flex items-center gap-2 text-sm text-[#6B7A5E] hover:text-[#3D4A2E] transition-colors self-start"
        >
          ← Retour au menu
        </button>
        <div className="max-w-3xl">
          {CONTENT[active] ?? (
            <div className="text-[#6B7A5E] text-sm">Section à venir...</div>
          )}
        </div>
      </main>
    </div>
  )
}
