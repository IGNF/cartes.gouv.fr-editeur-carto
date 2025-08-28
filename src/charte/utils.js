import charte from './charte.js';

/**
 * Set the user from an API event
 * @param {Event} e 
 */
function setUser(e) {
  if (e && !e.error) {
    charte.setConnected(true);
    charte.getHeaderMenu({ action: 'connect' }).setMenu('user', {
      label: e.username,
      info: e.email
    })

  } else {
    charte.setConnected(false)
  }
}

export { setUser }