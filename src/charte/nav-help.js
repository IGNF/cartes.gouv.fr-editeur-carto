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
    href: '/documentation/fr',
  },{
    type: 'link',
    label: 'Documentation',
    icon: 'fr-icon-file-text-line',
    href: '/documentation/fr/guides-utilisateur/editeur-cartographique',
  },{
    type: 'link',
    label: 'Nous contacter',
    icon: 'fr-icon-mail-line',
    href: '/nous-ecrire',
  }
])
