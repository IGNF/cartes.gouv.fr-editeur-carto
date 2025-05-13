# Les workflows indspensables à un bon projet

Ce dossier contient selon chaque langage des workflows de CI et CD. 


## Définition

CI: Intégration en Continue d'un projet. Cela consiste à la vérification de tout changement apporter au projet

CD: Déployement en Continue d'un projet. Consiste à intégrer et vérifier les derniers changement dans l'optique de les publier.


## Description des workflows de CI

Voici le workflow des templates de CI proposé dans ce projet. Elle se déclanche au push merge et pull request sur les branchs main, dev et hotfix.

```mermaid
---
title: Workflow de CI
---
flowchart TD

    A[Push,PR, merge] --> | pipeline de test| B[vérification des conventions de code]
    B --> |passe| C[Vérification recouvrement test]
    B --> |ne passe pas | G[Modification réjeté]
    C -->|ne passe pas | G[Modification réjeté]
    C --> |passe| D[Vérification des tests]
    D -->|passe| F[modification ajouté]
    D --> |ne passe pas| G[modification rejeté]

```

## Description des workflows de CD

Voici le workflow des templates de CD proposé dans ce projet. Elle se déclanche au push merge et pull request sur la branche main et dev. 

Sur une branch main publication d'une version de production.
Sur une branch dev publication d'une version de développement.

```mermaid
---
title: Workflow de CD
---
flowchart TD

    A[Push] --> B[Lancement de la pipeline de test]
    B --> |passe| C[Build ou archivage du code]
    B --> |ne passe pas | G[Publication rejeté]
    C -->|ne passe pas | G[Publication rejeté]
    C --> |passe| D[Ajout des tags et publication]

```


## Comment adapter ces workflows à mon projet



Vous pouvez suivre ces étapes génériques pour adapter les templates à votre projet. Vérifier quand même que cela répond à votre besoin.


-> Rechercher dans l'ensembles des fichiers yml de ce dossier le mot clefs *template* et le remplacer par le *nom de votre projet*.
-> Vérifier les versions utiliser pour être en accord avec celles de votre projet 

Pour plus d'information sur les actions vous pouvez consulter la documentation GitHub qui suit : https://docs.github.com/fr/actions