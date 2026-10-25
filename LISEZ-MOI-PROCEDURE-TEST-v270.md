# Compta+ — version 270 — paquet TEST
**Bloc Santé, suite** : rôle **Réception** (et comptoir en pharmacie), contrôle des doublons et de la fraude sur les fiches patients.

À faire sur le dépôt **compta-plus--test** uniquement. Le paquet PROD ne vous sera donné qu'après votre « v270 validée ».

**Prérequis** : ce paquet est **cumulatif** : il contient aussi toute la v269 (le module Santé). Si vous avez déjà déposé la v269, déposez simplement celui-ci par-dessus. **1 script SQL à exécuter AVANT de déposer les fichiers** (étape 1). Aucune Edge Function. Pas de changement du workflow.

## Ce qui change (pour vous)
1. **Rôle Réception** = le rôle **Vendeur** de l'entreprise, affiché **« Réceptionniste »** (cabinet, laboratoire, hôpital) ou **« Vendeur(se) de comptoir »** (pharmacie).
   - **Peut** : créer et **modifier** les fiches patients, admettre un patient à l'hôpital, émettre des factures (actes, consultations, examens, séjours), encaisser et imprimer, consulter le catalogue et les lots.
   - **Ne peut pas** : modifier tarifs et catalogue, créer assureurs et praticiens, enregistrer remboursements et rejets, annuler une facture ou un encaissement, verser des honoraires, voir les rapports, supprimer une fiche, modifier les lots, changer le type d'établissement. Les onglets Assureurs, Praticiens et Rapports ne lui sont pas affichés.
2. **Produits** : en cabinet, laboratoire et hôpital, la réception **ne voit pas les produits** dans la facturation (la pharmacie vend). En type **Pharmacie**, le comptoir vend les produits (le stock baisse) mais ne modifie pas les lots.
3. **Détection de doublons et de fraude** à la création et à la modification d'une fiche patient (nom comparé sans accents ni majuscules, ordre des mots ignoré ; téléphone comparé sur ses chiffres) :
   - même nom **et** même téléphone, ou même nom **et** même n° de police → **bloqué** (doublon), pour tous les rôles ;
   - même n° de police avec un **autre nom** → **bloqué** pour la réception (message : demandez au responsable) ; l'administrateur ou le gestionnaire peut **confirmer** (police commune d'une famille) ;
   - même nom mais téléphone et police différents → **autorisé** (homonymes) ;
   - même téléphone, autre nom → **autorisé avec un avertissement** (familles).
   Chaque blocage et chaque confirmation est inscrit au **journal d'audit**.
4. **Modifier une fiche patient** : bouton « Modifier » dans la liste des patients.
5. Numéro de version : **20260830-270**.

**Limite à connaître** : la base de données autorise le Vendeur à écrire dans la catégorie Santé en bloc ; les interdits ci-dessus (annuler, supprimer, rapports…) sont appliqués par l'application, pas par la base. Les modifications sont inscrites au journal d'audit et les annulations ne passent que par des écritures inverses.

## Fichiers du paquet (17 fichiers)
| Dossier du paquet | Fichier | Où le déposer | Action |
|---|---|---|---|
| supabase | sante-reception.sql | **à copier dans Supabase** (étape 1), pas sur GitHub | **nouveau** |
| supabase | sante-reception-RETOUR-ARRIERE.sql | **à garder de côté**, ne pas l'exécuter | **nouveau** (au cas où) |
| racine | tst-u21.cjs | à la racine du dépôt | **nouveau** (test de cette version) |
| racine | tst-u20.cjs | à la racine du dépôt | nouveau ou remplace (test v269) |
| racine | tst-n1.cjs | à la racine du dépôt | remplace |
| racine | tst-lancer.mjs | à la racine du dépôt | remplace |
| racine | CARTE-DES-MODULES.md | à la racine du dépôt | remplace |
| build | build.mjs | dossier `build` (à la racine du dépôt) | remplace |
| src | 54-sante.jsx | dossier `src` | nouveau ou remplace |
| src | 53-import-export.jsx | dossier `src` | remplace |
| src | 00-config.jsx | dossier `src` | remplace |
| src | 06-icones-et-graphiques.jsx | dossier `src` | remplace |
| src | 07-constantes-metier.jsx | dossier `src` | remplace |
| src | 12-application-principale.jsx | dossier `src` | remplace |
| src | 38-administration-stock-et-sauvegardes.jsx | dossier `src` | remplace |
| src | 39-administration-module.jsx | dossier `src` | remplace |
| src | 50-secteurs-et-blocs.jsx | dossier `src` | remplace |

