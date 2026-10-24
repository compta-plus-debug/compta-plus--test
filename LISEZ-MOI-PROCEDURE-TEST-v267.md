# Compta+ — version 267 — paquet TEST
**Éducation, suite** : données séparées par type d'établissement, suppression des inscrits, rôles par type (Recteur…), mots du métier partout, cours avec crédits et réinscription.

À faire sur le dépôt **compta-plus--test** uniquement. Le paquet PROD ne vous sera donné qu'après votre « v267 validée ».

**Prérequis** : la v265 est active (TEST et PROD). Ce paquet **contient aussi la v266** (renommage en Éducation, type d'établissement, semestres, frais par crédit) : vous n'avez rien d'autre à déposer. **Aucun script SQL, aucune Edge Function.** Pas de changement du workflow.

## Ce qui change (pour vous), selon vos 5 remarques
1. **Données séparées par type d'établissement.** École, centre de formation professionnelle et université ont chacun leurs années, classes ou filières, inscrits, payeurs, frais, reçus, semestres, bourses et message de relance. Changer de type (Années et classes → « Type d'établissement ») change d'espace : la filière « Électricité » n'apparaît plus dans une école. Les reçus gardent une numérotation unique (RE-année-numéro) pour toute l'entreprise. **Important** : ce que vous avez saisi pendant le test de la v266 sans y prêter attention (par exemple « Électricité ») est rangé dans l'école : supprimez-le (voir point 2).
2. **Suppression.** Une classe ou filière **vide** se supprime avec la croix ×. Un **élève / étudiant / apprenant** se supprime avec le bouton **Supprimer** (onglet des inscrits) **tant qu'aucun de ses frais n'est constaté en comptabilité ou payé** ; ses échéances non payées sont supprimées avec lui. Sinon, la suppression est refusée avec explication, et « Marquer sorti » le retire des listes en gardant l'historique (règle comptable). Une classe qui contient encore des inscrits ne se supprime pas : supprimez-les ou déplacez-les d'abord. *(J'ai compris votre phrase comme « il n'est pas possible de supprimer » ; si vous vouliez au contraire l'interdire, dites-le-moi.)*
3. **Rôles par type d'établissement** (Administration → Accès → Utilisateurs, et bas du menu) :
   - École : Directeur (Gestionnaire), Secrétaire-caissier(ère) (Vendeur), Suppléant (Consultant) ;
   - Formation professionnelle : Directeur, Secrétaire-caissier(ère), Directeur adjoint ;
   - Université : **Recteur**, Secrétaire-caissier(ère), **Vice-recteur**.
   Les noms suivent le type choisi dans le bloc Éducation. Si vous souhaitez d'autres titres (par exemple « Doyen » ou « Secrétaire général »), donnez-les-moi.
4. **Mots du métier** dans les **rapports** (situation par filière, étudiants, payeurs), les **relances** (message adapté : « l'université vous rappelle… »), les **exports** (en-têtes et noms de fichiers) et les **reçus imprimés** (« Payeur : … », « Reste à payer par le payeur », « Université » si le nom de l'entreprise est vide), les bourses et les messages.
5. **Cours et crédits** (formation professionnelle et université), nouvel onglet **Cours et crédits** :
   - **Catalogue des cours** : code facultatif, intitulé, crédits (ex. Introduction à la gestion : 4 crédits), filière facultative ;
   - **Crédits requis** par filière (champ à côté de chaque filière) ;
   - **Inscrire un étudiant à un cours** (semestre facultatif) : crée l'échéance des frais « par crédit » = montant × crédits du cours. Un étudiant inscrit à des cours est facturé **par cours** ; un étudiant sans cours reste facturé d'après les crédits saisis sur sa fiche ;
   - **Résultat du cours** : En cours / Validé / À reprendre (pas de notes) ;
   - **Réinscrire** un cours « À reprendre » : nouvelle inscription et **nouvelle facturation** de ses crédits ; l'ancienne est marquée « Repris » ;
   - **Progression en crédits** par étudiant : validés, en cours, à reprendre, requis, « Il manque N crédits » ou « Crédits suffisants » ;
   - une inscription dont les frais ne sont ni constatés ni payés peut être supprimée.
6. Numéro de version : **20260830-267**.

## Fichiers du paquet (15 fichiers)
| Dossier du paquet | Fichier | Où le déposer | Action |
|---|---|---|---|
| racine | tst-u18.cjs | à la racine du dépôt | **nouveau** (test de cette version) |
| racine | tst-u17.cjs | à la racine du dépôt | nouveau ou remplace (test de la v266) |
| racine | tst-lancer.mjs | à la racine du dépôt | remplace |
| racine | tst-u12.cjs | à la racine du dépôt | remplace (nouveau nom du menu) |
| racine | tst-u13.cjs | à la racine du dépôt | remplace (nouveau nom du menu) |
| racine | tst-u14.cjs | à la racine du dépôt | remplace (nouveau nom du menu) |
| racine | CARTE-DES-MODULES.md | à la racine du dépôt | remplace |
| src | 00-config.jsx | dossier `src` | remplace |
| src | 07-constantes-metier.jsx | dossier `src` | remplace |
| src | 12-application-principale.jsx | dossier `src` | remplace |
| src | 38-administration-stock-et-sauvegardes.jsx | dossier `src` | remplace |
| src | 39-administration-module.jsx | dossier `src` | remplace |
| src | 50-secteurs-et-blocs.jsx | dossier `src` | remplace |
| src | 51-ecoles.jsx | dossier `src` | remplace |
| src | 52-ecoles-suite.jsx | dossier `src` | remplace |

(7 fichiers de racine, 8 fichiers `src`, aucun script SQL.)

## Procédure pas à pas
### Étape 1 — Supabase
Rien à faire (pas de script SQL, pas d'Edge Function).

### Étape 2 — Les fichiers de la racine
Dépôt **compta-plus--test** → **Add file → Upload files** → glissez les 7 fichiers du dossier `racine` → **Commit changes**.

### Étape 3 — Les fichiers du dossier `src`
Dossier **src** → **Add file → Upload files** → glissez les 8 fichiers du dossier `src` → **Commit changes**. Une construction démarre (25 à 40 minutes). Ne redéposez rien pendant ce temps.

### Étape 4 — Attendre le vert
Onglet **Actions** : « Construire le site » doit passer au **vert**. Si rouge : ne touchez à rien, copiez-moi le texte de l'étape en échec.

### Étape 5 — Vérifier sur le site de test
1. **Ctrl + Maj + R** (téléphone : fermez complètement puis rouvrez l'application). Version en bas du menu : **20260830-267**.
2. Éducation → Années et classes : en type **École**, supprimez les données de test qui n'ont rien à y faire (classe « Électricité », élèves de test) : bouton Supprimer d'un élève, puis × de la classe.
3. Choisissez **Centre de formation professionnelle** : la liste est vide (données séparées). Créez une année et une filière « Électricité ». Revenez en **École** : Électricité n'y est pas.
4. Choisissez **Université** : créez une année, une filière (Gestion, crédits requis 12), deux semestres, un frais « par crédit » (ex. 1 000), un payeur et un étudiant.
5. Onglet **Cours et crédits** : ajoutez « Introduction à la gestion » (4 crédits) ; inscrivez l'étudiant : échéance de **4 000**. Mettez le résultat **À reprendre**, cliquez **Réinscrire** : une 2e échéance de 4 000 apparaît ; la progression indique les crédits manquants.
6. Administration → Accès → Utilisateurs (entreprise en Université) : **Recteur (Gestionnaire)**, **Vice-recteur (Consultant)** ; le bas du menu affiche « Rôle : Recteur » pour un Gestionnaire.
7. Onglets **Impayés et relances**, **Rapports** et un **reçu** imprimé : vérifiez les mots (étudiants, payeurs, filières, université).
8. Dites-moi « v267 validée », ou ce qui cloche.

## Ce que j'ai vérifié avant livraison
- Série automatique complète rejouée sur la version finale (la série « c1 » se vérifie à la construction automatique, comme avant).
- Test dédié (u18, 22 contrôles) : données séparées entre école et formation professionnelle ; marquage des enregistrements ; année active par type ; suppression refusée puis acceptée (classe avec élève, élève sans trace, classe vide) ; cours à 4 crédits ; échéance 4 000 ; progression ; réinscription (nouvelle échéance, ancienne « Repris ») ; mots de l'université dans relances et rapports ; message de relance adapté ; rôle « Recteur » dans le menu et dans Administration. Tests des versions précédentes adaptés et rejoués.
- **Limites à connaître** : la réinscription se fait dans la même année (autre semestre ou même semestre) ; pour réinscrire un étudiant l'année suivante, inscrivez-le dans la nouvelle année puis aux cours à reprendre ; la comptabilité (journal, plan de comptes) reste commune aux trois types (comptes 4111, 7061, 7062, 7068, 709) ; les titres de rôles en formation professionnelle (Directeur adjoint) et en université (Vice-recteur) sont mes propositions ; pas de contrôle visuel sur une vraie construction avec la feuille de styles complète.

## Retour arrière (seulement si je vous le demande)
Redéposer les fichiers de la v265 (et retirer les tests ajoutés). Les données saisies resteraient en base ; les enregistrements marqués par type resteraient sans effet.

## CE QUI RESTE DE VOTRE RESSORT
**À faire maintenant**
- Déposer ce paquet sur **TEST**, tester (étape 5), me dire « v267 validée » ou ce qui cloche.
- Me confirmer le sens de votre phrase sur la suppression (voir point 2) et les titres de rôles souhaités.

**Décisions à prendre**
- **Prix** : scénario « Équilibré » retenu (grille A pour Éducation et Import-export) ; à confirmer après un test auprès de 5 à 10 entreprises cibles.
- **Numérotation qui repart de 0001 chaque année** et **exercice octobre–septembre** : avec l'expert-comptable.
- Prochain bloc ou priorité : dites-moi.

**Échéances et suivis**
- **Liste annuelle des versements** : avant le **31 octobre 2026** ; **retenues d'octobre** : 1er–15 novembre ; **acomptes provisionnels** : 1er–15 décembre.
- **Lundi 26 octobre** : vérifier la réception des e-mails de relance (Resend).
- Dans quelques jours : relancer le script 1 (journal) sur TEST et PROD ; garder le script 3.

**Validations externes et démarches**
- Expert-comptable : TCA sur cantine, transport, uniformes, examens et laboratoire ; compte 709 ; TCA sur les abonnements ; base des retenues 96–97 ; taux de retenue sur primes ; acomptes ; acompte d'impôt à l'importation, TCA à l'exportation, taux de droits et taxes à l'importation.
- Avocat : documents juridiques et données d'élèves et d'étudiants (dont mineurs) ; messages de relance ; accès d'une secrétaire.
- Décision sur la sauvegarde à la minute ; récupération du 2FA ; compte MonCash de production ; prestataires de test d'intrusion ; règle « période clôturée ».
