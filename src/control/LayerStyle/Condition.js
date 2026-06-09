import { fromMcutilsOperator, isConditionalOperator, isMcutilsOperator } from "./ConditionalOperator.js";
import BaseObject from "ol/Object.js";

/**
 * @typedef {Object} ConditionOptions
 * @property {String} attribute Attribut sur lequel appliquer la condition
 * @property {String} operator Opérateur
 * @property {any} value Valeur avec laquelle comparer l'attribut
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

    /**
     * @param {String} attribute Nom de l'attribut
     */
    set attribute (attribute) {
        if (!attribute || typeof attribute !== "string") {
            throw new TypeError("Condition.attribute doit être une chaîne non vide");
        }
        this.set("attribute", attribute);
    }

    get operator () {
        return this.get("operator");
    }

    /**
     * @param {String} value Opérateur.
     * Voir [ConditionalOperator]{@link (./ConditionalOperator.js)} pour plus d'infos sur la valeur à utiliser.
     */
    set operator (value) {
        if (isMcutilsOperator(value)) {
            this.set("operator", fromMcutilsOperator(value))
        } else if (!isConditionalOperator(value)) {
            throw new TypeError(`Opérateur conditionnel non pris en charge : ${value}`);
        } else {
            this.set("operator", value);
        }
    }

    get value () {
        return this.get("value");
    }

    set value (value) {
        this.set("value", value);
    }

    /**
     * Vérifie si un objet (Feature) passe la condition
     * 
     * @param {import("ol/Feature.js").default} feature Feature openlayer.
     * @returns {Boolean} Vrai si la condition est validée, faux sinon.
     */
    isValid (feature) {
        const attribute = feature.get(this.attribute);
        return this._applyOperator(attribute, this.operator, this.value);
    }

    /**
     * Récupère la valeur de l'attribut
     * @param {import("ol/Feature.js").default} feature Feature openlayer
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
     * Compare deux éléments en fonction de l'opérateur
     * 
     * @returns {Boolean} Vrai si la condition est vérifiée
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
            case "LIKE": 
                const source = String(left ?? "").toLowerCase();
                const pattern = String(right ?? "").toLowerCase();
                return source.includes(pattern);
            case "IN": 
                const listIn = Array.isArray(right) ? right : String(right ?? "").split(",").map(v => v.trim());
                return listIn.includes(left);
            case "NOT_IN": 
                const listNotIn = Array.isArray(right) ? right : String(right ?? "").split(",").map(v => v.trim());
                return !listNotIn.includes(left);
            case "NOT":
                return !this._toBoolean(left);
            default:
                return false;
        }
    }

    /**
     * Convertit une valeur en booléen, valeur pouvant être une chaîne de charactère
     * @param {String} value Valeur à convertir
     * @returns {Boolean} Vrai si la valeur correspond à un booléen.
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