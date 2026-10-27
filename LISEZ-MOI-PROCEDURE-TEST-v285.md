# Compta+ — version 285 — paquet TEST (petite correction)
**Statistiques de l'Éducation : « Élèves par classe » s'affiche maintenant en nombres d'élèves** (et non plus en gourdes).

À faire sur le dépôt **compta-plus--test** (TEST) uniquement. **Prérequis** : TEST est en v284. **Aucun script SQL, aucune Edge Function.** Rien à supprimer.

## Ce qui change
- Le graphique « Élèves par classe » (onglet Statistiques d'Éducation) affiche « 2 », « 2 (100 %) »… au lieu de « 2 G ». Les autres graphiques de montants restent en gourdes.
- Le mécanisme est général : tout futur graphique d'effectifs (élèves, séjours, patients…) pourra s'afficher en nombres.

Numéro de version : **20260830-285**.

## Fichiers du paquet (6 fichiers)
| Dossier du paquet | Fichier | Où le déposer | Action |
|---|---|---|---|
| racine | tst-u31.cjs | à la racine du dépôt | remplace |
| racine | CARTE-DES-MODULES.md | à la racine du dépôt | remplace |
| src | 55-statistiques.jsx | dossier `src` | remplace |
| src | 51-ecoles.jsx | dossier `src` | remplace |
| src | 06-icones-et-graphiques.jsx | dossier `src` | remplace |
| src | 00-config.jsx | dossier `src` | remplace |

## Procédure pas à pas
### Étape 1 — Supabase
Rien à faire.
### Étape 2 — Les fichiers de la racine
Dépôt **compta-plus--test** → **Add file → Upload files** → glissez les 2 fichiers du dossier `racine` → **Commit changes**.
### Étape 3 — Les fichiers du dossier `src`
Dossier **src** → **Add file → Upload files** → glissez les 4 fichiers → **Commit changes**. Une construction démarre (25 à 40 minutes). Ne redéposez rien pendant ce temps.
### Étape 4 — Attendre le vert
Onglet **Actions** → « Construire le site » doit passer au **vert**. Si rouge : copiez-moi les lignes **ÉCHEC / FAIL**.
### Étape 5 — Vérifier
**Ctrl + Maj + R**, version **20260830-285** ; Éducation → **Statistiques** : « Élèves par classe » est en nombres.

## CE QUI RESTE DE VOTRE RESSORT
- Déposer, attendre le vert, vérifier, puis me dire **« v285 validée »**. Je livre alors la version PROD cumulative (Éducation complète). Si vous préférez gagner un déploiement, dites-moi « livre directement en PROD » et je vous donne le paquet PROD sans repasser par TEST.
- Me dire « v283 active sur PROD » une fois la v283 déployée et vérifiée.
- À confirmer avec votre **expert-comptable** : exonération de TCA des frais scolaires, avances (487) et bourses (709) ; Hôtellerie : 7076, 7077, 7078, 4191, 4476 ; Restauration : 7075, 4677.
- Avant le **31 octobre 2026** : liste annuelle des versements. **1–15 novembre** : retenues d'octobre. **1–15 décembre** : acomptes provisionnels.
- Décisions en attente : retour en arrière de la base (PITR), récupération 2FA, compte MonCash de production, tests d'intrusion, règle « période clôturée », scénario de prix « Équilibré ».
