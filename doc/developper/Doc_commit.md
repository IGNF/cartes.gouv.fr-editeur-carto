# Comment bien nommer ses commits ?

## Convention Angular :

On peut utiliser la convention Angular qui propose la syntaxe suivante : `<type>(<scope>): <sujet> #<numéro issue>`


### Type du commit :

On distingue 9 types principaux de commit (on peut en ajouter):
- build : changement de dépendances, système de build
- ci : changements liés aux scripts d'intégration ou config
- feat : ajout d'une fonctionnalité
- fix : correction bug
- refactor : modification sans ajout de fonctionnalité ni meilleure performance
- style : changement sans toucher l'architecture du programme (indentation, renommage)
- docs : rédaction/mise à jour documentation
- test : ajout ou modification de tests
- revert : annulation commit --> syntaxe : revert <sujet commit annulé> <hash commit annulé>


### Scope : Partie affectée

Le scope décrit la partie du projet affectée par le commit, on peut utiliser le nom d'une classe par exemple ou d'un domaine plus général.


### Sujet :

Petite description succinte des changements introduit par le commit, attention à la limite de caractères.


### Lien avec les issues :

On peut faire un lien avec une issue en cours dans le commit avec la syntaxe suivante : `#18`
Cela fera référence à l'issue numéro 18 du projet et le commit sera mentionnée dans les commentaires de l'issue.
Ce lien est optionnel car tous les commits ne sont pas forcément relié à une issue.


Ressources utiles:
[https://buzut.net/cours/versioning-avec-git/bien-nommer-ses-commits](https://buzut.net/cours/versioning-avec-git/bien-nommer-ses-commits)
[https://www.conventionalcommits.org/fr/v1.0.0-beta.3/](https://www.conventionalcommits.org/fr/v1.0.0-beta.3/)
