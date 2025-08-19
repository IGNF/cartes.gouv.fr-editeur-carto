import charte from './charte'

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
    url: '#',
  },{
    type: 'link',
    label: 'Documentation',
    icon: 'fr-icon-file-text-line',
    url: '#',
  },{
    type: 'link',
    label: 'Nous ocntacter',
    icon: 'fr-icon-mail-line',
    url: '#',
  }
])
