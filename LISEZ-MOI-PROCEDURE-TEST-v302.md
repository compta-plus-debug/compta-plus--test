# Compta+ — version 302 — paquet TEST
**Correction de la réinitialisation des données** (pièces qui restaient après « tout cocher ») **+ nouveau bloc Industries artisanales + bouton « Modifier le dossier » du BTP.**

À faire sur le dépôt **compta-plus--test** uniquement. Ce paquet est **cumulatif depuis la v299** (validée sur TEST) : il remplace le paquet v301 (inutile de déposer la v301 si ce n'est pas déjà fait ; si elle l'est, celui-ci la met à jour).
**Prérequis** : la v299 (ou la v301) est active sur TEST. **Aucun script SQL, aucune Edge Function.** Vos données ne changent pas. **Rien à supprimer.**

## La correction (réinitialisation)
**Ce que vous avez constaté** : après « Tout cocher » puis la réinitialisation, des écritures (Comptabilité, Caisse et banque) et des clients/factures restaient.
**La cause (reproduite et vérifiée)** : la base de données refuse de supprimer une écriture, une facture ou un achat **daté dans une période clôturée** (règle « période clôturée », ou une date de clôture mémorisée). L'application supprimait les pièces **avant** d'avoir effacé la date de clôture sur le serveur : le serveur refusait la suppression, puis l'application rechargeait les pièces depuis le serveur — elles « restaient », sans message durable. Dans mon test, l'ancienne version laissait 3 écritures, 2 factures et 1 achat ; la nouvelle vide tout.
**Ce qui change** :
1. La **date de clôture est effacée et enregistrée sur le serveur d'abord**, puis les données sont supprimées.
2. Après la suppression, l'application **relit le serveur** et vérifie que chaque catégorie cochée est vide. Un encadré reste affiché dans le panneau : **vert « terminée et vérifiée »** ou **rouge « incomplète : il reste X écritures, Y factures… »** avec la raison.
3. Pendant l'opération, un message « Réinitialisation en cours » apparaît et le bouton est bloqué (quelques secondes ; ne fermez pas la page).
**Ce qui n'a PAS changé (volontaire)** : les paramètres de l'entreprise, le logo, les utilisateurs et le journal d'audit sont toujours conservés ; les 3 produits d'exemple et le fournisseur d'exemple par défaut reviennent si vous cochez « Catalogue produits » / « Fournisseurs » (c'est l'état d'une entreprise neuve).

## Autres changements (déjà annoncés dans la v301)
- **Industries artisanales** : nouveau bloc complet (matières et achats, produits et recettes, production avec coût de revient, commandes avec acomptes, ventes et factures, dépenses d'atelier, rapports, statistiques, rôles Vendeur et Lecteur, 3 contrôles de l'assistant). Voir `CAS-PRATIQUE-INDUSTRIES-pas-a-pas.md`. Grille de prix A inchangée.
- **BTP** : bouton « Modifier le dossier » (nom, client, adresse, dates, retenue ; lignes du bordereau).

Numéro de version : **20260830-302**.

## Fichiers du paquet (19 fichiers)
| Dossier du paquet | Fichier | Où le déposer | Action |
|---|---|---|---|
| racine | CARTE-DES-MODULES.md | à la racine du dépôt | remplace |
| racine | tst-fake.js | à la racine du dépôt | remplace |
| racine | tst-lancer.mjs | à la racine du dépôt | remplace |
| racine | tst-n1.cjs | à la racine du dépôt | remplace |
| racine | tst-u36.cjs | à la racine du dépôt | remplace |
| racine | tst-u39.cjs | à la racine du dépôt | remplace |
| racine | tst-u40.cjs | à la racine du dépôt | **nouveau** |
| racine | tst-u41.cjs | à la racine du dépôt | **nouveau** |
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

(+ `CAS-PRATIQUE-INDUSTRIES-pas-a-pas.md` : à lire, pas à déposer.) Total : 8 fichiers de racine, 1 fichier `build`, 10 fichiers `src` ; aucun script SQL.

## Procédure pas à pas
### Étape 1 — Supabase
Rien à faire (pas de script SQL, pas d'Edge Function).
### Étape 2 — Les fichiers de la racine
Dépôt **compta-plus--test** → **Add file → Upload files** → glissez les 8 fichiers du dossier `racine` → **Commit changes**.
### Étape 3 — Le fichier du dossier `build`
Dossier **build** → **Add file → Upload files** → `build.mjs` → **Commit changes**.
### Étape 4 — Les fichiers du dossier `src`
Dossier **src** → **Add file → Upload files** → glissez les 10 fichiers → **Commit changes**. Une construction démarre (25 à 40 minutes). Ne redéposez rien pendant ce temps.
### Étape 5 — Attendre le vert
Onglet **Actions** → « Construire le site » doit passer au **vert**. Si rouge : copiez-moi les lignes **ÉCHEC / FAIL**.
### Étape 6 — Vérifier sur le site de test
1. **Ctrl + Maj + R**. Version en bas du menu : **20260830-302**.
2. **Test de la réinitialisation** (entreprise d'essai, pas une entreprise réelle) : créez 2 ou 3 écritures et une facture ; dans Comptabilité → Clôture annuelle, clôturez une période qui contient certaines de ces pièces (si votre entreprise a déjà une date de clôture, c'est encore mieux) ; puis Administration → Données → Réinitialiser… → **Tout cocher (complète)** → Réinitialiser la sélection → tapez RÉINITIALISER.
3. Attendez l'encadré : il doit devenir **vert** (« terminée et vérifiée »). Contrôlez ensuite Comptabilité, Caisse et banque, Comptes clients : tout est vide.
4. S'il devient **rouge**, **notez mot pour mot** le texte de l'encadré (et le message qui s'affiche en bas) et envoyez-le-moi.
5. Industries artisanales : voir le cas pratique.

## CE QUI RESTE DE VOTRE RESSORT
- Déposer le paquet **sur compta-plus--test seulement**, attendre le vert, faire le test de réinitialisation et le cas pratique, puis me dire **« v302 validée »** (ou me décrire par écrit le message rouge).
- **PROD** : la réinitialisation est aussi concernée sur PROD ; je prépare le paquet PROD cumulatif (depuis la v300) **dès votre validation**. Dites-moi aussi **« v300 active sur PROD »** après dépôt du paquet PROD v300 (les confirmations v290 et v292 sont restées sans réponse).
- **Règles du serveur** : vous avez prévu d'activer le mode « bloque » (enforce) après lecture du journal ; la correction ci-dessus est compatible avec ce mode. Si vous avez déjà activé le blocage sur PROD, la réinitialisation y est défaillante tant que la correction n'y est pas.
- Prévenir vos clients ; expert-comptable (Industries : 601, 701, 4191, 602, 605, 613, 615, 618, 628, stock de fin d'exercice, main-d'œuvre des lots ; BTP : 706, 4117, 4191, 601, 661, 611, 622, 618, 628, paie des ouvriers) ; juriste (étiquetage/traçabilité des lots, acomptes et commandes sur mesure, règles BTP, contrats d'ouvriers, conditions d'utilisation).
- Échéances : liste annuelle des versements du **31 octobre 2026** (demain) ; retenues d'octobre **1–15 novembre** ; acomptes provisionnels **1–15 décembre**.
- Décisions en attente : retour en arrière de la base (PITR), récupération 2FA, compte MonCash de production, tests d'intrusion, règle « période clôturée » (voir ci-dessus), scénario de prix « Équilibré ».
- **Suite** : ONG/associations/églises, puis Agriculture et élevage.
