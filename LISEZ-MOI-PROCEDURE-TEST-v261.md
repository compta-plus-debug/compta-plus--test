# Compta+ — version 261 — paquet TEST
**Espace de travail École / Commerce + secrétaire-caissier(ère)** (inclut la v260 : relances, bourses et rabais, rapports, cantine/transport)

À faire sur le dépôt **compta-plus--test** et le Supabase de **TEST** uniquement. Le paquet PROD ne vous sera donné qu'après votre « v261 validée ».

**Prérequis** : la v259 est active sur TEST. Ce paquet **contient aussi tous les fichiers de la v260** : si vous avez déjà déposé la v260, c'est sans conséquence. **1 script SQL à exécuter AVANT de déposer les fichiers** (étape 1). Aucune Edge Function. Pas de changement du workflow.

## Ce qui change (pour vous)
1. **Espace de travail** : pour une entreprise qui a le secteur **Écoles**, un sélecteur **« École | Commerce »** apparaît en haut du menu.
   - **Espace École** (par défaut) : le menu met **Écoles** en premier, puis Caisse et banque, Comptabilité, **Dépenses et fournisseurs**, **Salaires du personnel**, Rapports, Administration, Gestion avancée. **Vente (POS), Stock et Comptes clients (CRM) sont repliés** : ils n'encombrent plus l'école. Le bouton du haut devient **« Tableau de bord de l'école »** et ouvre la vue d'ensemble de l'école ; à l'ouverture de l'application, vous arrivez directement dans l'école.
   - **Espace Commerce** : le menu habituel (Vente, Achats, Stock, Comptes clients…). Le module Écoles est masqué dans cet espace.
   - Le choix est mémorisé sur l'appareil. Une entreprise **sans** le secteur Écoles ne voit aucun changement.
