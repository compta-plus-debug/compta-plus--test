# Compta+ — version 286 — paquet TEST (refonte Import-export)
À faire sur le dépôt **compta-plus--test** (TEST) uniquement. **Prérequis** : TEST est en v285. **Aucun script SQL, aucune Edge Function.** Rien à supprimer.

## Ce qui change dans Import-export
- **Tableau de bord** (ex « Vue d'ensemble ») : guide en 7 étapes, 8 indicateurs (en cours, dû aux fournisseurs, à recevoir des clients, importé/exporté ce mois, marge, choses à faire), liste « À faire » avec bouton Ouvrir, arrivées prévues sous 30 jours, marchandises au port depuis plus de 7 jours.
- **Importations et Exportations** : recherche, filtre par étape, **ligne de total** (facture, reste dû / à recevoir, coût de revient / marge). Fournisseurs, clients et pays déjà saisis proposés dans une liste déroulante.
- **Documents imprimables (A4 / PDF)** : « Fiche de coût de revient » (importation) et « Facture d'exportation » (client), avec votre en-tête d'entreprise.
- **Rapports** : filtre par période, totaux sur chaque tableau, « Dû par fournisseur », « À recevoir par client », écart de change net, exports CSV avec ligne de total.
- **Statistiques** : en plus, valeur importée par fournisseur, importations par pays et par étape (en nombres).
- Aucune règle comptable modifiée ; aucun taux ni mention inventés.

Numéro de version : **20260830-286**.

## Fichiers du paquet (5 fichiers)
| Dossier du paquet | Fichier | Où le déposer | Action |
|---|---|---|---|
| racine | tst-u32.cjs | racine du dépôt (comme tst-u31.cjs en v285) | nouveau |
| racine | tst-lancer.mjs | racine du dépôt (comme en v285) | remplace |
| racine | CARTE-DES-MODULES.md | racine du dépôt | remplace |
| src | 53-import-export.jsx | dossier `src` | remplace |
| src | 00-config.jsx | dossier `src` | remplace |

## Procédure pas à pas
1. **Supabase** : rien à faire.
2. Dépôt **compta-plus--test** → **Add file → Upload files** → glissez les 3 fichiers du dossier `racine` (aux mêmes emplacements que ceux de la v285) → **Commit changes**.
3. Dossier **src** → **Add file → Upload files** → glissez les 2 fichiers → **Commit changes**. Une construction démarre (25 à 40 minutes) ; ne redéposez rien pendant ce temps.
4. Onglet **Actions** → « Construire le site » doit passer au **vert**. Si rouge : copiez-moi les lignes ÉCHEC / FAIL.
5. **Ctrl + Maj + R**, version **20260830-286**. Activez le secteur Import-export (Administration → Secteurs) puis testez : Tableau de bord, créer un dossier, filtres, impression de la fiche et de la facture, Rapports, Statistiques, et sur téléphone.

## CE QUI RESTE DE VOTRE RESSORT
- Déposer, attendre le vert, vérifier, puis me dire **« v286 validée »**. Je passe alors à la Santé. Dites « livre directement en PROD » pour gagner un déploiement.
- Me dire **« v285 active sur PROD »** une fois déployée et vérifiée.
- À confirmer avec votre **expert-comptable** : comptes 607/608/370, 4456, 4458, 666/766, taux douaniers (droits, vérification, 2 %, TCA, acompte), TCA à l'exportation ; Hôtellerie : 7076, 7077, 7078, 4191, 4476 ; Restauration : 7075, 4677 ; Éducation : TCA des frais scolaires, 487, 709.
- Prévenir vos clients (écoles, hôtels, restaurants, importateurs) que les blocs existent (secteur à activer dans Administration → Secteurs).
- Échéances : liste annuelle des versements **avant le 31 octobre 2026** ; **1–15 novembre** retenues d'octobre ; **1–15 décembre** acomptes provisionnels.
- Décisions en attente : retour en arrière de la base (PITR), récupération 2FA, compte MonCash de production, tests d'intrusion, règle « période clôturée », scénario de prix « Équilibré ». Juriste : consentement WhatsApp, données clients/patients, conditions d'utilisation.
