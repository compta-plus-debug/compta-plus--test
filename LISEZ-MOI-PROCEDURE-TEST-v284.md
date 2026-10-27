# Compta+ — version 284 — paquet TEST
**Refonte du bloc « Éducation »** (même démarche que Restauration et Hôtellerie) : tableau de bord avec guide de démarrage, familles en tableau, relevé de compte imprimable, filtres et totaux partout, reçus A4 ou ticket, rapports complétés, nouveau contrôle de l'assistant.

À faire sur le dépôt **compta-plus--test** (TEST) uniquement. **Ne rien déposer sur PROD** avant de m'avoir écrit « v284 validée ».

**Prérequis** : TEST est en v282. Ce paquet est cumulatif depuis la v282 (il contient aussi la correction « tableaux sur téléphone » de la v283). **Aucun script SQL, aucune Edge Function** : les données de l'école ne changent pas. Tout ce que vous avez déjà saisi (années, classes, familles, élèves, frais, reçus) reste tel quel.

## Ce qui change (pour vous)
1. **Tableau de bord** (ancien « Vue d'ensemble »).
   - **Guide de démarrage** : 7 étapes cochées automatiquement (année, classes, familles, élèves, grille de frais, application des frais, premier encaissement). Chaque étape non faite a un bouton « Ouvrir » qui vous amène au bon onglet. Le guide disparaît quand tout est fait. C'est la réponse à « j'ai tout rempli et rien n'apparaît ».
   - **Indicateurs** : élèves inscrits, frais attendus, encaissé, impayés échus, **encaissé aujourd'hui, encaissé ce mois, taux d'encaissement**, nombre de familles avec impayés.
   - **Échéances des 30 prochains jours** (avec total), **effectifs par classe** (avec attendu et reste à payer), familles avec impayés (avec total), **derniers encaissements**.
2. **Familles et élèves**.
   - Les familles sont maintenant dans un **tableau** (nom, téléphone, e-mail, nombre d'élèves, reste à payer, total en bas) avec **Modifier** (nom, téléphone, e-mail) et **Relevé de compte**.
   - **Relevé de compte** (nouveau document) : en-tête de l'école, élèves de la famille, chaque frais avec montant, payé et reste, paiements reçus, **reste à payer**. À imprimer en **A4 ou ticket**, ou à enregistrer en PDF.
   - Les élèves se **cherchent** (nom ou matricule) et se **filtrent par classe**, avec une ligne de total.
   - Boutons plus clairs : « Enregistrer la famille », « Inscrire l'élève et créer ses échéances ».
3. **Frais** : avant le bouton, un message dit **combien d'échéances restent à créer et pour combien d'élèves**. Le bouton devient « Appliquer les frais : créer les échéances » et se grise quand tout est déjà créé.
4. **Échéances** : **filtres** (état : échues impayées / à venir / soldées, classe, dates, recherche) et **ligne de totaux** (montant, payé, reste).
5. **Encaissements** : **filtres** (dates, famille, mode, état) et **ligne de totaux** (avec espèces et banque séparés). Le reçu s'ouvre avec un bouton **« Passer en A4 / ticket »**.
6. **Rapports** : lignes de **total** sous « Situation par classe » et « Âge des impayés » ; nouveau tableau **« Encaissé par type de frais »** (écolage, inscription, cantine…) avec total, sur la période du journal de caisse.
7. **Statistiques** : deux répartitions en plus (élèves par classe, impayés selon l'ancienneté).
8. **Assistant de contrôle** (forfaits Assisté et Extension) : nouveau point **« Échéances échues jamais constatées en comptabilité »** (plus de 30 jours), avec guide pas à pas.
9. **Téléphone** : les tableaux ne font plus déborder la page (déjà dans la v283).
10. **Secrétaire (rôle Vendeur)** : toujours 3 onglets (familles et élèves, encaissements, impayés) ; elle peut ouvrir et imprimer les relevés, mais pas modifier les familles.
11. **Technique** : le bloc se charge maintenant à la demande (comme Restauration et Hôtellerie), donc l'application de départ s'ouvre plus vite.

Les écrans pour la **formation professionnelle** et l'**université** (vocabulaire, semestres, crédits, cours) bénéficient des mêmes améliorations.

**Comptabilité : inchangée** (constatation à l'échéance : Débit 4111 / Crédit 706x ; avances en 487 ; remises en 709 ; encaissements Débit caisse/banque).

Numéro de version : **20260830-284**.

## Fichiers du paquet (11 fichiers)
| Dossier du paquet | Fichier | Où le déposer | Action |
|---|---|---|---|
| racine | tst-u31.cjs | à la racine du dépôt | **nouveau** (test Éducation) |
| racine | tst-u30.cjs | à la racine du dépôt | **nouveau** (test petits écrans) |
| racine | tst-n1.cjs | à la racine du dépôt | remplace |
| racine | tst-lancer.mjs | à la racine du dépôt | remplace |
| racine | CARTE-DES-MODULES.md | à la racine du dépôt | remplace |
| build | build.mjs | dossier `build` | remplace |
| src | 60-ecoles-socle.jsx | dossier `src` | **nouveau** |
| src | 52-ecoles-suite.jsx | dossier `src` | remplace |
| src | 51-ecoles.jsx | dossier `src` | remplace |
| src | 57-assistant-blocs.jsx | dossier `src` | remplace |
| src | 00-config.jsx | dossier `src` | remplace |

(5 fichiers de racine, 1 fichier `build`, 5 fichiers `src`, aucun script SQL. **Rien à supprimer.**)

## Procédure pas à pas
### Étape 1 — Supabase
Rien à faire (pas de script SQL, pas d'Edge Function).
### Étape 2 — Les fichiers de la racine
Dépôt **compta-plus--test** → **Add file → Upload files** → glissez les 5 fichiers du dossier `racine` → **Commit changes**.
### Étape 3 — Le fichier du dossier `build`
Dossier **build** → **Add file → Upload files** → `build.mjs` → **Commit changes**.
### Étape 4 — Les fichiers du dossier `src`
Dossier **src** → **Add file → Upload files** → glissez les 5 fichiers → **Commit changes**. Une construction démarre (25 à 40 minutes). Ne redéposez rien pendant ce temps.
### Étape 5 — Attendre le vert
Onglet **Actions** → « Construire le site » doit passer au **vert**. Si rouge : copiez-moi les lignes **ÉCHEC / FAIL**.
### Étape 6 — Scénario de vérification (10 minutes)
1. **Ctrl + Maj + R**. Version en bas du menu : **20260830-284**. Ouvrez l'espace **Éducation**.
2. **Tableau de bord** : si votre école est déjà remplie, le guide est masqué ; sinon suivez-le étape par étape (boutons « Ouvrir »).
3. **Familles et élèves** : le tableau des familles ; cliquez **Modifier** sur une famille, changez le téléphone, **Enregistrer** ; cliquez **Relevé de compte** : vérifiez le reste à payer, essayez **Passer en ticket**, puis **Fermer**.
4. **Frais** : ajoutez un frais (ex. « Cantine », 600, 1 échéance, date du jour). Le message au-dessus du bouton annonce le nombre d'échéances à créer ; cliquez **Appliquer les frais** : le message passe à « déjà créées ».
5. **Échéances** : essayez le filtre « Échues et impayées » et la recherche ; contrôlez la ligne de total.
6. **Encaissements** : encaissez un montant pour une famille ; dans le reçu, essayez **Passer en ticket** ; vérifiez la ligne de total et le filtre par date.
7. **Rapports** : contrôlez les totaux et le tableau « Encaissé par type de frais ». **Statistiques** : deux graphiques de plus.
8. Sur téléphone : les tableaux défilent dans leur cadre.

## CE QUI RESTE DE VOTRE RESSORT
- Déposer le paquet **sur compta-plus--test seulement**, attendre le vert, faire le scénario (étape 6), puis me dire **« v284 validée »** ou me décrire ce qui ne va pas. Je livre alors la version PROD cumulative.
- Me dire « v283 active sur PROD » une fois la v283 déployée et vérifiée (Hôtellerie + tableaux sur téléphone).
- À confirmer avec votre **expert-comptable** (si ce n'est pas déjà fait) : exonération de TCA des frais scolaires, traitement des avances (487) et des bourses (709) ; et, pour l'Hôtellerie, les comptes 7076, 7077, 7078, 4191, 4476.
- Avant le **31 octobre 2026** : liste annuelle des versements. **1–15 novembre** : retenues d'octobre. **1–15 décembre** : acomptes provisionnels.
- Décisions en attente : retour en arrière de la base (PITR), récupération 2FA, compte MonCash de production, tests d'intrusion, règle « période clôturée », scénario de prix « Équilibré ».
- **Suite du programme** : après la validation de la v284 (et sa livraison PROD), je passe à l'**Import-export**, puis à la **Santé**.
