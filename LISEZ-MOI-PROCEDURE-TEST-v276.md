# Compta+ — version 276 — paquet TEST
**Émission de facture : choix de l'entreprise à facturer.**

À faire sur le dépôt **compta-plus--test** uniquement. Le paquet PROD ne vous sera donné qu'après votre « v276 validée ».

**Prérequis** : la v275 est déposée sur TEST. **Aucun script SQL, aucune Edge Function.** Pas de changement du workflow.

## Ce qui change (pour vous)
Super admin → Facturation → Factures → carte **« Émettre les factures du mois »** :
1. Nouveau sélecteur **« Entreprise à facturer »** : par défaut « Toutes les entreprises payantes » (comme avant) ; ou une entreprise précise. Les entreprises en essai sont repérées « (essai) ».
2. Avec une entreprise choisie, le bouton devient **« Émettre la facture de cette entreprise »** et la confirmation rappelle son nom.
3. Règles :
   - entreprise payante : sa facture du mois est émise (jamais en double) ;
   - entreprise en essai ou suspendue : pas de facture mensuelle ; seule sa facture d'inscription à 0 est créée si elle manque, puis un message explique que la première facture sera émise à son passage en forfait payant ;
   - entreprise d'un groupe Extension : la facture du groupe (350 $) est émise une seule fois, au nom de l'entreprise la plus ancienne du groupe, avec le groupe et les entreprises couvertes cités sur la ligne.
4. Numéro de version : **20260830-276**.

## Fichiers du paquet (5 fichiers)
| Dossier du paquet | Fichier | Où le déposer | Action |
|---|---|---|---|
| racine | tst-u26.cjs | à la racine du dépôt | **nouveau** (test de cette version) |
| racine | tst-lancer.mjs | à la racine du dépôt | remplace |
| racine | CARTE-DES-MODULES.md | à la racine du dépôt | remplace |
| src | 56-facturation-abonnements.jsx | dossier `src` | remplace |
| src | 00-config.jsx | dossier `src` | remplace |

(3 fichiers de racine, 2 fichiers `src`, aucun script SQL.)

## Procédure pas à pas
### Étape 1 — Supabase
Rien à faire (pas de script SQL, pas d'Edge Function).

### Étape 2 — Les fichiers de la racine
Dépôt **compta-plus--test** → **Add file → Upload files** → glissez les 3 fichiers du dossier `racine` → **Commit changes**.

### Étape 3 — Les fichiers du dossier `src`
Dossier **src** → **Add file → Upload files** → glissez les 2 fichiers → **Commit changes**. Une construction démarre (25 à 40 minutes). Ne redéposez rien pendant ce temps.

### Étape 4 — Attendre le vert
Onglet **Actions** : « Construire le site » doit passer au **vert**. Si rouge : copiez-moi les lignes **ÉCHEC / FAIL** de l'étape en échec.

### Étape 5 — Vérifier sur le site de test
1. **Ctrl + Maj + R**. Version en bas du menu : **20260830-276**.
2. Super admin → Facturation → Factures : le sélecteur « Entreprise à facturer » est dans la carte, avec la date et le taux.
3. Choisissez **Le Maître inc.** → **Émettre la facture de cette entreprise** : une seule facture est créée, au nom de Le Maître inc.
4. Choisissez une entreprise en essai : un message explique pourquoi il n'y a pas de facture mensuelle.
5. Remettez « Toutes les entreprises payantes » : le bouton redevient « Émettre les factures du mois ».

## CE QUI RESTE DE VOTRE RESSORT
- Déposer le paquet, attendre le vert, tester, puis **« v276 validée »** (ou vos remarques). Dites aussi **« v274 validée »** et **« v275 validée »** si ce n'est pas encore fait, et **« v271 active sur PROD »** si c'est fait.
- Le script SQL de la v274 (`relances-whatsapp.sql`) devra aussi passer sur Supabase **PROD** avec le paquet PROD, ainsi que le script de facturation de la v272.
- Compte **WhatsApp Business** dédié ; relire les messages de relance ; renseigner les réglages de facturation (logo, NIF, comment payer).
- Avant le **31 octobre 2026** : liste annuelle des versements. Lundi **26 octobre** : vérifier les e-mails de relance (Resend). **1–15 novembre** : retenues d'octobre. **1–15 décembre** : acomptes provisionnels.
- Expert-comptable : TCA sur les abonnements, mentions des factures. Juriste : conditions d'utilisation (consentement WhatsApp, données).
- Décisions en attente : retour en arrière de la base (PITR), récupération 2FA, compte MonCash de production, tests d'intrusion, règle « période clôturée », scénario de prix « Équilibré ».
