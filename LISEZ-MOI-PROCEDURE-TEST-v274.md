# Compta+ — version 274 — paquet TEST
**Facturation en cartes, onglet Relances (e-mail + WhatsApp), téléphone obligatoire à l'inscription.**

À faire sur le dépôt **compta-plus--test** uniquement. Le paquet PROD ne vous sera donné qu'après votre « v274 validée ».

**Prérequis** : la v273 est déposée sur TEST. **1 script SQL à exécuter AVANT de déposer les fichiers** (étape 1). **Aucune Edge Function à déployer** : l'envoi des e-mails utilise la fonction `send-offer-email` que vous avez déjà (avec Resend). Pas de changement du workflow.

## Ce qui change (pour vous)
1. **Super admin → Facturation** : tout est maintenant dans des **cartes** (indicateurs colorés, émission du mois, facture complémentaire, historique des factures avec pastilles d'état : À payer, En retard, Payée, Gratuite, Annulée). Plus rien directement sur le fond de l'application.
2. **Nouvel onglet « Relances »** (Super admin → Facturation → Relances) :
   - indicateurs : factures en retard, montant en retard, déjà relancées ;
   - pour chaque facture impayée : client, numéro, échéance, jours de retard, e-mail de l'administrateur, numéro WhatsApp, nombre de relances et date de la dernière ;
   - bouton **E-mail** : envoie le message tout de suite et note la relance ;
   - bouton **WhatsApp** : ouvre WhatsApp avec le numéro du client et le message déjà écrit ; vous appuyez sur envoyer (vous pouvez joindre une image, un audio, une vidéo) ; la relance est notée ;
   - bouton **E-mail à tous les retards** : envoie à tous ceux qui n'ont pas été relancés depuis 3 jours (jamais deux fois de suite le même jour) ;
   - filtre « En retard » ou « Toutes les factures à payer ».
3. **Messages de relance modifiables** (Réglages de facturation → carte « Messages de relance ») : objet et texte de l'e-mail, message WhatsApp. Mots remplacés automatiquement : {client} {numero} {montant} {echeance} {jours} {emetteur} {paiement}. Bouton « Remettre les messages d'origine ».
4. **Téléphone dès l'inscription** : l'écran de bienvenue demande maintenant le **téléphone WhatsApp** (obligatoire, avec l'indicatif ; 8 chiffres = Haïti, 509 ajouté automatiquement) et une case facultative « J'accepte de recevoir les nouveautés et offres de Compta+ sur WhatsApp ». Il est enregistré avec l'entreprise (et recopié dans les paramètres de l'entreprise). Il est aussi modifiable dans **Administration → Accès → Abonnement et factures → Vos coordonnées de contact**, et à chaque enregistrement des paramètres de l'entreprise.
5. **Nom sur la facture d'inscription** : le nom donné à l'inscription est provisoire ; la facture d'inscription suit désormais le vrai nom de l'entreprise (script SQL), et les anciennes sont remises à niveau.
6. **Écran client « Abonnement et factures »** présenté en cartes : résumé (nombre de factures, reste à payer, en retard), historique, coordonnées de contact.
7. Numéro de version : **20260830-274**.

## Fichiers du paquet (12 fichiers)
| Dossier du paquet | Fichier | Où le déposer | Action |
|---|---|---|---|
| supabase | relances-whatsapp.sql | **à copier dans Supabase** (étape 1), pas sur GitHub | **nouveau** |
| supabase | relances-whatsapp-RETOUR-ARRIERE.sql | **à garder de côté**, ne pas l'exécuter | **nouveau** (au cas où) |
| racine | tst-u24.cjs | à la racine du dépôt | **nouveau** (test de cette version) |
| racine | tst-p3.cjs | à la racine du dépôt | remplace (le téléphone est saisi à l'inscription) |
| racine | tst-p6.cjs | à la racine du dépôt | remplace (idem) |
| racine | tst-lancer.mjs | à la racine du dépôt | remplace |
| racine | CARTE-DES-MODULES.md | à la racine du dépôt | remplace |
| src | 56-facturation-abonnements.jsx | dossier `src` | remplace |
| src | 12-application-principale.jsx | dossier `src` | remplace |
| src | 39-administration-module.jsx | dossier `src` | remplace |
| src | 43-super-admin.jsx | dossier `src` | remplace |
| src | 00-config.jsx | dossier `src` | remplace |

(5 fichiers de racine, 5 fichiers `src`, 2 scripts SQL dont un seul à exécuter.)

## Procédure pas à pas
### Étape 1 — Supabase TEST (script SQL, à faire EN PREMIER)
1. Ouvrez **supabase.com** → votre projet **TEST** → menu de gauche **SQL Editor** → **New query**.
2. Ouvrez `supabase/relances-whatsapp.sql` (bloc-notes), **copiez tout**, collez dans l'éditeur, cliquez **Run**.
3. En bas, le tableau doit afficher **3 lignes avec le chiffre 3** (companies.phone 3, billing_invoices 3, billing_settings 3). Si ce n'est pas le cas, ne continuez pas : copiez-moi le résultat.
4. Ne lancez jamais le fichier RETOUR-ARRIERE (il supprime les téléphones et le suivi des relances).

### Étape 2 — Edge Function
**Rien à faire** : la fonction `send-offer-email` existe déjà sur TEST et PROD (celle qui envoie les offres avec Resend). Si l'envoi d'e-mail échoue dans l'onglet Relances avec « RESEND_API_KEY non configurée », il faut refaire le réglage du secret `RESEND_API_KEY` sur ce projet (dites-le-moi, je détaille).

### Étape 3 — Les fichiers de la racine
Dépôt **compta-plus--test** → **Add file → Upload files** → glissez les 5 fichiers du dossier `racine` → **Commit changes**.

### Étape 4 — Les fichiers du dossier `src`
Dossier **src** → **Add file → Upload files** → glissez les 5 fichiers du dossier `src` → **Commit changes**. Une construction démarre (25 à 40 minutes). Ne redéposez rien pendant ce temps.

### Étape 5 — Attendre le vert
Onglet **Actions** : « Construire le site » doit passer au **vert**. Si rouge : ne touchez à rien, copiez-moi le texte de l'étape en échec.

### Étape 6 — Vérifier sur le site de test
1. **Ctrl + Maj + R** (téléphone : fermez complètement puis rouvrez). Version en bas du menu : **20260830-274**.
2. Super admin → Facturation : cartes colorées, historique dans une carte.
3. **Réglages de facturation** : vérifiez la carte « Messages de relance », cliquez **Enregistrer les réglages**.
4. Entreprise de test → **Administration → Accès → Abonnement et factures** → « Vos coordonnées de contact » : saisissez **votre numéro WhatsApp** (avec 509 ou 8 chiffres) → **Enregistrer**.
5. Super admin → Facturation → **Relances** : s'il n'y a aucune facture en retard, créez-en une : dans l'historique, il faut une facture « À payer » dont l'échéance est passée (par exemple en émettant avec une date d'émission de plus de 15 jours dans le passé). Cliquez **WhatsApp** : WhatsApp s'ouvre avec votre numéro et le message ; cliquez **E-mail** : un e-mail part vers l'administrateur de l'entreprise (utilisez une entreprise dont l'administrateur est vous, pour le recevoir).
6. Créez un compte neuf : l'écran de bienvenue demande le **téléphone WhatsApp**.

## Limites (à savoir)
- Le message WhatsApp n'est **pas envoyé automatiquement** : WhatsApp s'ouvre, vous appuyez sur envoyer. L'envoi 100 % automatique demande l'API officielle de Meta (compte vérifié) : possible plus tard.
- Les relances ne partent pas toutes seules : vous cliquez (un clic pour tous les e-mails en retard). Une planification automatique viendra avec l'étape suivante.
- L'e-mail n'a pas la facture en pièce jointe : il indique où la retrouver (Administration → Accès → Abonnement et factures).
- Pour les entreprises Extension créées sans entreprise (groupe seul), le téléphone saisi est retenu et proposé dans « Vos coordonnées de contact » : il faut cliquer Enregistrer une fois l'entreprise créée.

## CE QUI RESTE DE VOTRE RESSORT
- Exécuter le script SQL sur Supabase **TEST** (étape 1), déposer les fichiers, tester, puis dire **« v274 validée »** (ou vos remarques). Le même script devra passer sur Supabase **PROD** avec le paquet PROD.
- Dire **« v271 active sur PROD »** si c'est fait.
- Renseigner vos réglages de facturation (logo, NIF, coordonnées, comment payer) et relire les messages de relance.
- **Compte WhatsApp Business dédié à Compta+** : installer l'application *WhatsApp Business* (gratuite) sur un téléphone avec un numéro dédié (pas votre numéro personnel), créer le profil (nom, logo, description, horaires, site), activer le **message d'accueil**, les **réponses rapides** et le **catalogue** (voir ma réponse). C'est ce compte qui recevra les messages ouverts par le bouton WhatsApp.
- Avant le **31 octobre 2026** : liste annuelle des versements. Lundi **26 octobre** : vérifier les e-mails de relance (Resend). **1–15 novembre** : retenues d'octobre. **1–15 décembre** : acomptes provisionnels.
- Expert-comptable : TCA sur les abonnements, numérotation et mentions obligatoires des factures. Juriste : conditions d'utilisation (consentement WhatsApp, protection des données).
- Décisions en attente : retour en arrière de la base (PITR), récupération 2FA, compte MonCash de production, tests d'intrusion, règle « période clôturée », scénario de prix « Équilibré ».
