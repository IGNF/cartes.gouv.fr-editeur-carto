# Internationalisation

Le projet utilise [i18next](https://www.i18next.com/) pour centraliser les libellés
dans des catalogues JSON, sous [`src/i18n/locales/`](../../src/i18n/locales/).
Les ressources sont importées par
[`src/i18n/index.ts`](../../src/i18n/index.ts), sans chargement réseau.

## Namespaces : organiser les libellés

Un **namespace** est un groupe fonctionnel de traductions, correspondant à un
fichier JSON par langue. Il ne dépend pas du dossier technique du code.

| Namespace       | Contenu                                                         |
| --------------- | --------------------------------------------------------------- |
| `common`        | Actions partagées : Annuler, Fermer, Ajouter…                   |
| `charte`        | En-tête, pied de page et navigation                             |
| `actions`       | Dialogues et messages regroupés par identifiant d'action        |
| `pages`         | Barres de l'éditeur, catalogue, dessin, plein écran et badges   |
| `controls`      | Recherche, couches, styles, conditions, légende et mise en page |
| `notifications` | Messages globaux, avertissements et chargement                  |

```js
import i18next from "../../i18n/index"; // Adapter le chemin au fichier appelant.

const label = i18next.t("common:cancel");
const title = i18next.t("actions:open-map.title");
```

Dans `actions:open-map.title`, `actions` désigne le namespace et `open-map.title`
le chemin de la clé dans le JSON. Utiliser des clés stables et explicites :
une modification de formulation ne doit pas imposer de renommer la clé.
Toujours préciser le namespace dans les appels.

## Interpolation : insérer des valeurs

Écrire une phrase complète dans le catalogue, avec des paramètres `{{…}}`,
plutôt que concaténer plusieurs morceaux dans le code.

```json
{
    "import-local": {
        "emptyFile": "Le fichier {{fileName}} ne contient aucun objet valide"
    }
}
```

```js
const message = i18next.t("actions:import-local.emptyFile", {
    fileName: file.name,
    interpolation: { escapeValue: false },
});
element.textContent = message;
```

Les valeurs sont échappées par défaut. Désactiver cet échappement **uniquement pour une insertion comme texte** (`textContent`, valeur d'un champ, etc.), sinon
les caractères comme `&` peuvent apparaître encodés. Ne jamais insérer ces valeurs
non échappées avec `innerHTML`. Les balises, liens et icônes restent dans les
composants, pas dans les catalogues.

Voir la [documentation de l'interpolation](https://www.i18next.com/translation-function/interpolation).

## Pluriels : passer le nombre avec `count`

i18next choisit la forme selon la langue. Par exemple, dans le namespace
`notifications`, les ressources françaises contiennent :

```json
{
    "map": {
        "deleted_one": "{{count}} objet supprimé",
        "deleted_many": "{{count}} objets supprimés",
        "deleted_other": "{{count}} objets supprimés"
    }
}
```

```js
i18next.t("notifications:map.deleted", { count: features.length });
```

Appeler **la clé de base sans suffixe** et fournir un nombre dans la propriété
`count` (ce nom est obligatoire). Ne pas choisir manuellement singulier/pluriel
avec un test `count > 1`.

En anglais, les formes sont `_one` et `_other`. En français, `_many` couvre
notamment les millions entiers ; zéro utilise généralement `_one`, contrairement
à l'anglais. Une variante `_zero` peut définir une formulation dédiée à zéro.

Voir la [documentation des pluriels](https://www.i18next.com/translation-function/plurals).

## Ajouter ou modifier un libellé

1. Choisir le namespace et renseigner la clé dans les catalogues des langues concernées.
2. Appeler `i18next.t('namespace:cle')` dans le code, y compris pour les attributs
   accessibles (`aria-label`, `title`, `alt`, etc.).
3. Garder les libellés dans les JSON, sans `defaultValue` français dupliqué.
   Pour une classe de contrôle, conserver ses valeurs françaises par défaut :
   injecter les traductions depuis l'appel via ses options (`labels`, par exemple).
   Les contrôles de style partagent les libellés `controls:ui`, obtenus avec
   `getControlLabels()` ; les actions génériques proviennent de `common`.
   Les titres numérotés des conditions utilisent une fonction `conditionTitle`
   et l'interpolation `{{number}}` (il s'agit d'un numéro, pas d'un pluriel).
   Ne pas traduire les contenus utilisateur, URL ou identifiants techniques.
4. Pour un nouveau namespace, importer ses ressources et l'enregistrer dans
   [`index.ts`](../../src/i18n/index.ts).

Depuis la racine du projet :

```sh
npx i18next-cli extract
npx i18next-cli status fr
npx i18next-cli status en
```

L'extraction repose sur les appels présents dans le code : elle ne traduit pas
les textes. Compléter les valeurs vides et vérifier le diff ; les clés inutilisées
peuvent être supprimées, sauf les motifs préservés dans
[`i18next.config.ts`](../../i18next.config.ts). `npm run extract` concerne les
icônes Remix, pas les traductions.

## Traduire un modele HTML

Utiliser `data-i18n="namespace:cle"` sur un élément contenant uniquement du texte :

```html
<span class="fr-notice__title" data-i18n="actions:open-map.loading"></span>
```

Pour les attributs, utiliser `data-i18n-placeholder`, `data-i18n-title`,
`data-i18n-aria-label` ou `data-i18n-alt`, avec la même syntaxe de clé.
Si un label contient une icône ou une indication, placer le marqueur sur un
`span` dédié pour ne pas supprimer ces enfants.

Avant d'insérer un modèle importé avec `?raw`, appeler `translateHtml(html)`
depuis `src/i18n/translateHtml.ts`. Le helper traduit le fragment hors du DOM,
avec `textContent` et `setAttribute`, sans interpréter les traductions comme du
HTML. Une clé absente ou un marqueur texte contenant des éléments enfants
déclenche une erreur explicite. Les valeurs utilisateur restent gérées en JS ;
les interpolations et pluriels dynamiques utilisent directement `i18next.t`.

Le plugin `scripts/i18next-html.ts` collecte ces clés dans les fichiers HTML
lors de l'extraction, y compris ceux qui ne sont pas encore importés.
La traduction est calculée à chaque appel du helper, dans la langue courante.

### Exemple

Prenons un bouton dont le texte visible, le titre au survol et le libellé
accessible sont différents. Modèle brut dans `searchButton.html` :

```html
<button type="button" data-i18n="common:search" data-i18n-title="actions:search.buttonTitle" data-i18n-aria-label="actions:search.buttonAriaLabel"></button>
```

Pour cet exemple, ajouter dans le catalogue français `actions.json` :

```json
{
    "search": {
        "buttonTitle": "Lancer la recherche",
        "buttonAriaLabel": "Rechercher une carte dans mes cartes enregistrées"
    }
}
```

La clé `common:search` existe déjà et vaut `"Rechercher"` en français.
Dans le JavaScript situé à côté du modèle :

```js
import searchButtonHtml from "./searchButton.html?raw";
import { translateHtml } from "../../i18n/translateHtml";

// Traduit le modèle, puis le transmet au dialogue pour l'afficher.
dialog.setDialogContent(translateHtml(searchButtonHtml));
```

HTML rendu lorsque la langue courante est le français :

```html
<button
    type="button"
    data-i18n="common:search"
    data-i18n-title="actions:search.buttonTitle"
    data-i18n-aria-label="actions:search.buttonAriaLabel"
    title="Lancer la recherche"
    aria-label="Rechercher une carte dans mes cartes enregistrées"
>
    Rechercher
</button>
```

Chaque marqueur est traité indépendamment : `data-i18n` remplit le texte,
`data-i18n-title` remplit `title` et `data-i18n-aria-label` remplit `aria-label`.
Ce dernier définit le nom annoncé par les lecteurs d'écran : il doit conserver
le texte visible « Rechercher », ici complété par le contexte.
Les marqueurs restent présents dans le HTML rendu. Pour une autre langue,
ajouter les mêmes clés dans son catalogue ; le code et le modèle ne changent pas.

## Ajouter une langue

Le français est la langue par défaut et de repli. Pour ajouter une langue
(par exemple `es`) :

1. Créer `src/i18n/locales/es/` avec les mêmes namespaces et clés que les autres
   catalogues. Adapter les variantes de pluriel aux règles de cette langue.
2. Importer ces JSON dans [`index.ts`](../../src/i18n/index.ts), les ajouter sous
   `resources.es` et compléter `supportedLngs`.
3. Ajouter `es` à `locales` dans
   [`i18next.config.ts`](../../i18next.config.ts), puis vérifier les traductions
   avec `npx i18next-cli status es`.
4. Si un choix de langue est proposé, adapter sa sélection et conserver
   l'attribut `lang` du document en accord avec la langue affichée.

### Prévoir un sélecteur de langues

Un éventuel sélecteur destiné à l'interface publique devra suivre le
[composant Sélecteur de langues du DSFR](https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/selecteur-de-langues).
La bascule utilisée pour les vérifications en développement ne constitue pas
ce composant final.

Pour un futur sélecteur, un gestionnaire peut appeler l'API
[`changeLanguage`](https://www.i18next.com/overview/api#changelanguage) :

```js
// Exemple : à relier aux options du sélecteur DSFR.
async function selectLanguage(language) {
    await i18next.changeLanguage(language);
    document.documentElement.lang = i18next.resolvedLanguage || language;
    // Actualiser ensuite les textes et attributs des composants déjà créés.
}
```

**Cet appel seul ne rafraîchit pas le DOM.** Les composants actuels calculent
leurs libellés à la création : prévoir leur mise à jour sur `languageChanged`,
ou une reconstruction contrôlée, sans perdre les modifications de la carte.
La persistance du choix de langue devra également être définie lors de cette
intégration.
