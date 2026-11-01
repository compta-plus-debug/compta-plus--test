# Compta+ — correctif du test u29 (version 309 inchangée)
**Un seul fichier à remplacer. Le site lui-même ne change pas : la version reste 20261030-309.**

## Ce qui s'est passé (cause trouvée, cette fois)
Votre construction #165 a échoué sur le **même contrôle** que la #164 : le test u29 (Hôtellerie), « 1 facture, total 5 260 », avec 0 facture affichée. Mon premier correctif (attendre plus longtemps) était une mauvaise piste : **j'avais mal diagnostiqué**.
**La vraie cause : la date.** GitHub travaille à l'heure UTC. Chez vous il est 22 h le 31 octobre, mais en UTC nous sommes déjà le **1er novembre**. Le test enregistre un séjour qui se termine « hier », donc le **31 octobre**, et l'écran des factures n'affiche par défaut que le **mois en cours** (depuis le 1er novembre) : la facture du 31 octobre était hors du filtre. J'ai reproduit l'échec chez moi en simulant l'heure UTC.
**Ce n'est pas un défaut de l'application** : une facture du mois précédent se retrouve en changeant la date « Du », comme prévu. Le test, lui, n'aurait donc réussi que le 2 du mois ou plus tard : il aurait aussi échoué le 1er de chaque mois.
**Correction** : le test élargit lui-même la période affichée (« Du » = 5 jours avant) avant de contrôler et avant d'annuler la facture. Vérifié chez moi en heure UTC et en heure du Mexique : il passe dans les deux cas.

## Procédure pas à pas
### Étape 1 — Supabase
Rien à faire.
### Étape 2 — Le fichier
Dépôt **compta-plus--test** → **Add file → Upload files** → glissez **tst-u29.cjs** (dossier `racine` du paquet) à la **racine du dépôt** (là où se trouvent déjà les autres fichiers tst-…) → **Commit changes**. Il remplace l'ancien fichier du même nom (le correctif de tout à l'heure est remplacé par celui-ci).
### Étape 3 — Attendre le vert
Onglet **Actions** → « Construire le site » : la construction repart (25 à 40 minutes). Elle doit passer au **vert**, puis le site se met à jour.
**Si elle échoue encore** : copiez-moi les lignes **ÉCHEC / FAIL** : le contrôle affichera maintenant ce qu'il a lu.
### Étape 4 — Vérifier
Ctrl + Maj + R ; version en bas du menu : **20261030-309**.

## CE QUI RESTE DE VOTRE RESSORT
- Déposer ce fichier, attendre le vert, faire les vérifications de la v309 (coût par unité 6,50 G, marge 8,50 G, coût par tête 36,84 G, onglet Commandes), puis me dire **« v309 validée »**.
- Me confirmer l'état de **PROD v304** ; le paquet PROD v309 suivra votre validation.
- Échéances : 1–15 novembre (retenues d'octobre), 1–15 décembre (acomptes). Question au juriste/comptable : acomptes 60 % en 2 versements (nouveau Code) ou 75 % en 3 (site DGI) ; date de la liste des employés (30 septembre).
- Expert-comptable : comptes de l'Agriculture (6021, 6022, 6055, 6132, 6155, 6182, 6282, 632, 6612, 7012), valorisation des stocks et du cheptel. Juriste : ventes d'animaux vivants, traçabilité, main-d'œuvre agricole.
- Décisions en attente : PITR, récupération 2FA, compte MonCash de production, tests d'intrusion, règle « période clôturée », scénario de prix « Équilibré » (grille C).
- Suite : ONG / associations / églises.
