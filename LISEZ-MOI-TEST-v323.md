# Compta+ v323 (TEST) — captcha hCaptcha à la connexion

Cette version AJOUTE le captcha mais le laisse DÉSACTIVÉ (clé vide) : rien ne change tant que vous n'avez pas fait l'ÉTAPE 2. Version : 20261105-323.
Ce qui est inclus : case hCaptcha sur l'écran de connexion (lien magique), jeton transmis à Supabase, case remise à zéro après un échec, autorisations de sécurité (CSP) pour hcaptcha.com, test automatique u58.

## ÉTAPE 1 — Mettre la version en ligne (TEST)
1. GitHub, dépôt compta-plus--test > dossier src : remplacez 00-config.jsx, 04-authentification.jsx et index.modele.html par ceux du dossier src de ce zip (Add file > Upload files, mêmes noms, Commit).
2. À la racine du dépôt : remplacez tst-u58.cjs (nouveau), tst-lancer.mjs, tst-fake.js. Commit.
3. Onglet Actions : attendez la coche verte. Rechargez fortement l'application : version 20261105-323. La connexion fonctionne comme avant (pas de case).

## ÉTAPE 2 — Activer le captcha (TEST) — dans CET ordre, jamais l'inverse
1. Sur hcaptcha.com > votre compte > Sites : ouvrez votre site (ou créez-en un) et vérifiez que la liste des domaines contient compta-plus-debug.github.io. Copiez la « Sitekey » (clé PUBLIQUE, ce n'est pas le secret).
2. GitHub, dépôt compta-plus--test > src/00-config.jsx > icône crayon : trouvez la ligne
   const HCAPTCHA_SITEKEY = "";
   et collez la clé entre les guillemets. Commit, attendez la coche verte, rechargez. La case « Je suis un humain » apparaît sur l'écran de connexion.
3. SEULEMENT ENSUITE, Supabase TEST (compta-plus-debug's-test Project) > Authentication > Attack Protection : activez « Enable Captcha protection », fournisseur hCaptcha, collez le « Secret » hCaptcha (clé SECRÈTE : ne me l'envoyez pas), Save changes.
4. Essai : écran de connexion, cochez la case, demandez le lien : il arrive.
5. SI LA CONNEXION EST BLOQUÉE : désactivez le bouton Captcha dans Supabase (étape 3 inversée), tout revient à la normale ; envoyez-moi le message affiché.

## Ce qui reste de votre côté
1. Étape 1 puis étape 2 sur TEST, validation, puis PROD.
2. fermer-acces-2.sql, étape 16 (SQL + moncash), v322 (2FA) si pas encore en ligne.
3. Pentest TEST : exports 1.3 et comptes 1.4. Procédures 2FA/clôture, expert-comptable, acomptes, juriste, pilotes, MonCash production, pentest externe/PITR.
