import carte from '../../carte.js';

import Bar from 'ol-ext/control/Bar.js';
import Toggle from 'ol-ext/control/Toggle.js';
import styleDialog from '../../control/StyleDialog/styleDialog.js';
import switcher from '../../mcutils/layerSwitcher.js';
import VectorSource from 'ol/source/Vector.js';
import drawToggle from "./drawToggle.js";

import Action from '../../actions/Action.js';
import notification from '../../control/Notification/notification.js';

import './edit-bar.scss';
import rightPanel from '../../dialogs/rightPanel.js';
import { Snap } from 'ol/interaction.js';
import getCurrentStyle from '../../mcutils/currentStyle.js';

// TODO : mieux gérer les toggle d'édition / mesure
// et leur lien avec l'interaction de sélection

/**
 * @type {Toggle}
 */
let toggle;
// Fonction temporaire pour les toggle
// (les toggle n'envoient pas d'événement au click)
function onToggleAction() {
  // Désactive le toggle précédent
  if (toggle && toggle !== this) {
    toggle !== drawToggle && toggle.setActive(false);
  }
  toggle = this;
  let e = new CustomEvent('click', {
    detail: {
      'target': toggle.button_,
    }
  });
  Action.open(e);
}

rightPanel.onClose(() => {
  closeToggle(toggle)
}, false)

/**
 * Ferme le toggle à la fermeture du dialog
 * @param {Event} e 
 * @param {Toggle} toggle 
 */
function closeToggle(toggle) {
  if (toggle.getActive()) {
    toggle.setActive(false)
  }
}

// Interaction de select
let selectToggle = new Toggle({
  classButton: 'fr-btn fr-btn--tertiary-no-outline ri-cursor-line',
  attributes: {
    title: "Sélecteur",
    'aria-label': "Sélecteur",
  },
  interaction: carte.getSelect(),
  active: true,
  onToggle: function (e) {
    if (e) {
      carte.getSelect().clear();
    }
  }
});

// Barre ajout de donnée
let catalogue = new Toggle({
  classButton: 'fr-btn fr-btn--tertiary-no-outline ri-map-2-line',
  attributes: {
    'data-action': 'import-catalog',
    'aria-controls': rightPanel.getId(),
    title: "Importer une donnée depuis cartes.gouv",
    'aria-label': "Importer une donnée depuis cartes.gouv",
  },
  onToggle: onToggleAction
});

let file = new Toggle({
  classButton: 'fr-btn fr-btn--tertiary-no-outline ri-file-upload-line',
  attributes: {
    'data-action': 'import-local',
    'aria-controls': rightPanel.getId(),
    title: "Importer une donnée locale",
    'aria-label': "Importer une donnée locale",
  },
  onToggle: onToggleAction
});

let addDataBar = new Bar({
  toggleOne: true,
  controls: [
    catalogue,
    file,
  ]
});


// Interaction Snap
let snap = new Snap({ source: switcher.getSelectedLayer()?.getSource() });
/* Update drawing interaction source on layer switch */
switcher.on("layerswitcher:change:selected", (e) => {
  if (e.layer?.getSource() instanceof VectorSource) {
    drawToggle.toggleInteractions.forEach(toggle => {
      toggle.getInteraction().setSource?.(e.layer?.getSource());
    })

    // Ajoute aussi une interaction de snap
    snap && carte.getMap().removeInteraction(snap);
    snap = new Snap({ source: e.layer.getSource() });
    carte.getMap().addInteraction(snap);
  } else {
    // Enlève la source du dessin
    drawToggle.toggleInteractions.forEach(toggle => {
      snap && carte.getMap().removeInteraction(snap);
      toggle.getInteraction().setSource?.();
    })
  }
})


let measureToggle = new Toggle({
  classButton: 'fr-btn fr-btn--tertiary-no-outline ri-ruler-line ',
  attributes: {
    'data-action': 'measure',
    'aria-controls': rightPanel.getId(),
    title: "Mesurer",
    'aria-label': "Mesurer",
  },
  onToggle: onToggleAction
});

// Barre d'interaction
let interactionBar = new Bar({
  // toggleOne: true, // Ne fonctionne pas en liant les contrôles ol-ext et geopf 
  controls: [
    drawToggle,
    measureToggle,
  ]
})

// Barre d'édition
let editDataBar = new Bar({
  controls: [
    interactionBar,
  ]
})

drawToggle.dialog.on("dialog:open", () => {
  if (!(switcher.getSelectedLayer()?.getSource() instanceof VectorSource)) {
    notification.error("La couche sélectionnée n'est pas éditable. Sélectionnez en une ou le dessin ne sera pas ajouté à la couche");
  }
})
drawToggle.on("drawstart", (e) => {
  if (!(switcher.getSelectedLayer()?.getSource() instanceof VectorSource) && e.target.type_ !== "Point") {
    notification.error("La couche sélectionnée n'est pas éditable. Sélectionnez en une ou le dessin ne sera pas ajouté à la couche");
  }
})
drawToggle.on("drawend", (e) => {
  if (!(switcher.getSelectedLayer()?.getSource() instanceof VectorSource)) {
    notification.error("La couche sélectionnée n'est pas éditable. Le dessin n'est pas ajouté à la couche");
    e.preventDefault();
    drawToggle.select.clear ? drawToggle.select.clear() : drawToggle.select.getFeatures().clear();
  } else {
    e.feature?.setIgnStyle(getCurrentStyle());
  }
})

rightPanel.on("dialog:open", () => {
  drawToggle.getActive() && drawToggle.setActive(false);
})

// Barre principale
let mainbar = new Bar({
  className: 'ol-bar--separator edit-bar',
  toggleOne: true,
  controls: [selectToggle, addDataBar, editDataBar]
})

carte.addControl('mainBar', mainbar)
carte.addControl("styleDialog", styleDialog);

mainbar.setPosition('right');