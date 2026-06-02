import { isConditionalOperator } from "./ConditionalOperator";
import BaseObject from "ol/Object.js";

/**
 * @typedef {Object} ConditionOptions
 * @property {String} attribute
 * @property {String} operator
 * @property {*} value
 */

/**
 * @typedef {Object<String, *>|{get: function(String): *}} FeatureLike
 */

/**
 * Condition liée à un style.
 */
class Condition extends BaseObject {

    /**
    * @param {ConditionOptions} options
     */
    constructor ({ attribute, operator, value } = {}) {
        super();
        this.attribute = attribute;
        this.operator = operator;
        this.value = value;
    }

    get attribute () {
        return this.get("attribute");
    }

    set attribute (value) {
        if (!value || typeof value !== "string") {
            throw new TypeError("Condition.attribute doit être une chaîne non vide");
        }
        this.set("attribute", value);
    }

    get operator () {
        return this.get("operator");
    }

    set operator (value) {
        if (!isConditionalOperator(value)) {
            throw new TypeError(`Opérateur conditionnel non pris en charge : ${value}`);
        }
        this.set("operator", value);
    }

    get value () {
        return this.get("value");
    }

    set value (value) {
        this.set("value", value);
    }

    /**
        * @param {FeatureLike} feature
     * @returns {Boolean}
     */
    isValid (feature) {
        const candidate = this._getFeatureValue(feature, this.attribute);
        return this._applyOperator(candidate, this.operator, this.value);
    }

    /**
     * @private
     */
    _getFeatureValue (feature, attribute) {
        if (!feature) {
            return undefined;
        }
        if (typeof feature.get === "function") {
            return feature.get(attribute);
        }
        return feature[attribute];
    }

    /**
     * @private
     */
    _applyOperator (left, operator, right) {
        switch (operator) {
            case "EQ":
                return left === right;
            case "NEQ":
                return left !== right;
            case "GT":
                return left > right;
            case "GTE":
                return left >= right;
            case "LT":
                return left < right;
            case "LTE":
                return left <= right;
            case "STARTS_WITH":
                return String(left ?? "").startsWith(String(right ?? ""));
            case "ENDS_WITH":
                return String(left ?? "").endsWith(String(right ?? ""));
            case "LIKE": {
                const source = String(left ?? "").toLowerCase();
                const pattern = String(right ?? "").toLowerCase();
                return source.includes(pattern);
            }
            case "IN": {
                const list = Array.isArray(right) ? right : String(right ?? "").split(",").map(v => v.trim());
                return list.includes(left);
            }
            case "NOT_IN": {
                const list = Array.isArray(right) ? right : String(right ?? "").split(",").map(v => v.trim());
                return !list.includes(left);
            }
            case "NOT":
                return !this._toBoolean(left);
            default:
                return false;
        }
    }

    /**
     * @private
     */
    _toBoolean (value) {
        if (typeof value === "string") {
            return ["true", "1", "yes", "oui"].includes(value.trim().toLowerCase());
        }
        return !!value;
    }
}

export default Condition;