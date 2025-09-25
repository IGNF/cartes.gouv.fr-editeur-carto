import charte from './charte.js'

// Menu
const service = charte.getHeaderMenu({
  action: 'services',
  html: '<i class="fr-mr-1w ri-lg ri-grid-fill"></i>Services',
  text: 'Services',
})

service.addMenu([
  {
    type: 'link',
    label: 'Explorer les cartes',
    icon: 'fr-icon-road-map-line',
    url: '#',
  },{
    type: 'link',
    label: 'Rechercher une donnée',
    icon: 'fr-icon-search-line',
    url: '#',
  },{
    type: 'link',
    label: 'Publier une donnée',
    icon: 'fr-icon-database-line',
    url: '#',
  },{
    type: 'link',
    label: 'Créer une carte',
    icon: 'fr-icon-brush-line',
    url: '#',
  },{
    type: 'option',
    action: 'disconnect',
    label: 'Découvrir cartes.gouv',
    title: 'Découvrir cartes.gouv',
    href: '#',
    icon : 'fr-icon-external-link-line fr-btn--icon-right'
  }
])
