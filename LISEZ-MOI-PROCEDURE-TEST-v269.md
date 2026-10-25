# Compta+ — version 269 — paquet TEST
**Nouveau bloc Santé** : cabinet ou clinique, pharmacie, laboratoire ou imagerie, hôpital. Données **administratives et comptables seulement** (aucun diagnostic, aucune ordonnance, aucun résultat d'examen).

À faire sur le dépôt **compta-plus--test** uniquement. Le paquet PROD ne vous sera donné qu'après votre « v269 validée ».

**Prérequis** : la v268 est déposée sur TEST. **Aucun script SQL, aucune Edge Function.** Pas de changement du workflow. Le Vendeur n'a pas accès au bloc Santé dans cette version (un accès « réception » demanderait un script SQL : à voir ensuite si vous le souhaitez).

## Ce qui change (pour vous)
1. **Nouveau module « Santé »**, visible seulement pour une entreprise qui a le secteur **Santé** activé (comme pour Import-export). Un sélecteur d'espace « Santé » apparaît en haut du menu.
2. **Type d'établissement** (Vue d'ensemble) : Cabinet ou clinique, Pharmacie, Laboratoire ou imagerie, Hôpital. Chaque type a **ses propres données séparées** et ses propres mots (patient/client, acte/produit/examen, praticien/pharmacien…).
3. **Patients**, **Assureurs** (part payée par défaut en %), **Praticiens** (part d'honoraires reversée en %), **Catalogue** (consultations, examens, séjours, produits avec tarif ; un produit peut être lié au stock).
4. **Facturation** : choix du patient, lignes du catalogue, assureur facultatif → la facture se répartit automatiquement entre la part de l'assureur et la part du patient (tiers payant). Impression de la facture. Encaissements du patient (espèces ou banque), remboursements de l'assureur, **rejet** d'une part avec **motif obligatoire** : soit reportée sur le patient, soit constatée en perte. Annulation possible seulement sans paiement (écritures inverses).
5. **Honoraires** : à chaque facture avec un praticien, la part due est calculée (hors produits) puis payable depuis l'onglet Praticiens.
6. **Pharmacie** : la vente d'un produit lié au stock diminue le stock (refus si insuffisant) ; registre des **lots et péremptions** (alerte périmé / moins de 90 jours).
7. **Hôpital** : **séjours** (admission, service, tarif par jour) ; à la sortie, la facture est générée (jours × tarif).
8. **Rapports** : chiffre d'affaires par catégorie, journal des encaissements, exports CSV.
9. **Comptabilité** (automatique) : 4112 patients, 4113 assureurs, 7065 actes, 7066 examens, 7067 séjours, 707 produits, 6221/4678 honoraires, 659 rejets, 6037/370 coût des produits si le stock est à l'actif. **Aucune TCA calculée** dans cette version (à confirmer avec l'expert-comptable).
10. Noms des rôles dans l'espace Santé : Gestionnaire = Médecin-directeur / Pharmacien titulaire / Directeur du laboratoire / Directeur médical selon le type ; Consultant en lecture seule.
11. Numéro de version : **20260830-269**.

## Fichiers du paquet (14 fichiers)
| Dossier du paquet | Fichier | Où le déposer | Action |
|---|---|---|---|
| racine | tst-u20.cjs | à la racine du dépôt | **nouveau** (test de cette version) |
| racine | tst-lancer.mjs | à la racine du dépôt | remplace |
| racine | tst-n1.cjs | à la racine du dépôt | remplace (test de préchargement : 12 fichiers) |
| racine | CARTE-DES-MODULES.md | à la racine du dépôt | remplace |
| build | build.mjs | dossier `build` (à la racine du dépôt) | remplace (Santé et Import-export chargés à la demande, application de départ allégée) |
| src | 54-sante.jsx | dossier `src` | **nouveau** (le module Santé) |
| src | 53-import-export.jsx | dossier `src` | remplace (en-tête mis à jour, aucun changement de fonctionnement) |
| src | 00-config.jsx | dossier `src` | remplace |
| src | 06-icones-et-graphiques.jsx | dossier `src` | remplace |
| src | 07-constantes-metier.jsx | dossier `src` | remplace |
| src | 12-application-principale.jsx | dossier `src` | remplace |
| src | 38-administration-stock-et-sauvegardes.jsx | dossier `src` | remplace |
| src | 39-administration-module.jsx | dossier `src` | remplace |
| src | 50-secteurs-et-blocs.jsx | dossier `src` | remplace |

