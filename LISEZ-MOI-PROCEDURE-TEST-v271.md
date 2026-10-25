# Compta+ — version 271 — paquet TEST
**Sélecteur d'espaces mieux présenté, bloc Commerce selon l'activité, onglet Statistiques dans Éducation, Import-export et Santé.**

À faire sur le dépôt **compta-plus--test** uniquement. Le paquet PROD ne vous sera donné qu'après votre « v271 validée ». (Le paquet PROD v270 vous a déjà été remis.)

**Prérequis** : la v270 est déposée sur TEST. **Aucun script SQL, aucune Edge Function.** Pas de changement du workflow.

## Ce qui change (pour vous)
1. **Sélecteur d'espaces** (haut du menu) : les boutons sont maintenant disposés **sur 2 colonnes, plusieurs lignes, bien espacés** : « Éducation », « Import-export », « Santé », « Commerce » se lisent en entier et ne sont plus coupés.
2. **Bloc Commerce selon l'activité** : l'espace Commerce (Vente, Stock, Comptes clients…) n'est proposé que lorsque l'activité en dépend :
   - **Import-export** : oui ;
   - **Santé, type Pharmacie** : oui ; l'espace Santé de la pharmacie contient aussi le module Stock ;
   - **Entreprise sans secteur** : oui (menu habituel) ;
   - **Éducation** et **Santé (cabinet, laboratoire, hôpital)** : non, ces blocs ont leurs propres outils de facturation et d'encaissement ; l'espace Santé affiche alors les mêmes outils communs que l'Éducation (Caisse et banque, Comptabilité, Dépenses et fournisseurs, Salaires du personnel, Rapports, Administration, Gestion avancée).
   Si une entreprise a plusieurs secteurs dont un en dépend (par exemple Éducation + Import-export), Commerce reste proposé.
3. **Onglet « Statistiques »** dans chacun des 3 blocs : indicateurs clés, graphique des 6 derniers mois et répartitions en anneaux.
   - **Éducation** : inscrits, attendu, encaissé, taux d'encaissement, impayés échus ; échéances et encaissements par mois ; montants attendus par classe ; encaissements par mode de paiement.
   - **Import-export** : nombre d'importations, valeur importée, chiffre d'affaires et marge des exportations ; importations et exportations par mois ; frais d'approche par nature ; chiffre d'affaires export par client.
   - **Santé** : patients, facturé, encaissé (patients et assureurs), taux d'encaissement ; facturé et encaissé par mois ; chiffre d'affaires par catégorie ; qui paie (patients et assureurs). L'onglet n'est pas affiché à la réception.
4. Numéro de version : **20260830-271**.

**Attention (changement de comportement)** : une entreprise qui a **seulement** le secteur Éducation, ou Santé hors pharmacie, ne voit plus l'espace Commerce. Ses données de Commerce existantes ne sont pas supprimées ; ajoutez un secteur qui en dépend (par exemple Import-export) pour le retrouver.

## Fichiers du paquet (12 fichiers)
| Dossier du paquet | Fichier | Où le déposer | Action |
|---|---|---|---|
| racine | tst-u22.cjs | à la racine du dépôt | **nouveau** (test de cette version) |
| racine | tst-u14.cjs, tst-u15.cjs, tst-u20.cjs | à la racine du dépôt | remplace |
| racine | tst-lancer.mjs | à la racine du dépôt | remplace |
| racine | CARTE-DES-MODULES.md | à la racine du dépôt | remplace |
| src | 55-statistiques.jsx | dossier `src` | **nouveau** (composant commun des statistiques) |
| src | 00-config.jsx | dossier `src` | remplace |
| src | 12-application-principale.jsx | dossier `src` | remplace |
| src | 51-ecoles.jsx | dossier `src` | remplace |
| src | 53-import-export.jsx | dossier `src` | remplace |
| src | 54-sante.jsx | dossier `src` | remplace |

(6 fichiers de racine, 6 fichiers `src`, aucun script SQL.)

## Procédure pas à pas
### Étape 1 — Supabase
Rien à faire (pas de script SQL, pas d'Edge Function).

### Étape 2 — Les fichiers de la racine
Dépôt **compta-plus--test** → **Add file → Upload files** → glissez les 6 fichiers du dossier `racine` → **Commit changes**.

### Étape 3 — Les fichiers du dossier `src`
Dossier **src** → **Add file → Upload files** → glissez les 6 fichiers du dossier `src` → **Commit changes**. Une construction démarre (25 à 40 minutes). Ne redéposez rien pendant ce temps.

### Étape 4 — Attendre le vert
Onglet **Actions** : « Construire le site » doit passer au **vert**. Si rouge : ne touchez à rien, copiez-moi le texte de l'étape en échec.

### Étape 5 — Vérifier sur le site de test
1. **Ctrl + Maj + R** (téléphone : fermez complètement puis rouvrez). Version en bas du menu : **20260830-271**.
2. Entreprise de test avec Éducation + Import-export + Santé : le sélecteur montre 4 boutons sur 2 lignes, tout est lisible, rien n'est coupé par la barre.
3. Entreprise avec seulement Éducation (ou Santé cabinet) : pas de sélecteur Commerce. Santé pharmacie : Commerce présent, et le module Stock est dans l'espace Santé.
4. Dans chaque bloc, ouvrez l'onglet **Statistiques** : les indicateurs et graphiques s'affichent (message d'accueil tant qu'il n'y a pas de données).

## CE QUI RESTE DE VOTRE RESSORT
- Valider la v271 sur TEST : « v271 validée » ou vos remarques (surtout la règle Commerce du point 2).
- Dites-moi **« v270 active sur PROD »** quand le paquet PROD v270 est déposé (script SQL Santé à exécuter en premier sur Supabase PROD).
- Avant le **31 octobre 2026** : liste annuelle des versements. Lundi **26 octobre** : vérifier les e-mails de relance (Resend). **1–15 novembre** : retenues d'octobre. **1–15 décembre** : acomptes provisionnels.
- Relancer le script 1 (journal) sur TEST/PROD dans quelques jours ; garder le script 3.
- **Expert-comptable** : TCA et exonérations des actes de santé, rétrocession d'honoraires, rejets d'assureurs ; points déjà notés (Éducation, Import-export).
- **Juriste** : confidentialité des données des patients, accès du personnel d'accueil, mineurs et motifs de renvoi.
- Décisions en attente : retour en arrière de la base (PITR), récupération 2FA, compte MonCash de production, prestataires de tests d'intrusion, règle « période clôturée », scénario de prix « Équilibré ».
