# Compta+ — version 311 — petit paquet TEST (correctif de la v310)
À déposer sur **compta-plus--test** uniquement. **Prérequis : la v310 est active sur TEST.** Aucun script SQL. Contenu : rapports sans débordement sur téléphone (rapport financier, listes déroulantes), exports Excel sans formule exécutable, montants démesurés refusés (ONG), vocabulaire ONG adapté à chaque type (déjà dans la v310 corrigée). Numéro de version : **20261101-311**.

## Fichiers (7)
| Dossier | Fichiers | Où les déposer |
|---|---|---|
| racine | tst-u44.cjs | à la racine du dépôt (remplace) |
| src | 00-config, 33-gestion-reprise-et-rapports, 35-rapports-et-bilans, 39-administration-module, 60-ecoles-socle, 66-ong (en `.jsx`) | dossier `src` (remplace) |

## Procédure
1. Dépôt **compta-plus--test** → **Add file → Upload files** → `tst-u44.cjs` → **Commit changes**.
2. Dossier **src** → **Add file → Upload files** → les 6 fichiers → **Commit changes**. Attendre 25 à 40 minutes ; **Actions** → « Construire le site » au **vert** (sinon copiez-moi les lignes ÉCHEC / FAIL).
3. Vérifier : **Ctrl + Maj + R**, version **20261101-311** ; ONG → Rapports → un rapport financier sur téléphone : pas de défilement horizontal ; exportez un CSV : les noms commençant par `=` sont précédés d'une apostrophe.

## CE QUI RESTE DE VOTRE RESSORT
- Déposer, attendre le vert, vérifier, me dire « v311 validée sur TEST ». Facultatif : si vous préférez, ne déposez rien et attendez le prochain paquet de test.
