import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Snap from 'ol/interaction/Snap';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import CircleStyle from "ol/style/Circle";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import carte from '../../carte';

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

    // Afficher un point bleu lors du snap 
    this.on('snap', (e) => {
      // Sauf si objet en cours de sélection
      if (carte.getSelect().getActive() && !carte.getSelect().getLayer(e.feature)) {
        this.showOverlay(false);
      } else if (e.vertex) {
        snapFeatures.getGeometry().setCoordinates(e.vertex);
        this.showOverlay(true);
      } else {
        this.showOverlay(false);
      }
    });
    // Masquer le point bleu lors du unsnap
    this.on('unsnap', (e) => {
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