import openAction from '../actions/actions'
import loginDialog from '../loginDialog'
import api from 'mcutils/api/api'
import charte from './charte'
import './nav-user.scss'

// Menu
const account = charte.getHeaderMenu ({
  icon: 'fr-icon-account-fill',
  action: 'connect',
  text: 'Mon espace',
})

/* User menu */
account.addMenu([
  {
    type: 'description',
    label: 'Nom utilisateur',
    action: 'user',
    info: 'nobody@email.com'
  }, {
    type: 'link',
    label: 'Tableau de bord',
    action: 'board',
    href: '#',
    icon : 'fr-icon-dashboard-3-line'
  }, {
    type: 'link',
    label: 'Mon compte',
    action: 'account',
    href: '#',
    icon : 'fr-icon-user-line'
  }, {
    type: 'option',
    action: 'disconnect',
    label: 'Se déconnecter',
    title: 'Se déconnecter',
    href: '#',
    icon : 'fr-icon-logout-box-r-line'
  }
])

let disconnect = account.getMenu('disconnect')[0];
disconnect.link.addEventListener('click', (e) => {
  api.logout((e) => charte.setConnected(false))
})

const accountBtn = charte.getHeaderButton({
  type: 'button',
  label: 'Se connecter',
  icon: 'fr-icon-account-fill fr-btn--icon-left fr-btn--tertiary-no-outline',
  'data-action': 'login',
  click: openAction,
  'aria-controls': loginDialog.getId(),
  'data-fr-opened': false,
})

export default account;