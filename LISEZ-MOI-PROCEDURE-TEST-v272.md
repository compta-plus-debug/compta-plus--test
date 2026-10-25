# Compta+ — version 272 — paquet TEST
**Facturation des abonnements : Compta+ facture ses clients** (inscription à 0 pendant l'essai, puis facture mensuelle selon le forfait et les blocs d'activité, avec TCA en option).

À faire sur le dépôt **compta-plus--test** et sur **Supabase de TEST** uniquement. Le paquet PROD ne vous sera donné qu'après votre « v272 validée ».

**Prérequis** : la v271 est déposée sur TEST. **1 script SQL à exécuter AVANT de déposer les fichiers** (étape 1). Aucune Edge Function dans ce paquet. Pas de changement du workflow.

## Ce qui change (pour vous)
1. **Facture d'inscription à 0** : dès qu'une entreprise est créée (période d'essai), la base émet automatiquement une facture n° FA-AAAA-000001, montant 0, « Inscription — période d'essai gratuite jusqu'au… ». Les entreprises déjà existantes reçoivent la leur lors de la première émission du Super admin.
2. **Facture mensuelle** : dans **Super Admin → Facturation → Factures**, le bouton **« Émettre les factures du mois »** crée une facture par entreprise payante (et une seule par groupe Extension, au nom du groupe). Jamais en double pour le même mois ; on peut relancer sans risque.
   - **Forfait** : Standard 20 $, Assisté 80 $, Extension 350 $ (modifiables dans les réglages).
   - **Suppléments** (forfait Standard seulement ; Assisté et Extension incluent les blocs) : pack « 3 secteurs » 12 $, ou bloc par bloc selon la grille : A 8 $, B 5 $, C 3 $.
   - **Prorata** : la première facture payante court à partir du lendemain de la fin de l'essai, au prorata des jours restants du mois.
   - **Changement en cours de mois** : bouton **« Facture complémentaire »** : la hausse est facturée au prorata des jours restants ; une baisse s'applique au mois suivant (pas d'avoir).
3. **Monnaie et TCA** : prix en dollars, **facture établie en gourdes au taux affiché** (taux saisi ou « Taux du jour »). **TCA optionnelle** : désactivée par défaut, taux 10 % modifiable, activable dans les réglages ou à chaque émission.
4. **La facture** (aperçu, impression, PDF par « Imprimer ») : logo, nom et coordonnées de Compta+, NIF, numéro, date, échéance (15 jours), période, client, détail ligne par ligne (forfait et chaque bloc), sous-total en dollars, taux de conversion, sous-total en gourdes, TCA si activée, total à payer en gourdes, comment payer, puis le **mot de remerciement**.
5. **Paiements** : **« Enregistrer le paiement »** (MonCash, carte, virement ou espèces, référence, date). Une facture se corrige par **annulation avec motif obligatoire**, jamais par effacement. Une facture non payée au-delà de 15 jours est marquée **« En retard »** (aussi chez le client).
6. **Réglages de facturation** (Super Admin → Facturation → Réglages) : logo, émetteur, remerciement, comment payer, prix, taux de change, TCA.
7. **Chez le client** : **Administration → Accès → Abonnement et factures** (administrateur) : liste de ses factures, alerte de retard, voir et imprimer.
8. Numéro de version : **20260830-272**.

**Pas encore dans cette version** (prévu ensuite) : l'**envoi des factures et des rappels par e-mail** (il demande une Edge Function Supabase) et le **lien de paiement MonCash** (il demande votre compte MonCash de production). En attendant, vous enregistrez les paiements vous-même et vous imprimez ou envoyez les factures en PDF.