2. **Secrétaire-caissier(ère)** : une personne avec le rôle **Vendeur** dans une école accède **uniquement** au module Écoles (espace École), avec 3 onglets : **Familles et élèves** (consultation), **Encaissements** (elle encaisse et édite les reçus numérotés) et **Impayés et relances** (appel, WhatsApp, message copié). Elle ne peut ni créer d'années, de classes ou de frais, ni inscrire un élève, ni **annuler un reçu**, ni voir la comptabilité ou l'administration. Chaque reçu mémorise son adresse e-mail. Un bandeau lui rappelle son périmètre.
3. **Comptes de l'école** : les comptes 4111, 7061, 7062, 7068 et 709 sont créés à l'ouverture du module Écoles par un administrateur ou un gestionnaire (la secrétaire n'a pas le droit de modifier le plan comptable). **Une fois la secrétaire créée, faites ouvrir une fois le module Écoles par la direction avant qu'elle encaisse.**
4. Numéro de version : **20260830-261**.
(Inclus de la v260 : onglets « Impayés et relances », « Bourses et rabais » et « Rapports » ; frais facultatifs cantine/transport par abonnement ; reçus qui mémorisent la personne qui encaisse. Le détail est dans l'ancien LISEZ-MOI v260.)

## Pour créer une secrétaire-caissière
Administration → Utilisateurs / équipe → inviter la personne avec le rôle **Vendeur** (c'est le rôle que l'application affiche sous ce nom). Elle se connecte et arrive dans l'école.

## Fichiers du paquet (11 fichiers)
| Dossier du paquet | Fichier | Où le déposer | Action |
|---|---|---|---|
| supabase | ecole-secretaire-caissiere.sql | **à copier dans Supabase** (étape 1), pas sur GitHub | **nouveau** |
| racine | tst-lancer.mjs | à la racine du dépôt | remplace |
| racine | tst-u13.cjs | à la racine du dépôt | nouveau (v260) ou remplace |
| racine | tst-u14.cjs | à la racine du dépôt | **nouveau** |
| racine | CARTE-DES-MODULES.md | à la racine du dépôt | remplace |
| src | 00-config.jsx | dossier `src` | remplace |
| src | 07-constantes-metier.jsx | dossier `src` | remplace |
| src | 12-application-principale.jsx | dossier `src` | remplace |
| src | 51-ecoles.jsx | dossier `src` | remplace |
| src | 52-ecoles-suite.jsx | dossier `src` | nouveau (v260) ou remplace |

(4 fichiers de racine, 5 fichiers `src`, 1 script SQL.)

## Procédure pas à pas
### Étape 1 — Supabase (script SQL, à faire EN PREMIER)
1. Ouvrez votre projet Supabase **de TEST** → menu de gauche **SQL Editor** → **New query**.
2. Ouvrez le fichier `supabase/ecole-secretaire-caissiere.sql` du paquet (un éditeur de texte suffit), **copiez tout son contenu** et collez-le dans l'éditeur.
3. Cliquez **Run**. Résultat attendu : « Success » puis un petit tableau de 2 lignes (Insert own company data, Update own company data) dont la colonne `with_check` contient le mot **compta-ecole**. Si ce n'est pas le cas, copiez-moi le message.
4. Ce script ne change rien pour les autres rôles et peut être rejoué sans risque. **Aucune Edge Function.**

### Étape 2 — Les fichiers de la racine
1. Page d'accueil du dépôt **compta-plus--test** → **Add file → Upload files**.
2. Glissez les 4 fichiers du dossier `racine`. **Commit changes**.

### Étape 3 — Les fichiers du dossier `src`
1. Ouvrez le dossier **src** → **Add file → Upload files**.
2. Glissez les 5 fichiers du dossier `src` du paquet. **Commit changes**. Une construction démarre (25 à 40 minutes). Ne redéposez rien pendant ce temps.

### Étape 4 — Attendre le vert
Onglet **Actions** : la dernière ligne « Construire le site » doit passer au **vert**. Si elle passe au rouge, ne touchez à rien et copiez-moi le texte de l'étape en échec.

### Étape 5 — Vérifier sur le site de test
1. **Ctrl + Maj + R** (téléphone : fermez complètement l'application puis rouvrez-la). Le numéro en bas du menu doit être **20260830-261**.
2. **Espace École** : avec l'entreprise qui a le secteur Écoles, le sélecteur « École | Commerce » est en haut du menu ; vous êtes dans l'école ; le menu ne montre plus Vente, Stock ni Comptes clients ; « Achat » s'appelle « Dépenses et fournisseurs » et « Salaires (RH) » « Salaires du personnel ».
3. **Espace Commerce** : touchez « Commerce » : le menu habituel revient, l'école disparaît du menu. Touchez « École » : retour à l'école.
4. **Comptes de l'école** : ouvrez le module Écoles en tant qu'administrateur, puis Comptabilité → plan comptable : 4111, 7061, 7062, 7068 et 709 existent.
5. **Secrétaire-caissière** : invitez (ou utilisez) un compte avec le rôle **Vendeur**. Connectez-vous avec : le menu ne montre que **Écoles** ; 3 onglets ; encaissez 500 pour une famille : le reçu s'affiche ; pas de bouton « Annuler » ; pas de formulaire d'inscription ni de frais. **Aucun bandeau rouge d'erreur de synchronisation ne doit apparaître** (c'est le signe que le script SQL a bien été pris en compte).
6. Côté direction : l'encaissement de la secrétaire apparaît dans Encaissements, et dans Rapports → journal de caisse, colonne « Encaissé par » (son e-mail).
7. Essayez aussi les points de la v260 (onglets Relances, Bourses et rabais, Rapports, cantine facultative) si vous n'avez pas encore validé la v260.
8. Dites-moi « v261 validée » (et « v260 validée » si c'est le cas), ou ce qui cloche (avec une capture si possible).

## Ce que j'ai vérifié avant livraison
- Série automatique complète rejouée sur la version finale (la série « c1 » se vérifie à la construction automatique, comme avant).
- Nouveau test dédié (u14, 25 contrôles) : sélecteur présent ; espace École (menu, libellés, accueil, bouton tableau de bord) ; espace Commerce ; choix mémorisé ; comptes de l'école créés ; entreprise sans secteur Écoles inchangée ; secrétaire : menu réduit à Écoles, bandeau, 3 onglets, encaissement avec reçu, pas d'annulation, pas d'inscription, relances accessibles, écritures équilibrées, auteur mémorisé, aucune erreur.
- Le script SQL reprend mot pour mot les règles que vous m'avez collées, avec la seule catégorie « compta-ecole » ajoutée pour le rôle Vendeur ; il n'a pas pu être exécuté ici (pas d'accès à votre Supabase) : c'est l'étape 1 qui le vérifie.

## Retour arrière (seulement si je vous le demande)
Redéposer les fichiers de la v259 retire le sélecteur et la secrétaire. Le script SQL peut rester en place sans effet pour les autres rôles.

## CE QUI RESTE DE VOTRE RESSORT
**À faire maintenant**
- Exécuter le script SQL sur **TEST** (étape 1), déposer ce paquet, tester (étape 5), me dire « v261 validée » (et « v260 validée »). Je prépare PROD ensuite (avec le même script SQL à exécuter sur le Supabase de **production** avant le dépôt).
- **v259 sur PROD** : si ce n'est pas déjà fait, exécuter `supabase/secteurs-et-blocs-migration.sql` sur le Supabase de production, déposer le paquet PROD v259 et me dire « v259 active sur PROD ».

**Décisions à prendre**
- **Prix** : scénario « Équilibré » retenu (grille A pour Écoles) ; à confirmer après un test auprès de 5 à 10 entreprises cibles.
- **Numérotation qui repart de 0001 chaque année** et **exercice octobre–septembre** dans l'impôt sur le revenu : avec l'expert-comptable.

**Échéances et suivis**
- **Liste annuelle des versements** : avant le 31 octobre 2026 ; **acomptes provisionnels** : 1er–15 décembre ; **versement des retenues d'octobre** : 1er–15 novembre.
- **Lundi 26 octobre** : vérifier la réception des e-mails de relance (Resend).
- Dans quelques jours : relancer le script 1 (journal) sur TEST et PROD ; garder le script 3 sous la main.

**Validations externes et démarches**
- Expert-comptable : TCA sur cantine, transport, uniformes ; traitement comptable des bourses et rabais (compte 709) ; TCA sur les abonnements ; base des retenues 96–97 ; taux de retenue sur primes ; acomptes.
- Avocat : documents juridiques et données d'élèves mineurs ; messages de relance aux familles ; accès d'une secrétaire aux fiches d'élèves.
- Décision sur la sauvegarde à la minute ; récupération du 2FA ; compte MonCash de production ; prestataires de test d'intrusion ; règle « période clôturée » en observation.

## Prochaine étape (après validation)
Niveau 2 du plan (tableaux de bord propres à chaque secteur au-delà de l'école), puis le bloc suivant (Import-export).
