# PerlerWyveth

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.9.
Access: [Site](https://perlerwyveth.web.app/)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Notifications des messages de contact

Lorsqu'un document est créé dans la collection Firestore `contacts`, la fonction Firebase `notifyOnContactCreated` envoie un e-mail depuis et vers `wyveth.pro@gmail.com` avec les informations du formulaire. Si l'adresse du visiteur est valide, elle est utilisée comme adresse de réponse. Le contact reste enregistré même si l'e-mail échoue.

### Configuration et déploiement

1. Activez le forfait **Blaze** pour le projet Firebase `perlerwyveth`. Firebase et les services Google Cloud utilisés peuvent occasionner des frais selon l'utilisation.
2. Activez la validation en deux étapes sur le compte Google `wyveth.pro@gmail.com`, puis créez un [mot de passe d'application](https://support.google.com/accounts/answer/185833). Il s'agit d'un mot de passe distinct du mot de passe habituel. Ne l'ajoutez jamais au dépôt et ne le partagez pas.
3. Installez les dépendances des fonctions avec Node.js 22 :

   ```sh
   npm --prefix functions install
   ```

4. Avec la CLI Firebase connectée à un compte autorisé sur le projet, créez le secret. La commande demande le mot de passe d'application de manière interactive :

   ```sh
   firebase functions:secrets:set GMAIL_APP_PASSWORD --project perlerwyveth
   ```

5. Déployez la fonction :

   ```sh
   firebase deploy --only functions:notifyOnContactCreated --project perlerwyveth
   ```

6. Envoyez un message depuis le formulaire du site et vérifiez sa présence dans l'administration et dans la boîte Gmail (y compris les indésirables). La notification ne fonctionne qu'après la configuration du secret et le déploiement.

En cas d'échec, consultez les journaux Firebase avec `firebase functions:log --only notifyOnContactCreated --project perlerwyveth`. Aucun nouvel essai automatique n'est configuré : le message reste consultable dans l'administration. Gmail impose des limites d'envoi et Firebase peut livrer un même événement plusieurs fois, ce qui peut occasionner des notifications en double. Les événements antérieurs au déploiement ne sont pas envoyés rétroactivement.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
