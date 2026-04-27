import TabNavItem from 'geopf-extensions-openlayers/src/packages/Controls/Toggle/TabNavItem.js';
import story, { carte } from '../../story.js';
import { addMessage, removeMessage, setDisabled } from '../../utils/utils.js';
import { getTitle, setLogo, setTitle } from '../../utils/story.js';


///// VALEURS PAR DÉFAUTS /////

/**
 * Ids utilisés pour la navigation tertiaire title
 */
const IDS = {
  TITLE_FIELDSET: 'layout-title-fieldset',
  TITLE_TOGGLE: 'layout-title-toggle',
  TITLE_INPUT: 'layout-title-input',
  SUBTITLE_INPUT: 'layout-subtitle-input',
  IMAGE_FIELDSET: 'layout-image-fieldset',
  IMAGE_TOGGLE: 'layout-image-toggle',
  IMAGE_INPUT: 'layout-image-input',
};


/**
 * Valeur par défaut pour chaque élément
 */
const defaultValues = {
  SHOW_TITLE: false,
  TITLE: 'Titre de la carte',
  SUBTITLE: 'Sous-titre de la carte',
  SHOW_LOGO: false,
  LOGO: '',
};

/**
 * Valeur du fichier image, pour l'utiliser plus facilement après
 */
let imgPath = "";


///// FONCTIONS UTILITAIRES /////

/**
 * Récupère les instances d'un élément
 * @param {HTMLElement} element Élément depuis lequel récupérer les instances.
 */
const getInstances = (element) => {
  return {
    titleFieldset: element.querySelector(`#${IDS.TITLE_FIELDSET}`),
    titleToggle: element.querySelector(`#${IDS.TITLE_TOGGLE}`),
    titleInput: element.querySelector(`#${IDS.TITLE_INPUT}`),
    subtitleInput: element.querySelector(`#${IDS.SUBTITLE_INPUT}`),
    imageFieldset: element.querySelector(`#${IDS.IMAGE_FIELDSET}`),
    imageToggle: element.querySelector(`#${IDS.IMAGE_TOGGLE}`),
    imageInput: element.querySelector(`#${IDS.IMAGE_INPUT}`),
  };
}

/**
 * Fonction utilitaire.
 * Réinitialise le logo utilisé, en modifiant la storymap et l'input
 * @param {import("mcutils/StoryMap.js").default} story Storymap de l'application
 * @param {HTMLInputElement} input Input à réinitialiser
 */
const resetLogo = (story, input) => {
  setLogo(story);
  input.value = "";
  imgPath = "";
}


///// FONCTION POUR LE TABNAV ITEM /////

/**
 * Initialise le contenu de la navigation tertiaire
 * @returns {HTMLElement}
 */
