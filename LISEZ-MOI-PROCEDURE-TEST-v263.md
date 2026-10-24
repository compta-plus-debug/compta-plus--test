# Compta+ — version 263 — paquet TEST
**Habillage du module Écoles** : tableaux, onglets, cartes et pastilles d'état.

À faire sur le dépôt **compta-plus--test** uniquement. Le paquet PROD ne vous sera donné qu'après votre « v263 validée ».

**Prérequis** : la v261 est active sur TEST (validée). Si vous n'avez pas encore déposé la v262, ce n'est pas bloquant : la v263 ne dépend pas de ses fichiers (mais elle ne contient pas les noms de rôles de la v262). **Aucun script SQL, aucune Edge Function.** Pas de changement du workflow.

## Ce qui change (pour vous)
Uniquement l'**apparence** du module Écoles ; aucune donnée, aucun calcul, aucune écriture ne change.
1. **Tableaux** (années, élèves, frais, échéances, encaissements, impayés, remises, rapports, journal de caisse) : carte blanche aux coins arrondis avec ombre légère, **en-tête bleu marine** avec titres en majuscules, **lignes alternées** et surlignage au survol, espacement plus aéré. Sur téléphone, un tableau trop large défile sur le côté au lieu de déborder.
2. **Pastilles d'état en couleur** : échéances (Soldée en vert, Échue/impayée en rouge, Avance reçue en bleu, À venir en gris), reçus (Valide en vert, Annulé en gris), relances (jours de retard : gris, ambre au-delà de 30 jours, rouge au-delà de 60).
3. **Onglets** en boutons : l'onglet actif est plein (bleu marine), les autres sont sur une barre claire.
4. **Cartes de chiffres** de la vue d'ensemble avec un liseré doré en haut et une ombre ; **formulaires** présentés dans des cartes ; **titres de section** avec un trait doré ; champs de saisie qui se soulignent en doré quand on les touche.
5. Numéro de version : **20260830-263**.

## Fichiers du paquet (4 fichiers)
| Dossier du paquet | Fichier | Où le déposer | Action |
|---|---|---|---|
| racine | CARTE-DES-MODULES.md | à la racine du dépôt | remplace |
| src | 00-config.jsx | dossier `src` | remplace |
| src | 51-ecoles.jsx | dossier `src` | remplace |
| src | 52-ecoles-suite.jsx | dossier `src` | remplace |

(1 fichier de racine, 3 fichiers `src`, aucun script SQL.)

## Procédure pas à pas
### Étape 1 — Supabase
Rien à faire (pas de script SQL, pas d'Edge Function).

### Étape 2 — Le fichier de la racine
Dépôt **compta-plus--test** → **Add file → Upload files** → glissez `CARTE-DES-MODULES.md` → **Commit changes**.

### Étape 3 — Les fichiers du dossier `src`
Dossier **src** → **Add file → Upload files** → glissez les 3 fichiers du dossier `src` → **Commit changes**. Une construction démarre (25 à 40 minutes). Ne redéposez rien pendant ce temps.

### Étape 4 — Attendre le vert
Onglet **Actions** : « Construire le site » doit passer au **vert**. Si rouge : ne touchez à rien, copiez-moi le texte de l'étape en échec.

### Étape 5 — Vérifier sur le site de test
1. **Ctrl + Maj + R** (téléphone : fermez complètement l'application puis rouvrez-la). Version en bas du menu : **20260830-263**.
2. Ouvrez le module Écoles et parcourez **tous les onglets** : Vue d'ensemble, Années et classes, Familles et élèves, Frais, Échéances, Encaissements, Impayés et relances, Bourses et rabais, Rapports. Regardez chaque tableau (en-tête bleu, lignes alternées) et les pastilles de couleur.
3. Sur **téléphone**, regardez si les tableaux sont lisibles (défilement latéral) et si les onglets passent à la ligne proprement.
4. Dites-moi « v263 validée », ou **précisez ce qui vous déplaît encore** (couleurs, tailles, un onglet précis) avec une capture : je l'ajusterai.

## Ce que j'ai vérifié avant livraison
- Série automatique complète rejouée sur la version finale (la série « c1 » se vérifie à la construction automatique, comme avant).
- Capture d'écran du module sur la version finale : tableau des échéances avec en-tête bleu, lignes alternées et pastilles ; onglets en boutons ; cartes de chiffres. Les couleurs de page et la mise en colonnes complète des cartes dépendent de la feuille de styles du site, que je ne peux contrôler pleinement qu'après la construction automatique : d'où votre regard à l'étape 5.

## Retour arrière (seulement si je vous le demande)
Redéposer les fichiers de la v261 remet l'ancien aspect. Aucune donnée n'est touchée.

## CE QUI RESTE DE VOTRE RESSORT
**À faire maintenant**
- Déposer ce paquet sur **TEST**, tester (étape 5) et me dire « v263 validée » (ou ce qui est à ajuster). Si vous n'avez pas encore testé la v262 (noms de rôles), déposez-la aussi et dites-moi « v262 validée ».
- **PROD v261** : exécuter les 2 scripts SQL sur le Supabase de production (dans l'ordre : `secteurs-et-blocs-migration.sql`, puis `ecole-secretaire-caissiere.sql`), déposer le paquet PROD v261 et me dire « v261 active sur PROD ».
- Me dire si la **v260** est bien validée (incluse dans la v261).

**Décisions à prendre**
- **Prix** : scénario « Équilibré » retenu (grille A pour Écoles) ; à confirmer après un test auprès de 5 à 10 entreprises cibles.
- **Numérotation qui repart de 0001 chaque année** et **exercice octobre–septembre** dans l'impôt sur le revenu : avec l'expert-comptable.

**Échéances et suivis**
- **Liste annuelle des versements** : avant le 31 octobre 2026 ; **acomptes provisionnels** : 1er–15 décembre ; **versement des retenues d'octobre** : 1er–15 novembre.
- **Lundi 26 octobre** : vérifier la réception des e-mails de relance (Resend).
- Dans quelques jours : relancer le script 1 (journal) sur TEST et PROD ; garder le script 3 sous la main.

**Validations externes et démarches**
- Expert-comptable : TCA sur cantine, transport, uniformes ; compte 709 (bourses et rabais) ; TCA sur les abonnements ; base des retenues 96–97 ; taux de retenue sur primes ; acomptes.
- Avocat : documents juridiques et données d'élèves mineurs ; messages de relance ; accès d'une secrétaire aux fiches d'élèves.
- Décision sur la sauvegarde à la minute ; récupération du 2FA ; compte MonCash de production ; prestataires de test d'intrusion ; règle « période clôturée » en observation.
