# Compta+ v321 (TEST) — la 2FA affiche la vraie cause en cas d'échec

Changement : lorsque l'activation ou la vérification de la double authentification échoue, l'écran affiche, sous le message clair, une ligne « Référence : … » (code et message du service d'authentification). Rien d'autre ne change. Version : 20261105-321.

## Procédure (TEST)
1. Ouvrez votre dépôt GitHub (compta-plus--test) > dossier src.
2. Remplacez src/00-config.jsx et src/04-authentification.jsx par ceux du dossier src de ce zip (Add file > Upload files, même nom, Commit).
3. Déposez racine/tst-u57.cjs et racine/tst-lancer.mjs à la racine du dépôt (mêmes noms), Commit.
4. Attendez la fin du déploiement GitHub (onglet Actions : coche verte).
5. Ouvrez l'application, rechargez fortement, vérifiez la version 20261105-321 (en bas ou dans À propos).
6. Reproduisez l'activation de la 2FA ; si elle échoue, copiez-moi la ligne « Référence : … ».

## Ce qui reste de votre côté
1. Cette mise en ligne puis la ligne « Référence » ; fermer-acces-2.sql (TEST puis PROD) ; étape 16 (SQL + moncash) tests a–d puis PROD.
2. Pentest : relevés restants, TEST seulement.
3. Procédures 2FA/clôture, expert-comptable, fiscalité acomptes, juriste, pilotes, MonCash production, pentest externe/PITR.
