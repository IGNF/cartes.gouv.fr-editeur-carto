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
    href: '/cartes',
  },{
    type: 'link',
    label: 'Rechercher une donnée',
    icon: 'fr-icon-search-line',
    href: '/catalogue/search',
  },{
    type: 'link',
    label: 'Publier une donnée',
    icon: 'fr-icon-database-line',
    href: '/tableau-de-bord',
  },{
    type: 'link',
    label: 'Créer une carte',
    icon: 'fr-icon-brush-line',
    href: '/editeur/cartes',
  },{
    type: 'option',
    label: 'Découvrir cartes.gouv',
    title: 'Découvrir cartes.gouv',
    href: '/accueil',
    icon : 'fr-icon-external-link-line fr-btn--icon-right'
  }
])
