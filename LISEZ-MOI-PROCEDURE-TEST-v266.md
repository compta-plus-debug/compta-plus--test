# Compta+ — version 266 — paquet TEST
**Le bloc « École » devient « Éducation »** : école, centre de formation professionnelle ou université, avec filières, semestres, crédits et frais par crédit.

À faire sur le dépôt **compta-plus--test** uniquement. Le paquet PROD ne vous sera donné qu'après votre « v266 validée ».

**Prérequis** : la v265 est active sur TEST (validée). **Aucun script SQL, aucune Edge Function.** Pas de changement du workflow. Vos données existantes ne changent pas : une école existante reste une école.

## Ce qui change (pour vous)
1. **Renommage** : le module, le secteur d'activité (Administration → Entreprise → Mes secteurs), le sélecteur d'espace de travail et les sauvegardes s'appellent **Éducation**. Le titre d'accueil de l'espace devient « Tableau de bord de l'établissement ».
2. **Type d'établissement** : Éducation → onglet **Années et classes** (en haut) : choisissez **École**, **Centre de formation professionnelle** ou **Université / institut supérieur**. Le vocabulaire s'adapte :
   - École : classes, élèves, familles (comme avant) ;
   - Formation professionnelle : **filières, apprenants, payeurs, années de formation** ;
   - Université : **filières, étudiants, payeurs, années académiques**.
3. **Semestres et sessions** (formation pro. et université) : sous les filières, vous créez « Semestre 1 », « Semestre 2 », avec une date de début facultative.
4. **Crédits** : à l'inscription d'un étudiant, champ **Crédits ce semestre** ; modifiable ensuite dans le tableau.
5. **Frais** (tous les modes sont possibles) :
   - **forfait en tranches** (par année ou semestre), jusqu'à 12 échéances (donc aussi les **mensualités** des formations courtes) ;
   - **par crédit** : case « Montant par crédit » ; l'échéance de chaque étudiant = montant × ses crédits (ex. 5 000 × 15 = 75 000) ;
   - frais séparés d'**inscription**, d'**examens**, de laboratoire, de diplôme : types de frais existants (inscription, autres frais) ;
   - **rattachement à un semestre** : le nom du semestre apparaît sur l'échéance (« Écolage 1/3 — Semestre 1 »).
   Si les crédits d'un étudiant sont saisis après la création du frais, cliquez sur **Appliquer les frais** : l'échéance manquante est créée (jamais en double).
6. La comptabilité ne change pas (4111, 7061, 7062, 7068, 709, 487, TCA facultative).
7. Numéro de version : **20260830-266**.

## Fichiers du paquet (13 fichiers)
| Dossier du paquet | Fichier | Où le déposer | Action |
|---|---|---|---|
| racine | tst-u17.cjs | à la racine du dépôt | **nouveau** (test Éducation) |
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

(6 fichiers de racine, 7 fichiers `src`, aucun script SQL.)