(5 fichiers de racine, 1 fichier `build`, 9 fichiers `src`, 2 scripts SQL dont un seul à exécuter.)

## Procédure pas à pas
### Étape 1 — Supabase (script SQL, à faire EN PREMIER)
1. Ouvrez votre projet Supabase **de TEST** → menu de gauche **SQL Editor** → **New query**.
2. Ouvrez le fichier `supabase/sante-reception.sql` du paquet (un éditeur de texte suffit), **copiez tout son contenu** et collez-le dans l'éditeur.
3. Cliquez **Run**. Résultat attendu : « Success » puis un petit tableau de 2 lignes (Insert own company data, Update own company data) dont la colonne `with_check` contient le mot **compta-sante**. Sinon, copiez-moi le message.
4. Ce script ne change rien pour les autres rôles et peut être rejoué sans risque. Le fichier `RETOUR-ARRIERE` ne sert que si vous voulez annuler : ne l'exécutez pas maintenant. **Aucune Edge Function.**

### Étape 2 — Les fichiers de la racine
Dépôt **compta-plus--test** → **Add file → Upload files** → glissez les 5 fichiers du dossier `racine` → **Commit changes**.

### Étape 3 — Le fichier du dossier `build`
Dossier **build** (à la racine du dépôt) → **Add file → Upload files** → glissez `build.mjs` → **Commit changes**.

### Étape 4 — Les fichiers du dossier `src`
Dossier **src** → **Add file → Upload files** → glissez les 9 fichiers du dossier `src` → **Commit changes**. Une construction démarre (25 à 40 minutes). Ne redéposez rien pendant ce temps.

### Étape 5 — Attendre le vert
Onglet **Actions** : « Construire le site » doit passer au **vert**. Si rouge : ne touchez à rien, copiez-moi le texte de l'étape en échec.

### Étape 6 — Vérifier sur le site de test
1. **Ctrl + Maj + R** (téléphone : fermez complètement puis rouvrez). Version en bas du menu : **20260830-270**.
2. En **administrateur**, essayez de créer deux fois la même personne (même nom, même téléphone) : la 2e est refusée. Créez un homonyme avec un autre téléphone et une autre police : accepté.
3. Connectez-vous avec un compte **Vendeur** (entreprise avec le secteur Santé) : le rôle s'affiche « Réceptionniste » ; vous voyez Vue d'ensemble, Patients, catalogue, facturation (et Séjours en hôpital) mais pas Assureurs, Praticiens, Rapports. Créez un patient, modifiez-le, facturez une consultation, encaissez. Pas de bouton d'annulation. **Aucun bandeau rouge d'erreur de synchronisation** (signe que le script SQL est bien pris en compte).
4. Essayez avec une police déjà utilisée par une autre personne : refusé ; l'administrateur, lui, peut confirmer.
5. Type **Pharmacie** (par l'administrateur) : le comptoir voit les produits dans la facturation, la vente baisse le stock, les lots sont en lecture seule.

## CE QUI RESTE DE VOTRE RESSORT
- **Avant de déposer** : exécuter le script SQL sur Supabase TEST (étape 1). Le même script devra être exécuté sur Supabase PROD au moment du paquet PROD.
- Valider la v269 (module Santé) et la v270 sur TEST : « v270 validée » ou vos remarques. Me dire « v268 active sur PROD » si ce n'est pas déjà fait.
- Avant le **31 octobre 2026** : liste annuelle des versements. Lundi **26 octobre** : vérifier les e-mails de relance (Resend). **1–15 novembre** : retenues d'octobre. **1–15 décembre** : acomptes provisionnels.
- Relancer le script 1 (journal) sur TEST/PROD dans quelques jours ; garder le script 3.
- **Expert-comptable** : TCA et exonérations des actes de santé et médicaments, rétrocession d'honoraires, traitement des rejets d'assureurs ; points déjà notés (Éducation, Import-export).
- **Juriste** : confidentialité des données des patients, accès du personnel d'accueil, détection de fraude et conservation des blocages au journal, conditions d'utilisation.
- Décisions en attente : retour en arrière de la base (PITR), récupération 2FA, compte MonCash de production, prestataires de tests d'intrusion, règle « période clôturée », scénario de prix « Équilibré » à tester avec 5 à 10 entreprises (grille B pour la Santé).
