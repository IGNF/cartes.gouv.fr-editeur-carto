/**
 * @typedef {"EQ"|"NEQ"|"GT"|"GTE"|"LT"|"LTE"|"STARTS_WITH"|"LIKE"|"ENDS_WITH"|"IN"|"NOT_IN"|"NOT"} ConditionalOperatorKey
 */

/**
 * @typedef {Object} ConditionalOperatorDefinition
 * @property {ConditionalOperatorKey} key
 * @property {String} label
 * @property {String} filterName
 */

/**
 * @typedef {Object} ConditionalOperatorOption
 * @property {ConditionalOperatorKey} key
 * @property {String} label
 * @property {String} filterName
 */

/**
 * Liste des opérateurs pour une condition
 */
const ConditionalOperator = Object.freeze({
    EQ : {
        key : "EQ",
        label : "=",
        filterName : "PropertyIsEqualTo",
    },
    NEQ : {
        key : "NEQ",
        label : "!=",
        filterName : "PropertyIsNotEqualTo",
    },
    GT : {
        key : "GT",
        label : ">",
        filterName : "PropertyIsGreaterThan",
    },
    GTE : {
        key : "GTE",
        label : ">=",
        filterName : "PropertyIsGreaterThanOrEqualTo",
    },
    LT : {
        key : "LT",
        label : "<",
        filterName : "PropertyIsLessThan",
    },
    LTE : {
        key : "LTE",
        label : "<=",
        filterName : "PropertyIsLessThanOrEqualTo",
    },
    STARTS_WITH : {
        key : "STARTS_WITH",
        label : "Starts with",
        filterName : "PropertyStartsWith",
    },
    LIKE : {
        key : "LIKE",
        label : "Like",
        filterName : "PropertyIsLike",
    },
    ENDS_WITH : {
        key : "ENDS_WITH",
        label : "Ends with",
        filterName : "PropertyEndsWith",
    },
    IN : {
        key : "IN",
        label : "In",
        filterName : "PropertyIsIn",
    },
    NOT_IN : {
        key : "NOT_IN",
        label : "Not in",
        filterName : "PropertyIsNotIn",
    },
    NOT : {
        key : "NOT",
        label : "Not",
        filterName : "Not",
    },
});

const OPERATOR_VALUES = new Set(Object.values(ConditionalOperator).map((operator) => operator.key));

/**
 * @param {ConditionalOperatorKey|String} operatorKey
 * @returns {Boolean}
 */
export function isConditionalOperator (operatorKey) {
    return OPERATOR_VALUES.has(operatorKey);
}

/**
 * @param {ConditionalOperatorKey|String} operatorKey
 * @returns {ConditionalOperatorDefinition|undefined}
 */
export function getConditionalOperatorInfo (operatorKey) {
    return Object.values(ConditionalOperator).find((operator) => operator.key === operatorKey);
}

/**
 * @returns {Array<ConditionalOperatorOption>}
 */
export function getConditionalOperatorOptions () {
    return Object.values(ConditionalOperator).map(({ key, label, filterName }) => ({
        key,
        label,
        filterName,
    }));
}



export default ConditionalOperator;