# Éditeur cartographique de Cartes.gouv.fr

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](LICENSE)

L'éditeur cartographique est l'un des outils de Cartes.gouv.fr : il est constitué d'une interface cartographique d'édition permettant de personnaliser ses propres cartes et de les publier pour les partager, les cartes sont visibles dans une interface de visualisation ou via une intégration sur site distant (via iframe par exemple)


## Description/Résumé du projet

À compléter...

## Projets liés

* [API de l'editeur carte](https://github.com/IGNF/carte.gouv.fr-editeur-api)
* [Version compacte du DSFR](https://github.com/IGNF/carte.gouv.fr-editeur-dsfr)
* [L'outil d'édition de cartes](https://github.com/IGNF/cartes.gouv.fr-editeur-carto)
* [La bibliothèque de l'éditeur de carte (accès à l'API, etc)](https://github.com/IGNF/carte.gouv.fr-editeur-lib)

## Modification des variables d'environnements

Historiquement, le projet utilisait un fichier config.json situé dans le dossier `public`.

Désormais, il faut utiliser les variables d'environnements définies dans .env. **Attention** à ne pas modifier ce fichier, mais plutôt écrire un fichier .env.local, qui sera pris en priorité et qui ne sera pas déposé sur le répertoire GitHub.


### Explications des variables d'environnements

- `REDIRECT_URI` : URL vers laquelle le module **oidc-spa** doit rediriger l'application lorsque déployé en prod (cela empêche la redirection automatique vers "/", qui renvoie alors sur l'entrée carto);

- `API_URL` : URL de l'API à utiliser;

- `VIEWER_URL` : URL de la visionneuse de carte;

- Variables en `IAM_` : Information de connexion à l'IAM (Identity and Access Manager) :
  - `IAM_URL` : URL de connexion;
  - `IAM_REALM` : realm à utiliser;
  - `IAM_CLIENT_ID` : clientId utilisé pour se connecter;


## Installer les dépendances

```sh
npm install
```

### Compilation et Hot-Reload pour le développement

```sh
npm run dev
```

### Vérification des types, Compilation et Minification pour la Production

```sh
npm run build
```

## Voir l'application avec le code de production

```sh
npm run preview
```

## Déployer le code de production

Déployer le contenu du dossier `dist` après avoir généré le code de production.

### Vérifier la syntaxe et le formattage avec [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Lancer les Tests Unitaires avec [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lancer les tests de composants avec [Cypress](https://www.cypress.io/)

#### Avec une interface graphique

```sh
npm run test:ct
```

#### Sans interface graphique (pour la CI)

```sh
npm run test:ct:ci
```

### Lancer les Tests End-to-End Tests avec [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

Cela lance les tests end-to-end avec le code de développement et le server de développement Vite.
C’est bien plus rapide que le build de production.

Cependant, il est recommandé de lancer les tests end-to-end avec le code de production : il faut lancer le build puis lancer
cypress avec le server Vite qui sert le code de production :

```sh
npm run build
npm run test:e2e
```

### Analyse statique du code avec [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Lancer l'application en local via docker-compose

```sh
docker compose build
docker compose up
```