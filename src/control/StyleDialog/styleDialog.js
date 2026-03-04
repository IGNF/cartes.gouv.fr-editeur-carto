import Dialog from 'geopf-extensions-openlayers/src/packages/Controls/Toggle/Dialog.js';
import labelForm from './labelForm.js';
import styleForm from './styleForm.js';
import carte from "../../carte.js";
import { flatToIGNKeyValue, styleToFlatStyle } from './styleToFlatStyle.js';
import { updateCurrentStyle } from '../../mcutils/currentStyle.js';

const forms = [styleForm, labelForm];

// Création du Dialog avec navigation tertiaire
const styleDialog = new Dialog({
  id: "style-dialog",
  title: "Dialog",
  position: "left",
  onOpen: function () {
    // Initialise les formulaires
    const feature = carte.getSelect().getFeatures().item(0);
    // Attendre que la feature soit prête pour récupérer son style
    setTimeout(() => {
      const flatStyle = styleToFlatStyle(feature);
      forms.forEach(form => {
        form.setFlatStyle(flatStyle);
      });
    });
  },
  onClose: function () {
    // Déselectionne la sélection courante
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
  form.on("style", (e) => {
    const features = carte.getSelect().getFeatures();
    if (e.property) {
      // Récupère les résultats
      const results = flatToIGNKeyValue(e.property, e.value);
      features.forEach(f => {
        // Une clé peut correspondre à plusieurs clé IGN
        // D'où le fait d'avoir un
        results.forEach(({ key, value }) => {
          f.setIgnStyle(key, value);
        })
        // Met à jour le style courant
        updateCurrentStyle(f);
        f.changed();
      });
    } else {
      /* TODO: Appliquer le style à la ou les features sélectionnées */
      console.log('changer le style ?', e);
    }
  })
})

export default styleDialog;