function initContent() {
  // Formulaire racine du panneau "Titre"
  const container = document.createElement('form');
  container.setAttribute('aria-label', 'Paramètres du titre');

  // Fieldset de contenu piloté par le toggle "Titre"
  const titleFieldset = document.createElement('fieldset');
  titleFieldset.className = 'fr-fieldset';
  titleFieldset.id = IDS.TITLE_FIELDSET;
  titleFieldset.setAttribute('aria-label', 'Paramètres du titre');
  titleFieldset.setAttribute('aria-describedby', `${IDS.TITLE_FIELDSET}-messages`);

  // Fieldset dédié au toggle "Titre" (évite les décalages de styles DSFR)
  const titleToggleFieldset = document.createElement('fieldset');
  titleToggleFieldset.className = 'fr-fieldset';

  const titleToggleElement = document.createElement('div');
  titleToggleElement.className = 'fr-fieldset__element';

  // Active/desactive l'affichage du bloc titre
  const toggleGroup = document.createElement('div');
  toggleGroup.className = 'fr-toggle fr-toggle--left';

  const toggleInput = document.createElement('input');
  toggleInput.className = 'fr-toggle__input';
  toggleInput.type = 'checkbox';
  toggleInput.id = IDS.TITLE_TOGGLE;
  toggleInput.setAttribute('aria-controls', `${IDS.TITLE_FIELDSET} ${IDS.IMAGE_FIELDSET}`);

  const toggleLabel = document.createElement('label');
  toggleLabel.className = 'fr-toggle__label fr-text--bold';
  toggleLabel.setAttribute('for', IDS.TITLE_TOGGLE);
  toggleLabel.textContent = 'Ajouter un titre';

  toggleGroup.appendChild(toggleInput);
  toggleGroup.appendChild(toggleLabel);
  titleToggleElement.appendChild(toggleGroup);
  titleToggleFieldset.appendChild(titleToggleElement);

  // Champ de saisie du titre principal
  const titleInputGroup = document.createElement('div');
  titleInputGroup.className = 'fr-input-group';

  const titleInputElement = document.createElement('div');
  titleInputElement.className = 'fr-fieldset__element';

  const titleInputLabel = document.createElement('label');
  titleInputLabel.className = 'fr-label';
  titleInputLabel.setAttribute('for', IDS.TITLE_INPUT);
  titleInputLabel.textContent = 'Titre';

  const titleInput = document.createElement('input');
  titleInput.className = 'fr-input';
  titleInput.type = 'text';
  titleInput.id = IDS.TITLE_INPUT;

  titleInputGroup.appendChild(titleInputLabel);
  titleInputGroup.appendChild(titleInput);
  titleInputElement.appendChild(titleInputGroup);

  // Champ de saisie du sous-titre
  const subtitleInputGroup = document.createElement('div');
  subtitleInputGroup.className = 'fr-input-group';

  const subtitleInputElement = document.createElement('div');
  subtitleInputElement.className = 'fr-fieldset__element';

  const subtitleInputLabel = document.createElement('label');
  subtitleInputLabel.className = 'fr-label';
  subtitleInputLabel.setAttribute('for', IDS.SUBTITLE_INPUT);
  subtitleInputLabel.textContent = 'Sous-titre';

  const subtitleInput = document.createElement('input');
  subtitleInput.className = 'fr-input';
  subtitleInput.type = 'text';
  subtitleInput.id = IDS.SUBTITLE_INPUT;

  subtitleInputGroup.appendChild(subtitleInputLabel);
  subtitleInputGroup.appendChild(subtitleInput);
  subtitleInputElement.appendChild(subtitleInputGroup);

  // Fieldset de contenu piloté par le toggle "Image"
  const imageFieldset = document.createElement('fieldset');
  imageFieldset.className = 'fr-fieldset';
  imageFieldset.id = IDS.IMAGE_FIELDSET;
  imageFieldset.setAttribute('aria-label', 'Paramètres de l\'image');

  // Toggle pour activer l'ajout d'une image
  const imageToggleElement = document.createElement('div');
  imageToggleElement.className = 'fr-fieldset__element';

  const imageToggleGroup = document.createElement('div');
  imageToggleGroup.className = 'fr-toggle fr-toggle--left';

  const imageToggleInput = document.createElement('input');
  imageToggleInput.className = 'fr-toggle__input';
  imageToggleInput.type = 'checkbox';
  imageToggleInput.id = IDS.IMAGE_TOGGLE;
  imageToggleInput.setAttribute('aria-label', 'Image');
  imageToggleInput.setAttribute('aria-controls', IDS.IMAGE_INPUT);

  const imageToggleLabel = document.createElement('label');
  imageToggleLabel.className = 'fr-toggle__label';
  imageToggleLabel.setAttribute('for', IDS.IMAGE_TOGGLE);
  imageToggleLabel.textContent = 'Image';

  imageToggleGroup.appendChild(imageToggleInput);
  imageToggleGroup.appendChild(imageToggleLabel);
  imageToggleElement.appendChild(imageToggleGroup);

  // Input fichier associe a l'image
  const imageUploadGroup = document.createElement('div');
  imageUploadGroup.className = 'fr-upload-group';

  const imageUploadElement = document.createElement('div');
  imageUploadElement.className = 'fr-fieldset__element';

  const imageUploadLabel = document.createElement('label');
  imageUploadLabel.className = 'fr-label';
  imageUploadLabel.setAttribute('for', IDS.IMAGE_INPUT);
  imageUploadLabel.textContent = 'Fichier image';

  const imageUploadHint = document.createElement('span');
  imageUploadHint.className = 'fr-hint-text';
  imageUploadHint.textContent = 'Taille maximale : 2 Mo. Formats supportés : jpg, png et svg.';

  const imageUploadInput = document.createElement('input');
  imageUploadInput.className = 'fr-upload';
  imageUploadInput.type = 'file';
  imageUploadInput.id = IDS.IMAGE_INPUT;
  imageUploadInput.accept = 'image/jpeg,image/png,image/svg+xml,.jpg,.jpeg,.png,.svg';
  imageUploadInput.setAttribute('aria-describedby', `${IDS.IMAGE_INPUT}-messages`);

  imageUploadLabel.appendChild(imageUploadHint);
  imageUploadGroup.appendChild(imageUploadLabel);
  imageUploadGroup.appendChild(imageUploadInput);
  imageUploadElement.appendChild(imageUploadGroup);

  const titleMessages = document.createElement('div');
  titleMessages.className = 'fr-messages-group';
  titleMessages.setAttribute('aria-live', 'assertive');
  titleMessages.id = `${IDS.TITLE_FIELDSET}-messages`;

  const imageInputMessages = document.createElement('div');
  imageInputMessages.className = 'fr-messages-group';
  imageInputMessages.setAttribute('aria-live', 'assertive');
  imageInputMessages.id = `${IDS.IMAGE_INPUT}-messages`;

  // Assemblage final des blocs dans l'ordre d'affichage
  titleFieldset.appendChild(titleInputElement);
  titleFieldset.appendChild(subtitleInputElement);
  titleFieldset.appendChild(titleMessages);

  imageFieldset.appendChild(imageToggleElement);
  imageFieldset.appendChild(imageUploadElement);
  imageUploadGroup.appendChild(imageInputMessages);

  container.appendChild(titleToggleFieldset);
  container.appendChild(titleFieldset);
  container.appendChild(imageFieldset);

  // Lie le formulaire à la storymap
  addEvents(container, story)

  return container;
}

