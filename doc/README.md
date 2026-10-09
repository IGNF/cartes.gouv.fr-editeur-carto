# Contribuer au projet

Les contributions se font par pull request (PR). Avant de commencer, vérifiez qu'une issue ou une discussion ne traite pas déjà du sujet.

## Préparer son environnement

Le projet demande Node.js `>=24 <26` et npm `>=11.13 <12` (voir `package.json`). Depuis la racine du projet, installez les dépendances avec :

```sh
npm i
```

Créez une branche dédiée à votre changement, par exemple `feat/nom-du-sujet`, `fix/nom-du-sujet`. Ces noms sont des conventions pratiques, pas une vérification automatique.

## Bonnes pratiques

- Gardez chaque PR ciblée et de taille raisonnable ; séparez les changements indépendants.
- Respectez les conventions existantes et évitez les modifications sans rapport avec le sujet.
- N'ajoutez ni secrets, ni fichiers locaux, ni dépendances générées ou artefacts de build sans raison.
- Ajoutez ou adaptez les tests lorsque le comportement change.
- Avant d'ouvrir la PR, relisez `git diff`, vérifiez les fichiers inclus et exécutez les contrôles adaptés.
- Dans la PR, décrivez le problème, la solution et les vérifications effectuées. Ajoutez des captures d'écran pour les changements d'interface.

## Vérifications locales

```sh
npm run lint       # Analyse ESLint du code dans src/
npm run format     # Vérifie le formatage avec Prettier
npm test           # Lance les tests unitaires Vitest
npm run build      # Vérifie le lint puis construit l'application
```

Pour formater un seul fichier sans réécrire tout le dépôt :

```sh
npx prettier --write chemin/du/fichier.js
```

`npm run format:fix` applique Prettier à l'ensemble du dépôt ; vérifiez ensuite le diff avant de valider.

## Outils de qualité

| Outil                                                             | Rôle dans le projet                                                                                                                                         |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ESLint (`eslint`)                                                 | Repère les erreurs et problèmes de code dans `src/`. Le script de lint échoue également en présence d'avertissements.                                       |
| Prettier (`prettier`)                                             | Formate le code de manière cohérente. La configuration utilise notamment une largeur de tabulation de 4 espaces et une longueur de ligne de 160 caractères. |
| Commitlint (`@commitlint/cli`, `@commitlint/config-conventional`) | Vérifie que les messages de commit respectent la convention Conventional Commits.                                                                           |
| Husky (`husky`)                                                   | Lance les hooks Git du projet : vérifications avant commit et validation du message de commit.                                                              |
| lint-staged (`lint-staged`)                                       | Lance les traitements configurés lors du hook pré-commit, notamment Prettier et ESLint.                                                                     |
| TypeScript (`typescript`, `typescript-eslint`)                    | Le hook pré-commit lance `tsc -b` ; `typescript-eslint` permet à ESLint d'analyser les fichiers TypeScript.                                                 |
| Vitest (`vitest`)                                                 | Exécute les tests unitaires via `npm test`. `jsdom` fournit un environnement DOM simulé et `msw` permet de simuler des requêtes réseau dans les tests.      |

Prettier et ESLint sont lancés séparément par les scripts du projet. Bien que `eslint-config-prettier` et `eslint-plugin-prettier` soient installés, ils ne sont pas activés dans la configuration ESLint actuelle (`eslint.config.ts`). En cas de désaccord de formatage, vérifiez les deux outils séparément.

Les hooks Husky sont ignorés lorsque la variable `CI` est définie. En local, laissez-les s'exécuter : ils fournissent un dernier contrôle avant la création du commit.

## Messages de commit

Utilisez le format Conventional Commits :

```text
type(portée): description courte
```

Exemples :

```text
feat(symbol-lib): permettre le déplacement des symboles
fix(search): corriger le filtrage des résultats
docs(contributing): préciser les commandes de vérification
```

Types courants : `feat` pour une fonctionnalité, `fix` pour une correction, `docs` pour la documentation, `test` pour les tests, `refactor` pour une restructuration sans changement fonctionnel et `chore` pour la maintenance. La portée est facultative ; privilégiez une description concise et explicite.

Le hook `commit-msg` vérifie le message avec Commitlint. Le hook `pre-commit` lance `tsc -b` puis `lint-staged`.
