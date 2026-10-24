# Compta+ — version 264 — paquet TEST
**Rôles de l'école dans Administration** : noms du métier toujours visibles, avec le rôle réel entre parenthèses.

À faire sur le dépôt **compta-plus--test** uniquement. Le paquet PROD ne vous sera donné qu'après votre « v264 validée ».

**Prérequis** : la v263 est active sur TEST. **Aucun script SQL, aucune Edge Function.** Pas de changement du workflow.

## Ce qui change (pour vous)
Vous m'avez signalé que, dans Administration, la liste des rôles montrait toujours Vendeur, Gestionnaire et Consultant. Dans mes essais, les noms de l'école s'affichaient bien **tant que l'espace « École » était sélectionné** ; ils retombaient sur les anciens noms dès que le sélecteur était sur « Commerce » (le choix est mémorisé sur l'appareil). Je supprime cette dépendance :
1. **Administration → Accès → Utilisateurs** (invitation et modification d'un membre) : pour toute entreprise qui a le secteur **Écoles**, la liste des rôles affiche toujours :
   - **Directeur (Gestionnaire)**
   - **Secrétaire-caissier(ère) (Vendeur)**
   - **Suppléant (Consultant)**
   - Administrateur et Expert-comptable inchangés.
   Le nom du métier est suivi du **rôle réel** entre parenthèses, pour que vous sachiez exactement quel droit vous attribuez.
2. Le journal d'audit et la phrase d'explication utilisent les mêmes noms.
3. Le bas du menu (« Rôle : … ») continue d'afficher le nom de l'école dans l'espace École.
4. Une entreprise **sans** le secteur Écoles ne voit aucun changement.
5. Numéro de version : **20260830-264**.

## Fichiers du paquet (5 fichiers)
| Dossier du paquet | Fichier | Où le déposer | Action |
|---|---|---|---|
| racine | tst-u15.cjs | à la racine du dépôt | remplace |
| racine | CARTE-DES-MODULES.md | à la racine du dépôt | remplace |
| src | 00-config.jsx | dossier `src` | remplace |
| src | 12-application-principale.jsx | dossier `src` | remplace |
| src | 39-administration-module.jsx | dossier `src` | remplace |

(2 fichiers de racine, 3 fichiers `src`, aucun script SQL.)

## Procédure pas à pas
### Étape 1 — Supabase
Rien à faire (pas de script SQL, pas d'Edge Function).

### Étape 2 — Les fichiers de la racine
Dépôt **compta-plus--test** → **Add file → Upload files** → glissez les 2 fichiers du dossier `racine` → **Commit changes**.

### Étape 3 — Les fichiers du dossier `src`
Dossier **src** → **Add file → Upload files** → glissez les 3 fichiers du dossier `src` → **Commit changes**. Une construction démarre (25 à 40 minutes). Ne redéposez rien pendant ce temps.

### Étape 4 — Attendre le vert
Onglet **Actions** : « Construire le site » doit passer au **vert**. Si rouge : ne touchez à rien, copiez-moi le texte de l'étape en échec.

### Étape 5 — Vérifier sur le site de test
1. **Ctrl + Maj + R** (téléphone : fermez complètement l'application puis rouvrez-la). Version en bas du menu : **20260830-264**. *(Si le numéro est plus ancien, la page est encore en mémoire : fermez tous les onglets du site et rouvrez.)*
2. Administration → Accès → Utilisateurs : ouvrez la liste « Rôle » du formulaire d'invitation : vous voyez **Directeur (Gestionnaire)**, **Secrétaire-caissier(ère) (Vendeur)**, **Suppléant (Consultant)**.
3. Même chose avec le sélecteur du menu sur « École » **puis** sur « Commerce » : les noms doivent être identiques.
4. **Si vous voyez encore Vendeur / Gestionnaire / Consultant seuls** : envoyez-moi une capture d'écran de la liste et du bas du menu (avec le numéro de version), et dites-moi sur quel site vous êtes (test ou production) ; vérifiez aussi dans Administration → Entreprise → « Mes secteurs d'activité » que **Écoles** est bien coché pour cette entreprise.
5. Dites-moi « v264 validée », ou ce qui cloche.

## Ce que j'ai vérifié avant livraison
- Série automatique complète rejouée sur la version finale (la série « c1 » se vérifie à la construction automatique, comme avant).
- Test dédié (u15, 8 contrôles) : noms du menu pour les trois rôles ; Administrateur inchangé ; listes de rôles d'Administration avec le rôle réel entre parenthèses, en espace École **et** en espace Commerce ; entreprise sans secteur Écoles inchangée ; aucune erreur de page. Vérifié sur la version de test **et** sur la version de production.

## Retour arrière (seulement si je vous le demande)
Redéposer les fichiers de la v263. Aucune donnée n'est touchée.

## CE QUI RESTE DE VOTRE RESSORT
**À faire maintenant**
- Déposer ce paquet sur **TEST**, tester (étape 5), me dire « v264 validée » (ou la capture demandée à l'étape 5.4).
- **PROD v263** : si ce n'est pas terminé, déposer le paquet PROD v263 (les 2 scripts SQL sont déjà exécutés) et me dire « v263 active sur PROD ».
- Me dire si la **v260** est bien validée (incluse depuis la v261).

**Décisions à prendre**
- **Prix** : scénario « Équilibré » retenu (grille A pour Écoles) ; à confirmer après un test auprès de 5 à 10 entreprises cibles.
- **Numérotation qui repart de 0001 chaque année** et **exercice octobre–septembre** dans l'impôt sur le revenu : avec l'expert-comptable.
- Prochain bloc : **Import-export** (ou autre priorité : dites-moi).

**Échéances et suivis**
- **Liste annuelle des versements** : avant le **31 octobre 2026** ; **acomptes provisionnels** : 1er–15 décembre ; **versement des retenues d'octobre** : 1er–15 novembre.
- **Lundi 26 octobre** : vérifier la réception des e-mails de relance (Resend).
- Dans quelques jours : relancer le script 1 (journal) sur TEST et PROD ; garder le script 3 sous la main.

**Validations externes et démarches**
- Expert-comptable : TCA sur cantine, transport, uniformes ; compte 709 (bourses et rabais) ; TCA sur les abonnements ; base des retenues 96–97 ; taux de retenue sur primes ; acomptes.
- Avocat : documents juridiques et données d'élèves mineurs ; messages de relance ; accès d'une secrétaire aux fiches d'élèves.
- Décision sur la sauvegarde à la minute ; récupération du 2FA ; compte MonCash de production ; prestataires de test d'intrusion ; règle « période clôturée » en observation.
