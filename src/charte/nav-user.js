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

// Set user account
account.setMenu('user', {
  info: 'adresseutilisateur@email.com'
})

// Get info when ready
setTimeout(() => {
  // Connect / disconnect user
  account.getMenu('disconnect').forEach(m => {
    m.link.addEventListener('click', () => {
      const connected = m.element.dataset.connected === 'false'; 
      account.setMenu('user', {
        info: connected ? 'toto@ign.fr' : 'not connected...'
      })
      account.setMenu('disconnect', {
        label: connected ? 'Se déconnecter' : 'Se connecter...',
        title: connected ? 'Se déconnecter' : 'Se connecter...',
        data: {
          connected: connected,
          parent: {
            connected: connected
          }
        },
      })
    })
  })
}, 100 /* ready */)

export default account;