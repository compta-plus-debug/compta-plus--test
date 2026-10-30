# Compta+ — version 303 — paquet TEST
**Numérotation de la barre latérale par ordre d'importance + Industries : catalogue de vente, contrôle du stock, alerte « vente sous le coût » + achats des métiers visibles dans « Achat et fournisseurs ».**

À faire sur le dépôt **compta-plus--test** uniquement. Ce paquet est **cumulatif** : il contient tout ce que contenait la v302 (réinitialisation corrigée, bloc Industries artisanales, bouton « Modifier le dossier » du BTP). Il remplace le paquet v302 : si la v302 n'est pas encore déposée, déposez seulement celui-ci.
**Prérequis** : la v299 (ou une version plus récente) est active sur TEST. **Aucun script SQL, aucune Edge Function.** Vos données ne changent pas. **Rien à supprimer.**

## 1. Numérotation de la barre latérale
**Votre remarque** : le même module portait le même numéro dans tous les secteurs (ex. « 4 » pour Achat et fournisseurs), sans lien avec son importance dans le secteur.
**Ce qui change** : les numéros sont maintenant le **rang réel dans l'espace de travail ouvert** (1, 2, 3…), et le même numéro s'affiche dans l'en-tête du module (« Module 3 »).
Ordre commun à tous les espaces de métier (Éducation, Santé, Restauration, Hôtellerie, Transport, Immobilier, BTP, Industries) :
1. le **module du métier** · 2. Caisse et banque · 3. Dépenses et fournisseurs · 4. Stock (seulement si l'espace en a un : Restauration, Hôtellerie, pharmacie) · puis Salaires · Comptabilité · Rapports et analyse · Gestion avancée · Administration.
Ex. BTP : 1 BTP, 2 Caisse et banque, 3 Dépenses et fournisseurs, 4 Salaires, 5 Comptabilité, 6 Rapports, 7 Gestion avancée, 8 Administration.
**Espace Commerce : ordre inchangé** (Comptabilité 1, Caisse 2, Vente 3, Achat 4…). **Espace Import-export** : Import-export en 1, puis l'ordre habituel du commerce (Comptabilité 2, Caisse 3…). Les phrases qui citaient « Module 3 » citent maintenant « le module Vente ».
*Si vous préférez un autre ordre d'importance, dites-le-moi : il se change à un seul endroit.*

## 2. Industries — ventes
**Ce que vous avez constaté** : on pouvait vendre plus que le stock du lot, et vendre à perte sans aucun avertissement.
**La cause (vérifiée dans le code)** : le contrôle du stock n'existait que si un produit était choisi ; l'option « texte libre », **choisie par défaut**, le contournait. Aucun contrôle du prix par rapport au coût de revient n'existait.
**Ce qui change** (Ventes) :
- **Catalogue de vente** : liste des produits avec prix, quantité disponible, mention « Rupture » (comme la carte de la Restauration).
- **Stock contrôlé dès l'ajout de la ligne**, en comptant les lignes déjà dans la facture : « il en reste X ».
- **Texte libre supprimé** pour les produits : une ligne hors stock doit être choisie comme **« Service ou prestation (hors stock) »**.
- **Alerte vente à perte** : encadré rouge (prix, coût de revient moyen, perte par unité) ; vous corrigez le prix ou confirmez. Je **n'interdis pas** la vente à perte (déstockage, produit près de la date limite) mais elle est **tracée** : journal d'audit, ligne « À faire », rapport « Ventes sous le coût de revient », avertissement sur la facture émise.
- **Commandes** : même alerte à l'ajout d'une ligne produit ; à « Livrer et facturer », si le coût de revient des lots liés dépasse le montant à facturer, le bouton devient « Facturer quand même (à perte) » (deuxième clic pour confirmer). Les lignes sur mesure (sans produit) restent libres : on ne peut pas connaître leur coût avant la fabrication.

## 3. Achats des métiers dans « Achat et fournisseurs »
**Ce que vous avez constaté** : les achats de matériaux (BTP) et de matières (Industries) n'apparaissaient pas dans « Achat et fournisseurs ».
**La cause** : ces deux modules tiennent leurs propres achats (liés au chantier ou au stock de matières) ; « Achat et fournisseurs » ne lisait que ses propres achats. Les écritures comptables, elles, étaient bien là (601/401, caisse, banque).
**Ce qui change** :
- Nouvel onglet **« Achats des métiers »** (visible dès qu'il y en a) : toutes les dépenses BTP et tous les achats/dépenses Industries **avec un fournisseur**, en **lecture seule** (date, métier, fournisseur, détail, montant, reste à payer, état) avec totaux.
- L'onglet **Fournisseurs** : le « total à payer » de chaque fournisseur **inclut maintenant** ces dettes, avec la mention « dont X dans les métiers ».
- Les fournisseurs saisis dans BTP ou Industries **rejoignent automatiquement la liste commune** (une seule fois, sans doublon) dès qu'on ouvre « Achat et fournisseurs » ; et les cases « Fournisseur » de BTP et d'Industries **proposent** la liste commune.
- **Le règlement reste dans le module du métier** (pas de double écriture comptable).
**Limite à connaître (correction de mon diagnostic)** : Transport et Immobilier n'ont **pas de champ « fournisseur »** dans leurs dépenses (seulement « payé par » caisse, banque ou à payer). Je ne peux donc pas les rattacher à un fournisseur. Je vous propose d'y ajouter ce champ dans un prochain paquet si vous le voulez.

Numéro de version : **20261030-303**.

## Fichiers du paquet (29 fichiers)
| Dossier du paquet | Fichiers | Où les déposer | Action |
|---|---|---|---|
| racine | CARTE-DES-MODULES.md, tst-fake.js, tst-lancer.mjs, tst-n1.cjs, tst-u36.cjs, tst-u39.cjs, tst-u40.cjs, tst-u41.cjs, **tst-u42.cjs** | à la racine du dépôt | remplace (u40, u41 : nouveau si la v302 n'est pas déposée ; u42 : nouveau) |
| build | build.mjs | dossier `build` | remplace |
| src | 00-config, 07-constantes-metier, 12-application-principale, 17-compta-assistant-de-controle, **19-compta-module, 21-caisse-et-banque, 23-vente, 24-achats, 25-stock, 26-creances-et-clients, 27-paie, 34-gestion-module, 35-rapports-et-bilans**, 38-administration-stock-et-sauvegardes, 39-administration-module, 50-secteurs-et-blocs, 57-assistant-blocs, 63-btp, 64-industries (tous en `.jsx`) | dossier `src` | remplace (64-industries : nouveau si la v302 n'est pas déposée) |

(+ `CAS-PRATIQUE-INDUSTRIES-pas-a-pas.md` : à lire, pas à déposer.) Total : 9 fichiers de racine, 1 fichier `build`, 19 fichiers `src` ; aucun script SQL.

## Procédure pas à pas
### Étape 1 — Supabase
Rien à faire (pas de script SQL, pas d'Edge Function).
### Étape 2 — Les fichiers de la racine
Dépôt **compta-plus--test** → **Add file → Upload files** → glissez les 9 fichiers du dossier `racine` → **Commit changes**.
### Étape 3 — Le fichier du dossier `build`
Dossier **build** → **Add file → Upload files** → `build.mjs` → **Commit changes**.
### Étape 4 — Les fichiers du dossier `src`
Dossier **src** → **Add file → Upload files** → glissez les 19 fichiers → **Commit changes**. Une construction démarre (25 à 40 minutes). Ne redéposez rien pendant ce temps.
### Étape 5 — Attendre le vert
Onglet **Actions** → « Construire le site » doit passer au **vert**. Si rouge : copiez-moi les lignes **ÉCHEC / FAIL**.
### Étape 6 — Vérifier sur le site de test
1. **Ctrl + Maj + R**. Version en bas du menu : **20261030-303**.
2. **Numérotation** : ouvrez un espace BTP ou Industries : les numéros vont de 1 à 8 sans trou, le métier est 1, « Dépenses et fournisseurs » est 3 ; cliquez-le : l'en-tête dit « Module 3 ». Passez en espace Commerce : Comptabilité 1, Achat 4.
3. **Industries → Ventes** : le catalogue s'affiche. Essayez (a) une quantité supérieure au stock → refusée avec « il en reste X » ; (b) un prix inférieur au coût de revient → encadré rouge ; confirmez ; (c) « Service ou prestation » avec une désignation libre → accepté ; (d) Rapports → « Ventes sous le coût de revient ».
4. **BTP** : enregistrez une dépense **à payer** avec un fournisseur ; ouvrez « Dépenses et fournisseurs » → onglet **Achats des métiers** (la ligne y est) puis **Fournisseurs** (le fournisseur y est, avec sa dette).
5. **Test de la réinitialisation** (v302, toujours à valider) et **cas pratique Industries** : voir les documents de la v302 / `CAS-PRATIQUE-INDUSTRIES-pas-a-pas.md`.

## CE QUI RESTE DE VOTRE RESSORT
- Déposer le paquet **sur compta-plus--test seulement**, attendre le vert, faire les vérifications ci-dessus et le test de réinitialisation, puis me dire **« v303 validée »** (ou me décrire par écrit ce qui ne va pas).
- **Décisions pour moi** : (a) l'**ordre d'importance** des modules vous convient-il ? (b) voulez-vous le champ **fournisseur** pour Transport et Immobilier ? (c) la vente à perte reste possible avec confirmation et trace : à confirmer, ou voulez-vous un blocage pur ?
- **PROD** : je prépare le paquet PROD cumulatif (depuis la v300) **dès votre validation**. Dites-moi aussi **« v300 active sur PROD »** après dépôt du paquet PROD v300 (les confirmations v290 et v292 sont restées sans réponse).
- **Règles du serveur** : activer le mode « bloque » (enforce) après lecture du journal reste compatible avec la correction de réinitialisation.
- Prévenir vos clients ; expert-comptable (Industries : 601, 701, 4191, 602, 605, 613, 615, 618, 628, stock de fin d'exercice, main-d'œuvre des lots ; BTP : 706, 4117, 4191, 601, 661, 611, 622, 618, 628, paie des ouvriers) ; juriste (étiquetage/traçabilité des lots, acomptes et commandes sur mesure, règles BTP, contrats d'ouvriers, conditions d'utilisation).
- Échéances : liste annuelle des versements du **31 octobre 2026** (demain) ; retenues d'octobre **1–15 novembre** ; acomptes provisionnels **1–15 décembre**.
- Décisions en attente : retour en arrière de la base (PITR), récupération 2FA, compte MonCash de production, tests d'intrusion, règle « période clôturée », scénario de prix « Équilibré » (grille C).
- **Suite** : ONG/associations/églises, puis Agriculture et élevage.
