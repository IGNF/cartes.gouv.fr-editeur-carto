import carte from '../../carte.js';
import './dropMap.css'

// Drop zone
let dragtout;
const dropZone = document.body.querySelector('[data-role="map"]') || document.body.querySelector('[data-role="storymap"]');

// Show drop zone on file drag
['dragenter', 'dragover'].forEach(evt => {
  dropZone.addEventListener(evt, () => {
    clearTimeout(dragtout);
    dropZone.dataset.drop = '';
  })
});
// Remove drop zone on leave
dropZone.addEventListener('dragleave', () => {
  dragtout = setTimeout(() => delete dropZone.dataset.drop, 100)
})
dropZone.addEventListener('dragend', () => {
  delete dropZone.dataset.drop
})

// Drop files
dropZone.addEventListener('drop', e => {
  if (e.target.type !== 'file') e.preventDefault();
  delete dropZone.dataset.drop;
  const files = e.dataTransfer.files;
  if (files.length) {
    setTimeout(() => loadFiles(files), 200)
  }
});

// Prevent drop on document (but input:file)
['dragover', 'drop'].forEach(evt => {
  window.addEventListener(evt, e => {
    if (e.target.tagName !== 'INPUT' || e.target.type !== 'file') {
        e.preventDefault()
    }
  });
});


/** Load file on drop
 * @param {FileList} files
 */
function loadFiles(files) {
  const file = files[0];
  // Only .carte files
  if (file.name.endsWith('.carte')) {
    const reader = new FileReader();
    // Load carte
    reader.onload = function () {
      const json = JSON.parse(reader.result);
      carte.read(json);
    }
    // Error handler : corrupted file content, etc ... : do not add it to the map
    reader.addEventListener('error', () => {
      console.error(`Error occurred reading file: ${file.name}`);
    });
    // read
    reader.readAsText(file);
  }
}