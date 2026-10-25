# Compta+ — version 273 — paquet TEST (correctif de la facturation)

À faire sur le dépôt **compta-plus--test** uniquement. **Prérequis : la v272 est déposée (avec le fichier 50).**

## Ce qui est corrigé
1. **Nom du client sur la facture.** Une facture d'un groupe Extension prenait le nom du groupe (ou d'une autre entreprise du groupe). Elle porte maintenant toujours **le nom de l'entreprise à laquelle elle est rattachée** ; la ligne du forfait rappelle « groupe « … » : entreprises couvertes ». La facture complémentaire suit la même règle.
2. **Écran « Abonnement et factures » de l'entreprise** : chaque facture est une carte qui s'adapte à la largeur de l'écran (plus de données coupées ou débordantes, téléphone compris).
3. Numéro de version : **20260830-273**.

## Fichiers du paquet (4 fichiers)
| Dossier du paquet | Fichier | Où le déposer | Action |
|---|---|---|---|
| racine | tst-u23.cjs | à la racine du dépôt | remplace |
| racine | CARTE-DES-MODULES.md | à la racine du dépôt | remplace |
| src | 56-facturation-abonnements.jsx | dossier `src` | remplace |
| src | 00-config.jsx | dossier `src` | remplace |

Aucun script SQL, aucune Edge Function, aucun changement du workflow.

## Procédure pas à pas
**Étape 1 — Supabase** : rien à faire.

**Étape 2 — Racine** : dépôt **compta-plus--test** → **Add file → Upload files** → glissez les 2 fichiers du dossier `racine` → **Commit changes**.

**Étape 3 — Dossier `src`** : dossier **src** → **Add file → Upload files** → glissez les 2 fichiers → **Commit changes**. Une construction démarre (25 à 40 minutes). Ne redéposez rien pendant ce temps.

**Étape 4 — Attendre le vert** : onglet **Actions**, « Construire le site » doit passer au vert. Si rouge : ne touchez à rien, copiez-moi le texte de l'étape en échec.

**Étape 5 — Vérifier**
1. **Ctrl + Maj + R**. Version en bas du menu : **20260830-273**.
2. Les factures déjà émises **gardent leur ancien nom** (elles ne sont pas réécrites). Pour les refaire : Super admin → Facturation → facture fautive → **Annuler** (motif : « mauvais nom client »), puis **Émettre les factures du mois** : la nouvelle est créée avec le bon nom, au même mois.
3. Vérifiez que la facture de « Le Maître inc. » porte « Facturé à : Le Maître inc. ».
4. Entreprise → Administration → Accès → **Abonnement et factures** : les cartes tiennent dans l'écran (ordinateur et téléphone).

## CE QUI RESTE DE VOTRE RESSORT
- Faire les étapes ci-dessus, puis dire « v273 validée » (ou vos remarques) ; dire aussi « v271 active sur PROD » si c'est fait.
- Renseigner les réglages de facturation (logo, NIF, coordonnées, comment payer).
- Relance e-mail et WhatsApp (voir mon message) : me dire si je commence par l'étape 1 ; décider de créer le compte WhatsApp Business (démarches chez Meta).
- Avant le **31 octobre 2026** : liste annuelle des versements. Lundi **26 octobre** : vérifier les e-mails de relance (Resend). **1–15 novembre** : retenues d'octobre. **1–15 décembre** : acomptes provisionnels.
- Expert-comptable : TCA sur les abonnements, numérotation et mentions obligatoires des factures.
- Décisions en attente : retour en arrière de la base (PITR), récupération 2FA, compte MonCash de production, tests d'intrusion, règle « période clôturée », scénario de prix « Équilibré ».
