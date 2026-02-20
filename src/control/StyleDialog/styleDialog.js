import Dialog from 'geopf-extensions-openlayers/src/packages/Controls/Toggle/Dialog.js';
import labelForm from './labelForm.js';
import styleForm from './styleForm.js';
import carte from "../../carte.js";
import { flatToIGNKeyValue, styleToFlatStyle } from './styleToFlatStyle.js';

const forms = [styleForm, labelForm];

// Création du Dialog avec navigation tertiaire
const styleDialog = new Dialog({
  id: "style-dialog",
  title: "Dialog",
  position: "left",
  onOpen: function () {
    // Initialise les formulaires
    const features = carte.getSelect().getFeatures();
    forms.forEach(form => {
      form.setFlatStyle(styleToFlatStyle(features.item(0)));
    });
  },
  onClose: function () {
    // Désl
    carte.getSelect().getFeatures().clear();
    carte.getSelect().dispatchEvent("select");
  },
  items: [
    {
      label: "Style",
      content: styleForm.getContent(),
      title: "Configuration du style"
    },
    {
      label: "Texte",
      content: labelForm.getContent(),
      title: "Configuration du texte"
    },
    {
      label: "Infobulle",
      content: "<p>Onglet Infobulle</p>",
      title: "Configuration de l'infobulle"
    },
    {
      label: "Attributs",
      content: "<p>Onglet Attributs</p>",
      title: "Configuration des attributs"
    }
  ],
  labelTabNav: "Navigation de configuration",
});

// Écouteurs d'événements "style" pour chaque formulaire
forms.forEach(form => {
  /* Listen style changes from style form */
  form.on("style", (e) => {
    const features = carte.getSelect().getFeatures();
    // Live change
    if (e.property) {
      features.forEach(f => {
        const { key, value } = flatToIGNKeyValue(e.property, e.value);
        f.setIgnStyle(key, value);
        f.changed()
      });
    } else {
      /* TODO: Appliquer le style à la ou les features sélectionnées */
      console.log('changer le style ?', e);
    }
  })
})

export default styleDialog;