## Procédure pas à pas
### Étape 1 — Supabase
Rien à faire (pas de script SQL, pas d'Edge Function).

### Étape 2 — Les fichiers de la racine
Dépôt **compta-plus--test** → **Add file → Upload files** → glissez les 6 fichiers du dossier `racine` → **Commit changes**.

### Étape 3 — Les fichiers du dossier `src`
Dossier **src** → **Add file → Upload files** → glissez les 7 fichiers du dossier `src` → **Commit changes**. Une construction démarre (25 à 40 minutes). Ne redéposez rien pendant ce temps.

### Étape 4 — Attendre le vert
Onglet **Actions** : « Construire le site » doit passer au **vert**. Si rouge : ne touchez à rien, copiez-moi le texte de l'étape en échec.

### Étape 5 — Vérifier sur le site de test
1. **Ctrl + Maj + R** (téléphone : fermez complètement puis rouvrez l'application). Version en bas du menu : **20260830-266**.
2. Le menu et le sélecteur affichent **Éducation** ; une école existante fonctionne comme avant (classes, élèves, familles).
3. Éducation → **Années et classes** → « Type d'établissement » : choisissez **Université**. Les mots deviennent filières / étudiants / payeurs ; un bloc **Semestres et sessions** apparaît.
4. Créez une année, une filière (ex. Comptabilité), un semestre « Semestre 1 ».
5. Onglet **Frais** : nom « Écolage », montant 5 000, cochez **Montant par crédit**, choisissez la période « Semestre 1 », première échéance, **Ajouter ce frais**.
6. Onglet **Payeurs et étudiants** : ajoutez un payeur, puis un étudiant avec **15 crédits** : l'échéance créée est de **75 000**. Ajoutez un second étudiant sans crédits (aucune échéance), saisissez **12** dans son tableau, puis onglet Frais → **Appliquer les frais** : **60 000** apparaît.
7. Choisissez ensuite **Centre de formation professionnelle** : « Apprenants » ; remettez **École** si vous testez avec une entreprise scolaire.
8. Dites-moi « v266 validée », ou ce qui cloche.

## Ce que j'ai vérifié avant livraison
- Série automatique complète rejouée sur la version finale (la série « c1 » se vérifie à la construction automatique, comme avant).
- Test dédié (u17, 13 contrôles) : nouveau nom dans le menu et le titre ; école par défaut sans semestres ; type université enregistré ; vocabulaire ; semestre ; frais par crédit (75 000 = 5 000 × 15, étiqueté Semestre 1) ; étudiant sans crédits sans échéance puis 60 000 après saisie et « Appliquer » ; formation professionnelle = apprenants ; aucune erreur de page. Les anciens tests ont été adaptés au nouveau nom du menu.
- **Limites à connaître** : les **rapports, les relances et les reçus imprimés** gardent encore les mots « élève » et « famille » (le vocabulaire adapté couvre les écrans de saisie, les onglets et les tableaux principaux) ; les semestres sont un repère sur les frais, ils ne gèrent pas encore les notes, les cours ou les réinscriptions par semestre ; pas de contrôle visuel sur une vraie construction avec la feuille de styles complète.

## Retour arrière (seulement si je vous le demande)
Redéposer les fichiers de la v265. Les types d'établissement, semestres et crédits saisis resteraient en base sans effet.

## CE QUI RESTE DE VOTRE RESSORT
**À faire maintenant**
- **PROD v265** : si ce n'est pas terminé, déposer le paquet PROD v265 (aucun SQL) et me dire « v265 active sur PROD ».
- Déposer ce paquet sur **TEST**, tester (étape 5), me dire « v266 validée » ou ce qui cloche.
- Me dire si, pour les universités et écoles professionnelles, il vous faut aussi la **gestion des cours et des notes** (non incluse) ou seulement la facturation.

**Décisions à prendre**
- **Prix** : scénario « Équilibré » retenu (grille A pour Éducation et Import-export) ; à confirmer après un test auprès de 5 à 10 entreprises cibles.
- **Numérotation qui repart de 0001 chaque année** et **exercice octobre–septembre** : avec l'expert-comptable.
- Prochain bloc ou priorité : dites-moi.

**Échéances et suivis**
- **Liste annuelle des versements** : avant le **31 octobre 2026** ; **retenues d'octobre** : 1er–15 novembre ; **acomptes provisionnels** : 1er–15 décembre.
- **Lundi 26 octobre** : vérifier la réception des e-mails de relance (Resend).
- Dans quelques jours : relancer le script 1 (journal) sur TEST et PROD ; garder le script 3.

**Validations externes et démarches**
- Expert-comptable : TCA sur cantine, transport, uniformes (et frais d'examens ou de laboratoire) ; compte 709 ; TCA sur les abonnements ; base des retenues 96–97 ; taux de retenue sur primes ; acomptes ; acompte d'impôt à l'importation, TCA à l'exportation, taux de droits et taxes à l'importation.
- Avocat : documents juridiques et données d'élèves et d'étudiants (dont mineurs) ; messages de relance ; accès d'une secrétaire.
- Décision sur la sauvegarde à la minute ; récupération du 2FA ; compte MonCash de production ; prestataires de test d'intrusion ; règle « période clôturée ».
