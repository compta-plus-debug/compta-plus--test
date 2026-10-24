# Compta+ — version 268 — paquet TEST
**Éducation, suite** : année modifiable par l'administrateur principal seulement, renvoi motivé d'un élève ou d'un étudiant (de la classe ou d'un semestre), rôles de l'université : Doyen, Vice-doyen, Secrétaire général(e).

À faire sur le dépôt **compta-plus--test** uniquement. Le paquet PROD ne vous sera donné qu'après votre « v268 validée ».

**Prérequis** : la v265 est active (TEST et PROD). Ce paquet est **cumulatif** : il contient aussi la v266 (renommage en Éducation, type d'établissement, semestres, frais par crédit) et la v267 (données séparées par type, suppression, cours et crédits, réinscription, mots du métier). Si vous avez déjà déposé la v267 sur TEST, déposez simplement celui-ci par-dessus. **Aucun script SQL, aucune Edge Function.** Pas de changement du workflow.

## Ce qui change (pour vous)
1. **Année scolaire, de formation ou académique** : seul l'**administrateur principal** de l'entreprise voit les boutons **Modifier** (nom, dates de début et de fin) et **Activer**. Les autres rôles (Gestionnaire, etc.) peuvent toujours **créer** une année mais ne peuvent plus la modifier ni la rendre active ; un message le leur indique. Les modifications sont inscrites au journal d'audit.
2. **Renvoi d'un élève, étudiant ou apprenant** (onglet des inscrits) : bouton **Renvoyer** → **motif obligatoire** → l'inscrit quitte la classe (il sort des listes, son nom reste visible avec « renvoyé le … — motif »). Ses échéances **à venir** non payées sont annulées ; celles déjà constatées en comptabilité ou payées **restent dues** (règle comptable). Ses inscriptions à des cours en cours sont marquées « renvoyé ». Le bouton **Réintégrer** le remet dans les listes (le motif est conservé dans son dossier ; les échéances annulées ne sont pas rétablies).
3. **Renvoi d'un semestre** (formation professionnelle et université, onglet **Cours et crédits**, bloc « Renvoi d'un semestre ») : choisir l'étudiant ou l'apprenant, le semestre, saisir le **motif obligatoire**. Ses inscriptions aux cours de ce semestre passent à « Renvoyé du semestre », ses échéances à venir de ce semestre sont annulées (celles déjà constatées ou payées restent dues), il **reste dans sa filière**. L'historique des renvois (étudiant, semestre, date, motif) s'affiche sous le formulaire.
4. **Rôles de l'université** (Administration → Accès → Utilisateurs, et bas du menu) :
   - Gestionnaire = **Doyen** ;
   - Consultant = **Vice-doyen** ;
   - Vendeur (encaissements, inscrits et relances) = **Secrétaire général(e)**.
   École et formation professionnelle ne changent pas (École : Directeur, Suppléant ; Formation professionnelle : Directeur, Directeur adjoint ; Secrétaire-caissier(ère) pour le Vendeur).
5. **Réinscriptions** : inchangées (v267) — un cours « À reprendre » se réinscrit et ses crédits sont refacturés.
6. Numéro de version : **20260830-268**.

## Fichiers du paquet (16 fichiers)
| Dossier du paquet | Fichier | Où le déposer | Action |
|---|---|---|---|
| racine | tst-u19.cjs | à la racine du dépôt | **nouveau** (test de cette version) |
| racine | tst-u18.cjs | à la racine du dépôt | nouveau ou remplace (test v267) |
| racine | tst-u17.cjs | à la racine du dépôt | nouveau ou remplace (test v266) |
| racine | tst-lancer.mjs | à la racine du dépôt | remplace |
| racine | tst-u12.cjs | à la racine du dépôt | remplace |
| racine | tst-u13.cjs | à la racine du dépôt | remplace |
| racine | tst-u14.cjs | à la racine du dépôt | remplace |
| racine | CARTE-DES-MODULES.md | à la racine du dépôt | remplace |
| src | 00-config.jsx | dossier `src` | remplace |
| src | 07-constantes-metier.jsx | dossier `src` | remplace |
| src | 12-application-principale.jsx | dossier `src` | remplace |
| src | 38-administration-stock-et-sauvegardes.jsx | dossier `src` | remplace |
| src | 39-administration-module.jsx | dossier `src` | remplace |
| src | 50-secteurs-et-blocs.jsx | dossier `src` | remplace |
| src | 51-ecoles.jsx | dossier `src` | remplace |
| src | 52-ecoles-suite.jsx | dossier `src` | remplace |

(8 fichiers de racine, 8 fichiers `src`, aucun script SQL.)

