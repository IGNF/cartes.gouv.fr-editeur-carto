import content from './edit-attribute.html?raw'

function onOpen() {
  console.log('on open attribute edit')
}

const editAttributeItem = {
  label: 'Attribut',
  content: content,
  onOpen: onOpen
}

export default editAttributeItem