import TabNavItem from 'geopf-extensions-openlayers/src/packages/Controls/Toggle/TabNavItem.js';

/**
 * @returns {HTMLElement}
 */
function initContent () {
  const container = document.createElement('div');
  container.style.padding = '1rem 0.5rem';

  const badge = document.createElement('p');
  badge.className = 'fr-badge fr-badge--new';
  badge.textContent = 'Bientôt disponible';

  container.appendChild(badge);

  return container;
}

const legendTabNavItem = new TabNavItem({
  label: 'Légende',
  title: 'Ouvrir l\'onglet Légende',
  content: initContent(),
});

export default legendTabNavItem;