## Fichiers du paquet (9 fichiers)
| Dossier du paquet | Fichier | Où le déposer | Action |
|---|---|---|---|
| supabase | facturation-abonnements.sql | **à copier dans Supabase** (étape 1), pas sur GitHub | **nouveau** |
| supabase | facturation-abonnements-RETOUR-ARRIERE.sql | **à garder de côté**, ne pas l'exécuter | **nouveau** (au cas où ; supprime les factures) |
| racine | tst-u23.cjs | à la racine du dépôt | **nouveau** (test de cette version) |
| racine | tst-lancer.mjs | à la racine du dépôt | remplace |
| racine | CARTE-DES-MODULES.md | à la racine du dépôt | remplace |
| src | 56-facturation-abonnements.jsx | dossier `src` | **nouveau** |
| src | 00-config.jsx | dossier `src` | remplace |
| src | 39-administration-module.jsx | dossier `src` | remplace |
| src | 43-super-admin.jsx | dossier `src` | remplace |
| src | 50-secteurs-et-blocs.jsx | dossier `src` | remplace (une seule ligne d'en-tête change ; **indispensable**, sinon la construction est bloquée) |

(3 fichiers de racine, 5 fichiers `src`, 2 scripts SQL dont un seul à exécuter.)

## Procédure pas à pas
### Étape 1 — Supabase TEST (script SQL, à faire EN PREMIER)
1. Ouvrez votre projet Supabase **de TEST** → menu de gauche **SQL Editor** → **New query**.
2. Ouvrez `supabase/facturation-abonnements.sql` du paquet, **copiez tout son contenu** et collez-le dans l'éditeur.
3. Cliquez **Run**. Résultat attendu : « Success » puis un tableau d'une ligne (id 1, issuer_name Compta+, vat_enabled false, vat_rate 10, les prix). Sinon, copiez-moi le message.
4. Le script peut être rejoué sans risque. Ne lancez pas le fichier `RETOUR-ARRIERE`. **Aucune Edge Function.**

### Étape 2 — Les fichiers de la racine
Dépôt **compta-plus--test** → **Add file → Upload files** → glissez les 3 fichiers du dossier `racine` → **Commit changes**.

### Étape 3 — Les fichiers du dossier `src`
Dossier **src** → **Add file → Upload files** → glissez les 5 fichiers du dossier `src` → **Commit changes**. Une construction démarre (25 à 40 minutes). Ne redéposez rien pendant ce temps.

### Étape 4 — Attendre le vert
Onglet **Actions** : « Construire le site » doit passer au **vert**. Si rouge : ne touchez à rien, copiez-moi le texte de l'étape en échec.

### Étape 5 — Vérifier sur le site de test
1. **Ctrl + Maj + R** (téléphone : fermez complètement puis rouvrez). Version en bas du menu : **20260830-272**.
2. **Super Admin → Facturation → Réglages de facturation** : saisissez votre nom, adresse, NIF, logo, mot de remerciement, « comment payer », vérifiez les prix, cliquez **Taux du jour** (ou saisissez le taux), **Enregistrer**.
3. **Facturation → Factures** : contrôlez la date et le taux, puis **Émettre les factures du mois**. Vérifiez une facture : **Voir / Imprimer** (logo en haut, remerciement en bas).
4. Créez une nouvelle entreprise de test : une facture d'inscription à 0 apparaît automatiquement (si ce n'est pas le cas, relancez « Émettre » : elle sera créée).
5. **Enregistrer le paiement** d'une facture ; **Annuler** une facture avec un motif ; cochez la **TCA** pour une émission de test.
6. Connecté en administrateur d'une entreprise cliente : **Administration → Accès → Abonnement et factures** : ses factures s'affichent et s'impriment.

## CE QUI RESTE DE VOTRE RESSORT
- **Avant de déposer** : exécuter le script SQL sur Supabase TEST (étape 1). Il devra aussi être exécuté sur Supabase PROD au moment du paquet PROD.
- Valider la v272 sur TEST : « v272 validée » ou vos remarques. Me dire « v271 active sur PROD » si ce n'est pas déjà fait.
- Renseigner vos réglages de facturation (logo, NIF, coordonnées, comment payer).
- **Expert-comptable** : TCA sur vos abonnements, numérotation et conservation des factures, mentions légales obligatoires sur une facture haïtienne.
- **Compte MonCash de production** : nécessaire pour le lien de paiement (étape suivante), avec l'envoi des factures et rappels par e-mail (Edge Function).
- Avant le **31 octobre 2026** : liste annuelle des versements. Lundi **26 octobre** : vérifier les e-mails de relance Resend. **1–15 novembre** : retenues d'octobre. **1–15 décembre** : acomptes provisionnels.
- Relancer le script 1 (journal) sur TEST/PROD ; garder le script 3.
- Autres points en attente : retour en arrière de la base (PITR), récupération 2FA, prestataires de tests d'intrusion, règle « période clôturée », scénario de prix « Équilibré » (grille B pour la Santé), juriste (données des patients, accès de l'accueil).
