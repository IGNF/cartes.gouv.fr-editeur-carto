import Action from '../actions/Action.js'
import loginDialog from '../loginDialog.js'
import api from 'mcutils/api/api.js'
import charte from './charte.js'
import './nav-user.scss'
import { setUser } from './utils.js'

// Menu
const account = charte.getHeaderMenu({
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
    icon: 'fr-icon-dashboard-3-line'
  }, {
    type: 'link',
    label: 'Mon compte',
    action: 'account',
    href: '#',
    icon: 'fr-icon-user-line'
  }, {
    type: 'option',
    action: 'disconnect',
    label: 'Se déconnecter',
    title: 'Se déconnecter',
    href: '#',
    icon: 'fr-icon-logout-box-r-line'
  }
])

// Bouton de connexion
charte.getHeaderButton({
  type: 'button',
  label: 'Se connecter',
  icon: 'fr-icon-account-fill fr-btn--icon-left fr-btn--tertiary-no-outline',
  'data-action': 'login',
  'aria-controls': loginDialog.getId(),
  'data-fr-opened': false,
})

// Attend que le DSFR soit prêt pour la duplication du header
document.documentElement.addEventListener('dsfr.start', () => {
  // Bouton de déconnexion
  let disconnect = account.getMenu('disconnect');
  disconnect.forEach(btn => {
    btn.link.addEventListener('click', () => {
      api.logout(() => charte.setConnected(false))
    })
  })

  const header = document.querySelector('header')
  const loginBtn = header.querySelectorAll('button[data-action="login"]')
  loginBtn.forEach(btn => {
    btn.addEventListener('click', Action.open)
  })

  api.whoami(setUser)

  api.on('me', setUser)
})

export default account;