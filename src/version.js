import ver from '../package.json'
import mcutils from 'mcutils/package.json'
import dsfr from 'dsfrign/package.json'
import gpf from 'geoportal-access-lib/package.json'
import gpfol from 'geopf-extensions-openlayers/package.json'
import ol from 'ol/package.json'
import olext from 'ol-ext/package.json'

const lib = [
  mcutils,
  dsfr,
  gpf, 
  ol,
  gpfol,
  olext
]
const libinfo = lib.map(l => l.name + ' - v.' + l.version)

// Display project info
console.log(
  '%cCarte.gouv %cby IGN\n%c' + ver.name + '%c v.' + ver.version + '%c\n' + libinfo.join('\n'),
  "font-size: 34px;",
  "font-size: 24px; color: #333;",
  "font-size: 24px; color: brown;",
  "color: #333; font-weight: bold;",
  "color: #333;"
)