import TabNavItem from 'geopf-extensions-openlayers/src/packages/Controls/Toggle/TabNavItem.js';
import LegendContainer from '../Legend/LegendContainer.js';
import story from '../../story.js';
import i18next from '../../i18n/index';
import { getControlLabels } from '../../i18n/controlLabels';

// Legende container sur la story
const legendContainer = new LegendContainer({
  labels: getControlLabels(),
  story: story
});

const legendTabNavItem = new TabNavItem({
  label: i18next.t('controls:layout.legend'),
  title: i18next.t('controls:layout.openLegend'),
  content: legendContainer.content,
  onOpen: () => legendContainer.initForm(),
});

export default legendTabNavItem;
