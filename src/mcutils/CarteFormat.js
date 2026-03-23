import BaseFormat from 'mcutils/format/Carte.js';
import { ignStyleDef } from 'mcutils/style/ignStyleFn.js';

/** Base class for reading / writing .macarte
 * @memberof mcutils.format
 * @api
 */
class CarteFormat extends BaseFormat {
  /** Constructor 
   */
  constructor() {
    super();
  }

  /** Write method
   * @param {mcutils.Carte} carte
   * @param {boolean} uncompressed if true, the output will not be compressed (for debug purpose)
   * @return {Object} options json object
   */
  write(carte, uncompressed) {
    const options = super.write(carte, uncompressed);
    options.version = 3.01; // Force version to 3.01 for backward compatibility
    return options;
  }

  /** Read method
   * @param {mcutils.Carte} carte
   * @param {Object} options json object
   * @return {mcutils.Carte}
   */
  read(carte, options) {
    const v4 =  (options.version > 3);
    console.log('version', options.version, v4)
    // upgradeCarte(options);
    super.read(carte, options);
    // Update layer styles to V4 format
    if (!v4) {
      carte.getMap().getLayers().forEach(layer => {
        if (layer.setIgnStyle) {
          for (let k in ignStyleDef) {
            layer.setIgnStyle(k, ignStyleDef[k].defaultV4);
          }
        }
      });
    }
    return carte;
  }
}


export default CarteFormat