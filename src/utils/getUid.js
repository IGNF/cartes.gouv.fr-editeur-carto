let currentId = 0;

/** Get element Uid
 * @param {string} type
 * @param {*} obj
 */
function getUid(type, obj) {
  let id = (type || 'default') + '-' + (++currentId)
  if (obj) {
    if (obj._uid) {
      return obj._uid
    }
    if (obj.getAttribute && obj.getAttribute('id')) {
      return obj.getAttribute('id')
    }
    if (parent.id) {
      return parent.id
    }
    if (obj.setAttribute) {
      obj.setAttribute('id', id)
    } else {
      obj._uid = id;
    }
  }
  return id
}

export default getUid;