## Procédure pas à pas
### Étape 1 — Supabase
Rien à faire (pas de script SQL, pas d'Edge Function).

### Étape 2 — Les fichiers de la racine
Dépôt **compta-plus--test** → **Add file → Upload files** → glissez les 8 fichiers du dossier `racine` → **Commit changes**.

### Étape 3 — Les fichiers du dossier `src`
Dossier **src** → **Add file → Upload files** → glissez les 8 fichiers du dossier `src` → **Commit changes**. Une construction démarre (25 à 40 minutes). Ne redéposez rien pendant ce temps.

### Étape 4 — Attendre le vert
Onglet **Actions** : « Construire le site » doit passer au **vert**. Si rouge : ne touchez à rien, copiez-moi le texte de l'étape en échec.

### Étape 5 — Vérifier sur le site de test
1. **Ctrl + Maj + R** (téléphone : fermez complètement puis rouvrez l'application). Version en bas du menu : **20260830-268**.
2. Connecté en **administrateur principal** : Éducation → Années et classes : les boutons **Modifier** et **Activer** sont présents ; modifiez le nom d'une année et enregistrez.
3. Connecté avec un compte **Gestionnaire** (ou Directeur/Doyen) non principal : ces deux boutons n'apparaissent pas et le message « Seul l'administrateur principal peut modifier ou activer… » s'affiche.
4. Dans les inscrits d'une école : **Renvoyer** un élève sans motif (refusé), puis avec motif : il sort de la liste active, le motif est visible, ses échéances à venir sont annulées. Essayez **Réintégrer**.
5. Type **Université** : créez une année, une filière, un semestre, un cours, un frais par crédit, un étudiant inscrit à un cours ; dans **Cours et crédits → Renvoi d'un semestre**, renvoyez-le avec un motif : l'inscription passe à « Renvoyé du semestre » et l'historique s'affiche.
6. Administration → Accès → Utilisateurs (entreprise en université) : **Doyen (Gestionnaire)**, **Vice-doyen (Consultant)**, **Secrétaire général(e) (Vendeur)**.
7. Dites-moi « v268 validée », ou ce qui cloche.

## Ce que j'ai vérifié avant livraison
- Série automatique complète rejouée sur la version finale (la série « c1 » se vérifie à la construction automatique, comme avant).
- Test dédié (u19, 15 contrôles) : boutons Modifier et Activer pour l'administrateur principal ; année renommée ; absence de ces boutons pour un gestionnaire non principal ; renvoi refusé sans motif puis accepté ; élève sorti avec motif, échéances à venir annulées, motif affiché ; renvoi d'un semestre (refusé sans motif, puis inscription « renvoyé », échéance annulée, étudiant toujours dans sa filière, historique) ; rôles de l'université (menu et Administration). Tests des versions précédentes adaptés et rejoués.
- **Limites à connaître** : la suppression d'une année n'existe pas (seulement la modification) ; le renvoi n'annule pas ce qui est déjà constaté ou payé (une remise ou un remboursement se traite avec Bourses et rabais ou la comptabilité) ; « Réintégrer » ne rétablit pas les échéances annulées (il faut cliquer sur « Appliquer les frais » dans l'onglet Frais pour les recréer) ; pas de contrôle visuel sur une vraie construction avec la feuille de styles complète.

## Retour arrière (seulement si je vous le demande)
Redéposer les fichiers de la v265 (et retirer les tests ajoutés). Les données saisies resteraient en base sans effet.

## CE QUI RESTE DE VOTRE RESSORT
**À faire maintenant**
- Déposer ce paquet sur **TEST**, tester (étape 5), me dire « v268 validée » ou ce qui cloche (cela couvre aussi v266 et v267).
- Me confirmer le sens de ma lecture de votre phrase sur la suppression d'un inscrit (v267) : suppression possible sans trace comptable, renvoi motivé sinon.

**Décisions à prendre**
- **Prix** : scénario « Équilibré » retenu (grille A pour Éducation et Import-export) ; à confirmer après un test auprès de 5 à 10 entreprises cibles.
- **Numérotation qui repart de 0001 chaque année** et **exercice octobre–septembre** : avec l'expert-comptable.
- Prochain bloc ou priorité : dites-moi.

**Échéances et suivis**
- **Liste annuelle des versements** : avant le **31 octobre 2026** ; **retenues d'octobre** : 1er–15 novembre ; **acomptes provisionnels** : 1er–15 décembre.
- **Lundi 26 octobre** : vérifier la réception des e-mails de relance (Resend).
- Dans quelques jours : relancer le script 1 (journal) sur TEST et PROD ; garder le script 3.

**Validations externes et démarches**
- Expert-comptable : TCA sur cantine, transport, uniformes, examens et laboratoire ; compte 709 ; TCA sur les abonnements ; base des retenues 96–97 ; taux de retenue sur primes ; acomptes ; acompte d'impôt à l'importation, TCA à l'exportation, taux de droits et taxes à l'importation ; traitement comptable d'un renvoi (frais déjà payés).
- Avocat : documents juridiques et données d'élèves et d'étudiants (dont mineurs) ; messages de relance ; accès d'une secrétaire ; **règlement intérieur et motifs de renvoi conservés dans les dossiers**.
- Décision sur la sauvegarde à la minute ; récupération du 2FA ; compte MonCash de production ; prestataires de test d'intrusion ; règle « période clôturée ».
