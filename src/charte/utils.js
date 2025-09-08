import charte from './charte.js';

/**
 * Set the user from an API event
 * @param {Event} e 
 */
function setUser(e) {
  let error = e.error
  let type = e.type;
  if (e && !error && type !== 'logout') {
    let user = e.user ? e.user : e;
    charte.setConnected(true);
    charte.getHeaderMenu({ action: 'connect' }).setMenu('user', {
      label: user.username,
      info: user.email
    })
  } else {
    charte.setConnected(false)
  }
}

export { setUser }