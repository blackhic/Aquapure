-- ============================================================================
-- AQUAPURE — Seed base de connaissances du chatbot « Aqua »
-- 7 entrées thématiques (type = document) pour la table public.knowledge_base.
-- Donnée NORMALE : Mehdi peut éditer / supprimer chaque entrée depuis l'admin
-- (/admin/base-de-connaissances) comme n'importe quelle autre. Rien en dur.
--
-- ⚠️  EMBEDDINGS — À LIRE ABSOLUMENT
-- Ce SQL insère seulement le texte dans knowledge_base. Il NE crée PAS les
-- embeddings (table knowledge_chunks). Or Aqua ne retrouve QUE le contenu
-- indexé : les embeddings sont générés uniquement par les routes admin, en
-- « embed avant écriture » (POST à la création, PATCH à l'édition). Sans cette
-- étape, les entrées existent mais restent INVISIBLES pour Aqua.
--
-- ── MÉTHODE RECOMMANDÉE (embeddings garantis, la plus simple) ────────────────
--   Ne PAS exécuter ce fichier. À la place, dans l'admin →
--   « Base de connaissances » → formulaire « Ajouter », pour CHACUNE des 7
--   entrées ci-dessous :
--     • Type            = Document
--     • Titre           = le titre de l'entrée
--     • Contenu         = le texte de l'entrée (copier-coller)
--   puis cliquer « Ajouter ». L'embedding est généré automatiquement à la
--   création (POST). Ce fichier sert alors de source de vérité / copier-coller.
--
-- ── MÉTHODE ALTERNATIVE (SQL puis ré-enregistrement) ─────────────────────────
--   1) Exécuter ce fichier dans Supabase → SQL Editor (insère les 7 lignes).
--   2) Dans l'admin, ouvrir CHACUNE des 7 entrées et cliquer « Enregistrer »
--      (déclenche un PATCH → génération des embeddings). Tant que ce n'est pas
--      fait pour une entrée, elle reste invisible pour Aqua.
--
-- NB : dollar-quoting $KB$…$KB$ → aucune gestion d'apostrophes nécessaire.
-- ============================================================================

insert into public.knowledge_base (type, title, content) values

