# Compta+ — version 297 — paquet TEST (BTP : onglet « Main-d'œuvre », étape 2)
À faire sur le dépôt **compta-plus--test** (TEST) uniquement. **Prérequis** : TEST est en v296. **Aucun script SQL, aucune Edge Function.** Rien à supprimer.

## Ce qui change
Dans la fiche d'un chantier (BTP → Chantiers → Ouvrir), un **6e onglet « Main-d'œuvre »** avec 5 sous-onglets :
1. **Grille salariale** : vos qualifications (maçon, manœuvre, ferrailleur…) avec leur **taux par jour** que *vous* fixez (rien n'est préréglé ; une liste de noms de qualifications est seulement suggérée). Commune à tous vos chantiers. Changer un taux n'affecte que les pointages futurs.
2. **Plan de main-d'œuvre** : effectif prévu et jours par personne pour chaque qualification → jours-homme et **coût prévu**, **réparti mois par mois** entre le début et la fin prévue du chantier. Bouton « Reporter ce coût dans le budget d'exécution » (onglet Budget).
3. **Ouvriers affectés** : fiche de l'ouvrier (nom, qualification, téléphone), période d'affectation, jours pointés et coût sur ce chantier. Un même ouvrier peut travailler sur plusieurs chantiers (un nom déjà connu reprend sa fiche). « Terminer » clôt l'affectation ; le retrait est refusé s'il y a des jours pointés.
4. **Pointage** : pour un jour donné (pas de date future), chaque ouvrier est absent, présent (journée) ou demi-journée ; bouton « Tous présents » ; coût du jour. Le taux est figé à la date du pointage.
5. **Paie, reliée au module Salaires** : pour une période choisie, jours pointés (tous chantiers) et salaire brut de chaque ouvrier.
   - « **Lier à Salaires** » (onglet Ouvriers affectés) crée la fiche employé (paie hebdomadaire) ou se relie à une fiche du même nom déjà présente.
   - « **Préparer dans Salaires** » met le salaire de base de la fiche au montant des jours pointés ; vous émettez ensuite le bulletin dans **Salaires → Bulletins de paie** (cotisations et retenues du module Salaires). Si la fiche existait déjà dans Salaires, BTP ne modifie pas son salaire de base.
   - Les salaires déjà versés via Salaires sont **affectés au chantier au prorata des jours pointés** et comptés dans les dépenses de main-d'œuvre (Budget d'exécution, Vue d'ensemble, rapports). Les bulletins annulés sont ignorés.
   - Un ouvrier non lié se paie par une dépense « Main-d'œuvre » (onglet Dépenses). **Ne saisissez pas le même salaire des deux façons.**
- Lecture seule : grille, plan et pointages consultables sans saisie.

## Comptabilité
Aucune nouvelle écriture dans BTP : la paie passe par le module Salaires (débit 641 salaires bruts, 645 charges patronales, crédit 431/425/caisse ou banque, comme d'habitude). Le coût de main-d'œuvre d'un chantier est un **suivi de gestion** ; les dépenses « Main-d'œuvre » saisies dans BTP restent en compte 661.

## Suite prévue
**Étape 3** : supervision (visites et réunions avec compte rendu, journal de chantier imprimable, réception provisoire/définitive avec réserves) et « Études et plan du projet » activable par chantier.

Numéro de version : **20260830-297**.

## Fichiers du paquet (6 fichiers)
| Dossier du paquet | Fichier | Où le déposer | Action |
|---|---|---|---|
| racine | tst-u37.cjs | racine du dépôt | **nouveau** (test main-d'œuvre) |
| racine | tst-lancer.mjs | racine du dépôt | remplace |
| racine | CARTE-DES-MODULES.md | racine du dépôt | remplace |
| src | 63-btp.jsx | dossier `src` | remplace |
| src | 12-application-principale.jsx | dossier `src` | remplace |
| src | 00-config.jsx | dossier `src` | remplace (numéro de version) |

## Procédure pas à pas
1. **Supabase** : rien à faire.
2. Dépôt **compta-plus--test** → page d'accueil du dépôt (racine) → **Add file → Upload files** → glissez les 3 fichiers du dossier `racine` → **Commit changes**.
3. Ouvrez le dossier **src** → **Add file → Upload files** → glissez les 3 fichiers du dossier `src` → **Commit changes**. La construction démarre (25 à 40 minutes) ; ne redéposez rien pendant ce temps.
4. Onglet **Actions** : « Construire le site » doit passer au **vert** (attendez la fin avant de tester). Si rouge : copiez-moi les lignes ÉCHEC / FAIL.
5. **Ctrl + Maj + R** ; version **20260830-297**.
6. Essai : BTP → Chantiers → Ouvrir → **Main-d'œuvre** :
   - Grille : « Maçon » 2 000, « Manœuvre » 1 000 (vos propres taux).
   - Plan : Maçon 2 personnes × 10 jours, Manœuvre 4 × 10 : le coût prévu s'affiche, réparti par mois ; « Reporter… » met le budget de main-d'œuvre.
   - Ouvriers affectés : affectez 2 ouvriers ; Pointage : « Tous présents », puis une demi-journée pour l'un ; Paie : vérifiez le brut ; « Lier à Salaires » puis « Préparer dans Salaires » ; ouvrez Salaires → Bulletins de paie : le salaire de base correspond.

## CE QUI RESTE DE VOTRE RESSORT
- Déposer, attendre le vert, vérifier, puis me dire **« v297 validée »** (ou ce qui manque) avant l'étape 3. Les paquets PROD (cumulatif BTP) ne sont livrés qu'après votre « validé ».
- Me dire **« v292 active sur PROD »** une fois fait (et si la v290 l'était), et si la v293 est validée.
- **Échéances** : liste annuelle des versements du **31 octobre 2026** (dans 2 jours) ; retenues d'octobre **1–15 novembre** ; acomptes provisionnels **1–15 décembre**.
- **Expert-comptable** : comptes BTP (706, 4117, 4191, 601, 661, 611, 622, 618, 628), traitement de la retenue, taxe sur les travaux, comptabilisation à l'avancement ; **nouveau** : paie des ouvriers de chantier (journaliers, paie hebdomadaire, imputation des salaires aux chantiers au prorata des jours pointés, cotisations et retenue d'impôt sur le salaire applicables) ; et les comptes des autres blocs déjà listés.
- **Juriste** : contrats de construction et de sous-traitance, retenue de garantie, pénalités de retard, garantie décennale, **contrats de travail des ouvriers journaliers**, données personnelles des ouvriers. Le logiciel n'impose aucun taux ni délai légal : la grille salariale et les jours sont les vôtres.
- Prévenir vos clients que les blocs existent (secteur à activer dans Administration → Secteurs).
- Décisions en attente : retour en arrière de la base (PITR), récupération 2FA, compte MonCash de production, tests d'intrusion, règle « période clôturée », prix « Équilibré » (grille C).
- **Suite** : étape 3 du BTP, puis blocs restants — Industries artisanales, ONG/associations/églises, Agriculture et élevage.
