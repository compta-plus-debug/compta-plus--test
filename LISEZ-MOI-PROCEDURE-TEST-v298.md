# Compta+ — version 298 — paquet TEST (BTP : corrections d'ergonomie du dossier de chantier)
À faire sur le dépôt **compta-plus--test** (TEST) uniquement. **Prérequis** : TEST est en v297. **Aucun script SQL, aucune Edge Function.** Rien à supprimer.

## Ce qui est corrigé (d'après vos remarques)
1. **Flèches déroulantes** : toutes les cases de saisie à suggestions (Tâche, Qualification, Ouvrier, Fonction, Nom du responsable, Désignation et Unité du bordereau, Fournisseur, Étape) ont maintenant une **vraie flèche ▾** à côté : touchez-la, choisissez dans la liste, la case se remplit. Vous pouvez toujours taper un texte libre. (La liste des tâches types : contrôle de l'implantation, validation des quantités, visite de qualité, pointage, réception des matériaux, rapport journalier, sécurité, commande des matériaux, coordination des sous-traitants.) Quand une liste est vide (ex. aucun ouvrier enregistré), la flèche l'indique.
2. **Boutons Enregistrer** : « Enregistrer le budget », « Enregistrer les étapes », « Enregistrer le marché ». Les montants, dates, poids et % sont enregistrés dès que vous quittez une case (message « Enregistré ✓ ») ; les boutons confirment l'ensemble avec les totaux.
3. **Poids des étapes expliqué** : dans « Étapes d'exécution », touchez « Comment l'avancement est-il calculé ? » : explication simple avec un exemple chiffré (30 + 20 + 0 = 50 %). Nouveau bouton **« Répartir les poids également »** (partage 100 entre les étapes, à ajuster ensuite).
4. **Encaissement du bordereau** : dans « Marché, avances et retenue », nouveau bloc **« Suivi du marché et encaissement »** (marché, travaux facturés, déjà encaissé, reste à encaisser, retenue à libérer) avec les boutons **« Émettre une situation de travaux »** et **« Encaisser une situation »** qui vous amènent directement à l'onglet Situations sur ce chantier. Une phrase explique le principe : on ne facture pas le bordereau en une fois, on émet des situations puis on encaisse.
5. **Débordement du devis et de la situation imprimable sur téléphone** : marges réduites et tableau défilant horizontalement dans l'aperçu au lieu de déborder de l'écran. (Si le débordement que vous avez vu est ailleurs, dites-moi sur quel écran.)
6. **Cas pratique pas à pas** : le fichier **CAS-PRATIQUE-BTP-pas-a-pas.md** (dans le paquet) vous fait exécuter un chantier complet sur TEST, avec les chiffres attendus à chaque étape. À faire après avoir validé l'ergonomie.

Numéro de version : **20260830-298**.

## Fichiers du paquet (4 fichiers + cas pratique)
| Dossier du paquet | Fichier | Où le déposer | Action |
|---|---|---|---|
| racine | tst-u36.cjs | racine du dépôt | remplace (test BTP complété) |
| racine | CARTE-DES-MODULES.md | racine du dépôt | remplace |
| src | 63-btp.jsx | dossier `src` | remplace |
| src | 00-config.jsx | dossier `src` | remplace (numéro de version) |
| (paquet) | CAS-PRATIQUE-BTP-pas-a-pas.md | à lire, rien à déposer | cas pratique |

## Procédure pas à pas
1. **Supabase** : rien à faire.
2. Dépôt **compta-plus--test** → racine → **Add file → Upload files** → glissez `tst-u36.cjs` et `CARTE-DES-MODULES.md` → **Commit changes**.
3. Dossier **src** → **Add file → Upload files** → glissez `63-btp.jsx` et `00-config.jsx` → **Commit changes**. La construction démarre (25 à 40 minutes) ; ne redéposez rien pendant ce temps.
4. Onglet **Actions** : « Construire le site » doit passer au **vert** avant de tester. Si rouge : copiez-moi les lignes ÉCHEC / FAIL.
5. **Ctrl + Maj + R** (sur téléphone : fermer puis rouvrir l'application) ; version **20260830-298**.
6. Ouvrez un chantier (BTP → Chantiers → Ouvrir) et vérifiez : flèches ▾ dans les cases, boutons Enregistrer, explication des poids, bloc « Suivi du marché et encaissement ».

## CE QUI RESTE DE VOTRE RESSORT
- Déposer, attendre le vert, vérifier, puis me dire **« v298 validée »** (ou ce qui manque) ; faire ensuite le cas pratique et me signaler tout chiffre qui ne correspond pas. L'étape 3 (supervision, journal de chantier, réception, études) vient après votre validation.
- Les paquets PROD (cumulatif BTP) ne sont livrés qu'après votre « validé ». Me dire aussi **« v292 active sur PROD »** (et si la v290 l'était), et si la v293 est validée.
- **Échéances** : liste annuelle des versements du **31 octobre 2026** (dans 2 jours) ; retenues d'octobre **1–15 novembre** ; acomptes provisionnels **1–15 décembre**.
- **Expert-comptable** : comptes BTP (706, 4117, 4191, 601, 661, 611, 622, 618, 628), traitement de la retenue, taxe sur les travaux, comptabilisation à l'avancement ; paie des ouvriers de chantier (journaliers, imputation aux chantiers, cotisations et retenue d'impôt) ; et les comptes des autres blocs déjà listés.
- **Juriste** : contrats de construction et de sous-traitance, retenue de garantie, pénalités de retard, garantie décennale, contrats de travail des ouvriers journaliers, données personnelles des ouvriers.
- Prévenir vos clients que les blocs existent (secteur à activer dans Administration → Secteurs).
- Décisions en attente : retour en arrière de la base (PITR), récupération 2FA, compte MonCash de production, tests d'intrusion, règle « période clôturée », prix « Équilibré » (grille C).
- **Suite** : étape 3 du BTP, puis blocs restants — Industries artisanales, ONG/associations/églises, Agriculture et élevage.
