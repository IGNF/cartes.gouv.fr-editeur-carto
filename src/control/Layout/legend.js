import TabNavItem from 'geopf-extensions-openlayers/src/packages/Controls/Toggle/TabNavItem.js';
import LegendContainer from '../Legend/LegendContainer.js';
import story from '../../story.js';

// Legende container sur la story
const legendContainer = new LegendContainer({
  story: story
});

const legendTabNavItem = new TabNavItem({
  label: 'Légende',
  title: 'Ouvrir l\'onglet Légende',
  content: legendContainer.content,
  onOpen: () => legendContainer.initForm(),
});

export default legendTabNavItem;
