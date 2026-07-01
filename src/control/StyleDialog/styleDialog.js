/**
 * @file Dialogue de style utilisé notamment par le contrôle de dessin
 */

import labelForm from './labelForm.js';
import styleForm from './styleForm.js';
import PopupForm from './popupForm.js';
import { carte } from "../../story.js";
import { flatToIGNKeyValue, styleToFlatStyle } from './styleToFlatStyle.js';
import { updateCurrentStyle } from '../../mcutils/currentStyle.js';
import StyleDialog from 'geopf-extensions-openlayers/src/packages/Controls/StyleDialog/StyleDialog.js';
import "./styleDialog.scss";
import { SelectEvent } from "ol/interaction/Select.js";
import charte from '../../charte/charte.js';

const forms = [styleForm, labelForm];
const popupForm = new PopupForm({ carte: carte });

// Création du Dialog avec navigation tertiaire
const styleDialog = new StyleDialog({
  id: "style-dialog",
  title: "Dialog",
  position: "left",
  select: carte.getSelect(),
  onOpen: function () {
    if (charte.getMode() !== "editor") {
      // Empêche la modale de s'ouvrir si on n'est pas en mode édition
      this.close();
      return;
    }
    // Initialise les formulaires
    const feature = carte.getSelect().getFeatures().item(0);
    // Attendre que la feature soit prête pour récupérer son style
    setTimeout(() => {
      const flatStyle = styleToFlatStyle(feature);
      forms.forEach(form => {
        form.setFlatStyle(flatStyle);
      });
      popupForm.setFeature(feature);
    });
  },
  onClose: () => {
    // Déselectionne la sélection courante
    const features = [...carte.getSelect().getFeatures().getArray()]
    carte.getSelect().getFeatures().clear();
    carte.getSelect().dispatchEvent(new SelectEvent("select", [], [features], undefined));
  },
  forms: [
    {
      form: styleForm,
      label: "Style",
      title: "Configuration du style"
    },
    {
      form: labelForm,
      label: "Texte",
      title: "Configuration du texte"
    },
    {
      form: popupForm,
      label: "Infobulle",
      title: "Configuration de l'infobulle"
    }
  ],
  labelTabNav: "Navigation de configuration",
});

// Écouteurs d'événements "style" pour chaque formulaire
styleDialog.getForms().forEach(form => {
  form.on("style", (e) => {
    const features = carte.getSelect().getFeatures();
    if (e.property) {
      // Récupère les résultats
      const results = flatToIGNKeyValue(e.property, e.value);
      features.forEach(f => {
        // Une clé peut correspondre à plusieurs clé IGN
        // D'où le fait d'avoir un forEach
        results.forEach(({ key, value }) => {
          if (/^popup/.test(key)) {
            popupForm.setPopupContent(f, key, value);
            f.showPopup(carte.popup);
          } else {
            f.setIgnStyle(key, value);
          }
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
