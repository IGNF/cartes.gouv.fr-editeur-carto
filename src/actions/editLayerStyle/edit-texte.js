import content from './edit-texte.html?raw'

function onOpen() {
  console.log('on open texte edit')
}

const editTexteItem = {
  label: 'Texte',
  content: content,
  onOpen: onOpen
}

export default editTexteItem