# Compta+ v274 — correctif du test automatique (1 fichier)

**Pourquoi** : la construction #99 a échoué sur un seul contrôle de mon test `tst-u24.cjs` (un message temporaire qui disparaît vite sur le serveur de construction, plus lent). **L'application n'est pas en cause** : 55 tests sur 56 réussissaient. Le test attend maintenant le message plus patiemment.

**Prérequis** : les autres fichiers de la v274 sont déjà déposés (c'est le cas). Aucun script SQL, aucune Edge Function, aucun changement du workflow. La version reste **20260830-274**.

## Fichier (1)
| Dossier du paquet | Fichier | Où le déposer | Action |
|---|---|---|---|
| racine | tst-u24.cjs | à la racine du dépôt **compta-plus--test** | remplace |

## Procédure pas à pas
1. Dépôt **compta-plus--test** → **Add file → Upload files** → glissez `tst-u24.cjs` (dossier `racine` du zip) → **Commit changes**.
2. Onglet **Actions** : attendez que « Construire le site » passe au **vert** (environ 30 minutes ; ne redéposez rien pendant ce temps).
3. Si rouge : copiez-moi les lignes **ÉCHEC / FAIL**.
4. Une fois vert : poursuivez les vérifications de l'étape 6 du LISEZ-MOI de la v274 (si le script SQL n'est pas encore passé sur Supabase TEST, exécutez-le d'abord).

## CE QUI RESTE DE VOTRE RESSORT
- Déposer ce fichier, attendre le vert, puis « v274 validée » (ou vos remarques) ; dire « v271 active sur PROD » si c'est fait.
- Script SQL `relances-whatsapp.sql` sur Supabase TEST (puis PROD avec le paquet PROD).
- Compte WhatsApp Business dédié (application WhatsApp Business, numéro dédié), messages de relance et réglages de facturation à relire.
- Échéances : liste annuelle des versements avant le **31 octobre** ; lundi **26 octobre** e-mails de relance (Resend) ; **1–15 novembre** retenues d'octobre ; **1–15 décembre** acomptes provisionnels.
- Expert-comptable (TCA sur les abonnements, mentions des factures), juriste (consentement WhatsApp, données), décisions en attente (PITR, 2FA, MonCash production, tests d'intrusion, période clôturée, prix « Équilibré »).
