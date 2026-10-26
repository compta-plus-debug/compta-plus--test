# Compta+ — version 279 — paquet TEST
**Bloc « Restauration » refondu : un vrai outil de restaurateur.** (L'hôtellerie viendra en v280.)

À faire sur le dépôt **compta-plus--test** uniquement. Le paquet PROD ne vous sera donné qu'après votre « v279 validée ».

**Prérequis** : aucun, ce paquet est **cumulatif depuis la v277** : il remplace la v278 déjà déposée sur TEST (mêmes fichiers, mises à jour). **Aucun script SQL, aucune Edge Function.** Pas de changement du workflow.

## Ce qui change (pour vous)
L'espace Restauration compte maintenant **9 onglets** :

1. **Tableau de bord** : ventes du jour, nombre d'additions, panier moyen, ventes du mois, commandes ouvertes, service à répartir, **plats les plus vendus**, commandes en cours ; réglages (service en %, TCA oui/non) ; message de démarrage en 5 étapes.
2. **Salle et commandes** : **plan de salle** en cartes (vert = libre, orange = occupée, avec le montant). On **touche une table** pour prendre la commande ; on touche les **plats** pour les ajouter ; boutons **+ / −** ; **Envoyer en cuisine** (les lignes passent à « Envoyé », l'état devient « En cuisine »), puis **Marquer servie**, puis **Encaisser**. **Remise** avec motif obligatoire. **Paiement partagé** (plusieurs modes sur une addition) et **division entre N personnes**, tous deux **facultatifs** : sans rien toucher, un paiement unique suffit. Commandes sans table (comptoir, à emporter). Gestion des tables dans le même onglet.
3. **Factures** : toutes les additions encaissées, avec **filtres** (dates, table, serveur, mode de paiement, état) et une **ligne de totaux calculée** (sous-total, service, TCA, pourboires, total encaissé). Chaque facture s'ouvre en **vraie facture** (nom, adresse, téléphone, NIF et logo de l'entreprise, lignes, remise, service, TCA, pourboire, modes de paiement) à imprimer en **A4 ou en ticket étroit**, ou à enregistrer en PDF (bouton « Imprimer / enregistrer en PDF »). Elle s'ouvre aussi automatiquement après chaque encaissement.
4. **Menu** : une vraie **carte** en cartes illustrées, groupées par catégorie (Entrées, Plats, Desserts, Boissons + **vos propres catégories**, ex. « Grillades »). Chaque plat : nom, description, prix, **photo** (réduite automatiquement pour rester légère), **plat du jour**, **en rupture** (non commandable), modifier, retirer. **Aperçu de la carte pour les clients**, imprimable.
5. **Recettes et coûts** : une ligne par plat avec prix, **coût** et **marge** ; la fiche recette se règle ici (ingrédients du stock, quantité d'une portion).
6. **Personnel** : l'équipe avec **nom, téléphone, poste** (serveur 3 points, cuisinier 2, aide-cuisinier 1,5, plongeur 1, barman 2, caissier 1,5, gérant 0), points modifiables, « marquer parti ».
7. **Service et pourboires** : un encadré **explique le calcul en 4 lignes** avec un **exemple chiffré**. Vous choisissez la **période**, vous voyez le service, les pourboires et le total à répartir, le tableau **employé par employé (points, part en %, montant)** avec un **total en bas**, vous mettez **0 point** à un absent, puis **Répartir**. Les **reçus par employé** (avec signature) s'impriment. Une addition déjà répartie ne peut plus être annulée.
8. **Rapports** : **journal des ventes par jour avec ligne de total** (additions, sous-total, service, TCA, pourboires, total encaissé, espèces, banque), ventes **par plat, catégorie, serveur, table et heure**, **marge par plat**, **clôture de caisse** du jour (espèces attendues contre espèces comptées, écart), export CSV.
9. **Statistiques** : indicateurs du mois (ventes, additions, panier moyen, pourboires), **graphique des 6 derniers mois**, répartitions par catégorie, par mode de paiement et par serveur.

Le **Vendeur** (serveur ou caissier) voit 5 onglets (tableau de bord, salle et commandes, factures, menu en consultation, recettes en consultation) : pas de personnel, service, rapports ni statistiques.

**Comptabilité (automatique, à l'encaissement ; une commande ouverte n'écrit rien) :** Débit caisse et/ou banque (selon les modes de paiement) / Crédit **7075** ventes nettes de remise, **445** TCA si activée, **4677** service et pourboires. Répartition : Débit 4677 / Crédit caisse ou banque. Annulation : écritures contrepassées, ingrédients remis en stock.

Numéro de version : **20260830-279**.

## Fichiers du paquet (15 fichiers)
| Dossier du paquet | Fichier | Où le déposer | Action |
|---|---|---|---|
| racine | tst-u28.cjs | à la racine du dépôt | remplace (test de cette version, refait) |
| racine | tst-n1.cjs | à la racine du dépôt | remplace |
| racine | tst-lancer.mjs | à la racine du dépôt | remplace |
| racine | CARTE-DES-MODULES.md | à la racine du dépôt | remplace |
| build | build.mjs | dossier `build` (à la racine du dépôt) | remplace |
| src | 58-restauration.jsx | dossier `src` | remplace (refait) |
| src | 57-assistant-blocs.jsx | dossier `src` | remplace |
| src | 17-compta-assistant-de-controle.jsx | dossier `src` | remplace |
| src | 12-application-principale.jsx | dossier `src` | remplace |
| src | 39-administration-module.jsx | dossier `src` | remplace |
| src | 38-administration-stock-et-sauvegardes.jsx | dossier `src` | remplace |
| src | 50-secteurs-et-blocs.jsx | dossier `src` | remplace |
| src | 07-constantes-metier.jsx | dossier `src` | remplace |
| src | 06-icones-et-graphiques.jsx | dossier `src` | remplace |
| src | 00-config.jsx | dossier `src` | remplace |

(4 fichiers de racine, 1 fichier `build`, 10 fichiers `src`, aucun script SQL.)

## Procédure pas à pas
### Étape 1 — Supabase
Rien à faire (pas de script SQL, pas d'Edge Function).
### Étape 2 — Les fichiers de la racine
Dépôt **compta-plus--test** → **Add file → Upload files** → glissez les 4 fichiers du dossier `racine` → **Commit changes**.
### Étape 3 — Le fichier du dossier `build`
Dossier **build** → **Add file → Upload files** → `build.mjs` → **Commit changes**.
### Étape 4 — Les fichiers du dossier `src`
Dossier **src** → **Add file → Upload files** → glissez les 10 fichiers → **Commit changes**. Une construction démarre (25 à 40 minutes). Ne redéposez rien pendant ce temps.
### Étape 5 — Attendre le vert
Onglet **Actions** → « Construire le site » doit passer au **vert**. Si rouge : copiez-moi les lignes **ÉCHEC / FAIL**. Si rien ne démarre : il faut un vrai changement dans `src`.
### Étape 6 — Vérifier sur le site de test
1. **Ctrl + Maj + R**. Version en bas du menu : **20260830-279**.
2. Entreprise de TEST en forfait **Assisté** ou **Extension** avec le secteur **Restauration et hôtellerie**. Dans **Stock**, créez un produit « marchandise » (ex. « Riz », prix de revient 60, quantité 10).
3. **Salle et commandes** : ajoutez 2 tables. **Menu** : ajoutez une catégorie « Grillades », puis 3 plats avec une **photo** pour l'un d'eux. Cliquez « Aperçu de la carte pour les clients ».
4. **Recettes et coûts** : recette du premier plat (Riz, quantité 2) : coût et marge s'affichent.
5. **Personnel** : ajoutez Anne (serveur), Boris (cuisinier), Carl (plongeur) : les points se remplissent selon le poste.
6. **Salle** : touchez une table, touchez des plats, **Envoyer en cuisine**, **Marquer servie**, remise avec motif, pourboire, **Encaisser** (essayez aussi « Payer avec plusieurs modes »). La **facture** s'ouvre : essayez **Passer en ticket**.
7. **Factures** : la liste et sa ligne de totaux. **Service et pourboires** : lisez l'encadré, mettez 0 point à Carl, **Répartir**, ouvrez les **Reçus**. **Rapports** : journal avec total, clôture de caisse. **Statistiques**.

## CE QUI RESTE DE VOTRE RESSORT
- Déposer le paquet **sur compta-plus--test seulement**, attendre le vert, tester (étape 6), puis **« v279 validée »** (ou vos remarques). PROD reste en v277 jusque-là.
- Décisions à me donner pour l'**hôtellerie (v280)** : types de chambres et tarifs par nuit, taxe de séjour (oui/non, taux), acompte à la réservation, petit-déjeuner inclus ou non.
- À confirmer avec votre **expert-comptable** : comptes 7075 et 4677, traitement fiscal du service et des pourboires reversés (retenues éventuelles), TCA sur les additions, mentions obligatoires de la facture.
- Votre idée d'étendre cette démarche aux autres blocs (Éducation, Import-export, Santé et les prochains) : dites-moi lequel passer en premier.
- Avant le **31 octobre 2026** : liste annuelle des versements. **1–15 novembre** : retenues d'octobre. **1–15 décembre** : acomptes provisionnels.
- Compte **WhatsApp Business** dédié ; relire messages de relance et réglages de facturation ; juriste : conditions d'utilisation (consentement WhatsApp, données).
- Décisions en attente : retour en arrière de la base (PITR), récupération 2FA, compte MonCash de production, tests d'intrusion, règle « période clôturée », scénario de prix « Équilibré ».
