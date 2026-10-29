# Compta+ — version 295 — paquet TEST (BTP : le chantier devient un dossier de projet, étape 1)
À faire sur le dépôt **compta-plus--test** (TEST) uniquement. **Prérequis** : TEST est en v293. **Aucun script SQL, aucune Edge Function.** Rien à supprimer.

## Ce qui change : la fiche d'un chantier a maintenant 5 onglets
BTP → Chantiers → « Ouvrir » un chantier. Sous l'en-tête (état, fin prévue) :
1. **Vue d'ensemble** : avancement physique, avancement facturé, temps écoulé, dépensé / budget, marge à ce jour ; « Points d'attention » (travaux plus avancés que la facturation → pensez à émettre une situation ; temps écoulé en avance sur les travaux ; budget dépassé ; étapes et tâches en retard) ; échéances des 14 prochains jours.
2. **Étapes d'exécution** : calendrier du chantier avec **frise** (barres par étape, trait « aujourd'hui »). Pour chaque étape : dates prévues, **poids dans le marché (%)**, dates réelles (remplies automatiquement), **% réalisé**, état (prévue, à démarrer, en cours, en retard, terminée). Bouton « Insérer les étapes courantes (à ajuster) » : propose 7 noms d'étapes **sans dates ni poids** (rien n'est inventé, vous les renseignez). Avancement physique = moyenne pondérée par les poids ; alerte si le total des poids n'est pas 100 %.
3. **Budget d'exécution** : budget prévu **par nature** (matériaux, main-d'œuvre, sous-traitance, engins, transport, autres) comparé aux dépenses déjà enregistrées : reste à engager, % consommé, dépassement signalé, marge prévue (marché − budget). Si vous ne détaillez pas, un budget global reste possible.
4. **Encadrement et tâches** : l'équipe d'encadrement (ingénieur, conducteur de travaux, chef de chantier…) avec le nombre de tâches ouvertes par personne ; **tâches** avec responsable, échéance, priorité, étape concernée, état (à faire, en cours, faite), filtres, total, signalement « en retard ».
5. **Marché, avances et retenue** : retenue de garantie, bordereau de prix et devis, avance de démarrage, retenue à libérer (comme avant, simplement regroupés).
- Tableau de bord → « À faire » : nouvelles lignes « étape(s) en retard » et « tâche(s) en retard », qui ouvrent directement le bon onglet du chantier.
- Les données saisies en v293 restent valables (budget global conservé).

## Suite prévue (déjà convenue avec vous)
- **Étape 2** : main-d'œuvre — fiche des ouvriers, grille salariale par qualification, affectation avec dates, pointage, reliée au module Salaires.
- **Étape 3** : supervision (visites et réunions avec compte rendu, journal de chantier imprimable, réception provisoire/définitive avec réserves) et « Études et plan du projet » activable par chantier.

Numéro de version : **20260830-295**.

## Fichiers du paquet (4 fichiers)
| Dossier du paquet | Fichier | Où le déposer | Action |
|---|---|---|---|
| racine | tst-u36.cjs | racine du dépôt | remplace (test BTP complété) |
| racine | CARTE-DES-MODULES.md | racine du dépôt | remplace |
| src | 63-btp.jsx | dossier `src` | remplace |
| src | 00-config.jsx | dossier `src` | remplace (numéro de version) |

## Procédure pas à pas
1. **Supabase** : rien à faire.
2. Dépôt **compta-plus--test** → **Add file → Upload files** → glissez les 2 fichiers du dossier `racine` → **Commit changes**.
3. Dossier **src** → **Add file → Upload files** → glissez `63-btp.jsx` et `00-config.jsx` → **Commit changes**. Une construction démarre (25 à 40 minutes) ; ne redéposez rien pendant ce temps.
4. Onglet **Actions** → « Construire le site » doit passer au **vert**. Si rouge : copiez-moi les lignes ÉCHEC / FAIL.
5. **Ctrl + Maj + R**, version **20260830-295**. BTP → Chantiers → ouvrez un chantier : parcourez les 5 onglets ; ajoutez 2 étapes avec dates et poids (60 / 40), mettez 100 % sur la première : l'avancement physique s'affiche ; saisissez un budget par nature ; ajoutez une tâche avec une échéance passée : elle apparaît « en retard » et dans « À faire » du tableau de bord.

## CE QUI RESTE DE VOTRE RESSORT
- Déposer, attendre le vert, vérifier, puis me dire **« v295 validée »** (ou me dire ce qui manque dans le dossier de projet avant que j'enchaîne l'étape 2). Pour la v293, dites-moi aussi si elle est validée ; le paquet PROD cumulatif (BTP inclus) ne sera livré qu'après votre « validé ».
- Me dire **« v292 active sur PROD »** une fois le paquet PROD v292 déployé et vérifié (et si la v290 l'était déjà).
- **Échéances** : liste annuelle des versements du **31 octobre 2026** (dans 2 jours) ; retenues d'octobre **1–15 novembre** ; acomptes provisionnels **1–15 décembre**.
- À confirmer avec votre **expert-comptable** : BTP — 706 (travaux), 4117 (retenues de garantie), 4191 (avances), 601, 661, 611, 622, 618, 628 (numéros proposés), traitement de la retenue (calculée sur le montant hors taxe), taxe sur les travaux et retenues à la source éventuelles, comptabilisation à l'avancement ; Immobilier : 706, 708, 165, 6152, 6411, 616, 605, 628 ; Transport : 6053, 6242, 6252, 618, TCA ; Santé : 4112, 4113, 7065 à 7067, 6221, 4678, 659 ; Import-export : 607/608/370, 4456, 4458, 666/766 ; Hôtellerie : 7076, 7077, 7078, 4191, 4476 ; Restauration : 7075, 4677 ; Éducation : TCA des frais scolaires, 487, 709.
- **Juriste** : contrats de construction et de sous-traitance, taux et durée de la retenue de garantie, pénalités de retard, garanties décennales, contrat de bail et dépôt de garantie, données des clients, locataires et sous-traitants, conditions d'utilisation. Le bloc n'impose ni ne génère aucun contrat ni délai légal : les étapes et poids sont les vôtres.
- Prévenir vos clients (entreprises de construction, agences immobilières…) que les blocs existent (secteur à activer dans Administration → Secteurs).
- Décisions en attente : retour en arrière de la base (PITR), récupération 2FA, compte MonCash de production, tests d'intrusion, règle « période clôturée », scénario de prix « Équilibré » (grille C : Transport, Immobilier, BTP).
- **Suite** : blocs restants — Industries artisanales, ONG/associations/églises, Agriculture et élevage.
