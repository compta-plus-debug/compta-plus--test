# Compta+ — version 275 — paquet TEST
**WhatsApp sans facture : écrire à un client, promotions pour les clients qui ont accepté, bouton WhatsApp sur chaque entreprise.**

À faire sur le dépôt **compta-plus--test** uniquement. Le paquet PROD ne vous sera donné qu'après votre « v275 validée ».

**Prérequis** : la v274 est déposée sur TEST (avec son script SQL déjà exécuté). **Aucun script SQL, aucune Edge Function** dans ce paquet. Pas de changement du workflow.

## Ce qui change (pour vous)
1. **Super admin → Facturation → Relances** :
   - quand aucune facture n'est en retard, un texte explique que les boutons E-mail et WhatsApp apparaissent sur chaque facture en retard, et renvoie vers la carte suivante ;
   - nouvelle carte **« Écrire à un client sur WhatsApp »** : choisir l'entreprise, un modèle (Prendre contact, Nouveauté, Offre), modifier le texte si besoin, **Ouvrir WhatsApp** (le nom du client et le nom de l'émetteur sont remplacés automatiquement). Refus clair si l'entreprise n'a pas de numéro ;
   - nouvelle carte **« Promotions »** : liste uniquement les entreprises qui ont **coché l'accord WhatsApp** et qui ont un numéro valide ; un message commun modifiable ; un bouton WhatsApp par entreprise ; la ligne se marque « Ouvert ✓ » et le compteur « restant(s) » baisse. (Le marquage « Ouvert » vaut pour la session en cours.)
2. **Super admin → Activité et finances → Entreprises** : dans la fiche dépliée de chaque entreprise, un bouton vert **WhatsApp** ouvre la conversation avec son numéro.
3. Numéro de version : **20260830-275**.

## Fichiers du paquet (6 fichiers)
| Dossier du paquet | Fichier | Où le déposer | Action |
|---|---|---|---|
| racine | tst-u25.cjs | à la racine du dépôt | **nouveau** (test de cette version) |
| racine | tst-lancer.mjs | à la racine du dépôt | remplace |
| racine | CARTE-DES-MODULES.md | à la racine du dépôt | remplace |
| src | 56-facturation-abonnements.jsx | dossier `src` | remplace |
| src | 43-super-admin.jsx | dossier `src` | remplace |
| src | 00-config.jsx | dossier `src` | remplace |

(3 fichiers de racine, 3 fichiers `src`, aucun script SQL.)

## Procédure pas à pas
### Étape 1 — Supabase
Rien à faire (pas de script SQL, pas d'Edge Function).

### Étape 2 — Les fichiers de la racine
Dépôt **compta-plus--test** → **Add file → Upload files** → glissez les 3 fichiers du dossier `racine` → **Commit changes**.

### Étape 3 — Les fichiers du dossier `src`
Dossier **src** → **Add file → Upload files** → glissez les 3 fichiers → **Commit changes**. Une construction démarre (25 à 40 minutes). Ne redéposez rien pendant ce temps.

### Étape 4 — Attendre le vert
Onglet **Actions** : « Construire le site » doit passer au **vert**. Si rouge : copiez-moi les lignes **ÉCHEC / FAIL** de l'étape en échec.

### Étape 5 — Vérifier sur le site de test
1. **Ctrl + Maj + R**. Version en bas du menu : **20260830-275**.
2. Super admin → Facturation → **Relances** : faites défiler : cartes « Écrire à un client sur WhatsApp » et « Promotions ».
3. Choisissez une entreprise dont vous avez saisi le numéro (Administration → Accès → Abonnement et factures → Vos coordonnées de contact), un modèle, **Ouvrir WhatsApp** : WhatsApp s'ouvre avec le message.
4. Pour voir la carte Promotions remplie : sur une entreprise de test, cochez l'accord WhatsApp et enregistrez un numéro (même écran de coordonnées).
5. Super admin → Entreprises → dépliez une entreprise : bouton **WhatsApp**.

## Limites (à savoir)
- Rien n'est envoyé automatiquement : WhatsApp s'ouvre, vous appuyez sur envoyer (et pouvez joindre image, audio, vidéo).
- Le marquage « Ouvert ✓ » des promotions n'est pas conservé après rechargement de la page (un suivi durable demanderait un petit script SQL ; dites-le-moi si vous le voulez).
- Les promotions n'atteignent que les clients qui ont donné leur accord : c'est volontaire (règle WhatsApp, évite le blocage du numéro).

## CE QUI RESTE DE VOTRE RESSORT
- Déposer le paquet, attendre le vert, tester, puis **« v275 validée »** (ou vos remarques). Dites aussi **« v274 validée »** si ce n'est pas encore fait (la v275 s'appuie dessus) et **« v271 active sur PROD »** si c'est fait.
- Compte **WhatsApp Business** dédié (application WhatsApp Business, numéro dédié, profil, message d'accueil, réponses rapides, catalogue).
- Relire les messages de relance, renseigner les réglages de facturation (logo, NIF, comment payer).
- Rappel : le script SQL de la v274 (`relances-whatsapp.sql`) devra aussi être exécuté sur Supabase **PROD** avec le paquet PROD.
- Avant le **31 octobre 2026** : liste annuelle des versements. Lundi **26 octobre** : vérifier les e-mails de relance (Resend). **1–15 novembre** : retenues d'octobre. **1–15 décembre** : acomptes provisionnels.
- Expert-comptable : TCA sur les abonnements, mentions des factures. Juriste : conditions d'utilisation (consentement WhatsApp, protection des données).
- Décisions en attente : retour en arrière de la base (PITR), récupération 2FA, compte MonCash de production, tests d'intrusion, règle « période clôturée », scénario de prix « Équilibré ».
