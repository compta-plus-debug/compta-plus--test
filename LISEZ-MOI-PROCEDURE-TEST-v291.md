# Compta+ — version 291 — paquet TEST (nouveau bloc « Immobilier et location »)
À faire sur le dépôt **compta-plus--test** (TEST) uniquement. **Prérequis** : TEST est en v290. **Aucun script SQL, aucune Edge Function.** Rien à supprimer.

## Ce que contient le bloc
- **Tableau de bord** : guide de démarrage en 7 étapes (cochées automatiquement), indicateurs (biens loués, taux d'occupation, loyers émis et encaissés ce mois, loyers à recevoir, loyers en retard, dépenses), liste « À faire » (loyers en retard, loyers du mois pas encore émis, baux arrivés à échéance, dépôts à encaisser ou à restituer), biens libres.
- **Biens** : nom, type (liste proposée), adresse ; recherche, filtre Loué / Libre / Hors gestion, total des loyers mensuels ; fiche du bien avec ses baux, ses loyers facturés et ses dépenses.
- **Locataires** : nom, téléphone, adresse ou pièce d'identité ; reste à payer par locataire.
- **Baux** : un bien libre + un locataire, loyer, charges, jour d'échéance (1 à 28), dates de début et de fin prévue, dépôt de garantie. Dépôt : enregistrement à la réception, restitution à la fin du bail avec retenue éventuelle, annulation. Fin de bail en un clic (le bien redevient libre).
- **Loyers** : « Émettre les loyers du mois » en un clic pour tous les baux en cours ; loyer isolé (premier mois au prorata, mois précédent, montant différent) ; encaissement partiel ou total (espèces ou banque) ; **avis d'échéance** et **quittance de loyer** imprimables en A4 ou en ticket ; filtres (recherche, état, dates) et ligne de totaux ; annulation par écriture inverse.
- **Dépenses** par bien (entretien, impôts fonciers, assurance, eau et électricité, autres), payées en caisse, banque ou à payer.
- **Rapports** : rentabilité par bien, loyers impayés par locataire (pas encore échu / 1–30 / 31–60 / plus de 60 jours), dépenses par nature, filtre de période, exports.
- **Statistiques** : loyers et dépenses sur 6 mois, loyers par bien, dépenses par nature, impayés par locataire, biens loués et libres.
- **Accueil** (rôle Vendeur) : locataires, émission et encaissement des loyers, avis et quittances ; le reste est réservé au responsable.
- **Assistant de contrôle** : 3 alertes (loyer impayé depuis plus de 30 jours, bail arrivé à échéance, dépôt à restituer), chacune avec son mode d'emploi.
- Rien n'est préréglé : loyers, charges, jours d'échéance, dépôts et taxe sont saisis par vous. La taxe sur les loyers est **désactivée par défaut** (case à cocher dans Loyers, réservée au responsable).

## Comptabilité (tout en gourdes)
- Loyer émis : Débit 411 / Crédit 706 (loyers), 708 (charges refacturées) et 445 (taxe, si activée).
- Encaissement : Débit caisse (530) ou banque (512) / Crédit 411.
- Dépôt de garantie reçu : Débit 530 ou 512 / Crédit 165. Restitué : Débit 165 / Crédit 530 ou 512, et Crédit 708 pour la retenue.
- Dépense : Débit 6152 entretien, 6411 impôts fonciers, 616 assurance, 605 eau et électricité, 628 autres / Crédit 530, 512 ou 401.
- Toute annulation passe une écriture inverse ; les dates futures et les périodes clôturées sont refusées.

## Activation
Le secteur **Immobilier et location** est désormais disponible : Administration → Secteurs → cocher « Immobilier et location » (grille de prix C). L'espace « Immobilier » apparaît ensuite dans le menu.

Numéro de version : **20260830-291**.

## Fichiers du paquet (15 fichiers)
| Dossier du paquet | Fichier | Où le déposer | Action |
|---|---|---|---|
| racine | tst-u35.cjs | racine du dépôt | **nouveau** |
| racine | tst-n1.cjs | racine du dépôt | remplace |
| racine | tst-lancer.mjs | racine du dépôt | remplace |
| racine | CARTE-DES-MODULES.md | racine du dépôt | remplace |
| build | build.mjs | dossier `build` | remplace |
| src | 62-immobilier.jsx | dossier `src` | **nouveau** |
| src | 00-config.jsx, 06-icones-et-graphiques.jsx, 07-constantes-metier.jsx, 12-application-principale.jsx, 17-compta-assistant-de-controle.jsx, 38-administration-stock-et-sauvegardes.jsx, 39-administration-module.jsx, 50-secteurs-et-blocs.jsx, 57-assistant-blocs.jsx | dossier `src` | remplace |

## Procédure pas à pas
1. **Supabase** : rien à faire (les données du bloc sont enregistrées dans la table générique existante).
2. Dépôt **compta-plus--test** → **Add file → Upload files** → glissez les 4 fichiers du dossier `racine` → **Commit changes**.
3. Dossier **build** → **Add file → Upload files** → glissez `build.mjs` → **Commit changes**.
4. Dossier **src** → **Add file → Upload files** → glissez les 10 fichiers du dossier `src` → **Commit changes**. Une construction démarre (25 à 40 minutes) ; ne redéposez rien pendant ce temps.
5. Onglet **Actions** → « Construire le site » doit passer au **vert**. Si rouge : copiez-moi les lignes ÉCHEC / FAIL.
6. **Ctrl + Maj + R**, version **20260830-291**. Administration → Secteurs → activez « Immobilier et location » → choisissez l'espace Immobilier → suivez le guide : un bien, un locataire, un bail, « Émettre les loyers du mois », un encaissement, puis imprimez la quittance (A4 puis ticket).

## CE QUI RESTE DE VOTRE RESSORT
- Déposer, attendre le vert, vérifier, puis me dire **« v291 validée »** : je livre le paquet PROD cumulatif (Immobilier inclus).
- Me dire **« v290 active sur PROD »** une fois le paquet PROD précédent déployé et vérifié.
- À confirmer avec votre **expert-comptable** : comptes de l'Immobilier (706 loyers, 708 charges refacturées et retenues, 165 dépôts de garantie, 6152, 6411, 616, 605, 628 : numéros proposés) et taxe éventuelle sur les loyers (selon la nature du local) ; Transport : 6053, 6242, 6252, 618 et TCA ; Santé : 4112, 4113, 7065 à 7067, 6221, 4678, 659 ; Import-export : 607/608/370, 4456, 4458, 666/766 ; Hôtellerie : 7076, 7077, 7078, 4191, 4476 ; Restauration : 7075, 4677 ; Éducation : TCA des frais scolaires, 487, 709.
- **Juriste** : modèle de contrat de bail, règles sur le dépôt de garantie et les préavis, quittances (valeur juridique), données des locataires, conditions d'utilisation. Le bloc n'impose aucun contrat et n'en génère pas.
- Prévenir vos clients que les blocs existent (secteur à activer dans Administration → Secteurs).
- Échéances : retenues d'octobre **1–15 novembre** ; acomptes provisionnels **1–15 décembre**.
- Décisions en attente : retour en arrière de la base (PITR), récupération 2FA, compte MonCash de production, tests d'intrusion, règle « période clôturée », scénario de prix « Équilibré » (prix du bloc Immobilier, grille C).