-- (1) Identité & coordonnées
('document', $KB$Identité & coordonnées$KB$, $KB$AQUAPURE Plomberie est une entreprise artisanale de plomberie dirigée par Mehdi Van Ardenne, plombier expérimenté (15 ans d'expérience). Adresse : 29 Boulevard Victor Hugo, 06000 Nice. Téléphone : 04 84 35 04 86. Email : contact@aquapureplomberie.fr. SIRET : 934 336 637 00012. Disponible 7j/7, 24h/24, y compris nuits, week-ends et jours fériés. Travaux couverts par une garantie décennale et une assurance responsabilité civile professionnelle. Note Google : 5,0/5 sur 29 avis. Clientèle : particuliers, professionnels, syndics et propriétaires de locations saisonnières (Airbnb). Les documents légaux (mentions légales, CGU, politique de confidentialité, CGV, politique de cookies) sont disponibles sur le site.$KB$),

-- (2) Prestations & expertise
('document', $KB$Prestations & expertise$KB$, $KB$AQUAPURE Plomberie couvre l'ensemble des besoins en plomberie. Réponse type quand un visiteur demande « est-ce que vous faites X ? » : si cela relève de la plomberie, répondre OUI clairement, exposer brièvement l'expertise, puis orienter vers un appel ou un devis. Domaines : (1) Dépannage et urgences 24h/24 — fuites d'eau, canalisations bouchées, WC/évier/douche engorgés, chauffe-eau en panne. (2) Installation et rénovation de salle de bain et cuisine — douche à l'italienne, baignoire, WC suspendu, robinetterie, meubles, carrelage, adaptation PMR. (3) Chauffe-eau et ballon d'eau chaude — installation, remplacement, entretien et dépannage (électrique et thermodynamique). (4) Plomberie générale — création et modification de réseaux d'eau, pose de cuisine, évier, robinetterie, raccordements divers. (5) Piscine — plomberie et local technique : système de filtration, pompe, raccordements, entretien du circuit hydraulique (AQUAPURE intervient sur la partie plomberie/filtration de la piscine). AQUAPURE utilise du matériel professionnel de marques reconnues. Le travail est soigné, propre, et réalisé dans le respect des normes.$KB$),

-- (3) Zones desservies
('document', $KB$Zones desservies$KB$, $KB$AQUAPURE Plomberie intervient sur toute la Côte d'Azur : les Alpes-Maritimes (06) et le Var (83). Villes desservies notamment : Fréjus, Saint-Raphaël, Draguignan, Le Muy, Roquebrune-sur-Argens (Var), ainsi que Nice, Cannes, Antibes, Grasse, Cagnes-sur-Mer (Alpes-Maritimes) et les communes environnantes. En cas de doute sur la couverture d'un secteur, inviter le visiteur à appeler le 04 84 35 04 86.$KB$),

-- (4) Tarifs indicatifs
('document', $KB$Tarifs indicatifs$KB$, $KB$Tarifs indicatifs « à partir de » (TTC, hors pièces et fournitures ; une majoration est possible en urgence la nuit, le week-end et les jours fériés ; seul le devis gratuit personnalisé fait foi) : déplacement + diagnostic à partir de 59 € ; débouchage/dégorgement à partir de 89 € ; recherche de fuite à partir de 149 € ; remplacement de WC à partir de 149 € ; robinetterie/mitigeur à partir de 89 € ; remplacement de chauffe-eau électrique à partir de 790 € ; main-d'œuvre à partir de 49 €/h. Le devis est gratuit et sans engagement. Ne jamais annoncer un prix ferme : toujours préciser que le devis personnalisé fait foi.$KB$),

-- (5) Conseils d'urgence & pratiques
('document', $KB$Conseils d'urgence & pratiques$KB$, $KB$Conseils de premier réflexe à donner selon la situation (toujours en complément, jamais en remplacement d'une intervention) :

Fuite d'eau : conseiller de fermer le robinet d'arrêt général (souvent situé près du compteur d'eau, sous un évier, dans un garage, une cave ou un regard extérieur) pour stopper l'écoulement et limiter les dégâts, puis de nous contacter en urgence. Sur le formulaire de devis, cocher la case « demande urgente ». Si le chauffe-eau électrique est concerné, conseiller aussi de couper son disjoncteur.
Fuite localisée sur un appareil (WC, lavabo, machine à laver) : conseiller de fermer le robinet d'arrêt spécifique de l'appareil (généralement juste à côté) plutôt que toute la maison.
Canalisation ou WC bouché : déconseiller les produits chimiques agressifs (ils abîment les canalisations) ; conseiller de ne pas insister et de nous appeler pour un débouchage professionnel.
Coupure d'eau chaude : vérifier le disjoncteur/le contacteur du chauffe-eau avant de conclure à une panne ; sinon nous contacter.
Ces conseils sont des gestes de premier secours simples ; pour toute intervention, recommander de faire appel à AQUAPURE. Ne jamais donner d'instructions techniques risquées (démontage, intervention sur le réseau sous pression, gaz) : orienter vers un professionnel.$KB$),

-- (6) Règles de collecte / orientation client
('document', $KB$Collecte des informations & orientation client$KB$, $KB$Objectif d'Aqua : renseigner utilement puis convertir en contact/lead. Règles : rester précis et concis, ne jamais écrire de longs pavés — répondre en 2 à 4 phrases, aller à l'essentiel. Quand un visiteur exprime un besoin réel (dépannage, devis, urgence), l'orienter vers l'une des deux actions : (1) appeler le 04 84 35 04 86 (recommandé en cas d'urgence), ou (2) demander un devis gratuit via le formulaire du site (et proposer le bouton « Être rappelé » du chat pour laisser ses coordonnées — nom et téléphone). En cas d'urgence, rappeler de cocher la case « demande urgente » du formulaire. Toujours terminer, quand c'est pertinent, par une invitation claire à appeler ou demander un devis. Ne pas promettre de rendez-vous ni de tarif ferme : seul Mehdi confirme.$KB$),

-- (7) Recherche & réparation de fuite + matériel
('document', $KB$Recherche & réparation de fuite + matériel$KB$, $KB$AQUAPURE est spécialisé dans la recherche et la réparation de fuites d'eau, y compris les fuites difficiles et encastrées, grâce à des méthodes de détection non destructives (sans casse) : détection électroacoustique, caméra d'inspection, gaz traceur. Pour cela, AQUAPURE utilise du matériel professionnel de référence, notamment de la marque SEWERIN (fabricant reconnu de matériel de détection de fuite). Cette expertise permet de localiser précisément une fuite avant toute réparation, en évitant les dégâts inutiles. Quand un visiteur évoque une fuite dont l'origine est inconnue, mettre en avant cette expertise de recherche de fuite non destructive, puis orienter vers un appel ou un devis. Présenter SEWERIN comme un exemple de matériel professionnel utilisé, sans dénigrer aucune autre marque et sans revendiquer de partenariat officiel.$KB$),

-- (8) Piscine — plomberie et local technique
('document', $KB$Piscine — plomberie et local technique$KB$, $KB$AQUAPURE Plomberie intervient sur la partie plomberie et hydraulique des piscines, y compris en urgence. Prestations : dépannage et recherche de fuite sur le circuit hydraulique et la tuyauterie de la piscine, réparation et remplacement de la pompe de filtration, entretien et rénovation du local technique, raccordements, vannes et canalisations du système de filtration. AQUAPURE traite la plomberie de la piscine (circuit d'eau, filtration, local technique), pas la maçonnerie ni le revêtement du bassin. En cas de fuite ou de panne sur une piscine, il est possible d'intervenir rapidement : conseiller au visiteur d'appeler le 04 84 35 04 86 ou de demander un devis gratuit, et de cocher la case « demande urgente » du formulaire si c'est urgent. Quand un visiteur pose une question sur la piscine (urgence, fuite, filtration, pompe, local technique), répondre OUI, AQUAPURE peut intervenir sur la partie plomberie, puis orienter vers l'appel ou le devis.$KB$);
