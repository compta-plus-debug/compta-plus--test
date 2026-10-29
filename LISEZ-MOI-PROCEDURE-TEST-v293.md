# Compta+ — version 293 — paquet TEST (nouveau bloc « BTP et construction » + correction Immobilier)
À faire sur le dépôt **compta-plus--test** (TEST) uniquement. **Prérequis** : TEST est en v291. **Aucun script SQL, aucune Edge Function.** Rien à supprimer.

## 1. Correction reprise de la version PROD v292 (Immobilier → Baux)
La liste « Bien » du formulaire « Nouveau bail » affiche maintenant **tous les biens en gestion** : ceux qui ont un bail en cours sont grisés avec le nom du locataire ; un message explique quoi faire quand aucun bien n'est libre. (Même correction que dans le paquet PROD v292.)

## 2. Nouveau bloc BTP et construction
- **Tableau de bord** : guide en 7 étapes (cochées automatiquement), indicateurs (chantiers en cours, marchés en cours, travaux facturés et encaissé ce mois, à recevoir, retenues de garantie à libérer, dépenses, dettes fournisseurs), « À faire » (situations impayées, chantiers en retard sur la date de fin, budgets dépassés, dépenses sans situation, retenues à réclamer, dettes à régler), chantiers en cours avec avancement.
- **Clients** (maîtres d'ouvrage) : recherche, reste à payer par client.
- **Chantiers** : nom, client, adresse, dates, **pourcentage de retenue de garantie** (selon votre marché), budget facultatif ; état (en préparation, en cours, suspendu, terminé) ; **bordereau de prix** (désignation, unité, quantité, prix unitaire) avec **devis imprimable** (A4) ; **avance de démarrage** (réception, annulation) ; **retenue de garantie** (encaissée à la réception du chantier). Filtres et totaux.
- **Situations de travaux** : on saisit pour chaque ligne la **quantité cumulée** réellement exécutée ; le programme calcule les travaux de la situation, la **retenue de garantie**, la **récupération de l'avance** (au prorata de l'avancement, soldée à 100 %) et le **net à payer**. Contrôles : la quantité ne peut ni diminuer ni dépasser le marché (message en rouge). Impression A4 de la situation (désignation, marché, précédent, cumul, net). Encaissements partiels ou totaux, filtres, totaux, annulation (dernière situation seulement, sans encaissement).
- **Dépenses de chantier** : matériaux, main-d'œuvre, sous-traitance, engins, transport, autres ; payées en caisse, banque ou **à payer plus tard** (fournisseur ou sous-traitant obligatoire) avec **règlement partiel ou total** ultérieur ; filtres et totaux ; annulation par écriture inverse.
- **Rapports** : rentabilité par chantier (marché, avancement, facturé, encaissé, dépenses, marge, reste à facturer, retenue à libérer), situations impayées par client (0–30 / 31–60 / plus de 60 jours), dépenses par nature, dettes envers les fournisseurs, période au choix, exports.
- **Statistiques** : travaux facturés et dépenses sur 6 mois, par chantier, par nature, chantiers par état, impayés par client.
- **Secrétariat** (rôle Vendeur) : clients, situations (émission, encaissement, impression) ; le reste est réservé au responsable.
- **Assistant de contrôle** : 3 alertes (situation impayée depuis plus de 30 jours, budget dépassé, chantier en retard), chacune avec son mode d'emploi.
- Rien n'est préréglé : prix, quantités, retenue, budget, dates et taxe sont saisis par vous. Taxe sur les situations **désactivée par défaut** (case à cocher, responsable seulement).

## Comptabilité (tout en gourdes)
- Situation : Débit 411 (net à payer), 4117 (retenue de garantie) et 4191 (avance récupérée) / Crédit 706 (travaux hors taxe) et 445 (taxe, si activée).
- Avance reçue : Débit caisse (530) ou banque (512) / Crédit 4191. Encaissement : Débit 530 ou 512 / Crédit 411. Retenue encaissée : Débit 530 ou 512 / Crédit 4117.
- Dépense : Débit 601 matériaux, 661 main-d'œuvre, 611 sous-traitance, 622 engins, 618 transport, 628 autres / Crédit 530, 512 ou 401. Règlement d'une dette : Débit 401 / Crédit 530 ou 512.
- Toute annulation passe une écriture inverse ; dates futures et périodes clôturées refusées.

## Activation
Administration → Secteurs → cocher « BTP et construction » (grille de prix C). L'espace « BTP » apparaît ensuite dans le menu.

Numéro de version : **20260830-293**.

