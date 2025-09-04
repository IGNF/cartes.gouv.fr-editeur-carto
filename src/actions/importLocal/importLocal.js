/**
 * @file Gère l'import du fichier.
 * Ne gère que la partie import, pas la partie DOM.
 */

import * as errors from '../../utils/errors.js'
import { loadFile } from 'mcutils/dialog/dialogImportFile.js'
import * as geoimportRaw from 'geoimport';

// Pour que les tests fonctionnent
const geoimport = geoimportRaw.default ?? geoimportRaw;

import workerUrl from 'geoimport/dist/static/gdal3.js?url';
import dataUrl from 'geoimport/dist/static/gdal3WebAssembly.data?url';
import wasmUrl from 'geoimport/dist/static/gdal3WebAssembly.wasm?url';

import VectorSource from 'ol/source/Vector.js';
import VectorStyle from 'mcutils/layer/VectorStyle.js';

const accepted = [
  'application/geo+json',
  'application/vnd.geo+json', // Obsolète géojson media type
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

let metadata = {};

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
  } else if (!accepted.includes(file.type)) {
    throw new errors.UnsupportedExtensionError(file.type);
  }

  return true;
}

/**
 * 
 * @param {File} file
 */
async function importFile(file) {
  metadata = {}

  try {
    // Lis les informations du fichier
    const r = await geoimport.info(file);

    // Gestion des fichiers CSV par la méthode mcutils directement
    if (r.driverShortName === 'CSV') {
      if (r.layers[0].featureCount === 0) {
        throw new errors.EmptyLayerError(file.name);
      }

      // Métadonnée : pour retrouver l'origine de la couche
      metadata = {
        layerType: 'import-local',
        fileType: file.type,
        size: file.size
      }

      const layer = await new Promise((resolve, reject) => {
        try {
          loadFile(file, (e) => {
            try {
              resolve(processFile(e));
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

    // Gère les autres couches (dont multicouches type géopackage)
    const promises = r.layers.map(async (layer) => {
      // Réinitialise les métadonnées
      metadata = {}

      // Lis le fichier avec geoimport
      const json = await geoimport.toGeoJSON(file, { layerName: layer.name, writeBbox: true })

      // Métadonnée : pour retrouver l'origine de la couche
      metadata = {
        layerType: 'import-local',
        fileType: file.type,
        size: file.size
      }

      // Créé un nouveau fichier pour envoyer à l'application
      let geojson = new File([JSON.stringify(json)], `${json.name}`, {
        type: 'application/geo+json',
      });

      const layerObj = await new Promise((resolve, reject) => {
        try {
          loadFile(geojson, (e) => {
            try {
              resolve(processFile(e));
            } catch (err) {
              reject(err);
            }
          }, { silent: true });
        } catch (err) {
          reject(err);
        }
      });

      return layerObj;
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
function processFile(result) {
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