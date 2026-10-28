# Compta+ — version 289 — paquet TEST (nouveau bloc Transport et logistique)
À faire sur le dépôt **compta-plus--test** (TEST) uniquement. **Prérequis** : TEST est en v287. **Aucun script SQL, aucune Edge Function** (les données du bloc utilisent le même stockage que Restauration et Hôtellerie). Rien à supprimer.

## Ce qui change
**Nouveau secteur « Transport et logistique »** (Administration → Secteurs, 3 secteurs maximum par entreprise). Un espace « Transport » apparaît avec 9 onglets :
- **Tableau de bord** : guide de démarrage en 7 étapes cochées automatiquement, 8 indicateurs (voyages et facturé du mois, voyages en route, encaissé, à recevoir, dépenses, marge), liste **« À faire »** (documents de véhicule échus ou à renouveler sous 30 jours, entretien à faire par date ou par kilomètres, permis de chauffeur, voyages livrés non facturés, factures impayées depuis plus de 30 jours), voyages des 7 jours à venir.
- **Voyages** : client, véhicule et chauffeur choisis dans des listes ; lieux déjà saisis proposés ; prix convenu saisi par vous ; état Planifié / En route / Livré / Annulé ; recherche, filtres, ligne de total ; **bordereau de transport** imprimable (A4, signatures du chauffeur et du destinataire).
- **Véhicules** : plaque (doublon refusé), type, compteur, entretien prévu, **échéances** (assurance, contrôle technique, vignette… à votre choix) avec alertes. **Chauffeurs** : permis et date de validité. **Clients** : recherche, reste à payer.
- **Factures** : on choisit un client et tous ses voyages livrés sont facturés ensemble ; encaissements partiels ; annulations par écriture inverse ; facture imprimable en **A4 ou ticket** ; TCA **désactivée par défaut** (case à cocher, taux des Réglages) ; filtres et totaux.
- **Dépenses** par véhicule : carburant, entretien, assurance, autres frais ; payées en caisse, banque ou à payer.
- **Rapports** (par période) : **rentabilité par véhicule** (chiffre d'affaires, dépenses, marge, coût au kilomètre), dépenses par nature, par chauffeur, clients par ancienneté, exports CSV. **Statistiques** : évolution, répartitions (en nombres pour les voyages).
- **Régulation** (rôle Vendeur) : tableau de bord, voyages, clients, factures et encaissements ; le reste est réservé au responsable.
- **Assistant de contrôle** : 3 nouveaux contrôles (document de véhicule échu, permis échu, facture de transport impayée) avec guide.

**Comptabilité (automatique)** : facture = Débit 411 / Crédit 706 (et 445 si TCA activée) ; encaissement = Débit caisse ou banque / Crédit 411 ; dépense = Débit 6053 (carburant), 6242 (entretien et réparations), 6252 (assurance du véhicule) ou 618 (autres frais) / Crédit caisse, banque ou 401.

**Aussi dans ce paquet** : le guide « Pour démarrer » de l'Éducation en carte blanche (déjà livré dans le paquet PROD v288).

Numéro de version : **20260830-289**.

## Fichiers du paquet (16 fichiers)
| Dossier du paquet | Fichier | Où le déposer | Action |
|---|---|---|---|
| racine | tst-u34.cjs | racine du dépôt (comme en v287) | nouveau |
| racine | tst-n1.cjs | racine du dépôt | remplace |
| racine | tst-lancer.mjs | racine du dépôt | remplace |
| racine | CARTE-DES-MODULES.md | racine du dépôt | remplace |
| build | build.mjs | dossier `build` | remplace |
| src | 61-transport.jsx | dossier `src` | **nouveau** |
| src | 57-assistant-blocs.jsx | dossier `src` | remplace |
| src | 51-ecoles.jsx | dossier `src` | remplace |
| src | 50-secteurs-et-blocs.jsx | dossier `src` | remplace |
| src | 39-administration-module.jsx | dossier `src` | remplace |
| src | 38-administration-stock-et-sauvegardes.jsx | dossier `src` | remplace |
| src | 17-compta-assistant-de-controle.jsx | dossier `src` | remplace |
| src | 12-application-principale.jsx | dossier `src` | remplace |
| src | 07-constantes-metier.jsx | dossier `src` | remplace |
| src | 00-config.jsx | dossier `src` | remplace |

(4 fichiers de racine, 1 fichier `build`, 10 fichiers `src` = 15 fichiers + ce LISEZ-MOI.)

## Procédure pas à pas
1. **Supabase** : rien à faire.
2. Dépôt **compta-plus--test** → **Add file → Upload files** → glissez les 4 fichiers du dossier `racine` → **Commit changes**.
3. Dossier **build** → **Add file → Upload files** → `build.mjs` → **Commit changes**.
4. Dossier **src** → **Add file → Upload files** → glissez les 10 fichiers → **Commit changes**. Une construction démarre (25 à 40 minutes) ; ne redéposez rien pendant ce temps.
5. Onglet **Actions** → « Construire le site » doit passer au **vert**. Si rouge : copiez-moi les lignes ÉCHEC / FAIL.
6. **Ctrl + Maj + R**, version **20260830-289**. Dans Administration → Secteurs, activez « Transport et logistique » (ou testez avec une entreprise qui l'a choisi). Essayez : ajouter un véhicule et ses échéances, un chauffeur, un client, un voyage, imprimer le bordereau, passer le voyage à « Livré », facturer, encaisser, saisir une dépense, ouvrir Rapports et Statistiques, puis le tout sur téléphone.

## CE QUI RESTE DE VOTRE RESSORT
- Déposer, attendre le vert, vérifier, puis me dire **« v289 validée »** : je livre le paquet PROD cumulatif.
- Me dire **« v288 active sur PROD »** une fois ce paquet déployé et vérifié.
- À confirmer avec votre **expert-comptable** : les comptes du Transport (6053, 6242, 6252, 618 : numéros proposés, à valider selon votre plan comptable) ; traitement de la TCA sur les prestations de transport ; Santé : 4112, 4113, 7065 à 7067, 6221, 4678, 659 ; Import-export : 607/608/370, 4456, 4458, 666/766 ; Hôtellerie : 7076, 7077, 7078, 4191, 4476 ; Restauration : 7075, 4677 ; Éducation : TCA des frais scolaires, 487, 709.
- Pour le transport : vérifiez avec les autorités ou votre assureur quels documents de véhicule sont obligatoires pour vos types de véhicules (le bloc n'en impose aucun : vous saisissez vos propres échéances).
- **Juriste** : données des patients, clients et chauffeurs (confidentialité, consentement), conditions d'utilisation.
- Prévenir vos clients (transporteurs, écoles, hôtels, restaurants, cabinets, importateurs…) que les blocs existent (secteur à activer).
- Échéances : retenues d'octobre **1–15 novembre** ; acomptes provisionnels **1–15 décembre**.
- Décisions en attente : retour en arrière de la base (PITR), récupération 2FA, compte MonCash de production, tests d'intrusion, règle « période clôturée », scénario de prix « Équilibré » (prix du bloc Transport : grille C, à confirmer).
