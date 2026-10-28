# Compta+ — version 287 — paquet TEST (refonte Santé)
À faire sur le dépôt **compta-plus--test** (TEST) uniquement. **Prérequis** : TEST est en v286. **Aucun script SQL, aucune Edge Function.** Rien à supprimer.

## Ce qui change dans Santé (cabinet, pharmacie, laboratoire, hôpital)
- **Tableau de bord** (ex « Vue d'ensemble ») : guide de démarrage en 7 étapes cochées automatiquement (il disparaît quand tout est fait), 8 indicateurs (facturé et encaissé du mois, factures à encaisser, à recevoir des patients et des assureurs, honoraires à verser, choses à faire, plus lots ou séjours selon le type), liste **« À faire »** avec bouton Ouvrir (patients et assureurs à relancer après 30 jours, honoraires à verser, lots périmés, séjours en cours), dernières factures.
- **Facturation** : recherche, filtre par état et par dates, **ligne de total** (total, reste patient, reste assureur). Facture imprimable en **A4 ou ticket** (bouton de bascule dans l'aperçu).
- **Patients** : recherche (nom, numéro, téléphone, police) et total du reste à payer. **Assureurs** : ligne de total. Spécialités et services déjà saisis proposés dans une liste déroulante.
- **Rapports** : filtre par période, totaux sur chaque tableau, nouveaux « Facturé par praticien » et « À recevoir des assureurs, par ancienneté » (0-30, 31-60, plus de 60 jours), exports CSV avec ligne de total.
- **Statistiques** : en plus, facturé par praticien, patients par assureur (en nombres), encaissements par mode.
- Aucune règle comptable modifiée. Toujours aucune donnée médicale.

Numéro de version : **20260830-287**.

## Fichiers du paquet (5 fichiers)
| Dossier du paquet | Fichier | Où le déposer | Action |
|---|---|---|---|
| racine | tst-u33.cjs | racine du dépôt (comme en v286) | nouveau |
| racine | tst-lancer.mjs | racine du dépôt | remplace |
| racine | CARTE-DES-MODULES.md | racine du dépôt | remplace |
| src | 54-sante.jsx | dossier `src` | remplace |
| src | 00-config.jsx | dossier `src` | remplace |

## Procédure pas à pas
1. **Supabase** : rien à faire.
2. Dépôt **compta-plus--test** → **Add file → Upload files** → glissez les 3 fichiers du dossier `racine` → **Commit changes**.
3. Dossier **src** → **Add file → Upload files** → glissez les 2 fichiers → **Commit changes**. Une construction démarre (25 à 40 minutes) ; ne redéposez rien pendant ce temps.
4. Onglet **Actions** → « Construire le site » doit passer au **vert**. Si rouge : copiez-moi les lignes ÉCHEC / FAIL.
5. **Ctrl + Maj + R**, version **20260830-287**. Activez le secteur Santé (Administration → Secteurs) puis testez, pour chaque type d'établissement : Tableau de bord, patients, facture (A4 puis ticket), filtres, Rapports, Statistiques, et sur téléphone.

## CE QUI RESTE DE VOTRE RESSORT
- Déposer, attendre le vert, vérifier, puis me dire **« v287 validée »**. Je livre alors le paquet PROD cumulatif (Import-export + Santé). Dites « livre directement en PROD » pour gagner un déploiement.
- Me dire **« v286 active sur PROD »** une fois le paquet PROD v286 déployé et vérifié.
- À confirmer avec votre **expert-comptable** : comptes Santé (4112, 4113, 7065 à 7067, 6221, 4678, 659) et traitement de la TCA (aucune TCA calculée dans le bloc Santé) ; Import-export : 607/608/370, 4456, 4458, 666/766, taux douaniers ; Hôtellerie : 7076, 7077, 7078, 4191, 4476 ; Restauration : 7075, 4677 ; Éducation : TCA des frais scolaires, 487, 709.
- **Juriste** : données des patients et clients (confidentialité, consentement), conditions d'utilisation.
- Prévenir vos clients (cabinets, pharmacies, laboratoires, hôpitaux, écoles, hôtels, restaurants, importateurs) que les blocs existent (secteur à activer dans Administration → Secteurs).
- Échéances : liste annuelle des versements **avant le 31 octobre 2026** ; **1–15 novembre** retenues d'octobre ; **1–15 décembre** acomptes provisionnels.
- Décisions en attente : retour en arrière de la base (PITR), récupération 2FA, compte MonCash de production, tests d'intrusion, règle « période clôturée », scénario de prix « Équilibré ».
