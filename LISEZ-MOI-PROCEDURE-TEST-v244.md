# Compta+ — version 244 — paquet TEST
**Le panier de la caisse n'est plus vidé quand on change de module**

À faire sur le dépôt **compta-plus--test** uniquement. Le paquet PROD viendra après votre « c'est validé ». Aucune migration SQL, aucune Edge Function : rien à faire côté Supabase. Pas de changement du workflow.

## Ce qui change (pour vous)
- Pendant une vente, si vous ouvrez un autre module (par exemple Comptes clients pour vérifier la dette d'un client), le panier **est conservé** au retour : articles, quantités, client, mode de paiement, remise globale et frais.
- Le panier se vide quand la vente est enregistrée ou quand vous le videz vous-même. Il expire après 6 heures, et il est propre à l'entreprise et au compte connecté.
- Numéro de version : **20260830-244**.

## Fichiers du paquet (6 fichiers)
| Dossier du paquet | Fichier | Où le déposer dans le dépôt | Action |
|---|---|---|---|
| racine | tst-lancer.mjs | à la racine | remplace |
| racine | tst-t1.cjs | à la racine | **nouveau** |
| racine | CARTE-DES-MODULES.md | à la racine | remplace |
| src | 00-config.jsx | dossier `src` | remplace |
| src | 23-vente.jsx | dossier `src` | remplace |
| src | index.modele.html | dossier `src` | remplace |

## Procédure pas à pas
### Étape 1 — Les fichiers de la racine
1. Page d'accueil du dépôt **compta-plus--test** → **Add file → Upload files**.
2. Glissez les 3 fichiers du dossier `racine` : `tst-lancer.mjs`, `tst-t1.cjs`, `CARTE-DES-MODULES.md`.
3. **Commit changes**. (Une construction démarre, sans changement visible : normal.)

### Étape 2 — Les fichiers du dossier `src`
1. Ouvrez le dossier **src** → **Add file → Upload files**.
2. Glissez `00-config.jsx`, `23-vente.jsx` et `index.modele.html`.
3. **Commit changes**. Une construction démarre (environ 8 à 10 minutes).

### Étape 3 — Attendre le vert
Onglet **Actions** : la dernière ligne « Construire le site » doit passer au **vert**. Si elle passe au rouge, ne touchez à rien et copiez-moi le texte de l'étape en échec : rien n'est publié tant que tout n'est pas vert.

### Étape 4 — Vérifier sur le site de test
1. **Ctrl + Maj + R** (sur téléphone : fermez complètement l'application puis rouvrez-la). Le numéro en bas du menu doit être **20260830-244**.
2. Vente → ajoutez 2 ou 3 articles, saisissez un client, choisissez « crédit ».
3. Ouvrez **Comptes clients (CRM)**, regardez un client, puis revenez à **Vente** : le panier doit être **identique**.
4. Faites un autre aller-retour par Stock puis Comptabilité : le panier est toujours là.
5. Terminez la vente : la facture est créée, et au retour sur la caisse le panier est **vide**.
6. Videz un panier à la main, changez de module, revenez : il reste vide.
7. Dites-moi « v244 validée en test », ou ce qui cloche.

## Ce que j'ai vérifié avant livraison
- Le défaut reproduit sur la v243 (le panier se vidait) et corrigé sur la v244, avec un test automatique dédié.
- Les 31 séries de tests automatiques et la régression complète de 63 séries passent.
