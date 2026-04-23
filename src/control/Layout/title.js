import TabNavItem from 'geopf-extensions-openlayers/src/packages/Controls/Toggle/TabNavItem.js';

/**
 * @returns {HTMLElement}
 */
function initContent () {
  // Formulaire racine du panneau "Titre"
  const container = document.createElement('form');
  container.setAttribute('aria-label', 'Paramètres du titre');

  // Fieldset de contenu piloté par le toggle "Titre"
  const titleFieldset = document.createElement('fieldset');
  titleFieldset.className = 'fr-fieldset';
  titleFieldset.id = 'layout-title-fieldset';
  titleFieldset.setAttribute('aria-label', 'Paramètres du titre');
  titleFieldset.setAttribute('aria-describedby', 'layout-title-fieldset-messages');

  // Fieldset dédié au toggle "Titre" (évite les décalages de styles DSFR)
  const titleToggleFieldset = document.createElement('fieldset');
  titleToggleFieldset.className = 'fr-fieldset';

  const titleToggleElement = document.createElement('div');
  titleToggleElement.className = 'fr-fieldset__element';

  // Active/desactive l'affichage du bloc titre
  const toggleGroup = document.createElement('div');
  toggleGroup.className = 'fr-toggle';

  const toggleInput = document.createElement('input');
  toggleInput.className = 'fr-toggle__input';
  toggleInput.type = 'checkbox';
  toggleInput.id = 'layout-title-toggle';
  toggleInput.setAttribute('aria-controls', 'layout-title-fieldset');

  const toggleLabel = document.createElement('label');
  toggleLabel.className = 'fr-toggle__label';
  toggleLabel.setAttribute('for', 'layout-title-toggle');
  toggleLabel.textContent = 'Titre';

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
  titleInputLabel.setAttribute('for', 'layout-title-input');
  titleInputLabel.textContent = 'Titre';

  const titleInput = document.createElement('input');
  titleInput.className = 'fr-input';
  titleInput.type = 'text';
  titleInput.id = 'layout-title-input';

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
  subtitleInputLabel.setAttribute('for', 'layout-subtitle-input');
  subtitleInputLabel.textContent = 'Sous-titre';

  const subtitleInput = document.createElement('input');
  subtitleInput.className = 'fr-input';
  subtitleInput.type = 'text';
  subtitleInput.id = 'layout-subtitle-input';

  subtitleInputGroup.appendChild(subtitleInputLabel);
  subtitleInputGroup.appendChild(subtitleInput);
  subtitleInputElement.appendChild(subtitleInputGroup);

  // Toggle pour activer l'ajout d'une image
  const imageToggleGroup = document.createElement('div');
  imageToggleGroup.className = 'fr-toggle';

  // Fieldset de contenu piloté par le toggle "Image"
  const imageFieldset = document.createElement('fieldset');
  imageFieldset.className = 'fr-fieldset';
  imageFieldset.id = 'layout-image-fieldset';
  imageFieldset.setAttribute('aria-label', 'Paramètres de l\'image');
  imageFieldset.setAttribute('aria-describedby', 'layout-image-fieldset-messages');

  // Fieldset dédié au toggle "Image"
  const imageToggleFieldset = document.createElement('fieldset');
  imageToggleFieldset.className = 'fr-fieldset';

  const imageToggleElement = document.createElement('div');
  imageToggleElement.className = 'fr-fieldset__element';

  const imageToggleInput = document.createElement('input');
  imageToggleInput.className = 'fr-toggle__input';
  imageToggleInput.type = 'checkbox';
  imageToggleInput.id = 'layout-image-toggle';
  imageToggleInput.setAttribute('aria-label', 'Image');
  imageToggleInput.setAttribute('aria-controls', 'layout-image-fieldset');

  const imageToggleLabel = document.createElement('label');
  imageToggleLabel.className = 'fr-toggle__label';
  imageToggleLabel.setAttribute('for', 'layout-image-toggle');
  imageToggleLabel.textContent = 'Image';

  imageToggleGroup.appendChild(imageToggleInput);
  imageToggleGroup.appendChild(imageToggleLabel);
  imageToggleElement.appendChild(imageToggleGroup);
  imageToggleFieldset.appendChild(imageToggleElement);

  // Input fichier associe a l'image
  const imageUploadGroup = document.createElement('div');
  imageUploadGroup.className = 'fr-upload-group';

  const imageUploadElement = document.createElement('div');
  imageUploadElement.className = 'fr-fieldset__element';

  const imageUploadLabel = document.createElement('label');
  imageUploadLabel.className = 'fr-label';
  imageUploadLabel.setAttribute('for', 'layout-image-input');
  imageUploadLabel.textContent = 'Fichier image';

  const imageUploadHint = document.createElement('span');
  imageUploadHint.className = 'fr-hint-text';
  imageUploadHint.textContent = 'Taille maximale : 2 Mo. Formats supportés : jpg, png et svg.';

  const imageUploadInput = document.createElement('input');
  imageUploadInput.className = 'fr-upload';
  imageUploadInput.type = 'file';
  imageUploadInput.id = 'layout-image-input';

  imageUploadLabel.appendChild(imageUploadHint);
  imageUploadGroup.appendChild(imageUploadLabel);
  imageUploadGroup.appendChild(imageUploadInput);
  imageUploadElement.appendChild(imageUploadGroup);

  const titleMessages = document.createElement('div');
  titleMessages.className = 'fr-messages-group';
  titleMessages.setAttribute('aria-live', 'assertive');
  titleMessages.id = 'layout-title-fieldset-messages';

  const imageMessages = document.createElement('div');
  imageMessages.className = 'fr-messages-group';
  imageMessages.setAttribute('aria-live', 'assertive');
  imageMessages.id = 'layout-image-fieldset-messages';

  // Assemblage final des blocs dans l'ordre d'affichage
  titleFieldset.appendChild(titleInputElement);
  titleFieldset.appendChild(subtitleInputElement);
  titleFieldset.appendChild(titleMessages);

  imageFieldset.appendChild(imageUploadElement);
  imageFieldset.appendChild(imageMessages);

  container.appendChild(titleToggleFieldset);
  container.appendChild(titleFieldset);
  container.appendChild(imageToggleFieldset);
  container.appendChild(imageFieldset);

  return container;
}

const titleTabNavItem = new TabNavItem({
  label: 'Titre',
  title: 'Ouvrir l\'onglet Titre',
  content: initContent(),
});

export default titleTabNavItem;
