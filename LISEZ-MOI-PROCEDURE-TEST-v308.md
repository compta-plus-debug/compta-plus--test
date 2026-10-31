# Compta+ — version 308 — paquet TEST
**Version 307 = v306 + comptes agricoles +  corrections de vos retours (voir section 0).** **Nouveau bloc Agriculture et élevage · Calendrier fiscal (d'après le site de la DGI) · Cartes « marche à suivre » en Restauration et Hôtellerie.**

À faire sur le dépôt **compta-plus--test** uniquement. Ce paquet contient **les changements depuis la v304** et **remplace les paquets v305, v306 et v307**. **Prérequis : la v304 (ou la v305) est active sur TEST.** **Aucun script SQL, aucune Edge Function.** Vos données ne changent pas. **Rien à supprimer.**

## 0. Corrections de vos retours (v306, v307 et v308)
- **v308 — Parcelles en double** : vous avez créé deux fois la même parcelle (même nom en minuscules) sans refus. **Je n'ai pas pu reproduire** l'erreur chez moi (nom identique, majuscules différentes, double clic rapide : tout est refusé), mais j'ai **renforcé le contrôle** : il compare maintenant au tout dernier état des données, sans tenir compte des majuscules, accents ni espaces en trop ; le refus s'écrit **en rouge sous le bouton** (en plus du message qui disparaît vite, qu'on rate facilement sur téléphone) ; les parcelles sont listées dans une **carte « Mes parcelles »** avec leur surface et leur nombre de campagnes. Même renforcement pour les doublons d'**intrants, produits, clients, bandes et repères d'animaux**. *Si le problème revient, écrivez-moi les deux noms exacts saisis et l'appareil utilisé.* **Nouveau bouton « Retirer »** sur chaque parcelle qui n'a aucune campagne : utilisez-le pour supprimer votre parcelle en double (il n'existait aucun moyen de la retirer, c'était un manque).
- **v307 — Vocabulaire comptable de l'Agriculture** : l'achat d'intrants affichait « Achats de matériaux de chantier », car le compte 601 est partagé avec le BTP et gardait son nom. L'Agriculture a maintenant **ses propres comptes**, nommés avec le vocabulaire du métier : **6021 Achats d'intrants agricoles** (semences, engrais, aliments, produits vétérinaires) ; **6022 Achats d'animaux d'élevage** ; **6055 Eau d'irrigation, énergie et carburant agricole** ; **6132 Location de terres agricoles** ; **6155 Entretien du matériel agricole, des clôtures et des bâtiments d'élevage** ; **6182 Transport des récoltes et des animaux** ; **6282 Autres frais d'exploitation agricole** ; **632 Honoraires (vétérinaire, agronome)** ; **6612 Main-d'œuvre agricole (journaliers)** ; **7012 Ventes de produits agricoles et d'animaux d'élevage**. Les écrans disent aussi **« Intrant »** au lieu de « Matière » et **« Fiche de transformation »** au lieu de « fiche de fabrication ». *Les écritures déjà passées sous l'ancien compte 601 restent telles quelles ; seules les nouvelles saisies utilisent les nouveaux comptes (si besoin, annulez et ressaisissez vos essais).*
- **Calendrier fiscal** : il est maintenant **en cartes** (« Calendrier fiscal », « Chaque mois », « Chaque année », « À savoir ») et **ne déborde plus sur petit écran** (testé à 360 px de large) : chaque échéance s'affiche sur plusieurs lignes au lieu d'un tableau large.
- **Cartes « Marche à suivre »** : elles se cachaient dès que les 7 étapes étaient faites (ou si vous aviez déjà des données). **Elles restent désormais toujours visibles** sur le Tableau de bord, avec ✓ devant les étapes faites et la mention « toutes faites ✓ » à la fin. Corrigé pour **Restauration, Hôtellerie, Industries, Transport, Santé et Agriculture** (Import-export l'avait déjà).
- **Cas pratique Agriculture et élevage** : `CAS-PRATIQUE-AGRICULTURE-pas-a-pas.md` (à lire, pas à déposer).

## 1. Calendrier fiscal (Rapports → Déclarations fiscales → dernier onglet « Calendrier fiscal »)
- **Réponse à votre question sur « l'échéance de demain »** : le **31 octobre**, c'est la **liste annuelle des bénéficiaires de versements** (art. 95), à déposer du 1er au 31 octobre. Pénalité indiquée par la DGI : 25 000 G par mois de retard, plafonnée à 300 000 G.
- **Correction de ma part** : je vous avais proposé d'« ajouter » cette liste alors qu'elle existait déjà dans l'application. Ce qui manquait était un **calendrier** qui regroupe toutes les dates ; il est maintenant là.
- **Contenu** : dates mensuelles (retenues sur salaires et primes, retenues sur prestataires, TCA : du 1er au 15 du mois suivant) ; dates annuelles (liste des employés 30 septembre, liste des bénéficiaires 1–31 octobre, acomptes 1–15 octobre et 1–15 décembre, déclaration définitive de l'IR 1er octobre–31 janvier) ; **échéances proches** en haut ; rappel sur la conservation des documents (5 ans), l'attestation de retenue remise aux employés, les pénalités et l'intérêt de 3 % par mois.
- **Chaque date est marquée « Code fiscal » ou « À confirmer ».** Cet onglet **ne calcule rien** : vos calculs restent ceux du **nouveau Code fiscal** (en vigueur le 1er octobre 2026).
- **Écart à connaître** : les pages du site de la DGI datent de l'**ancien Code** (acomptes à 75 % en 3 versements) alors que l'application applique le **nouveau** (60 % en 2 versements, primes à 15 %). Je n'ai rien changé aux calculs ; les dates incertaines sont « À confirmer » (voir « Ce qui reste de votre ressort »).

## 2. Restauration et Hôtellerie : carte « marche à suivre »
Comme dans les autres secteurs, l'**Aperçu** affiche une carte de **7 étapes** tant que vous n'avez pas fini : 
- **Restauration** : tables, menu, recettes, personnel, première commande, premier encaissement, service et pourboires.
- **Hôtellerie** : types de chambres, chambres, clients, réservation, arrivée, départ et facture, planning.
Chaque étape a un bouton **Ouvrir** qui mène à l'écran concerné (le Vendeur ne voit que les écrans qui lui sont permis). La carte disparaît quand tout est fait.

## 3. Nouveau bloc : Agriculture et élevage
**Activation** : Administration → **Secteurs** → cochez **Agriculture et élevage** (grille de prix C, **inchangée**). L'espace « Agriculture et élevage » apparaît dans le sélecteur d'espace.

**Ce que le bloc permet** (les trois activités : cultures, élevage, transformation et vente) :
- **Intrants et achats** : semences, engrais, aliments, produits vétérinaires ; achat avec fournisseur (à payer ou payé), stock suivi.
- **Produits et prix**, **Catalogue illustré** (comme Industries).
- **Cultures** : **parcelles**, **campagnes** (par campagne et par parcelle), **utilisation d'intrants**, **récoltes**, coût de la campagne et **coût par unité récoltée**.
- **Élevage** : **bandes** (lots) ou **animaux un par un** selon l'espèce ; naissances, achats, **mortalités**, pertes, autoconsommation ; **soins et vaccins avec rappel** ; pesées ; effectif, **coût par tête**, taux de mortalité.
- **Transformation simple** : recettes et lots (ex. maïs → farine), à partir d'un produit récolté.
- **Clients, commandes, ventes** : vente de produits **et d'animaux vivants** (bande ou animal) ; refus de vendre plus que le stock ou l'effectif ; **vente à perte = même règle qu'Industries** (raison obligatoire, gestionnaire requis, bouton « prix de revient », jamais de blocage pur).
- **Dépenses** (main-d'œuvre, salarié, animaux, vétérinaire, terre, énergie, entretien, transport, autre), **imputables à une campagne ou à une bande**. « Salarié » ne crée **pas** d'écriture (la paie se fait dans Salaires, pour éviter le double compte).
- **Rapports** : rentabilité des campagnes ; effectifs et coût par tête. **Statistiques** : coût par campagne.
- **« À faire » et assistant** : impayés, intrant bas, soin en retard, mortalité supérieure à 10 %, campagne de plus de 180 jours sans récolte.
- **Achat et fournisseurs** : onglet « Achats Agriculture ». Sauvegarde, export, import et réinitialisation incluent le bloc. Le **Vendeur** voit : aperçu, catalogue, clients, commandes, ventes.

Numéro de version : **20261030-308**.

## Fichiers du paquet (30 fichiers + 2 documents à lire)
| Dossier du paquet | Fichiers | Où les déposer | Action |
|---|---|---|---|
| racine | CARTE-DES-MODULES.md, tst-fake.js, tst-lancer.mjs, tst-n1.cjs, tst-u36.cjs, tst-u39.cjs, tst-u40.cjs, tst-u41.cjs, tst-u42.cjs, **tst-u43.cjs** | à la racine du dépôt | remplace (tst-u43 : nouveau) |
| build | build.mjs | dossier `build` | remplace |
| src | 00-config, 06-icones-et-graphiques, 07-constantes-metier, 12-application-principale, 17-compta-assistant-de-controle, 24-achats, 28-declarations-fiscales, 34-gestion-module, 35-rapports-et-bilans, 38-administration-stock-et-sauvegardes, 39-administration-module, 50-secteurs-et-blocs, 54-sante, 57-assistant-blocs, 58-restauration, 59-hotellerie, 61-transport, 64-industries, **65-agriculture** (tous en `.jsx`) | dossier `src` | remplace (65-agriculture : nouveau) |

Total : 10 fichiers de racine, 1 fichier `build`, 19 fichiers `src` ; aucun script SQL. **Important** : déposez bien les 10 fichiers de la racine (la liste des tests et le test n1 comptent désormais 20 fichiers de construction).

## Procédure pas à pas
### Étape 1 — Supabase
Rien à faire (pas de script SQL, pas d'Edge Function).
### Étape 2 — Les fichiers de la racine
Dépôt **compta-plus--test** → **Add file → Upload files** → glissez les 10 fichiers du dossier `racine` → **Commit changes**.
### Étape 3 — Le fichier du dossier `build`
Dossier **build** → **Add file → Upload files** → `build.mjs` → **Commit changes**.
### Étape 4 — Les fichiers du dossier `src`
Dossier **src** → **Add file → Upload files** → glissez les 19 fichiers → **Commit changes**. Une construction démarre (25 à 40 minutes). Ne redéposez rien pendant ce temps.
### Étape 5 — Attendre le vert
Onglet **Actions** → « Construire le site » doit passer au **vert**. Si rouge : copiez-moi les lignes **ÉCHEC / FAIL**.
### Étape 6 — Vérifier sur le site de test
1. **Ctrl + Maj + R**. Version en bas du menu : **20261030-308**.
2. **Calendrier fiscal** : Rapports → Déclarations fiscales → **Calendrier fiscal** : échéances proches, 6 dates annuelles, mentions « À confirmer ».
3. **Restauration** puis **Hôtellerie** (espace vide ou neuf) : carte « marche à suivre » sur l'Aperçu ; bouton **Ouvrir** sur une étape.
4. **Agriculture** : Administration → Secteurs → activez le bloc, ouvrez l'espace. Parcourez le **guide en 7 étapes** :
   - Produits et prix : créez « Maïs » ; Intrants : créez « Engrais » et faites un achat (fournisseur, payé) ;
   - Cultures : parcelle → campagne → utilisez de l'engrais → enregistrez une **récolte** → vérifiez le **coût par unité** ;
   - Élevage : créez une **bande** de 20 poulets, une mortalité, un aliment, un vaccin avec rappel ; vérifiez le **coût par tête** ;
   - Dépenses : « Main-d'œuvre » imputée à la campagne ; Ventes : vendez du maïs, puis des poulets ; essayez de vendre **plus que le stock** (refusé) et **sous le coût** (raison demandée) ;
   - Rapports : « Rentabilité des campagnes », « Élevage » ; Aperçu → « À faire ».
5. **Compte Vendeur** : seulement aperçu, catalogue, clients, commandes, ventes.
6. **Petit écran** : ouvrez le Calendrier fiscal sur votre téléphone : plus de défilement horizontal, des cartes. Vérifiez aussi que la carte « Marche à suivre » est visible sur Restauration, Hôtellerie, Industries, Transport, Santé.
7. Contrôle de non-régression : ouvrez Industries, BTP et Commerce : tout fonctionne comme en v304.

## CE QUI RESTE DE VOTRE RESSORT
- Déposer le paquet **sur compta-plus--test seulement**, attendre le vert, faire les vérifications, puis me dire **« v308 validée »** (ou me décrire par écrit ce qui ne va pas).
- **PROD** : dites-moi **« v304 active sur PROD »** (ou son état). Je prépare le paquet PROD v308 **dès votre validation**.
- **Échéances** : **31 octobre 2026** (demain) liste annuelle des bénéficiaires ; **1–15 novembre** retenues d'octobre ; **1–15 décembre** acomptes provisionnels.
- **Question à poser à votre juriste ou comptable** : pour les acomptes (60 % en 2 versements ou 75 % en 3) et la **date du 30 septembre** de la liste des employés, quelle règle s'applique : celle du site de la DGI (ancien Code) ou celle du nouveau Code ? Selon la réponse, je changerai le calendrier.
- **Expert-comptable — Agriculture** : confirmer les comptes 6021 (intrants), 6022 (animaux), 7012 (ventes), 4191 (acomptes clients), 6055 (énergie), 6132 (terre), 6155 (entretien), 6182 (transport), 6282 (autres), 632 (vétérinaire), 6612 (main-d'œuvre), et la **valorisation des stocks et du cheptel** à la clôture.
- **Juriste** : règles de vente d'animaux vivants, traçabilité et soins vétérinaires, contrats de main-d'œuvre agricole.
- **Décisions en attente** : retour en arrière de la base (PITR), récupération 2FA, compte MonCash de production, tests d'intrusion, règle « période clôturée », scénario de prix « Équilibré » (grille C).
- **Suite** : ONG / associations / églises.