## Fichiers du paquet (17 fichiers)
| Dossier du paquet | Fichier | Où le déposer | Action |
|---|---|---|---|
| racine | tst-u36.cjs | racine du dépôt | **nouveau** (test BTP) |
| racine | tst-u35.cjs | racine du dépôt | remplace (test Immobilier complété) |
| racine | tst-n1.cjs | racine du dépôt | remplace |
| racine | tst-lancer.mjs | racine du dépôt | remplace |
| racine | CARTE-DES-MODULES.md | racine du dépôt | remplace |
| build | build.mjs | dossier `build` | remplace |
| src | 63-btp.jsx | dossier `src` | **nouveau** |
| src | 62-immobilier.jsx | dossier `src` | remplace (correction de la liste « Bien ») |
| src | 00-config.jsx, 06-icones-et-graphiques.jsx, 07-constantes-metier.jsx, 12-application-principale.jsx, 17-compta-assistant-de-controle.jsx, 38-administration-stock-et-sauvegardes.jsx, 39-administration-module.jsx, 50-secteurs-et-blocs.jsx, 57-assistant-blocs.jsx | dossier `src` | remplace |

(5 fichiers de racine + 1 `build` + 11 `src` = 17 fichiers, plus ce LISEZ-MOI.)

## Procédure pas à pas
1. **Supabase** : rien à faire (données enregistrées dans la table générique existante).
2. Dépôt **compta-plus--test** → **Add file → Upload files** → glissez les 5 fichiers du dossier `racine` → **Commit changes**.
3. Dossier **build** → **Add file → Upload files** → glissez `build.mjs` → **Commit changes**.
4. Dossier **src** → **Add file → Upload files** → glissez les 11 fichiers du dossier `src` → **Commit changes**. Une construction démarre (25 à 40 minutes) ; ne redéposez rien pendant ce temps.
5. Onglet **Actions** → « Construire le site » doit passer au **vert**. Si rouge : copiez-moi les lignes ÉCHEC / FAIL.
6. **Ctrl + Maj + R**, version **20260830-293**. Administration → Secteurs → activez « BTP et construction » → espace BTP : un client, un chantier (retenue 5 %), 2 lignes de bordereau, une avance, une dépense, puis une situation (quantités cumulées) : vérifiez retenue, avance récupérée et net à payer ; imprimez la situation ; encaissez ; passez le chantier à « Terminé » et encaissez la retenue.
7. Vérifiez aussi Immobilier → Baux : la liste « Bien » montre tous les biens, les loués sont grisés.

## CE QUI RESTE DE VOTRE RESSORT
- Déposer, attendre le vert, vérifier, puis me dire **« v293 validée »** : je livre le paquet PROD cumulatif (BTP inclus).
- Me dire **« v292 active sur PROD »** une fois le paquet PROD v292 déployé et vérifié (et si la v290 l'était déjà).
- **Échéances** : liste annuelle des versements du **31 octobre 2026** (dans 2 jours) ; retenues d'octobre **1–15 novembre** ; acomptes provisionnels **1–15 décembre**.
- À confirmer avec votre **expert-comptable** : BTP — 706 (travaux), 4117 (retenues de garantie), 4191 (avances), 601, 661, 611, 622, 618, 628 (numéros proposés), traitement de la retenue (calculée sur le montant hors taxe), taxe sur les travaux et retenues à la source éventuelles, comptabilisation à l'avancement ; Immobilier : 706, 708, 165, 6152, 6411, 616, 605, 628 ; Transport : 6053, 6242, 6252, 618, TCA ; Santé : 4112, 4113, 7065 à 7067, 6221, 4678, 659 ; Import-export : 607/608/370, 4456, 4458, 666/766 ; Hôtellerie : 7076, 7077, 7078, 4191, 4476 ; Restauration : 7075, 4677 ; Éducation : TCA des frais scolaires, 487, 709.
- **Juriste** : contrats de construction et de sous-traitance, taux et durée de la retenue de garantie, pénalités de retard, garanties décennales, contrat de bail et dépôt de garantie, données des clients, locataires et sous-traitants, conditions d'utilisation. Le bloc n'impose ni ne génère aucun contrat.
- Prévenir vos clients (entreprises de construction, agences immobilières…) que les blocs existent (secteur à activer dans Administration → Secteurs).
- Décisions en attente : retour en arrière de la base (PITR), récupération 2FA, compte MonCash de production, tests d'intrusion, règle « période clôturée », scénario de prix « Équilibré » (grille C : Transport, Immobilier, BTP).
- **Suite** : blocs restants — Industries artisanales, ONG/associations/églises, Agriculture et élevage.
