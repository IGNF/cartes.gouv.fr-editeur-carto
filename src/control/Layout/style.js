import TabNavItem from 'geopf-extensions-openlayers/src/packages/Controls/Toggle/TabNavItem.js';
import i18next from '../../i18n/index';

/**
 * @returns {HTMLElement}
 */
function initContent () {
  const container = document.createElement('div');
  container.style.padding = '1rem 0.5rem';

  const badge = document.createElement('p');
  badge.className = 'fr-badge fr-badge--new';
  badge.textContent = i18next.t('controls:layout.comingSoon');

  container.appendChild(badge);

  return container;
}

const styleTabNavItem = new TabNavItem({
  label: i18next.t('controls:ui.style'),
  title: i18next.t('controls:layout.openStyle'),
  content: initContent(),
});

export default styleTabNavItem;
