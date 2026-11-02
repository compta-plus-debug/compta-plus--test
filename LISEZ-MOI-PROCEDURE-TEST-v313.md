# Compta+ — version 313 — paquet TEST
À déposer sur **compta-plus--test** uniquement. **Prérequis : la v310 est active sur TEST** (ce paquet remplace aussi les petits paquets v311 et v312). Aucun script SQL. Numéro de version : **20261102-313**.

**Contenu** : (1) **nouveau bloc Services et prestations** (sécurité privée, clubs et événementiel, coiffure et beauté, nettoyage, conseil, réparation, autres) : catalogue, clients, factures au comptant ou à crédit, taxe facultative, encaissements, contrats mensuels facturés en un clic, dépenses, rapports, créances âgées, assistant ; (2) **mention « ne remplace pas un expert-comptable »** sur Rapports, clôture, déclarations TCA et IR, PDF ; (3) **phrase sur le socle Commerce** à l'écran de choix des secteurs ; (4) cartes sans débordement sur petit écran, exports Excel sans formule exécutable, montants démesurés refusés (rappel v311–v312).

## Fichiers (27)
| Dossier | Fichiers | Où les déposer |
|---|---|---|
| racine | CARTE-DES-MODULES.md, tst-lancer.mjs, tst-n1.cjs, tst-u44.cjs, **tst-u45.cjs** | à la racine du dépôt (remplace) |
| build | build.mjs | dossier `build` (remplace) |
| src | **index.modele.html**, 00-config, 06-icones-et-graphiques, 07-constantes-metier, 10-formatage-impression-et-pdf, 12-application-principale, 17-compta-assistant-de-controle, 18-compta-revision-et-cloture, 24-achats, 28-declarations-fiscales, 33-gestion-reprise-et-rapports, 34-gestion-module, 35-rapports-et-bilans, 38-administration-stock-et-sauvegardes, 39-administration-module, 50-secteurs-et-blocs, 56-facturation-abonnements, 57-assistant-blocs, 60-ecoles-socle, 66-ong, **67-services** (tous en `.jsx` sauf index.modele.html) | dossier `src` (remplace) |

## Procédure pas à pas
1. Dépôt **compta-plus--test** → **Add file → Upload files** → les 5 fichiers de `racine` → **Commit changes**.
2. Dossier **build** → **Add file → Upload files** → `build.mjs` → **Commit changes**.
3. Dossier **src** → **Add file → Upload files** → les 21 fichiers → **Commit changes**. Attendre 25 à 40 minutes ; **Actions** → « Construire le site » au **vert** (sinon copiez-moi les lignes ÉCHEC / FAIL).
4. Vérifier : **Ctrl + Maj + R**, version **20261102-313** ; Administration → Secteurs → **Services et prestations** ; suivre `CAS-PRATIQUE-SERVICES-pas-a-pas.md` ; ouvrir Rapports et analyse (encadré expert-comptable) ; sur téléphone, les cartes gardent leurs montants.

## CE QUI RESTE DE VOTRE RESSORT
- Déposer, attendre le vert, tester avec le cas pratique, me dire « v313 validée sur TEST » ou décrire par écrit le problème et l'écran.
- Adopter les deux procédures (2FA et clôture) ; expert-comptable, fiscalité, DGI, juriste, contrôles de sécurité gratuits : voir la liste complète dans le paquet PROD v313 et dans mon message.