/**
 * Lie les controles du formulaire aux propriétés de la StoryMap.
 * 
 * @param {HTMLElement} container Conteneur du formulaire
 * @param {import("mcutils/StoryMap.js").default} story StoryMap à lier au formulaire
 */
function addEvents(container, story) {
  const refs = getInstances(container);

  // Active / désactive le formulaire d'ajout du titre
  refs.titleToggle.addEventListener('change', () => {
    const enabled = refs.titleToggle.checked;
    refs.titleFieldset.disabled = !enabled;
    refs.imageFieldset.disabled = !enabled;
    story.showTitle(enabled);
    story.set("showTitle", enabled);

    // Modifie la valeur du titre et sous-titre si aucun des deux n'est défini
    if (enabled && getTitle() === "" && story.get('subTitle') === undefined) {
      refs.titleInput.value = defaultValues.TITLE;
      refs.titleInput.dispatchEvent(new Event('input'));
      refs.subtitleInput.value = defaultValues.SUBTITLE;
      refs.subtitleInput.dispatchEvent(new Event('input'));
    } else {
      setTitle(story, { title: refs.titleInput.value, subTitle: refs.subtitleInput.value });
    }
  });

  // Titre
  refs.titleInput.addEventListener('input', () => {
    setTitle(story, { title: refs.titleInput.value });
  });

  // Sous-titre
  refs.subtitleInput.addEventListener('input', () => {
    setTitle(story, { subTitle: refs.subtitleInput.value });
  });

  refs.imageToggle.addEventListener('change', () => {
    const enabled = refs.imageToggle.checked;
    setDisabled(refs.imageInput, !enabled || !refs.titleToggle.checked);

    // N'enlève pas le logo de l'input
    if (!enabled) {
      // Indique que l'image ne doit pas être affichée
      story.target.dataset.logo = "none";
      setLogo(story);
    } else {
      // Met l'image pré-enregistré en logo
      delete story.target.dataset.logo;
      imgPath && setLogo(story, imgPath);
    }
  });

  // Temporaire, car impossible de stocker l'info
  refs.imageInput.addEventListener('change', () => {
    const file = refs.imageInput.files && refs.imageInput.files[0];
    if (!file) {
      removeMessage(refs.imageInput);
      return;
    }

    // Max size : 2Mo
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      addMessage(refs.imageInput, 'La taille du fichier est supérieur à 2Mo');
      resetLogo(story, refs.imageInput);
      return;
    }

    // Format
    const acceptedFormat = refs.imageInput.accept?.split(",") || [];
    const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();
    const isAcceptedFormat = acceptedFormat.includes(ext);

    if (!isAcceptedFormat) {
      addMessage(refs.imageInput, 'Le format du fichier n\'est pas accepté');
      resetLogo(story, refs.imageInput);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        removeMessage(refs.imageInput);
        // Enregistre le résultat pour le réutiliser après
        imgPath = reader.result;
        setLogo(story, reader.result);
        return;
      }

      addMessage(refs.imageInput, `Le fichier ${file.name} n'a pas pu être correctement importé.`);
      resetLogo(story, refs.imageInput);
    };
    reader.onerror = () => {
      addMessage(refs.imageInput, `Le fichier ${file.name} n'a pas pu être correctement importé.`);
      resetLogo(story, refs.imageInput);
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Initialise les valeurs du formulaire depuis l'etat courant de la story.
 * @param {import("mcutils/StoryMap.js").default} story StoryMap à utiliser
 */
function initForm(story) {
  const refs = getInstances(titleTabNavItem.getContent());
  if (!refs.titleToggle || !refs.imageToggle) {
    return;
  }

  // Récupère les valeurs d'initialisation du formulaire
  const showTitle = story.showTitle();
  const hasLogo = !!story.get('logo');

  // Active / désactive les valeurs du formulaire
  refs.titleToggle.checked = showTitle;
  refs.titleFieldset.disabled = !showTitle;
  refs.imageFieldset.disabled = !showTitle;

  // Valeurs du titre
  refs.titleInput.value = story.get('title') || '';
  refs.subtitleInput.value = story.get('subTitle') || '';

  // Valeurs du logo
  refs.imageToggle.checked = hasLogo;
  setDisabled(refs.imageInput, !showTitle || !hasLogo);
  removeMessage(refs.imageInput);
  // Affiche une image ou non
  if (hasLogo) {
    setLogo(story, story.get('logo'));
    delete story.target.dataset.logo;
  } else {
    story.target.dataset.logo = "none";
  }
}


/**
 * Initialise l'etat UI et les liaisons a l'ouverture de l'onglet.
 */
function onOpen() {
  initForm(story);
}

///// INSTANCE TABNAV ITEM POUR LE CHANGEMENT DU TITRE /////

const titleTabNavItem = new TabNavItem({
  label: 'Titre',
  title: 'Ouvrir l\'onglet Titre',
  content: initContent(),
  onOpen: onOpen,
});


export default titleTabNavItem;
