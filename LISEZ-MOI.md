# Compta+ v250 — complément pour le dépôt TEST
Le dernier échec est un oubli de fichiers de test, pas un défaut de l'application : la série de contrôles cherche `tst-u3.cjs` (livré avec la v249) et ne le trouve pas à la racine du dépôt **compta-plus--test**. Les 33 séries précédentes ont réussi.

## À faire
1. Page d'accueil du dépôt **compta-plus--test** → **Add file → Upload files**.
2. Glissez les 5 fichiers de ce dossier (à la racine, pas dans `src`) : `tst-u3.cjs`, `tst-u4.cjs`, `tst-u5.cjs`, `tst-fake.js`, `tst-lancer.mjs`.
3. **Commit changes**, puis attendez le vert dans l'onglet Actions (une seule construction, ne redéposez rien pendant ce temps).
4. Dites-moi le résultat (vert ou rouge avec le texte de l'étape en échec).

Les fichiers de `src` de la v250 sont déjà sur le dépôt : ne les redéposez pas.
