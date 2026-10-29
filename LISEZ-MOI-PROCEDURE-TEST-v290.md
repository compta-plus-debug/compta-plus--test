# Compta+ — version 290 — paquet TEST (correction : facturation du Transport)
À faire sur le dépôt **compta-plus--test** (TEST) uniquement. **Prérequis** : TEST est en v289. **Aucun script SQL, aucune Edge Function.** Rien à supprimer.

## Le problème signalé
Dans Transport → Factures, après avoir choisi le client, rien ne se passait et le bouton « Émettre la facture » restait gris.

## La cause
Le bouton ne s'active que pour les voyages à l'état **« Livré »**. Les voyages du client étaient encore « Planifié » ou « En route », mais l'écran ne l'expliquait pas.

## Ce qui change
- Quand le client n'a aucun voyage livré, un **message clair** explique quoi faire.
- Les voyages non livrés du client sont **listés sur le même écran**, avec leur état modifiable : on passe le voyage à « Livré » directement, et le bouton « Émettre la facture » s'active aussitôt.
- Si le client n'a aucun voyage, le message le dit.
- Rien d'autre ne change (comptabilité, rapports, impression).

Numéro de version : **20260830-290**.

## Fichiers du paquet (4 fichiers)
| Dossier du paquet | Fichier | Où le déposer | Action |
|---|---|---|---|
| racine | tst-u34.cjs | racine du dépôt | remplace |
| racine | CARTE-DES-MODULES.md | racine du dépôt | remplace |
| src | 61-transport.jsx | dossier `src` | remplace |
| src | 00-config.jsx | dossier `src` | remplace |

## Procédure pas à pas
1. **Supabase** : rien à faire.
2. Dépôt **compta-plus--test** → **Add file → Upload files** → glissez les 2 fichiers du dossier `racine` → **Commit changes**.
3. Dossier **src** → **Add file → Upload files** → glissez les 2 fichiers → **Commit changes**. Une construction démarre (25 à 40 minutes) ; ne redéposez rien pendant ce temps.
4. Onglet **Actions** → « Construire le site » doit passer au **vert**. Si rouge : copiez-moi les lignes ÉCHEC / FAIL.
5. **Ctrl + Maj + R**, version **20260830-290**. Transport → Factures → choisissez un client dont les voyages sont « Planifié » : le message et la liste apparaissent ; passez un voyage à « Livré », puis « Émettre la facture ».

## CE QUI RESTE DE VOTRE RESSORT
- Déposer, attendre le vert, vérifier, puis me dire **« v290 validée »** : je livre le paquet PROD cumulatif (Transport inclus).
- Me dire **« v288 active sur PROD »** une fois ce paquet déployé et vérifié.
- À confirmer avec votre **expert-comptable** : comptes du Transport (6053, 6242, 6252, 618 : numéros proposés) et TCA sur le transport ; Santé : 4112, 4113, 7065 à 7067, 6221, 4678, 659 ; Import-export : 607/608/370, 4456, 4458, 666/766 ; Hôtellerie : 7076, 7077, 7078, 4191, 4476 ; Restauration : 7075, 4677 ; Éducation : TCA des frais scolaires, 487, 709.
- Documents de véhicule obligatoires : à vérifier avec les autorités ou votre assureur (le bloc n'en impose aucun).
- **Juriste** : données des patients, clients et chauffeurs, conditions d'utilisation.
- Prévenir vos clients que les blocs existent (secteur à activer dans Administration → Secteurs).
- Échéances : retenues d'octobre **1–15 novembre** ; acomptes provisionnels **1–15 décembre**.
- Décisions en attente : retour en arrière de la base (PITR), récupération 2FA, compte MonCash de production, tests d'intrusion, règle « période clôturée », scénario de prix « Équilibré ».
