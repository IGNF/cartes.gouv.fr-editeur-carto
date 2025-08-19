import content from './edit-infobulle.html?raw'

function onOpen() {
  console.log('on open infobulle edit')
}

const editInfobulleItem = {
  label: 'Infobulle',
  content: content,
  onOpen: onOpen
}

export default editInfobulleItem