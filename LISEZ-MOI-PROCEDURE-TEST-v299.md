# Compta+ — version 299 — paquet TEST (BTP complet : supervision, journal, réception, études — étape 3)
À faire sur le dépôt **compta-plus--test** (TEST) uniquement. **Prérequis** : TEST est en v298. **Aucun script SQL, aucune Edge Function.** Rien à supprimer.

## Ce qui est nouveau dans la fiche d'un chantier (BTP → Chantiers → Ouvrir)
**Case « Ce chantier comprend une phase d'études »** (sous l'en-tête) et **3 nouveaux onglets** (8 onglets, 9 avec les études) :

1. **Supervision et journal**
   - **Calendrier de supervision** : visites de supervision, contrôles de qualité, réunions de chantier, réunions avec le client. Chaque ligne : date, type, objet (flèche ▾ de suggestions), responsable (choisi parmi l'encadrement), état (à venir, réalisée, à réaliser ou annuler, annulée). Bouton « Planifier une série de visites régulières » (première date, tous les N jours, nombre). Une visite future ne peut pas être marquée réalisée. **Compte rendu** (constats, décisions) rédigeable après réalisation, **imprimable en A4**.
   - **Journal de chantier** : un journal par jour (date jamais dans le futur) : météo, travaux exécutés, incidents/arrêts, visiteurs, matériaux reçus, rédacteur ; **l'effectif du jour est repris automatiquement du pointage**. Liste filtrable par période, **impression A4 (une page par jour)**.
2. **Réception et réserves**
   - **Règle de libération de la retenue de garantie choisie par chantier, selon votre marché** : quand le chantier est terminé (comportement d'avant, par défaut), à la réception provisoire, ou à la réception définitive. Aucune règle n'est imposée.
   - **Réception provisoire** puis **réception définitive** (dates sans futur, définitive après la provisoire, **refusée tant qu'il reste des réserves ouvertes**), **procès-verbal imprimable** avec la liste des réserves et trois signatures. Durée de garantie facultative (en mois) → fin de la période de garantie affichée.
   - **Réserves** : défaut à corriger, lieu, responsable, échéance, « Lever » / « Rouvrir », filtres (ouvertes, en retard, levées), totaux.
   - La retenue de garantie **ne peut être encaissée** (« Marché, avances et retenue ») que si la règle du chantier est remplie et que toutes les réserves sont levées ; un bandeau explique pourquoi elle n'est pas encore libérable. Une réception sur laquelle une retenue a déjà été encaissée ne peut plus être annulée.
3. **Études et plan** (visible seulement si la case est cochée) : liste des documents de la phase d'études (plans, étude de sol, devis, autorisations…) avec référence, responsable, échéance, état (à faire, en cours, remis, validé par le client), date de remise automatique, filtres, totaux, avancement « x / y validés ». Bouton « Insérer les documents courants (à ajuster) » : noms seulement, aucune date ni responsable inventés. Quand la case est cochée, l'étape **« Études et conception »** est proposée en premier dans les étapes courantes. La case ne peut pas être décochée s'il existe des documents.
- **Tableau de bord → À faire** et **Vue d'ensemble** : nouvelles alertes (visites à régulariser, réserves en retard, documents d'études en retard) et échéances des 14 jours (visites, réserves, documents).
- Lecture seule : tout est consultable, rien n'est modifiable.

## Comptabilité
Aucune nouvelle écriture : la libération de la retenue reste « Débit caisse ou banque / Crédit 4117 », seule la condition de déclenchement change.

## Cas pratique complet
**CAS-PRATIQUE-BTP-pas-a-pas.md** (dans le paquet) est complété avec l'étape 3 : études, supervision, journal, réception, réserves, libération de la retenue. À exécuter après déploiement, sur TEST.

Numéro de version : **20260830-299**.

## Fichiers du paquet (5 fichiers + cas pratique)
| Dossier du paquet | Fichier | Où le déposer | Action |
|---|---|---|---|
| racine | tst-u38.cjs | racine du dépôt | **nouveau** (test étape 3) |
| racine | tst-lancer.mjs | racine du dépôt | remplace |
| racine | CARTE-DES-MODULES.md | racine du dépôt | remplace |
| src | 63-btp.jsx | dossier `src` | remplace |
| src | 00-config.jsx | dossier `src` | remplace (numéro de version) |
| (paquet) | CAS-PRATIQUE-BTP-pas-a-pas.md | à lire, rien à déposer | cas pratique complet |

## Procédure pas à pas
1. **Supabase** : rien à faire.
2. Dépôt **compta-plus--test** → racine → **Add file → Upload files** → glissez les 3 fichiers du dossier `racine` → **Commit changes**.
3. Dossier **src** → **Add file → Upload files** → glissez `63-btp.jsx` et `00-config.jsx` → **Commit changes**. La construction démarre (25 à 40 minutes) ; ne redéposez rien pendant ce temps.
4. Onglet **Actions** : « Construire le site » doit passer au **vert** avant de tester. Si rouge : copiez-moi les lignes ÉCHEC / FAIL.
5. **Ctrl + Maj + R** (sur téléphone : fermer puis rouvrir l'application) ; version **20260830-299**.
6. Ouvrez un chantier : vérifiez la case « phase d'études » et les onglets Supervision et journal, Réception et réserves. Puis exécutez le **cas pratique** du début à la fin et signalez tout chiffre ou comportement qui ne correspond pas au guide.

## CE QUI RESTE DE VOTRE RESSORT
- Déposer, attendre le vert, vérifier, exécuter le cas pratique, puis me dire **« v299 validée »** (ou la liste de ce qui manque). Le BTP sera alors complet côté TEST ; les paquets **PROD cumulatifs (Immobilier + BTP complet)** ne sont livrés qu'après votre « validé ».
- Me dire **« v292 active sur PROD »** (et si la v290 l'était) ; me dire si la v293 est validée.
- **Échéances** : liste annuelle des versements du **31 octobre 2026** (dans 2 jours) ; retenues d'octobre **1–15 novembre** ; acomptes provisionnels **1–15 décembre**.
- **Expert-comptable** : comptes BTP (706, 4117, 4191, 601, 661, 611, 622, 618, 628), traitement de la retenue et moment de sa libération, taxe sur les travaux, comptabilisation à l'avancement, paie des ouvriers de chantier ; et les comptes des autres blocs déjà listés.
- **Juriste** : contrats de construction et de sous-traitance, **règles de réception (provisoire et définitive), de réserves et de garantie**, retenue de garantie, pénalités de retard, garantie décennale, contrats de travail des ouvriers journaliers, données personnelles des ouvriers. Le logiciel n'impose aucune règle ni durée légale : tout est choisi par vous selon votre marché.
- Prévenir vos clients que les blocs existent (secteur à activer dans Administration → Secteurs).
- Décisions en attente : retour en arrière de la base (PITR), récupération 2FA, compte MonCash de production, tests d'intrusion, règle « période clôturée », prix « Équilibré » (grille C).
- **Suite** : blocs restants — Industries artisanales, ONG/associations/églises, Agriculture et élevage (vous choisissez l'ordre).
