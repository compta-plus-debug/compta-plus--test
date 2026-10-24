# Compta+ — version 265 — paquet TEST
**Nouveau bloc « Import-export »** : dossiers d'importation (coût de revient réel), dossiers d'exportation, comptabilité toujours en gourdes.

À faire sur le dépôt **compta-plus--test** uniquement. Le paquet PROD ne vous sera donné qu'après votre « v265 validée ».

**Prérequis** : la v263 est active sur TEST. Ce paquet **contient aussi la v264** (noms des rôles dans Administration) : vous n'avez rien d'autre à déposer. **Aucun script SQL, aucune Edge Function.** Pas de changement du workflow.

## Ce que fait le bloc (pour vous)
Le bloc apparaît pour une entreprise qui a le secteur **Import-export** (Administration → Entreprise → « Mes secteurs d'activité »). Un sélecteur **Espace de travail** (École / Import-export / Commerce selon vos secteurs) apparaît en haut du menu ; le choix est mémorisé sur l'appareil. Réservé aux rôles Administrateur et Gestionnaire pour modifier ; Consultant en lecture seule ; Vendeur n'y a pas accès.

**Règle de la devise** : chaque dossier porte **son propre taux** (gourdes pour 1 dollar), choisi par l'entreprise. La facture en dollars est convertie à ce taux ; **tout est comptabilisé en gourdes**. Si vous payez (ou êtes payé) à un autre taux, l'écart est enregistré en gourdes : compte 666 « Pertes de change » ou 766 « Gains de change ». Aucun dollar ne reste dans la comptabilité.

**5 onglets** : Vue d'ensemble · Importations · Exportations · Rapports · Réglages.
1. **Importation** : fournisseur, taux, articles (désignation, produit du stock facultatif, quantité, prix en dollars), fret et assurance, documents à suivre (facture, connaissement, déclaration préalable, certificat de vérification, déclaration en douane), étapes (commandé, expédié, arrivé au port, dédouané, livré), alerte « jours au port ».
   - **Comptabiliser la facture** : charge 607 + frais d'approche 608 (ou stock 370 si votre méthode est « stock à l'actif ») contre **401 Fournisseurs**.
   - **Droits, taxes et frais** (douane, vérification, 2 %, transit, magasinage, transport local…) : ajoutés au coût de revient. La **TCA** payée à l'importation va en **4456** (récupérable, hors coût de revient) ; l'**acompte d'impôt sur le revenu** va en **4458**. Payables en caisse, banque ou « à payer ».
   - Une **estimation** (d'après vos Réglages) vous aide à préparer les montants ; vous saisissez les montants réels de la quittance de douane.
   - **Règlement du fournisseur en dollars** avec écart de change.
   - **Coût de revient** par dossier et par article (coefficient d'approche), puis **« Recevoir en stock au coût de revient »** : crée les entrées de stock et recalcule le coût moyen pondéré (une seule fois par dossier).
   - **Annulation** d'un frais ou d'un règlement par **écriture inverse** (jamais d'effacement). Un dossier sans écriture peut être supprimé.
2. **Exportation** : client, taux, articles, facture (**411 / 707**, TCA seulement si vous indiquez un taux : 0 % par défaut), frais d'exportation (compte 624), encaissements en dollars avec écart de change, **sortie de stock**, marge par dossier.
3. **Rapports** : coût de revient par importation, frais d'approche par nature, marge par exportation, exports CSV.
4. **Réglages** : taux d'estimation (droits 10 %, vérification 5 %, prélèvement 2 %, TCA 10 %, acompte 0 %, TCA à l'exportation 0 %). **Ce sont des valeurs indicatives à confirmer avec votre expert-comptable ou transitaire** ; les montants réels se saisissent toujours dossier par dossier.
5. Les dates futures et les périodes clôturées sont refusées ; tout est journalisé. Les sauvegardes, imports/exports et la remise à zéro d'Administration incluent les dossiers.
6. Numéro de version : **20260830-265**.

## Fichiers du paquet (12 fichiers)
| Dossier du paquet | Fichier | Où le déposer | Action |
|---|---|---|---|
| racine | tst-u16.cjs | à la racine du dépôt | **nouveau** (test du bloc) |
| racine | tst-lancer.mjs | à la racine du dépôt | remplace |
| racine | CARTE-DES-MODULES.md | à la racine du dépôt | remplace |
| src | 53-import-export.jsx | dossier `src` | **nouveau** (le bloc) |
| src | 00-config.jsx | dossier `src` | remplace |
| src | 07-constantes-metier.jsx | dossier `src` | remplace |
| src | 12-application-principale.jsx | dossier `src` | remplace |
| src | 38-administration-stock-et-sauvegardes.jsx | dossier `src` | remplace |
| src | 39-administration-module.jsx | dossier `src` | remplace |
| src | 50-secteurs-et-blocs.jsx | dossier `src` | remplace |
| src | 51-ecoles.jsx | dossier `src` | remplace (en-tête technique seulement) |
| src | 52-ecoles-suite.jsx | dossier `src` | remplace (en-tête technique seulement) |

(3 fichiers de racine, 9 fichiers `src`, aucun script SQL.)

## Procédure pas à pas
### Étape 1 — Supabase
Rien à faire (pas de script SQL, pas d'Edge Function).

### Étape 2 — Les fichiers de la racine
Dépôt **compta-plus--test** → **Add file → Upload files** → glissez les 3 fichiers du dossier `racine` → **Commit changes**.

### Étape 3 — Les fichiers du dossier `src`
Dossier **src** → **Add file → Upload files** → glissez les 9 fichiers du dossier `src` → **Commit changes**. Une construction démarre (25 à 40 minutes). Ne redéposez rien pendant ce temps.

### Étape 4 — Attendre le vert
Onglet **Actions** : « Construire le site » doit passer au **vert**. Si rouge : ne touchez à rien, copiez-moi le texte de l'étape en échec.

### Étape 5 — Vérifier sur le site de test
1. **Ctrl + Maj + R** (téléphone : fermez complètement l'application puis rouvrez-la). Version en bas du menu : **20260830-265**.
2. Administration → Entreprise → **Mes secteurs d'activité** : cochez **Import-export** pour votre entreprise de test (si ce n'est pas déjà fait). Un sélecteur « Espace de travail » apparaît dans le menu ; choisissez **Import-export** : le module **Import-export** s'ouvre.
3. **Réglages** : vérifiez les taux.
4. **Importations** : créez un dossier (fournisseur, taux, par exemple 130). Ajoutez un article (ex. 100 × 2 USD) et un fret de 20 USD → total 220 USD = 28 600 G. Cliquez **Comptabiliser la facture**. Ajoutez un frais « Droits de douane » 2 860 G en caisse, puis une « TCA » 3 289 G en banque : le **coût de revient** affiche 31 460 G (la TCA n'en fait pas partie). Enregistrez un règlement de 220 USD à un taux du jour de 135 : une **perte de change de 1 100 G** apparaît. Dans Comptabilité → Journal, contrôlez les écritures (607, 608, 401, 4456, 666). Si un article est lié à un produit du stock, **Recevoir en stock** met à jour le stock et le coût moyen.
5. **Exportations** : créez un dossier, un article (ex. 5 × 10 USD à 130), comptabilisez la facture (411 / 707), ajoutez un frais, enregistrez un encaissement à un autre taux (écart de change), sortez du stock.
6. **Rapports** : vérifiez le coût de revient et la marge ; essayez l'export CSV.
7. **Rôles** (v264) : Administration → Accès → Utilisateurs avec une entreprise École : Directeur (Gestionnaire), Secrétaire-caissier(ère) (Vendeur), Suppléant (Consultant). Si vous voyez encore les anciens noms seuls : capture d'écran de la liste et du bas du menu (avec la version).
8. Dites-moi « v265 validée » (cela couvre aussi la v264), ou ce qui cloche.

## Ce que j'ai vérifié avant livraison
- Série automatique complète rejouée sur la version finale (la série « c1 » se vérifie à la construction automatique, comme avant).
- Test dédié (u16, 24 contrôles) : espace et sélecteur ; calcul du total en dollars et en gourdes ; estimation des droits et de la TCA ; écritures de la facture, des frais, de la TCA (4456), du règlement avec perte de change ; écritures toutes équilibrées ; annulation par écriture inverse ; coût de revient hors TCA ; réception en stock (quantité et coût moyen) ; exportation (facture, frais, encaissement avec écart, sortie de stock) ; rapports ; réglage enregistré ; droits des rôles (Consultant lecture seule, Vendeur sans accès, entreprise sans secteur sans bloc) ; aucune erreur de page.
- **Limites à connaître** : les taux par défaut et le traitement de l'acompte d'impôt et de la TCA à l'exportation sont à confirmer avec un expert-comptable ; les frais ajoutés après la réception en stock ne modifient plus le coût déjà en stock ; les captures d'écran n'ont pas été contrôlées visuellement sur une vraie construction avec la feuille de styles complète.

## Retour arrière (seulement si je vous le demande)
Redéposer les fichiers de la v263 (et supprimer `src/53-import-export.jsx`). Les dossiers saisis resteraient en base sans effet.

## CE QUI RESTE DE VOTRE RESSORT
**À faire maintenant**
- Déposer ce paquet sur **TEST**, tester (étape 5), me dire « v265 validée » (ou ce qui cloche).
- Me dire si la **v260** est bien validée (incluse depuis la v261).

**Décisions à prendre**
- **Prix** : scénario « Équilibré » retenu (grille A pour Écoles et Import-export) ; à confirmer après un test auprès de 5 à 10 entreprises cibles.
- **Numérotation qui repart de 0001 chaque année** et **exercice octobre–septembre** dans l'impôt sur le revenu : avec l'expert-comptable.
- Prochain bloc ou priorité : dites-moi.

**Échéances et suivis**
- **Liste annuelle des versements** : avant le **31 octobre 2026** ; **acomptes provisionnels** : 1er–15 décembre ; **versement des retenues d'octobre** : 1er–15 novembre.
- **Lundi 26 octobre** : vérifier la réception des e-mails de relance (Resend).
- Dans quelques jours : relancer le script 1 (journal) sur TEST et PROD ; garder le script 3 sous la main.

**Validations externes et démarches**
- Expert-comptable : TCA sur cantine, transport, uniformes ; compte 709 ; TCA sur les abonnements ; base des retenues 96–97 ; taux de retenue sur primes ; acomptes ; **acompte d'impôt sur le revenu à l'importation, TCA à l'exportation, taux de droits et taxes à l'importation**.
- Avocat : documents juridiques et données d'élèves mineurs ; messages de relance ; accès d'une secrétaire aux fiches d'élèves.
- Décision sur la sauvegarde à la minute ; récupération du 2FA ; compte MonCash de production ; prestataires de test d'intrusion ; règle « période clôturée » en observation.
