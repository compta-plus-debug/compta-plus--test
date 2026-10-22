# Compta+ — version 245 — paquet TEST
**Ouverture sans internet pour les entreprises protégées par un code PIN (7 jours)**

À faire sur le dépôt **compta-plus--test** uniquement. Le paquet PROD viendra après votre « c'est validé ». Aucune migration SQL, aucune Edge Function : rien à faire côté Supabase. Pas de changement du workflow.

Ce paquet **contient aussi** la correction v244 (panier conservé quand on change de module). Si vous l'aviez déjà déposée, les fichiers sont simplement remplacés par une version identique ou plus récente : aucun risque.

## Ce qui change (pour vous)
- Avant : une entreprise protégée par un code PIN ne pouvait **jamais** s'ouvrir sans internet (message « cette entreprise est protégée par un code PIN… »).
- Maintenant : si le code PIN a été saisi **avec internet** sur cet appareil depuis **moins de 7 jours**, l'application (caisse comprise) s'ouvre sans internet, sans redemander le code. Au-delà de 7 jours, ou pour un autre compte, ou si le code n'a jamais été saisi sur cet appareil, l'ouverture reste refusée.
- Le message de refus explique maintenant la raison et la marche à suivre (se connecter avec internet et saisir le code une fois : l'ouverture sans internet est ensuite possible pendant 7 jours).
- Le code PIN lui-même n'est **jamais** enregistré sur l'appareil : seule la date de la dernière saisie réussie l'est (avec l'adresse du compte). La déconnexion efface cette trace.
- Numéro de version : **20260830-245**.

## Fichiers du paquet (9 fichiers)
| Dossier du paquet | Fichier | Où le déposer dans le dépôt | Action |
|---|---|---|---|
| racine | tst-lancer.mjs | à la racine | remplace |
| racine | tst-t1.cjs | à la racine | **nouveau** si v244 pas encore déposée, sinon remplace |
| racine | tst-t2.cjs | à la racine | **nouveau** |
| racine | CARTE-DES-MODULES.md | à la racine | remplace |
| src | 00-config.jsx | dossier `src` | remplace |
| src | 02-mode-hors-ligne.jsx | dossier `src` | remplace |
| src | 12-application-principale.jsx | dossier `src` | remplace |
| src | 23-vente.jsx | dossier `src` | remplace |
| src | index.modele.html | dossier `src` | remplace |

## Procédure pas à pas
### Étape 1 — Les fichiers de la racine
1. Page d'accueil du dépôt **compta-plus--test** → **Add file → Upload files**.
2. Glissez les 4 fichiers du dossier `racine` : `tst-lancer.mjs`, `tst-t1.cjs`, `tst-t2.cjs`, `CARTE-DES-MODULES.md`.
3. **Commit changes**. (Une construction démarre, sans changement visible : normal.)

### Étape 2 — Les fichiers du dossier `src`
1. Ouvrez le dossier **src** → **Add file → Upload files**.
2. Glissez les 5 fichiers : `00-config.jsx`, `02-mode-hors-ligne.jsx`, `12-application-principale.jsx`, `23-vente.jsx`, `index.modele.html`.
3. **Commit changes**. Une construction démarre (environ 8 à 10 minutes).

### Étape 3 — Attendre le vert
Onglet **Actions** : la dernière ligne « Construire le site » doit passer au **vert**. Si elle passe au rouge, ne touchez à rien et copiez-moi le texte de l'étape en échec : rien n'est publié tant que tout n'est pas vert.

### Étape 4 — Vérifier sur le site de test
Prévoyez un compte d'entreprise **avec code PIN** et un téléphone ou ordinateur.
1. **Ctrl + Maj + R** (sur téléphone : fermez complètement l'application puis rouvrez-la). Le numéro en bas du menu doit être **20260830-245**.
2. **Avec internet** : ouvrez l'application, saisissez le code PIN de l'entreprise, entrez dans l'application.
3. Fermez complètement l'application (ou l'onglet), **coupez internet** (mode avion), puis rouvrez-la : elle doit s'ouvrir **sans redemander le code**, et la caisse doit fonctionner (vente hors ligne).
4. Rétablissez internet : la vente faite hors ligne doit se synchroniser comme d'habitude.
5. Test du refus (facultatif) : déconnectez-vous (menu → Déconnexion), coupez internet, rouvrez : l'ouverture est refusée avec le message qui explique le code PIN et les 7 jours.
6. Contrôle panier (v244) : ajoutez 2 articles à la vente, ouvrez Comptes clients (CRM), revenez à Vente : le panier est identique.
7. Dites-moi « v245 validée », ou ce qui cloche (avec une capture si possible).

## Point de sécurité à connaître
La durée de 7 jours se mesure avec l'horloge de l'appareil. Une date reculée ou avancée à la main est détectée côté futur (refus), mais un appareil dont l'horloge serait reculée volontairement pourrait prolonger la fenêtre : c'est la limite normale de tout accès sans internet, et c'est pourquoi la durée est courte.

## Ce que j'ai vérifié avant livraison
- Nouveau test automatique dédié (14 contrôles) : code correct en ligne, mauvais code sans trace, ouverture sans internet dans les 7 jours, refus à 8 jours, refus pour un autre compte, refus sans saisie préalable, refus si la date est dans le futur, le code n'est jamais stocké.
- 31 des 32 séries de tests automatiques réussies ; la 32e (« c1 », contrôle de la politique de sécurité) lit le site construit et se vérifie donc à la construction automatique, où elle avait déjà réussi en v243.
