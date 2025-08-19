import content from './edit-style.html?raw'

function onOpen() {
  console.log('on open style edit')
}

const editStyleItem = {
  label: 'Style',
  content: content,
  onOpen: onOpen
}

export default editStyleItem