import { getSelectStyleFn, getShownFeatureStyleFn } from 'mcutils/style/ignStyleFn';
import CircleStyle from 'ol/style/Circle';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import { defaultIgnStyle } from 'mcutils/style/ignStyleFn';

import ol_style_FontSymbol from 'ol-ext/style/FontSymbol'

ol_style_FontSymbol.addDefs({
  "font":"cursive",
  "name":"cursive",
  "copyright":"SIL OFL 1.1",
  "prefix": "std"
}, {
  "std-circle": { char: "\u25cf", "font": "Verdana, Helvetica, Arial, sans-serif", "theme": "standerd", name: "cercle", "search": "" },
});
window.defStyle = defaultIgnStyle;

/* Overwrite defaultIgnStyle for GPF */
defaultIgnStyle.pointRadius = 19;
defaultIgnStyle.pointGlyph = "std-circle";
defaultIgnStyle.pointForm = "marker",
defaultIgnStyle.symbolColor = "#ffffff";
defaultIgnStyle.pointColor = "#000091";
defaultIgnStyle.pointStrokeColor = "#000091";
defaultIgnStyle.pointStrokeWidth = 0;
defaultIgnStyle.strokeColor = '#ff8800'

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