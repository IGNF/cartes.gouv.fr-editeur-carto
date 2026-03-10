import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import Snap from 'ol/interaction/Snap.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import CircleStyle from "ol/style/Circle.js";
import Style from "ol/style/Style.js";
import Stroke from "ol/style/Stroke.js";
import Fill from "ol/style/Fill.js";
import carte from '../../carte.js';

const circle = [
 
  new Style({
    image: new CircleStyle ({
      stroke: new Stroke({ 
        color: "#33b1ff", 
        width: 2 
      }),
      fill: new Fill({
        color: "#fff",
      }),
      radius: 8,
    }),
  }),
  new Style({
    image: new CircleStyle ({
      fill: new Fill({
        color: "#33b1ff",
      }),
      radius: 3,
    }),
  }),
];


/**
 * Interaction de snap personnalisée pour l'éditeur cartographique
 * Ajout d'un point bleu lors d'un snap 
 * 
 * @class
 * @extends {Snap}
 */ 
class SnapInteraction extends Snap {
  constructor(options) {
    super(options);

    this.overlay_ = new VectorLayer({
      source: new VectorSource(),
      style: circle
    });

    window.overlaySnap = this.overlay_;
    const snapFeatures = new Feature(new Point([0, 0]));
    this.overlay_.getSource().addFeature(snapFeatures);

    // Check modification is on to snap 
    let modifying = false;
    carte._interactions.modify.on('modifystart', () => {
      modifying = true;
    });
    carte._interactions.modify.on('modifyend', () => {
      modifying = false;
    });
    // Afficher un point bleu lors du snap 
    this.on('snap', (e) => {
      // Ne pas afficher le point bleu si en cours de sélection d'un objet
      if (!modifying && carte.getSelect().getActive() && !carte.getSelect().getLayer(e.feature)) {
        this.showOverlay(false);
      } else if (e.vertex) {
        snapFeatures.getGeometry().setCoordinates(e.vertex);
        this.showOverlay(true);
      } else {
        this.showOverlay(false);
      }
    });
    // Masquer le point bleu lors du unsnap
    this.on('unsnap', () => {
      this.showOverlay(false);
    });
  }
  /** show overlay 
   * @param {boolean} b
   */
  showOverlay(b) {
    if (b) {
      if (!this.showOverlay_) {
        this.overlay_.setMap(this.getMap());
      }
    } else {
      if (this.showOverlay_) {
        this.overlay_.setMap();
      }
    }
    this.showOverlay_ = b;
  }
  /** Add overlay
   * @param {import("ol/Map").default} map
   */
  setMap(map) {
    super.setMap(map);
    if (!map) {
      this.overlay_.setMap();
    }
  }
}

export default SnapInteraction;