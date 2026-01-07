import charte from './charte.js'

// Menu
const help = charte.getHeaderMenu ({
  icon: 'fr-icon-question-fill',
  action: 'help',
  text: 'Aide',
})

help.addMenu([
  {
    type: 'link',
    label: 'Questions fréquentes',
    icon: 'fr-icon-question-mark',
    href: 'https://cartes.gouv.fr/aide/fr/',
  },{
    type: 'link',
    label: 'Guide d\'utilisation',
    icon: 'fr-icon-book-2-line',
    href: 'https://cartes.gouv.fr/aide/fr/guides-utilisateur/presentation-utilisateur/generalites-utilisateur/',
  },{
    type: 'link',
    label: 'Nous contacter',
    icon: 'fr-icon-mail-line',
    href: 'https://cartes.gouv.fr/nous-ecrire',
  }
])
