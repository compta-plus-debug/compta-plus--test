# Compta+ — version 301 — paquet TEST
**Nouveau bloc : Industries artisanales** (alimentaire, produits d'entretien et cosmétiques, bois et métal, couture et artisanat d'art), **et reprise du bouton « Modifier le dossier » du chantier BTP** déjà livré sur PROD (v300).

À faire sur le dépôt **compta-plus--test** uniquement. Ce paquet est **cumulatif depuis la v299** (validée sur TEST) : déposez-le seul.
**Prérequis** : la v299 est active sur TEST. **Aucun script SQL, aucune Edge Function.** Vos données ne changent pas. **Rien à supprimer.** Les données du nouveau bloc sont enregistrées dans la table générique existante (catégorie « indus »).

## Ce qui change (pour vous)
1. **Industries artisanales** (secteur à activer : Administration → Secteurs ; grille de prix A, inchangée). Un espace dédié avec 10 onglets :
   - **Tableau de bord** : guide en 7 étapes, « À faire » (stock bas, commandes en retard, devis sans réponse depuis 7 jours, commandes prêtes, factures impayées depuis plus de 30 jours, achats à payer), 8 indicateurs, produits en stock.
   - **Matières et achats** : matières premières avec unité et seuil d'alerte, achats (caisse, banque ou à payer avec règlement partiel), stock et **prix moyen d'achat**, valeur du stock, ajustements (casse, inventaire) avec motif.
   - **Produits et recettes** : produits finis, prix de vente facultatif, recette (matières pour une fabrication, coût estimé).
   - **Production** : lots de fabrication (matières utilisées, heures, taux horaire, frais, date limite de consommation, commande liée) avec **coût de revient et coût unitaire**, stock contrôlé, fiche de fabrication imprimable, annulation protégée.
   - **Clients**, **Commandes** (gamme ou sur mesure, devis imprimable, confirmation, acomptes, livraison et facturation), **Ventes** (factures, encaissements partiels, vente directe au comptoir, facture A4 ou ticket), **Dépenses** d'atelier (énergie, emballages, loyer, entretien, transport…), **Rapports** (marge par produit, marge par commande, impayés par ancienneté, état du stock, exports CSV), **Statistiques**.
   - Rôle **Vendeur** : tableau de bord, clients, commandes, ventes. **Lecteur** : consultation seule. Téléphone : sans débordement.
   - **3 contrôles de l'assistant** : facture impayée, matière presque épuisée, commande en retard.
   - **Rien n'est préréglé** : prix, quantités, taux horaire, frais et taxe sont saisis par vous. Taxe désactivée par défaut.
   - **Comptabilité automatique** : achat 601 ; vente 411 / 701 (+ 445 si taxe) ; acompte 4191 ; encaissement 411 ; dépenses 602, 605, 613, 615, 618, 628 ; dettes 401 ; annulations par écriture inverse. Le stock, le coût de revient et la main-d'œuvre des lots sont un **suivi de gestion** (aucune écriture de salaire : la paie reste dans Salaires ; la variation de stock de fin d'exercice se règle avec l'expert-comptable).
2. **BTP — bouton « Modifier le dossier »** (fiche du chantier) : nom, client, adresse, dates, retenue de garantie ; lignes du bordereau corrigeables (quantité et prix tant qu'aucune situation n'est émise).
3. Un test de l'ancienne suite a été corrigé (u36), sans effet sur l'application.

Numéro de version : **20260830-301**.

## Fichiers du paquet (17 fichiers)
| Dossier du paquet | Fichier | Où le déposer | Action |
|---|---|---|---|
| racine | CARTE-DES-MODULES.md | à la racine du dépôt | remplace |
| racine | tst-lancer.mjs | à la racine du dépôt | remplace |
| racine | tst-n1.cjs | à la racine du dépôt | remplace |
| racine | tst-u36.cjs | à la racine du dépôt | remplace |
| racine | tst-u39.cjs | à la racine du dépôt | remplace |
| racine | tst-u40.cjs | à la racine du dépôt | **nouveau** |
| build | build.mjs | dossier `build` | remplace |
| src | 00-config.jsx | dossier `src` | remplace |
| src | 07-constantes-metier.jsx | dossier `src` | remplace |
| src | 12-application-principale.jsx | dossier `src` | remplace |
| src | 17-compta-assistant-de-controle.jsx | dossier `src` | remplace |
| src | 38-administration-stock-et-sauvegardes.jsx | dossier `src` | remplace |
| src | 39-administration-module.jsx | dossier `src` | remplace |
| src | 50-secteurs-et-blocs.jsx | dossier `src` | remplace |
| src | 57-assistant-blocs.jsx | dossier `src` | remplace |
| src | 63-btp.jsx | dossier `src` | remplace |
| src | 64-industries.jsx | dossier `src` | **nouveau** |

