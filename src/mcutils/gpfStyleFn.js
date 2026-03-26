import { getSelectStyleFn, getShownFeatureStyleFn } from 'mcutils/style/ignStyleFn.js';
import CircleStyle from 'ol/style/Circle.js';
import Stroke from 'ol/style/Stroke.js';
import Fill from 'ol/style/Fill.js';
import { defaultIgnStyle, ignStyleDef } from 'mcutils/style/ignStyleFn.js';

import ol_style_FontSymbol from 'ol-ext/style/FontSymbol.js'

ol_style_FontSymbol.addDefs({
  "font":"cursive",
  "name":"cursive",
  "copyright":"SIL OFL 1.1",
  "prefix": "std"
}, {
  "std-circle": { char: "\u25cf", "font": "Verdana, Helvetica, Arial, sans-serif", "theme": "standerd", name: "cercle", "search": "" },
});

/* Overwrite defaultIgnStyle for GPF */
defaultIgnStyle.pointRadius = 19;
defaultIgnStyle.pointGlyph = " ";
defaultIgnStyle.pointForm = "marker",
defaultIgnStyle.symbolColor = "rgba(255, 255, 255, 1)"; // "#ffffff";
defaultIgnStyle.pointColor = "rgba(0, 0, 145, 1)"; // "#000091";
defaultIgnStyle.pointStrokeColor = "rgba(255, 255, 255, 1)"; // "#ffffff";
defaultIgnStyle.pointStrokeWidth = 2;
defaultIgnStyle.strokeColor = "rgba(51, 177, 255, 1)"; // '#33B1FF';
defaultIgnStyle.strokeWidth = 4;
defaultIgnStyle.fillColor = "rgba(51, 177, 255, 0.5)"; // "rgba(51, 177, 255, .5)";
defaultIgnStyle.textColor = "rgba(0, 0, 0, 1)"; 
defaultIgnStyle.fillColorPattern = "rgba(0, 0, 0, 0)";

// Update default style for GPF
for (let k in defaultIgnStyle) {
  //Old version
  ignStyleDef[k].defaultV4 = ignStyleDef[k].defaultValue;
  ignStyleDef[k].defaultValue = defaultIgnStyle[k];
}

const circle = new CircleStyle({
  stroke : new Stroke({ 
    color : "#fff", 
    width : 2 
  }),
  fill : new Fill({ 
    color : "#33b1ff",
  }),
  radius : 4,
});

function getBlueSelectStyle(styleFn) {
  return function (feature, resolution) {
    const style = styleFn(feature, resolution);

    // Blues points
    const pts = style.pop();
    if (pts && !pts.getStroke() && !pts.getFill() && !pts.getText()) {
      const img = pts.getImage();
      if (img) {
        pts.setImage(circle);
      }
      style.push(pts);
    } else {
      style.push(pts)
    }

    // Extent for selected features
    const extent = style[0];
    if (extent && extent.getStroke()) {
      extent.getStroke().setColor('#3399ff');
    } else if (extent.getImage()) {
      extent.setImage(circle);
      style.push(extent);
    }

    return style;
  };
}

/* Update style with blue points */
function gpfStyleFn(options) {
  const styleFn = getSelectStyleFn(options); 
  return getBlueSelectStyle(styleFn);
}

/* Update style with blue points */
function gpfShownStyleFn(options) {
  const styleFn = getShownFeatureStyleFn(options); 
  return getBlueSelectStyle(styleFn);
}

export { gpfStyleFn, gpfShownStyleFn }