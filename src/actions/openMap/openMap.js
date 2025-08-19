import Action from '../Action.js';
import content from './openMap.html?raw';
import connectContent from './askConnect.html?raw';
import loginDialog from '../../loginDialog.js';
import cardTemplate from './cardMapTemplate.html?raw';
import api from 'mcutils/api/api.js';
import carte from '../../carte.js';
import ol_ext_element from 'ol-ext/util/element';
import './openMap.scss';
import { htmlToNode } from '../../charte/utils.js';

const defaultImagePath = 'img/alt-image.png';

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

const buttonConnect = [
  {
    label: "Se connecter",
    kind: 1,
    close: false,
    'aria-controls': loginDialog.getId(),
    'data-fr-opened': false,
  }
];

function onOpen(e) {
  let dialog = openMapAction.getDialog();

  if (api.isConnected) {
    api.getMaps({}, getUserMaps);

  } else {
    dialog.setDialogContent(connectContent);
    dialog.setButtons(buttonConnect);
  }
}

function getUserMaps(e) {
  let dialog = openMapAction.getDialog();

  const maps = e.maps;

  if (maps && maps.length) {
    let list = ol_ext_element.create('div', {
      className: 'map-list'
    })

    maps.forEach(map => {
      if (map.type === 'macarte') {
        let card = createMapCard({
          title: map.title,
          timestamp: map.updated_at || map.created_at,
          img: map.img_url,
          id: map.view_id,
        })

        list.appendChild(card)
      }
    });

    dialog.setDialogContent(list)

    dialog.setButtons(buttons)
  } else {
    dialog.setDialogContent("<p>Vous n'avez pas de cartes enregistrées</p>")
  }
}

function selectCard(e) {
  if (e.type === 'click' || (e.type === 'keyup' && (e.code === 'Enter' || e.code === 'Space'))) {
    let dialog = openMapAction.getDialog();
    let dialogElement = dialog.getDialog();

    // Active le bouton d'ouverture
    dialog.getButton(0).disabled = false;

    // Déselctionne les autres éléments s'il y'en a
    let currents = dialogElement.querySelectorAll('[aria-current="true"]')
    currents.forEach(card => {
      card.ariaCurrent = false
    });

    let target;
    if (e.target.classList.contains('ol-map-card')) target = e.target;
    else target = e.target.closest('.ol-map-card');

    target.ariaCurrent = true;
  }
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
      hour: "2-digit",
      minute: "2-digit"
    };

    dateStr = date.toLocaleDateString('fr-FR', options)
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

function openMap(e) {
  let dialog = openMapAction.getDialog();
  let card = dialog.getDialog().querySelector('[aria-current="true"]');

  let mapId = card.dataset.mapId;

  api.getMap(mapId, (e) => {
    carte.getMap().getLayers().clear();
    setTimeout(() => {
      carte.load(e);
      dialog.close()
    }, 100)
  })
}

const openMapAction = new Action({
  title: 'Ouvrir une carte',
  content: content,
  onOpen: onOpen
})

export default openMapAction;