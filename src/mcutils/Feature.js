/** @File update MCUtils Features */
import Feature from "mcutils/ol/Feature.js";
import md2html from "mcutils/md/md2html.js";

import "./popup.scss";

const getPopupContent = Feature.prototype.getPopupContent;

/**
 * Get popup content for a feature, with optional link and URL 
 */
Feature.prototype.getPopupContent = function (options, html) {
  const content = getPopupContent.call(this, options, html);
  if (content.appendChild) {
    let popupContent;
    if (this._popupContent && this._popupContent.active) {
      popupContent = this._popupContent;
    } else {
      popupContent = (this.getLayer() && this.getLayer().getPopupContent ? this.getLayer().getPopupContent() : '');
    }
    if (popupContent.link && popupContent.url) {
      const link = md2html(`[${popupContent.link}](${popupContent.url})`);
      const div = document.createElement("div");
      div.className = "fr-popup-footer";
      div.innerHTML = link;
      content.appendChild(div);
      const a = content.querySelector(".fr-popup-footer a");
      if (a) {
        a.className = "fr-link fr-icon-arrow-right-line fr-link--icon-right";
      }
    }
  }
  return content;
}


export default Feature;