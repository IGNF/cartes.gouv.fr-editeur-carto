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
    href: '/explorer-les-cartes',
  },{
    type: 'link',
    label: 'Rechercher une donnée',
    icon: 'fr-icon-search-line',
    href: '/rechercher-une-donnee/search',
  },{
    type: 'link',
    label: 'Publier une donnée',
    icon: 'fr-icon-database-line',
    href: '/publier-une-donnee',
  },{
    type: 'link',
    label: 'Créer une carte',
    icon: 'fr-icon-brush-line',
    href: '/editeur',
  },{
    type: 'option',
    label: 'Découvrir cartes.gouv.fr',
    title: 'Découvrir cartes.gouv.fr',
    href: '/decouvrir',
    icon : 'fr-icon-external-link-line fr-btn--icon-right'
  }
])
