import Condition from "./Condition";
import SymbolLib from "mcutils/style/SymbolLib.js";
import { flatToIgnStyle } from "../StyleDialog/styleToFlatStyle.js";

/**
 * @typedef {Object<String, *>} FlatStyleObject
 */

/**
 * @typedef {Object} StyleObjOptions
 * @property {String} name
 * @property {String} type
 * @property {Boolean} [default=false]
 * @property {Array<Condition|Object>} [conditions=[]]
 * @property {FlatStyleObject} [flatStyle={}]
 */

/**
 * Objet permettant d'enregistrer un style avec zéro à plusieurs conditions.
 */
class StyleObj {

    /**
    * @param {StyleObjOptions} options
     */
    constructor (options = {}) {
        const {
            name,
            type,
            default : isDefault = false,
            conditions = [],
            flatStyle = {},
        } = options;

        this._default = Boolean(isDefault);
        this.name = name;
        this.type = type;
        this.setConditions(conditions);
        this.setFlatStyle(flatStyle, true);
    }

    get name () {
        return this._name;
    }

    set name (value) {
        if (!value || typeof value !== "string") {
            throw new TypeError("StyleObj.name doit être une chaîne non vide");
        }
        if (this._default && this._name !== undefined && this._name !== value) {
            throw new Error("Le nom d'un style par défaut ne peut pas être modifié");
        }
        this._name = value;
    }

    get type () {
        return this._type;
    }

    set type (value) {
        if (!value || typeof value !== "string") {
            throw new TypeError("StyleObj.type doit être une chaîne non vide");
        }
        this._type = value;
    }

    get isDefault () {
        return this._default;
    }

    set isDefault (value) {
        this._default = Boolean(value);
    }

    get conditions () {
        return [...this._conditions];
    }

    set conditions (value) {
        this.setConditions(value);
    }

    /**
     * @param {String} [flatStyleProperty]
        * @returns {FlatStyleObject|*}
     */
    getFlatStyle (flatStyleProperty) {
        if (flatStyleProperty === undefined) {
            return { ...this._flatStyle };
        }
        return this._flatStyle[flatStyleProperty];
    }

    /**
     * @param {String} prop
     * @param {*} value
     */
    setFlatStyleProperty (prop, value) {
        if (!prop || typeof prop !== "string") {
            throw new TypeError("La propriété du flat style doit être une chaîne non vide");
        }
        this._flatStyle[prop] = value;
    }

    /**
        * @param {FlatStyleObject} flatStyle
     * @param {Boolean} [reset=false]
     */
    setFlatStyle (flatStyle, reset = false) {
        if (!flatStyle || typeof flatStyle !== "object" || Array.isArray(flatStyle)) {
            throw new TypeError("flatStyle doit être un objet");
        }
        this._flatStyle = reset ? { ...flatStyle } : { ...(this._flatStyle || {}), ...flatStyle };
    }

    /**
     * @param {Array<Condition|Object>} conditions
     */
    setConditions (conditions = []) {
        if (!Array.isArray(conditions)) {
            throw new TypeError("conditions doit être un tableau");
        }
        this._conditions = conditions.map((condition) => this._toCondition(condition));
    }

    /**
     * @param {Condition|Object} condition
     */
    addCondition (condition) {
        this._conditions.push(this._toCondition(condition));
    }

    /**
     * @param {Number} index
     */
    removeCondition (index) {
        if (!Number.isInteger(index) || index < 0 || index >= this._conditions.length) {
            return;
        }
        this._conditions.splice(index, 1);
    }

    /**
     * @param {Object} feature
     * @returns {Boolean}
     */
    isValidForFeature (feature) {
        return this._conditions.every((condition) => condition.isValid(feature));
    }

    /**
     * Retourne une représentation canvas du style courant via SymbolLib.
     * @param {Array<Number>} [size=[60,45]] Dimensions du canvas [largeur, hauteur]
     * @returns {HTMLCanvasElement|null}
     */
    getImage (size) {
        const ignStyle = flatToIgnStyle(this.getFlatStyle());
        const symbol = new SymbolLib({
            type : this._type,
            style : ignStyle,
            size : size,
        });
        return symbol.getImage();
    }

    /**
     * @private
     */
    _toCondition (condition) {
        if (condition instanceof Condition) {
            return condition;
        }
        return new Condition(condition);
    }
}

export default StyleObj;