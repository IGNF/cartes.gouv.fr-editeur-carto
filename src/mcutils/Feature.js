/** @File update MCUtils Features */
import Feature from "mcutils/ol/Feature.js";
import md2html from "mcutils/md/md2html.js";

import "./popup.scss";

const getPopupContent = Feature.prototype.getPopupContent;

/**
 * Get popup content for a feature, with optional link and URL 
 * @method ol.Feature#getPopupContent
 * @param {Object|true|undefined} options popup options (with a content propertie) or undefined to get the popupcontent object
 *  @param {string} options.titre
 *  @param {string} options.desc description as Markdown
 *	@param {string} options.img image url
 *  @param {boolean} options.coord
 * @param {boolean} [html=false] true return html string
 * @return {string|Element} popupcontent
 */
Feature.prototype.getPopupContent = function (content, html) {
  const popupContent = getPopupContent.call(this, content, html);
  if (popupContent.appendChild && this._popupContent && this._popupContent.active) {
    if (this._popupContent.link && this._popupContent.url) {
      const link = md2html(`[${this._popupContent.link}](${this._popupContent.url})`);
      const div = document.createElement("div");
      div.className = "fr-popup-footer";
      div.innerHTML = link;
      popupContent.appendChild(div);
      const a = popupContent.querySelector(".fr-popup-footer a");
      if (a) {
        a.className = "fr-link fr-icon-arrow-right-line fr-link--icon-right";
      }
    }
  }
  return popupContent;
}


export default Feature;