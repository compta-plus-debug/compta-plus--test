# Compta+ — version 312 — petit paquet TEST (cartes sans débordement)
À déposer sur **compta-plus--test** uniquement. **Prérequis : la v310 est active sur TEST** (ce paquet remplace aussi le petit paquet v311). Aucun script SQL. Numéro de version : **20261102-312**.

**Contenu** : (1) **montants à 7 chiffres et plus** sur petit écran : les cartes des tableaux de bord de secteur (ONG, Agriculture, etc.) coupaient les montants à 9 chiffres ; une règle commune adapte maintenant la taille des gros montants à l'écran et les fait passer à la ligne ; listes déroulantes et champs limités à la largeur de l'écran ; tableaux larges défilant de côté ; (2) rapports ONG sans débordement ; (3) exports Excel sans formule exécutable ; (4) montants démesurés refusés (ONG).

## Fichiers (8)
| Dossier | Fichiers | Où les déposer |
|---|---|---|
| racine | tst-u44.cjs | à la racine du dépôt (remplace) |
| src | **index.modele.html**, 00-config, 33-gestion-reprise-et-rapports, 35-rapports-et-bilans, 39-administration-module, 60-ecoles-socle, 66-ong (les six derniers en `.jsx`) | dossier `src` (remplace) |

## Procédure
1. Dépôt **compta-plus--test** → **Add file → Upload files** → `tst-u44.cjs` → **Commit changes**.
2. Dossier **src** → **Add file → Upload files** → les 7 fichiers (dont `index.modele.html`) → **Commit changes**. Attendre 25 à 40 minutes ; **Actions** → « Construire le site » au **vert** (sinon copiez-moi les lignes ÉCHEC / FAIL).
3. Vérifier : **Ctrl + Maj + R**, version **20261102-312** ; sur téléphone, un tableau de bord de secteur avec un gros montant : il reste dans sa carte (passage à la ligne si besoin).

## CE QUI RESTE DE VOTRE RESSORT
- Déposer, attendre le vert, vérifier, me dire « v312 validée sur TEST » (ou me décrire par écrit le problème et l'écran).
- Le PROD v312 (cumulatif depuis la v304) est dans l'autre paquet ; ne le déposez que si vous voulez ces corrections en production.
- Les points de la liste classée (expert-comptable, fiscalité, DGI, juriste, contrôles de sécurité gratuits, récupération 2FA…) : voir le bilan.
