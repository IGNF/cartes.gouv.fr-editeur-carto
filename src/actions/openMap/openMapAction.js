import Action from '../Action.js';
import content from './openMap.html?raw';
import loadingContent from './loading.html?raw';
import cardTemplate from './cardMapTemplate.html?raw';
import { api } from '../../api';
import carte from '../../carte.js';
import ol_ext_element from 'ol-ext/util/element.js';
import './openMap.scss';
import htmlToNode from '../../utils/htmlToNode.js';
import { loadMapFromMapId } from '../../utils/load.js';
import Alert from '../../control/Alert/Alert';

const defaultImagePath = 'img/alt-image.svg';

const buttons = [
  {
    label: "Ouvrir",
    kind: 0,
    close: false,
    disabled: true,
    callback: openMap
  },
  {
    label: "Annuler",
    kind: 1,
    close: true
  }
];

/**
 * @type {import('../../control/Dialog/AbstractDialog.js').default}
 * Dialog utilisé par l'action 
 */
let dialog;

/**
 * Fonction à l'ouverture du dialog.
 * 
 * @param {Event} e Événement générique openlayer
 * @param {import('../../control/Dialog/AbstractDialog.js').default} e.target
 * Dialog utilisé par l'action
 */
async function onOpen(e) {
  dialog = e.target;


  // Nombre de fois max où l'on fait des appels à l'API.
  const maxRefetchCount = 4;
  let refetchCount = 0;
  const load = async () => {
    const { data, status } = await api.map.getMaps({ context: "profile", limit: "all" });
    if (refetchCount >= maxRefetchCount) {
      refetchCount = 0;
      dialog.setDialogContent('<p class="fr-message fr-message--error">Une erreur est survenue.</p>');
    } else if (status !== 200 && status !== 206) {
      refetchCount++;
      load();
    } else {
      refetchCount = 0;
      getUserMaps(data);
    }
  }

  // Check if map has changed
  if (carte.hasChanged()) {
    dialog.setDialogContent('<p>La carte a été modifiée. Voulez-vous continuer sans enregistrer ?</p>');
    dialog.setButtons([{
      label: 'Annuler',
      kind: 0,
      close: true
    }, {
      label: 'Continuer',
      kind: 1,
      close: false,
      callback: () => {
        dialog.setDialogContent(loadingContent);
        dialog.setButtons();
        load();
      }
    }]);
  } else {
    dialog.setDialogContent(loadingContent);
    dialog.setButtons();
    load();
  }
}

/**
 * 
 * @param {import('../../api/model').MapResearch} data event renvoyé par l'API getMaps
 */
function getUserMaps(data) {
  const { maps } = data;
  if (!maps.length) {
    dialog.setDialogContent("<p>Vous n'avez pas de cartes enregistrées</p>");
    return;
  }

  const content = ol_ext_element.create('div', {
    className: 'map-list'
  })

  /*
  TODO: ajouter un champ de recherche et
    outil de filtrage
  */
  // Filter liste des cartes en fonction du champ de recherche
  const filtermap = function () {
    content.querySelectorAll('.ol-map-card').forEach((/** @type {Element} */ card) => {
      const title = card.querySelector('.ol-map-card__title').textContent;
      const rex = new RegExp(filterInput.value, 'i');
      if (rex.test(title)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }

  let tout;
  const filterInput = ol_ext_element.create('input', {
    className: 'fr-input',
    id: 'map-filter',
    placeholder: 'Rechercher',
    parent: content,
    on: {
      // Filter on keyup
      keyup: () => {
        if (tout) clearTimeout(tout);
        tout = setTimeout(filtermap, 300);
      }
    }
  })
  // Icône de recherche dans le champ de recherche
  ol_ext_element.create('span', {
    className: 'fr-icon-search-line fr-icon--sm',
    "aria-hidden": true,
    parent: content,
  })

  console.log(maps);

  maps.forEach(map => {
    if (map.type === 'macarte') {
      let card = createMapCard({
        title: map.title,
        timestamp: map.updated_at || map.created_at,
        img: map.img_url,
        id: map.view_id,
      })

      content.appendChild(card)
    }
  });

  dialog.setDialogContent(content)

  dialog.setButtons(buttons);
}

/**
 * 
 * @param {string} title 
 * @param {string} timestamp 
 * @param {string} img 
 * @param {string} id Id de la carte à modifier (pour la récupérer)
 * @returns {ChildNode}
 */
function createMapCard({ title, timestamp, img, id }) {
  let src = img ? img : defaultImagePath;
  let mapTitle = title ? title : '';
  let date = new Date(timestamp);
  let dateStr = '';
  if (date) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const localDate = date.toLocaleDateString('fr-FR', options);
    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit"
    };
    const time = date.toLocaleTimeString('fr-FR', timeOptions).replace(":", "h");

    dateStr = `${localDate}, ${time}`;
  }

  let template = cardTemplate.replace('$IMG_SRC', src);
  template = template.replace('$MAP_TITLE', mapTitle);
  template = template.replace('$TIMESTAMP', dateStr);

  let card = htmlToNode(template);

  card.addEventListener('click', selectCard);
  card.addEventListener('keyup', selectCard);

  card.dataset.mapId = id;

  return card;
}


function selectCard(e) {
  if (e.type === 'click' || (e.type === 'keyup' && (e.code === 'Enter' || e.code === 'Space'))) {
    // Active le bouton d'ouverture
    dialog.getButton(0).disabled = false;

    // Déselctionne les autres éléments s'il y'en a
    let currents = dialog.querySelectorAll('[aria-current="true"]')
    currents.forEach(card => {
      card.ariaCurrent = false
    });

    let target;
    if (e.target.classList.contains('ol-map-card')) target = e.target;
    else target = e.target.closest('.ol-map-card');

    target.ariaCurrent = true;
  }
}

async function openMap() {
  const card = dialog.querySelector('[aria-current="true"]');

  const mapId = card.dataset.mapId;

  const loaded = loadMapFromMapId(carte, mapId);
  loaded.then((bool => {
    dialog.close();
    if (bool) {
      Alert.addAlert({
        id: "map-loaded--success",
        type: "success",
        small: true,
        description: "La carte a été chargée avec succés.",
        closable: true,
      })
    } else {
      Alert.addAlert({
        id: "map-loaded--error",
        type: "error",
        small: true,
        description: "Une erreur est survenue. La carte n'a pas pu être chargée.",
        closable: true,
      })
    }
  }))
}

const openMapAction = new Action({
  id: 'open-map',
  title: 'Mes cartes',
  content: content,
  onOpen: onOpen
})

export default openMapAction;