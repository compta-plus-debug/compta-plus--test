# Compta+ — version 281 — paquet TEST
**Nouveau bloc « Hôtellerie »** (chambres, planning, réservations, arrivées et départs, factures de séjour) + la **liste déroulante des serveurs** du bloc Restauration (déjà livrée en PROD v280, elle arrive enfin sur TEST).

À faire sur le dépôt **compta-plus--test** (TEST) uniquement. **Ne rien déposer sur PROD** avant de m'avoir écrit « v281 validée ».

**Prérequis** : TEST est en v279, le workflow corrigé (`ubuntu-24.04`) est en place. Ce paquet est cumulatif depuis la v279. **Aucun script SQL, aucune Edge Function** (les données de l'hôtel sont rangées dans le stockage existant).

## Principe : rien n'est inventé
Aucun tarif, aucune taxe, aucun service n'est préréglé. **Vous saisissez** vos types de chambres, leurs prix, vos services, et **vous décidez** d'activer ou non la taxe de séjour et la TCA. Tant que ce n'est pas activé, ça n'apparaît pas sur la facture.

## Ce que contient l'espace « Hôtellerie » (8 onglets)
1. **Tableau de bord** : chambres occupées, taux d'occupation du jour, arrivées et départs du jour (cliquables), ventes du mois, prix moyen par nuit. Message de démarrage en 5 étapes tant que rien n'est créé.
2. **Planning** : toutes les chambres × 14 jours (boutons « 7 jours » avant/arrière et « Aujourd'hui »). Bleu = réservée, orange = en séjour, gris = hors service. On touche une case pour ouvrir la réservation.
3. **Réservations** : formulaire (client dans une liste, dates, **liste des chambres libres sur ces dates seulement**, tarif repris du type de chambre et modifiable, adultes, enfants, acompte facultatif). Pour chaque réservation : **acompte supplémentaire**, **Enregistrer l'arrivée**, **services** ajoutés pendant le séjour (liste de vos services ou saisie libre), **Annulation / client absent** (acompte remboursé ou conservé), **Départ et facturation** (totaux affichés avant de valider, paiement unique ou plusieurs modes — facultatif).
4. **Chambres et tarifs** (administrateur) : types (nom, personnes max., tarif par nuit, description, **photo**), chambres (numéro, type), **état de ménage** (propre / à nettoyer / hors service ; une chambre sale ne peut pas recevoir un client), **services de l'hôtel** (nom et prix), **taxes** (taxe de séjour par adulte et par nuit, TCA).
5. **Clients** : fiches (nom, téléphone, e-mail, pièce d'identité facultative), nombre de séjours et total dépensé.
6. **Factures** : liste avec filtres (dates, type de chambre, état) et **ligne de totaux** ; facture de séjour (en-tête de l'entreprise : nom, adresse, téléphone, NIF, logo) en **A4 ou ticket**, impression ou PDF ; annulation (administrateur) avec contre-écritures.
7. **Rapports** (administrateur) : journal des ventes par jour **avec totaux**, ventes par type de chambre, services vendus, **occupation par jour**, export CSV.
8. **Statistiques** (administrateur) : ventes, nuitées, taux d'occupation et prix moyen du mois, graphique des 6 derniers mois, répartitions.

La **réception** (rôle Vendeur) voit 5 onglets : tableau de bord, planning, réservations, clients, factures ; elle peut réserver, enregistrer arrivées et départs, encaisser et imprimer, mais pas modifier chambres, tarifs, rapports ni statistiques.

**Règles de sécurité** : pas de réservation dans le passé, pas de chambre prise deux fois sur les mêmes dates, capacité respectée, arrivée impossible avant la date prévue, départ après l'arrivée, aucune date dans le futur pour l'argent, période clôturée respectée. Le départ ne passe pas si les paiements ne correspondent pas au solde.

**Comptabilité (automatique)** : acompte = Débit caisse ou banque / Crédit **4191** (acomptes reçus). Au **départ** : Débit caisse/banque (solde) et 4191 (acomptes déduits) / Crédit **7076** hébergement, **7077** services annexes, **4476** taxe de séjour à reverser, **445** TCA. L'hébergement n'est donc un revenu qu'au départ. Annulation avec acompte : remboursement (Débit 4191 / Crédit caisse) ou acompte conservé (Débit 4191 / Crédit **7078**). Annulation d'une facture : écritures contrepassées, séjour de nouveau « en cours ». Ces comptes sont **à confirmer avec votre expert-comptable**.

**Assistant de contrôle** (forfaits Assisté et Extension) : 2 nouveaux points — client attendu ni arrivé ni annulé ; séjour dépassé sans départ enregistré — chacun avec son guide pas à pas.

Sauvegarde, restauration, remise à zéro et export du bloc : inclus dans Administration.

Numéro de version : **20260830-281**.

## Fichiers du paquet (17 fichiers)
| Dossier du paquet | Fichier | Où le déposer | Action |
|---|---|---|---|
| racine | tst-u29.cjs | à la racine du dépôt | **nouveau** (test de cette version) |
| racine | tst-u28.cjs | à la racine du dépôt | remplace |
| racine | tst-n1.cjs | à la racine du dépôt | remplace |
| racine | tst-lancer.mjs | à la racine du dépôt | remplace |
| racine | CARTE-DES-MODULES.md | à la racine du dépôt | remplace |
| build | build.mjs | dossier `build` | remplace |
| src | 59-hotellerie.jsx | dossier `src` | **nouveau** |
| src | 58-restauration.jsx | dossier `src` | remplace |
| src | 57-assistant-blocs.jsx | dossier `src` | remplace |
| src | 17-compta-assistant-de-controle.jsx | dossier `src` | remplace |
| src | 12-application-principale.jsx | dossier `src` | remplace |
| src | 39-administration-module.jsx | dossier `src` | remplace |
| src | 38-administration-stock-et-sauvegardes.jsx | dossier `src` | remplace |
| src | 50-secteurs-et-blocs.jsx | dossier `src` | remplace |
| src | 07-constantes-metier.jsx | dossier `src` | remplace |
| src | 06-icones-et-graphiques.jsx | dossier `src` | remplace |
| src | 00-config.jsx | dossier `src` | remplace |

## Procédure pas à pas
### Étape 1 — Supabase
Rien à faire (pas de script SQL, pas d'Edge Function).
### Étape 2 — Les fichiers de la racine
Dépôt **compta-plus--test** → **Add file → Upload files** → glissez les 5 fichiers du dossier `racine` → **Commit changes**.
### Étape 3 — Le fichier du dossier `build`
Dossier **build** → **Add file → Upload files** → `build.mjs` → **Commit changes**.
### Étape 4 — Les fichiers du dossier `src`
Dossier **src** → **Add file → Upload files** → glissez les 11 fichiers → **Commit changes**. Une construction démarre (25 à 40 minutes). Ne redéposez rien pendant ce temps.
### Étape 5 — Attendre le vert
Onglet **Actions** → « Construire le site » doit passer au **vert**. Si rouge : copiez-moi les lignes **ÉCHEC / FAIL**.
### Étape 6 — Scénario de vérification (10 minutes)
1. **Ctrl + Maj + R**. Version en bas du menu : **20260830-281**. Le secteur « Restauration et hôtellerie » doit être actif (Administration → Secteurs) ; en haut du menu, un bouton **Hôtellerie** apparaît à côté de Restauration.
2. **Chambres et tarifs** : créez le type « Double » (2 personnes, 2000 par nuit) et « Simple » (1 personne, 1000) ; ajoutez les chambres 101 (Simple), 102 et 103 (Double) ; ajoutez le service « Petit-déjeuner » à 300 ; cochez la taxe de séjour (50) et la TCA, puis **Enregistrer**.
3. **Clients** : enregistrez « Marie Dupont ».
4. **Réservations** : client Marie, arrivée aujourd'hui, départ dans 2 jours, chambre 102, 2 adultes, acompte 1000 → **Enregistrer**. Vérifiez que la chambre 102 n'est plus proposée sur les mêmes dates.
5. Dans la réservation ouverte : **Enregistrer l'arrivée**, puis ajoutez 2 « Petit-déjeuner ». Regardez le **Planning** : case orange.
6. Le **jour du départ** (ou en choisissant une date de départ plus tardive à partir de demain) : **Départ et facturation** : contrôlez les totaux (nuits × tarif + services + taxe de séjour + TCA − acompte), validez : la facture s'ouvre, essayez **A4** et **ticket**.
7. Onglets **Factures**, **Rapports**, **Statistiques** : les totaux doivent correspondre à la facture.
8. Facultatif : créez une réservation pour dans 5 jours et annulez-la en **conservant l'acompte**.
9. Dans **Restauration → Salle et commandes** : la liste des serveurs vient bien de l'onglet Personnel.

## CE QUI RESTE DE VOTRE RESSORT
- Déposer le paquet **sur compta-plus--test seulement**, attendre le vert, faire le scénario (étape 6), puis me dire **« v281 validée »** ou me décrire ce qui ne va pas. Je livre alors la version PROD cumulative.
- Confirmer à votre convenance les réglages réels de votre hôtel (types de chambres, tarifs, taxe de séjour, TCA, services) : ils se saisissent dans l'application, rien à me dire.
- À confirmer avec votre **expert-comptable** : comptes 7076, 7077, 7078, 4191, 4476, 445, traitement fiscal de la taxe de séjour, des acomptes conservés, mentions obligatoires de la facture.
- Me dire « v280 active sur PROD » une fois la v280 déployée et vérifiée.
- Avant le **31 octobre 2026** : liste annuelle des versements. **1–15 novembre** : retenues d'octobre. **1–15 décembre** : acomptes provisionnels.
- Décisions en attente : retour en arrière de la base (PITR), récupération 2FA, compte MonCash de production, tests d'intrusion, règle « période clôturée », scénario de prix « Équilibré ».