(+ le fichier `CAS-PRATIQUE-INDUSTRIES-pas-a-pas.md` : à lire, il n'est pas à déposer.) Total : 6 fichiers de racine, 1 fichier `build`, 10 fichiers `src` ; aucun script SQL.

## Procédure pas à pas
### Étape 1 — Supabase
Rien à faire (pas de script SQL, pas d'Edge Function).
### Étape 2 — Les fichiers de la racine
Dépôt **compta-plus--test** → **Add file → Upload files** → glissez les 6 fichiers du dossier `racine` → **Commit changes**.
### Étape 3 — Le fichier du dossier `build`
Dossier **build** → **Add file → Upload files** → `build.mjs` → **Commit changes**.
### Étape 4 — Les fichiers du dossier `src`
Dossier **src** → **Add file → Upload files** → glissez les 10 fichiers → **Commit changes**. Une construction démarre (25 à 40 minutes). Ne redéposez rien pendant ce temps.
### Étape 5 — Attendre le vert
Onglet **Actions** → « Construire le site » doit passer au **vert**. Si rouge : copiez-moi les lignes **ÉCHEC / FAIL**.
### Étape 6 — Vérifier sur le site de test
1. **Ctrl + Maj + R**. Version en bas du menu : **20260830-301**.
2. Administration → Secteurs : cochez « Industries artisanales ». Le menu propose l'espace « Industries artisanales ».
3. Suivez **CAS-PRATIQUE-INDUSTRIES-pas-a-pas.md** (environ 30 minutes).
4. BTP : ouvrez un chantier → « Modifier le dossier ».
5. Dites-moi ce qui manque pour votre métier d'artisan.

## CE QUI RESTE DE VOTRE RESSORT
- Déposer le paquet **sur compta-plus--test seulement**, attendre le vert, exécuter le cas pratique, puis me dire **« v301 validée »** (ou me décrire par écrit ce qui ne va pas : vous ne pouvez pas joindre de capture).
- **PROD** : la v300 (BTP complet + Modifier) a été livrée ; dites-moi **« v300 active sur PROD »** après dépôt. Les confirmations v290 et v292 sont sans réponse (la v300 les remplace). Industries artisanales ira sur PROD après votre validation de la v301, dans un paquet cumulatif depuis la v300.
- Prévenir vos clients artisans que le bloc arrive après validation.
- **Expert-comptable** : Industries : 601, 701, 4191, 602, 605, 613, 615, 618, 628, traitement du stock de fin d'exercice (variation de stocks, comptes de stock) et de la main-d'œuvre des lots ; BTP : 706, 4117, 4191, 601, 661, 611, 622, 618, 628 et paie des ouvriers ; autres blocs : voir les paquets précédents.
- **Juriste** : étiquetage, date limite de consommation et traçabilité des lots (alimentaire, cosmétiques et produits d'entretien : règles à vérifier avant d'imprimer sur vos emballages), conditions des commandes sur mesure et des acomptes, règles BTP (réception, réserves, garantie), contrats d'ouvriers, conditions d'utilisation. Le bloc n'impose aucune norme.
- Échéances : liste annuelle des versements du **31 octobre 2026** (demain) ; retenues d'octobre **1–15 novembre** ; acomptes provisionnels **1–15 décembre**.
- Décisions en attente : retour en arrière de la base (PITR), récupération 2FA, compte MonCash de production, tests d'intrusion, règle « période clôturée », scénario de prix « Équilibré » (grille C ; Industries reste en grille A).
- **Suite** : ONG/associations/églises, puis Agriculture et élevage.
