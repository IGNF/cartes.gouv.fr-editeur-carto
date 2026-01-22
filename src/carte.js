// Extensions géoplateforme
import 'geoportal-access-lib/dist/GpServices.js';

import 'geopf-extensions-openlayers/src/packages/CSS/DSFRgeneralWidget.css';
import 'geopf-extensions-openlayers/css/Dsfr.css';

// Ma Carte
import Carte from './mcutils/Carte.js';

import charte from './charte/charte.js';

import 'ol-ext/dist/ol-ext.css'
import 'mcutils/Carte.css';
import 'mcutils/Carte.js';
import ModifyingInteraction from 'geopf-extensions-openlayers/src/packages/Interactions/Modifying.js';
import switcher from './mcutils/layerSwitcher.js';
import notification from './control/Notification/notification.js';

// The Carte
const carte = new Carte({
  target: charte.getElement('map'),
  // Default Carte
  url: import.meta.env.BASE_URL + 'carte/template.carte'
})
// Only one selction when editing features
carte.getSelect().multi_ = false;

const modify = new ModifyingInteraction({
  select : carte.getInteraction('select'),
})
carte.getMap().addInteraction(modify);

carte.getMap().addControl(notification);

// Copy/paste feature with Ctrl+C / Ctrl+V
modify.on(['cut', 'delete'], e => {
  const features = e.features || e.deleted;
  notification.info(features.length + (features.length > 1 ? ' objets supprimés.' : ' objet supprimé.'), () => {
    notification.hide();
    features.forEach(f => {
      f.layer.getSource().addFeature(f.feature);
    });
  });
});

// Paste feature with Ctrl+V
modify.on(['paste'], e => {
  const features = [];
  const layer = switcher.getSelectedLayer();
  // Check layer
  if (!layer || layer.get('type') !== 'Vector') {
    notification.warning('La couche sélectionnée ne permet pas l\'ajout d\'objets.');
    return;
  }
  // copy features
  e.features.forEach(f => {
    const feature = f.feature.clone();
    features.push({ layer: layer, feature: feature });
    layer.getSource().addFeature(feature);
  });
  // undo notification
  notification.info(features.length + ' objet(s) ajouté(s).', () => {
    notification.hide();
    features.forEach(f => {
      f.layer.getSource().removeFeature(f.feature);
    });
  });
});

// Duplicate feature
modify.on(['duplicate'], e => {
  const features = e.features || [];
  notification.info(features.length + ' objet(s) ajouté(s).', () => {
    notification.hide();
    features.forEach(f => {
      f.layer.getSource().removeFeature(f.feature);
    });
  });
});

export { notification}
export default carte