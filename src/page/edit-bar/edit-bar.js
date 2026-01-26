import carte from '../../carte.js';

import Bar from 'ol-ext/control/Bar.js';
import Toggle from 'ol-ext/control/Toggle.js';
import { DrawingInteraction as Drawing, Draw } from 'geopf-extensions-openlayers';
import styleDialog, { styleForm } from '../../control/StyleDialog/styleDialog.js';
import switcher from '../../mcutils/layerSwitcher.js';
import VectorSource from 'ol/source/Vector.js';

import Action from '../../actions/Action.js';
import notification from '../../control/Notification/notification.js';

import './edit-bar.scss';
import rightPanel from '../../dialogs/rightPanel.js';
import { flatToIgnKey, styleToFlatStyle } from '../../control/StyleDialog/styleToFlatStyle.js';

// TODO : mieux gérer les toggle d'édition / mesure
// et leur lien avec l'interaction de sélection

/**
 * @type {Toggle}
 */
let activeToggle;

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
      // if (activeToggle && activeToggle.getActive()) {
      //   // Simule un click sur le toggle
      //   activeToggle.button_? activeToggle.button_.click() : activeToggle.setActive(false)
      // }
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

// let drawToggle = new Toggle({
//   classButton: 'fr-btn fr-btn--tertiary-no-outline ri-pen-nib-line',
//   attributes: {
//     'data-action': 'create-object',
//     'aria-controls': rightPanel.getId(),
//     title: "Annoter la carte",
//     'aria-label': "Annoter la carte",
//   },
//   onToggle: onToggleAction
// });

let drawToggle = new Draw({
  position: "right",
  title: "Annoter la carte",
  select: carte.getSelect()
});

const typeObjects = {
  "Multi": {
    icon: "fr-icon-map-pin-2-line",
    label: "Multiple",
  },
  "Point": {
    icon: "fr-icon-map-pin-2-line",
    label: "Point",
  },
  "LineString": {
    icon: "fr-icon-ign-dessiner-trace-line",
    label: "Ligne",
  },
  "Polygon": {
    icon: "fr-icon-ign-shape-3-fill",
    label: "Surface",
  }
}

Object.keys(typeObjects).forEach(k => {
  if (k === "Multi") return;
  const obj = typeObjects[k];
  const interaction = new Drawing({
    type: k,
    select: drawToggle.select,
    selectOnDrawEnd: true,
  })
  interaction.setActive(false);
  drawToggle.addInteraction({
    interaction: interaction,
    icon: obj.icon,
    label: obj.label,
  });
})

const onSelect = (e) => {
  // Selected features
  const features = e.target.getFeatures();
  // styleForm.setFeatures(features.getArray());
  // At least one feature selected
  if (features.getLength()) {
    // Update styleform
    styleForm.setFlatStyle(styleToFlatStyle(features.item(0)));
    // Geometry lists
    const gTypes = {};
    features.forEach(f => {
      gTypes[f.getGeometry().getType()] = true;
    })
    const geomType = Object.keys(gTypes).length > 1 ? 'Multi' : features.item(0).getGeometry().getType();
    // Title
    styleDialog.setDialogTitle(typeObjects[geomType].label);
    styleDialog.setIcon(typeObjects[geomType].icon);
    // Content class
    styleDialog.getDialogContent().className = 'GPF-dialog__content ' + Object.keys(gTypes).join(' ');
    // Show dialog
    styleDialog.show();
  } else {
    styleDialog.close();
  }
}
// drawToggle.getSelect().on("select", onSelect)
carte.getSelect().on("select", onSelect)

/* Listen style changes from style form */
styleForm.on("style", (e) => {
  const features = carte.getSelect().getFeatures();
  // Live change
  if (e.property) {
    features.forEach(f => {
      f.setIgnStyle(flatToIgnKey(e.property), e.value);
      f.changed()
    });
  } else {
    /* TODO: Appliquer le style à la ou les features sélectionnées */
    console.log('changer le style ?', e);
  }
})

/* Update drawing interaction source on layer switch */
switcher.on("layerswitcher:change:selected", (e) => {
  if (e.layer?.getSource() instanceof VectorSource) {
    drawToggle.toggleInteractions.forEach(toggle => {
      toggle.getInteraction().setSource?.(e.layer?.getSource());
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

// // Gère l'activation du toggle de sélection
// const interactionToggles = [drawToggle, measureToggle]
// interactionToggles.forEach((toggle) => {
//   toggle.on('change:active', (e) => {
//     if (e.target.get(e.key) || e.active) {
//       activeToggle = e.target;
//       selectToggle.setActive(false);
//     } else if (!(drawToggle.getActive() || measureToggle.getActive())) {
//       // Les deux sont désactivés, on réactive la sélection
//       selectToggle.setActive(true);
//       activeToggle = null;
//     }
//   })
// })

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

// drawToggle.on("change:active", (e) => {
//   if (e.target.get(e.key)) {
//     console.log(switcher.getSelectedLayer());
//     selectToggle.getInteraction().getFeatures().clear();
//     activeToggle = e.target;
//     if (rightPanel.getDialog().open) {
//       rightPanel.close();
//     }
//   }
// })


drawToggle.dialog.on("dialog:open", (e) => {
  if (!(switcher.getSelectedLayer()?.getSource() instanceof VectorSource)) {
    notification.error("La couche sélectionné n'est pas éditable. Sélectionnez en une ou le dessin ne sera pas ajouté à la couche");
  }
})
drawToggle.on("drawstart", (e) => {
  if (!(switcher.getSelectedLayer()?.getSource() instanceof VectorSource) && e.target.type_ !== "Point") {
    notification.error("La couche sélectionné n'est pas éditable. Sélectionnez en une ou le dessin ne sera pas ajouté à la couche");
  }
})
drawToggle.on("drawend", () => {
  if (!(switcher.getSelectedLayer()?.getSource() instanceof VectorSource)) {
    notification.error("La couche sélectionné n'est pas éditable. Le dessin n'est pas ajouté à la couche");
    drawToggle.select.clear ? drawToggle.select.clear() : drawToggle.select.getFeatures().clear();
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

mainbar.setPosition('right')

export { drawToggle };