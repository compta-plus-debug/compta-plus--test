# Compta+ — version 260 — paquet TEST
**Bloc Écoles, suite** : bourses et rabais, impayés et relances, rapports, cantine et transport en abonnement.

À faire sur le dépôt **compta-plus--test** uniquement. Le paquet PROD ne vous sera donné qu'après votre « v260 validée ».

**Prérequis** : la v259 est active sur ce dépôt (c'est le cas). **Aucun script SQL, aucune Edge Function** : rien à faire côté Supabase. Pas de changement du workflow.

## Ce qui change (pour vous)
Dans le module **Écoles**, trois nouveaux onglets et une nouveauté dans « Frais » et « Familles et élèves ».

1. **Onglet « Impayés et relances »** : liste des familles qui ont des échéances échues non payées, avec les élèves concernés, le nombre de jours de retard et le reste à payer. Pour chaque famille : **Appeler** (lien téléphone), **WhatsApp** (ouvre WhatsApp avec le message déjà écrit) et **Copier le message** (pour un SMS ou un e-mail). Le **message de relance** est modifiable et enregistrable (mots remplacés automatiquement : {famille}, {montant}, {depuis}, {ecole}). Chaque relance est notée (date, moyen, montant) et la liste affiche « dernière relance » et le nombre de relances. Bouton **Exporter la liste** (fichier tableur).
2. **Onglet « Bourses et rabais »** : on choisit l'élève, le nom de la remise (Bourse, Rabais fratrie…), la forme (pourcentage ou montant fixe), le frais concerné (ou tous), un motif. La remise réduit ce que l'élève doit, sur les échéances déjà créées **et** sur celles créées plus tard. Elle ne peut jamais réduire une échéance sous ce qui a déjà été payé dessus (le montant accordé est alors limité et le message vous le dit). Un montant fixe exige de choisir un frais. **Comptabilité** : si l'échéance n'est pas encore constatée, aucune écriture (elle sera simplement constatée à son nouveau montant) ; si elle est déjà constatée, une écriture est passée : Débit 709 « Rabais, remises et bourses accordés » / Crédit 4111 (avec la TCA au 445 si le frais en portait). Le compte 709 est créé tout seul. Une remise ne se retire pas : vérifiez avant de valider.
3. **Onglet « Rapports »** : situation **par classe** (élèves, frais attendus, encaissé, impayés échus, taux de recouvrement) ; **âge des impayés** (0-30, 31-60, 61-90, plus de 90 jours) ; **journal de caisse** entre deux dates (total espèces, total banque, total par personne qui a encaissé, liste des reçus). Les trois ont un bouton d'export tableur. Chaque reçu mémorise désormais **l'adresse e-mail de la personne qui a encaissé** (pour les reçus créés à partir de cette version).
4. **Cantine et transport en abonnement** : dans « Frais », une nouvelle case **« Facultatif »**. Un frais facultatif n'est **pas** appliqué automatiquement : il n'est créé que pour les élèves abonnés. Dans « Familles et élèves », chaque élève a une case à cocher par frais facultatif de sa classe. Cocher crée les échéances (en tenant compte des remises permanentes) ; décocher annule les échéances **non constatées et non payées** ; celles déjà constatées ou payées restent dues et le message vous le précise.
5. Numéro de version : **20260830-260**.

## Ce qui n'est PAS dans cette version
- **Rôle secrétaire-caissier** (voir « Ce qui reste de votre ressort ») : j'attends le résultat de la requête sur les règles de la base.
- **Espace de travail adapté au secteur** (menu Écoles en premier, vocabulaire de l'école à la place de « Ventes », « Comptes clients »…) : j'attends votre choix entre les deux options que je vous ai proposées.

## Fichiers du paquet (7 fichiers)
| Dossier du paquet | Fichier | Où le déposer | Action |
|---|---|---|---|
| racine | tst-lancer.mjs | à la racine du dépôt | remplace |
| racine | tst-u13.cjs | à la racine du dépôt | **nouveau** |
| racine | CARTE-DES-MODULES.md | à la racine du dépôt | remplace |
| src | 00-config.jsx | dossier `src` | remplace |
| src | 12-application-principale.jsx | dossier `src` | remplace |
| src | 51-ecoles.jsx | dossier `src` | remplace |
| src | 52-ecoles-suite.jsx | dossier `src` | **nouveau** |

(3 fichiers de racine, 4 fichiers `src` dont 1 nouveau, aucun script SQL.)

## Procédure pas à pas
### Étape 1 — Supabase
Rien à faire (pas de script SQL, pas d'Edge Function).

### Étape 2 — Les fichiers de la racine
1. Page d'accueil du dépôt **compta-plus--test** → **Add file → Upload files**.
2. Glissez les 3 fichiers du dossier `racine`. **Commit changes**.

### Étape 3 — Les fichiers du dossier `src`
1. Ouvrez le dossier **src** → **Add file → Upload files**.
2. Glissez les 4 fichiers du dossier `src` du paquet (dont le nouveau `52-ecoles-suite.jsx`). **Commit changes**. Une construction démarre (25 à 40 minutes). Ne redéposez rien pendant ce temps.

### Étape 4 — Attendre le vert
Onglet **Actions** : la dernière ligne « Construire le site » doit passer au **vert**. Si elle passe au rouge, ne touchez à rien et copiez-moi le texte de l'étape en échec.

### Étape 5 — Vérifier sur le site de test
1. **Ctrl + Maj + R** (téléphone : fermez complètement l'application puis rouvrez-la). Le numéro en bas du menu doit être **20260830-260**.
2. **Cantine facultative** : Écoles → Frais → ajoutez « Cantine », 600, 1 échéance, type « Autres frais scolaires », cochez **Facultatif** → « Appliquer les frais ». Échéances : la cantine n'apparaît pas. Familles et élèves : cochez « Cantine » sur un élève : l'échéance apparaît. Décochez : elle disparaît.
3. **Remise sans écriture** : onglet Bourses et rabais → un élève, « Bourse », 10 %, frais « Écolage » → « Accorder la remise ». Échéances : les montants d'écolage baissent de 10 %. Comptabilité : aucune nouvelle écriture.
4. **Remise avec écriture** : faites d'abord un encaissement (qui constate les échéances échues), puis accordez une remise en montant fixe (par exemple 90) sur l'écolage. Comptabilité → journal : une écriture « Remise scolaire… » Débit 709 / Crédit 4111.
5. **Garde-fou** : essayez une remise en montant fixe sans choisir de frais : elle est refusée avec un message.
6. **Relances** : onglet Impayés et relances : la famille en retard apparaît. Cliquez **Copier le message** (puis collez-le quelque part pour le lire) : « dernière relance » passe à « 1 relance ». Cliquez **WhatsApp** (sur téléphone, WhatsApp s'ouvre avec le message). Modifiez le message, **Enregistrer ce message**. Essayez **Exporter la liste**.
7. **Rapports** : onglet Rapports : la classe, les 4 tranches d'ancienneté, le journal de caisse (choisissez les dates). Essayez les boutons **Exporter**. Après un nouvel encaissement, la ligne du journal affiche votre adresse e-mail dans « Encaissé par ».
8. **Sauvegarde** : exportez une sauvegarde et vérifiez qu'elle s'ouvre sans erreur (les remises et relances sont dans la catégorie « Écoles »).
9. Dites-moi « v260 validée », ou ce qui cloche (avec une capture si possible).

## Ce que j'ai vérifié avant livraison
- Série automatique complète rejouée sur la version finale (la série « c1 » se vérifie à la construction automatique, comme avant).
- Nouveau test dédié (u13, 29 contrôles) : nouveaux onglets présents ; frais facultatif non appliqué sans abonnement, créé à l'abonnement, annulé au désabonnement, rétabli au réabonnement ; remise de 10 % (échéances à 900, aucune écriture) ; encaissement et constatation équilibrés ; remise après constatation (écriture 709 / 4111 équilibrée, compte 709 créé) ; une remise ne descend jamais sous le payé ; montant fixe sans frais refusé ; relances (famille, liens appel et WhatsApp, message enregistré, relance journalisée et affichée) ; rapports (classe, 4 tranches, journal, export déclenché) ; aucune erreur de page.
- Reste à vérifier par vous : l'ouverture de WhatsApp et l'ouverture des fichiers exportés sur votre téléphone ou votre tableur (étapes 5.6 et 5.7).

## Retour arrière (seulement si je vous le demande)
Aucune donnée existante n'est modifiée. Redéposer les fichiers de la v259 retirerait les nouveaux onglets ; les remises et relances saisies resteraient en réserve.

## CE QUI RESTE DE VOTRE RESSORT
**À faire maintenant**
- Déposer ce paquet sur **TEST**, tester (étape 5) et me dire « v260 validée ». Je prépare PROD ensuite.
- **v259 sur PROD** : exécuter d'abord `supabase/secteurs-et-blocs-migration.sql` sur le Supabase de production (sans risque si rejoué), déposer le paquet PROD v259 (qui couvre aussi v257 et v258) et me dire « v259 active sur PROD ».
- **Secrétaire-caissière** : dans le SQL Editor du Supabase de **TEST**, exécuter `select policyname, cmd, qual, with_check from pg_policies where tablename = 'kv_store';` et me coller le résultat.
- **Espace de travail adapté au secteur** : répondre à ma question (a ou b) du message de propositions.

**Décisions à prendre**
- **Prix** : scénario « Équilibré » retenu (grille A pour Écoles) ; à confirmer après un test auprès de 5 à 10 entreprises cibles.
- **Numérotation qui repart de 0001 chaque année** et **exercice octobre–septembre** dans l'impôt sur le revenu : avec l'expert-comptable.

**Échéances et suivis**
- **Liste annuelle des versements** : avant le 31 octobre 2026 ; **acomptes provisionnels** : 1er–15 décembre ; **versement des retenues d'octobre** : 1er–15 novembre.
- **Lundi 26 octobre** : vérifier la réception des e-mails de relance (Resend).
- Dans quelques jours : relancer le script 1 (journal) sur TEST et PROD ; garder le script 3 sous la main.

**Validations externes et démarches**
- Expert-comptable : TCA sur cantine, transport, uniformes ; traitement comptable des bourses et rabais (compte 709) ; TCA sur les abonnements ; base des retenues 96–97 ; taux de retenue sur primes ; acomptes.
- Avocat : documents juridiques et données d'élèves mineurs (le module ne garde que nom, famille et classe) ; messages de relance envoyés aux familles.
- Décision sur la sauvegarde à la minute ; récupération du 2FA ; compte MonCash de production ; prestataires de test d'intrusion ; règle « période clôturée » en observation.

## Prochaine étape (après validation)
Secrétaire-caissière (dès que j'ai le résultat de la requête), espace de travail adapté au secteur (selon votre choix), puis le bloc suivant (Import-export).
