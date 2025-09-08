/**
 * @file Gère l'import du fichier.
 * Ne gère que la partie import, pas la partie DOM.
 */

import * as errors from '../../utils/errors.js'
import { loadFile } from 'mcutils/dialog/dialogImportFile.js'
import * as geoimportRaw from 'geoimport';
import ol_format_GeoJSON from 'ol/format/GeoJSON.js'

import workerUrl from 'geoimport/dist/static/gdal3.js?url';
import dataUrl from 'geoimport/dist/static/gdal3WebAssembly.data?url';
import wasmUrl from 'geoimport/dist/static/gdal3WebAssembly.wasm?url';

import VectorSource from 'ol/source/Vector.js';
import VectorStyle from 'mcutils/layer/VectorStyle.js';

// Pour que les tests fonctionnent
const geoimport = geoimportRaw.default ?? geoimportRaw;

/** Liste des formats acceptés */
const accepted = [
  'application/geo+json',
  'application/vnd.geo+json', // Obsolète géojson media type
  '.geojson',
  'application/json',
  'application/vnd.google-earth.kml+xml',
  'application/geopackage+sqlite3', // Geopackage
  '.gpkg',
  'application/gpx+xml', // Gpx
  '.gpx',
  'application/zip',
  'application/x-zip-compressed', // Windows zip
  'application/x-7z-compressed', // Fichiers 7zip
  '.zip',
  'text/csv',
  'application/vnd.ms-excel', // Windows csv
]
// Fichiers excel :
// 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
// 'application/vnd.oasis.opendocument.spreadsheet',

// Initialise geoimport
geoimport.init({
  paths: {
    wasm: wasmUrl,
    data: dataUrl,
    js: workerUrl,
  },
  useWorker: false,
});

/**
 * Fonction permettant de valider le formulaire.
 * Renvoie des exceptions en cas de problème.
 * @param {File|null} file Fichier envoyé (null si aucun fichier n'est mis)
 * 
 * @throws {errors.MissingFileError} Fichier manquant
 * @throws {errors.UnsupportedExtensionError} Extension non supportée
 */
function checkFile(file) {
  // Input du fichier
  if (!file) {
    throw new errors.MissingFileError();
  } else {
    // Test extension
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!accepted.includes(file.type) && !accepted.includes(ext)) {
      throw new errors.UnsupportedExtensionError(file.type);
    }
  }

  return true;
}

/** Type de fichier
 * @param {File} file
 * @returns {string}
 */
function getDriver(file) {
  switch (file.type) {
    case 'application/geo+json':
    case 'application/vnd.geo+json':
    case 'application/json':
      return 'GeoJSON';
    case 'application/vnd.google-earth.kml+xml': return 'KML';
    case 'application/geopackage+sqlite3': return 'GPKG';
    case 'application/gpx+xml': return 'GPX';
    case 'application/zip':
    case 'application/x-zip-compressed':
    case 'application/x-7z-compressed':
      return 'ZIP'
    case 'text/csv':
    case 'application/vnd.ms-excel':
      return 'CSV'
    default: {
      const ext = file.name.split('.').pop().toLowerCase()
      switch (ext) {
        case 'gpkg': return 'GPKG';
        case 'gpx': return 'GPX'
        case 'zip': return 'ZIP'
        case 'geojson': return 'GeoJSON'
      }
    }
  }
  return ''
}

/**
 * 
 * @param {File} file
 */
async function importFile(file) {
  try {
    // Gestion des fichiers CSV/GeoJSON par la méthode mcutils directement
    if (/^(CSV|GeoJSON)$/.test(getDriver(file))) {
      // Métadonnée : pour retrouver l'origine de la couche
      const metadata = {
        layerType: 'import-local',
        fileType: file.type,
        size: file.size
      }

      const layer = await new Promise((resolve, reject) => {
        try {
          loadFile(file, (e) => {
            try {
              // Problème à l'import
              if (e.features.layer === 0 || e.error) {
                throw new errors.EmptyLayerError(file.name);
              }
              resolve(processFile(e, metadata));
            } catch (err) {
              reject(err);
            }
          }, { silent: true });
        } catch (err) {
          reject(err);
        }
      });

      // Retourne un array pour unifier le résultat avec les autres
      // type de fichiers
      return Promise.allSettled([layer]);
    }

    // Contenu du fichier
    const r = await geoimport.info(file);

    // Gère les autres couches (dont multicouches type géopackage)
    const promises = r.layers.map(async (layer) => {
      // Lis le fichier avec geoimport
      const json = await geoimport.toGeoJSON(file, { layerName: layer.name, writeBbox: true })

      // Métadonnée : pour retrouver l'origine de la couche
      const metadata = {
        layerType: 'import-local',
        fileType: file.type,
        size: file.size
      }

      // Read GeoJSON
      const format = new ol_format_GeoJSON();
      const features = format.readFeatures(json, {
        featureProjection: 'EPSG:3857'
      })

      return processFile({
        name: json.name,
        features: features
      }, metadata)

    });

    return Promise.allSettled(promises);
  } catch (err) {
    // Gère le cas du shapefile
    if (err instanceof Array && err.length) {
      let msg = err[0].message;
      let regex = /Unable to open .*(input\/.*\.shx)/;
      let match = regex.exec(msg);
      if (match) {
        let fileName = match.at(1).slice(6);
        throw new errors.MissingFileInZipError(fileName);
      }
      // Sinon, renvoie l'erreur normale
    } else {
      throw err
    }
  }
}

/**
 * Function permettant de gérer le fichier une fois lu.
 * 
 * @param {Object} result Résultat de la fonction de lecture du fichier
 * @param {Array<import("ol").Feature>|boolean} result.features
 * Array de features à ajouter. Faux si aucune feature n'est à ajouter.
 * @param {String} result.name Nom de la couche.
 * @param {String} result.fileName Nom du fichier en entrée.
 * @param {String} [result.data] Résultat brut de la lecture du fichier
 * si aucune feature n'est trouvé.
 * @param {Object} [result.carte] Carte au format JSON (si le fichier donnéeen entrée est une carte).
 * @param {HTMLFormElement} form Formulaire de l'ajout de fichier.
 * @returns {VectorStyle} Couche vectorielle
 */
function processFile(result, metadata) {
  const name = result.name;
  if (result.features) {
    // let layer = new VectorLayer({
    let layer = new VectorStyle({
      type: 'Vector',
      title: name,
      source: new VectorSource(),
      metadata: metadata,
    });
    // Ajout des features à la couche
    layer.getSource().addFeatures(result.features);
    return layer;
  } else {
    throw new errors.EmptyLayerError;
  }
}

export { accepted, checkFile, processFile, importFile };