/**
 * @file
 * 
 * Ensemble de fonctions utilitaires permettant de
 * modifier ou d'accéder aux valeurs d'une storymap.
 */


/**
 * @typedef {Object} TitleOptions Propritétés pour la fonction setTitle
 * @property {string} [title] Titre principal
 * @property {string} [subTitle] Sous-titre
 * @property {string} [title1] Titre de panneau 1
 * @property {string} [title2] Titre de panneau 2
 */

/**
 * Fonction utilitaire.
 * Permet de changer le logo d'une storymap.
 * Ne passe pas par `StoryMap.setLogo`, puisque cette fonction change aussi
 * le iconrel du site.
 * @param {import("mcutils/StoryMap.js").default} story Storymap sur laquelle il faut changer le logo
 * @param {String} [src] Source de l'image à modifier.
 */
const setLogo = (story, src) => {
  story.set('logo', src || '');
  story.element.logo.src = src || '';
  console.log(story.element.logo, story.element.logo.src)
}

/**
 * Fonction utilitaire.
 * Modifie le titre d'une storymap sans impacter `document.title`.
 * Ne passe pas par `StoryMap.setTitle` pour éviter cet effet de bord.
 * @param {import("mcutils/StoryMap.js").default} story Storymap à modifier
 * @param {TitleOptions} options Propriétés à mettre à jour
 */
const setTitle = (story, options) => {
  /**
   * Modifie un élément HTML selon une fonction render.
   * Permet d'éviter une suite de `if` par la suite;
   * @param {string} key Clé correspondant à l'élément dans `StoryMap.element`
   * @param {string|undefined} value Valeur correspondante
   * @param {(el: HTMLElement, val: string) => void} render Fonction de transformation
   */
  const setField = (key, value, render) => {
    if (value === undefined) return;
    story.set(key, value);
    render(story.element[key], value);
  };

  setField('title', options.title, (el, val) => {
    el.innerHTML = val ? val : '<i>sans titre</i>';
  });
  setField('subTitle', options.subTitle, (el, val) => { el.innerText = val; });
  setField('title1', options.title1, (el, val) => { el.innerText = val; });
  setField('title2', options.title2, (el, val) => { el.innerText = val; });

  story.changed();
};

/**
 * Retourne le titre de la storymap ou de la carte si non défini
 * @returns {String} Titre de la storymap
 */
const getTitle = () => {
  return story.get("title") || carte.getTitle(true);
}

export {
  setLogo,
  setTitle,
  getTitle,
}