(4 fichiers de racine, 1 fichier `build`, 9 fichiers `src`, aucun script SQL.)

## Procédure pas à pas
### Étape 1 — Supabase
Rien à faire (pas de script SQL, pas d'Edge Function).

### Étape 2 — Les fichiers de la racine
Dépôt **compta-plus--test** → **Add file → Upload files** → glissez les 4 fichiers du dossier `racine` → **Commit changes**.

### Étape 2 bis — Le fichier du dossier `build`
Dossier **build** (à la racine du dépôt) → **Add file → Upload files** → glissez `build.mjs` → **Commit changes**.

### Étape 3 — Les fichiers du dossier `src`
Dossier **src** → **Add file → Upload files** → glissez les 9 fichiers du dossier `src` → **Commit changes**. Une construction démarre (25 à 40 minutes). Ne redéposez rien pendant ce temps.

### Étape 4 — Attendre le vert
Onglet **Actions** : « Construire le site » doit passer au **vert**. Si rouge : ne touchez à rien, copiez-moi le texte de l'étape en échec.

### Étape 5 — Vérifier sur le site de test
1. **Ctrl + Maj + R** (téléphone : fermez complètement puis rouvrez). Version en bas du menu : **20260830-269**.
2. Activez le secteur **Santé** pour votre entreprise de test (même endroit que pour Import-export). L'espace **Santé** apparaît.
3. Cabinet : créez un assureur (80 %), un praticien (50 %), un acte « Consultation » à 1 000, un patient rattaché à l'assureur. Facturez : la facture montre assureur 800 / patient 200. Encaissez 200, enregistrez un remboursement de 500, testez un rejet sans motif (refusé) puis avec motif.
4. Onglet Praticiens : honoraires à reverser 500 → versez-les.
5. Passez le type en **Pharmacie** : la liste de clients est vide (données séparées). Liez un produit du stock, vendez-en : le stock baisse. Ajoutez un lot périmé : il est signalé.
6. Passez en **Hôpital** : admettez un patient, entrez une date de sortie, « Sortie et facturation ».
7. Revenez en **Cabinet** : vos premières données sont intactes. Connecté en Consultant : tout est visible, rien ne se modifie.

## CE QUI RESTE DE VOTRE RESSORT
- Avant le **31 octobre 2026** : liste annuelle des versements. Lundi **26 octobre** : vérifier les e-mails de relance (Resend). **1–15 décembre** : acomptes provisionnels. **1–15 novembre** : retenues d'octobre.
- Relancer le script 1 (journal) sur TEST/PROD dans quelques jours ; garder le script 3.
- **Expert-comptable** : TCA et exonérations des actes de santé et des médicaments, rétrocession d'honoraires aux praticiens, traitement des rejets d'assureurs ; plus les points déjà notés (Éducation, Import-export).
- **Juriste** : confidentialité et protection des données personnelles des patients, accès du personnel d'accueil, conditions d'utilisation.
- Décisions déjà en attente : retour en arrière de la base (PITR), récupération 2FA, compte MonCash de production, prestataires de tests d'intrusion, règle « période clôturée », scénario de prix « Équilibré » à tester avec 5 à 10 entreprises cibles (grille B pour la Santé).
- Dites-moi **« v268 active sur PROD »** quand c'est fait, et **« v269 validée »** (ou vos remarques) après vos essais.
