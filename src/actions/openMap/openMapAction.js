import Action from '../Action.js';
import content from './openMap.html?raw';
import connectContent from './askConnect.html?raw';
import loadingContent from './loading.html?raw';
import loginDialog from '../../dialogs/loginDialog.js';
import cardTemplate from './cardMapTemplate.html?raw';
import api from 'mcutils/api/api.js';
import carte from '../../carte.js';
import ol_ext_element from 'ol-ext/util/element.js';
import './openMap.scss';
import htmlToNode from '../../utils/htmlToNode.js';
import modal from '../../dialogs/modal.js';

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

const buttonConnect = [
  {
    label: 'Se connecter',
    kind: 1,
    close: true,
    'data-action': 'login',
    'aria-controls': loginDialog.getId(),
    'data-fr-opened': false,
    callback: (e) => {
      Action.open(e);
      console.log(loginDialog)
      loginDialog.once(loginDialog.selectors.CLOSE_EVENT, () => {
        Action.open(modal, 'open-map');
      })
    }
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
function onOpen(e) {
  dialog = e.target;

  const load = () => {
    dialog.setDialogContent(loadingContent);
    dialog.setButtons();
    if (api.isConnected()) {
      api.getMaps({}, (e) => getUserMaps(e, dialog));
    } else {
      dialog.setDialogContent(connectContent);
      dialog.setButtons(buttonConnect);
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
      callback: load
    }]);
  } else {
    load();
  }
}

/**
 * 
 * @param {*} e event renvoyé par l'API getMaps
 */
function getUserMaps(e) {
  const maps = e.maps;

  if (e.error) {
    if (e.status === 401) {
      dialog.setDialogContent('<p class="fr-message fr-message--error">Vous devez être connecté pour accéder à vos cartes</p>')
    } else {
      dialog.setDialogContent('<p class="fr-message fr-message--error">Impossible de charger les cartes</p>')
    }
  } else if (maps && maps.length) {
    const content = ol_ext_element.create('div', {
      className: 'map-list'
    })

    /*
    TODO: ajouter un champ de recherche et
     outil de filtrage
    */
    // Filter liste des cartes en fonction du champ de recherche
    const filtermap = function () {
      list.querySelectorAll('.ol-map-card').forEach(card => {
        const title = card.querySelector('.ol-map-card__title').textContent;
        const rex = new RegExp(filterInput.value, 'i');
        if (rex.test(title)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    }

    let tout
    const filterInput = ol_ext_element.create('input', {
      className: 'fr-input fr-icon-search-line',
      id: 'map-filter',
      placeholder: 'Rechercher',
      parent: content,
      'aria-controls': 'openmap-list',
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


    const list = ol_ext_element.create('div', {
      className: 'map-list__list',
      id: 'openmap',
      parent: content
    });



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

    dialog.setDialogContent(content)

    dialog.setButtons(buttons)
  } else {
    dialog.setDialogContent("<p>Vous n'avez pas de cartes enregistrées</p>")
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
  console.log(timestamp, date)
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


function openMap() {
  let card = dialog.querySelector('[aria-current="true"]');

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
  id: 'open-map',
  title: 'Mes cartes',
  content: content,
  onOpen: onOpen
})

export default openMapAction;