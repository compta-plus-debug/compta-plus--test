# Compta+ — version 310 — paquet TEST
**Version 310 = v309 + nouveau bloc ONG, associations, églises (dernier bloc de secteur).**

À faire sur le dépôt **compta-plus--test** uniquement. Ce paquet contient **les changements depuis la v309** (validée sur TEST). **Prérequis : la v309 est active sur TEST.** **Aucun script SQL, aucune Edge Function.** Vos données ne changent pas. **Rien à supprimer.**

## 1. Nouveau bloc : ONG, associations, églises
**Activation** : Administration → **Secteurs** → cochez **ONG, associations, églises** (grille de prix B, **inchangée**). Un espace du même nom apparaît dans le sélecteur d'espace.

**Ce que j'ai compris de vos réponses** (dites-moi si c'est faux) : les **quatre types** d'organisations (ONG avec bailleurs, associations et clubs, églises et communautés religieuses, fondations et écoles communautaires) ; des **fonds affectés par projet** ; **quatre documents** ; en cas de **dépassement** du solde ou du budget : **alerte + raison obligatoire + gestionnaire**, jamais de blocage pur (comme les ventes à perte).

**Ce que le bloc permet** :
- **Type d'organisation** : choisi sur le Tableau de bord ; adapte les mots (bailleurs, fidèles…) et les natures de recettes (subvention, don, collecte ; dîme, offrande ; cotisation).
- **Fonds et projets** : un fonds par projet ou bailleur (budget, dates, bailleur), plus le **Fonds général (libre)** ; solde et barre de budget ; **virements entre fonds** avec raison ; **clôture** seulement à solde zéro.
- **Dons et reçus** : **reçus numérotés** (RC-année-0001…), montant **en lettres**, format A4 ou ticket ; écriture automatique (banque ou caisse / comptes 7581 à 7589) ; **annulation** avec écriture inverse (refusée si l'argent est déjà dépensé).
- **Bailleurs, donateurs, membres** ; **cotisations** (annuelle, trimestrielle, mensuelle), reçu de cotisation, **retards** (période commencée depuis plus de 30 jours).
- **Dépenses** imputées à un fonds (activités, aides, formation, transport, honoraires, communication, loyer, énergie, personnel temporaire, salarié sans écriture, autre) ; **à payer plus tard** avec règlements ; **dépassement du solde ou du budget** : alerte, raison obligatoire, tracée dans le rapport.
- **Rapports** : situation des fonds (période, CSV), **rapport financier par fonds** pour le bailleur, recettes et dépenses par nature, **rapport annuel des dons** (imprimable, CSV) et **relevé par donateur**, cotisations.
- **Statistiques**, **À faire**, **assistant** (budget dépassé, fonds clôturé avec solde, cotisation en retard, dépense impayée), **Achats ONG** dans Achat et fournisseurs, sauvegarde, export, import et réinitialisation.
- Le reçu précise qu'il **ne vaut reçu fiscal que si la DGI a autorisé l'organisation**.
- Rôle **Vendeur** (accueil) : donateurs, membres, dons, cotisations et reçus. Pas de fonds, dépenses, annulations ni rapports.

Numéro de version : **20261101-310**.

## Fichiers du paquet (16 fichiers + 2 documents à lire)
| Dossier du paquet | Fichiers | Où les déposer | Action |
|---|---|---|---|
| racine | CARTE-DES-MODULES.md, tst-lancer.mjs, tst-n1.cjs, **tst-u44.cjs** | à la racine du dépôt | remplace (tst-u44 : nouveau) |
| build | build.mjs | dossier `build` | remplace |
| src | 00-config, 06-icones-et-graphiques, 07-constantes-metier, 12-application-principale, 17-compta-assistant-de-controle, 24-achats, 34-gestion-module, 38-administration-stock-et-sauvegardes, 39-administration-module, 50-secteurs-et-blocs, 57-assistant-blocs, **66-ong** (tous en `.jsx`) | dossier `src` | remplace (66-ong : nouveau) |

Total : 4 fichiers de racine, 1 fichier `build`, 12 fichiers `src` ; aucun script SQL. **Important** : déposez bien les 4 fichiers de la racine (le test n1 compte désormais **21** fichiers de construction).

## Procédure pas à pas
### Étape 1 — Supabase
Rien à faire (pas de script SQL, pas d'Edge Function).
### Étape 2 — Les fichiers de la racine
Dépôt **compta-plus--test** → **Add file → Upload files** → glissez les 4 fichiers du dossier `racine` → **Commit changes**.
### Étape 3 — Le fichier du dossier `build`
Dossier **build** → **Add file → Upload files** → `build.mjs` → **Commit changes**.
### Étape 4 — Les fichiers du dossier `src`
Dossier **src** → **Add file → Upload files** → glissez les 12 fichiers → **Commit changes**. Une construction démarre (25 à 40 minutes). Ne redéposez rien pendant ce temps.
### Étape 5 — Attendre le vert
Onglet **Actions** → « Construire le site » doit passer au **vert**. Si rouge : copiez-moi les lignes **ÉCHEC / FAIL**.
### Étape 6 — Vérifier sur le site de test
1. **Ctrl + Maj + R**. Version en bas du menu : **20261101-310**.
2. Administration → Secteurs → activez **ONG, associations, églises** ; ouvrez l'espace.
3. Suivez **CAS-PRATIQUE-ONG-pas-a-pas.md** : type d'organisation, donateur, membre, deux fonds, subvention avec reçu (n° 0001, montant en lettres), don au fonds général, dépenses avec **dépassement** (raison demandée), virement, tentative de clôture avec solde, cotisation, annulation d'un reçu, rapports (financier, annuel, relevé).
4. Essayez avec le type **Église** (dîme, offrande) : mots et natures changent.
5. **Compte Vendeur** : seulement tableau de bord, dons, donateurs, membres.
6. **Petit écran** : tableau de bord, formulaires et reçus sans défilement horizontal.
7. Non-régression : ouvrez Agriculture, Industries, BTP et Commerce : tout fonctionne comme en v309.

## CE QUI RESTE DE VOTRE RESSORT
- Déposer le paquet **sur compta-plus--test seulement**, attendre le vert, faire les vérifications, puis me dire **« v310 validée »** (ou me décrire par écrit ce qui ne va pas).
- **PROD** : dites-moi **« v309 active sur PROD »** (le paquet PROD v309 a été livré ; je ne sais pas encore s'il est déposé). Je prépare le paquet PROD v310 **dès votre validation**.
- **Échéances fiscales** : **1–15 novembre** retenues d'octobre ; **1–15 décembre** acomptes provisionnels ; vérifiez que la **liste annuelle des versements** (31 octobre) a bien été déposée (pénalité indiquée : 25 000 G par mois de retard).
- **Question à poser à votre juriste ou comptable** : acomptes à 60 % en 2 versements (nouveau Code, appliqué) ou 75 % en 3 (site de la DGI, ancien Code) ; date de la liste des employés (30 septembre).
- **Expert-comptable — ONG** : confirmer les comptes 7581 (dons et legs), 7582 (subventions), 7583 (cotisations), 7584 (dîmes et offrandes), 7585 (collectes), 7589 (autres), 6041, 6581, 6331, 6183, 6322, 6231, 6133, 6056, 6613, 6283 ; et la **comptabilité des fonds affectés** (fonds dédiés, report des ressources non utilisées).
- **Expert-comptable — Agriculture** : comptes 6021, 6022, 6055, 6132, 6155, 6182, 6282, 632, 6612, 7012 ; et s'il faut des comptes propres pour BTP et Industries à la place du 601 partagé.
- **Juriste** : **autorisation de la DGI pour délivrer des reçus fiscaux** (déduction d'impôt), protection des données des donateurs et des fidèles, traitement des dîmes et offrandes de l'église, règles propres à chaque type d'organisation.
- **Décisions en attente** : retour en arrière de la base (PITR), récupération 2FA, compte MonCash de production, tests d'intrusion, règle « période clôturée », scénario de prix « Équilibré » (grille C).
- **Suite** : **tous les blocs de secteur sont faits.** Prochaine étape selon vos priorités.
