/**
 * @typedef {"EQ"|"NEQ"|"GT"|"GTE"|"LT"|"LTE"|"STARTS_WITH"|"LIKE"|"ENDS_WITH"|"IN"|"NOT_IN"|"NOT"} ConditionalOperatorKey
 */

/**
 * @typedef {"="|"!="|"<"|"<="|">="|">"|"contain"|"!contain"|"regexp"|"!regexp"} McutilsOperator
 */

/**
 * @typedef {Object} ConditionalOperatorDefinition
 * @property {ConditionalOperatorKey} key Identifiant interne de l'opérateur.
 * @property {String} label Libellé affiché dans l'interface.
 * @property {String} filterName Nom de l'opérateur utilisé dans la couche de filtrage.
 * @property {McutilsOperator|undefined} mcutilsOperator Valeur équivalente côté mcutils si disponible.
 */

/**
 * @typedef {Object} ConditionalOperatorOption
 * @property {ConditionalOperatorKey} key Identifiant interne de l'opérateur.
 * @property {String} label Libellé affichable.
 * @property {String} filterName Nom d'opérateur pour le moteur de filtre.
 * @property {McutilsOperator|undefined} mcutilsOperator Valeur mcutils correspondante, ou `undefined` si non mappée.
 */

/**
 * Liste des opérateurs pour une condition
 */
const ConditionalOperator = Object.freeze({
    EQ : {
        key : "EQ",
        label : "=",
        filterName : "PropertyIsEqualTo",
        mcutilsOperator : "=",
    },
    NEQ : {
        key : "NEQ",
        label : "!=",
        filterName : "PropertyIsNotEqualTo",
        mcutilsOperator : "!=",
    },
    GT : {
        key : "GT",
        label : ">",
        filterName : "PropertyIsGreaterThan",
        mcutilsOperator : ">",
    },
    GTE : {
        key : "GTE",
        label : ">=",
        filterName : "PropertyIsGreaterThanOrEqualTo",
        mcutilsOperator : ">=",
    },
    LT : {
        key : "LT",
        label : "<",
        filterName : "PropertyIsLessThan",
        mcutilsOperator : "<",
    },
    LTE : {
        key : "LTE",
        label : "<=",
        filterName : "PropertyIsLessThanOrEqualTo",
        mcutilsOperator : "<=",
    },
    STARTS_WITH : {
        key : "STARTS_WITH",
        label : "Starts with",
        filterName : "PropertyStartsWith",
        mcutilsOperator : undefined,
    },
    LIKE : {
        key : "LIKE",
        label : "Like",
        filterName : "PropertyIsLike",
        mcutilsOperator : "regexp",
    },
    ENDS_WITH : {
        key : "ENDS_WITH",
        label : "Ends with",
        filterName : "PropertyEndsWith",
        mcutilsOperator : undefined,
    },
    IN : {
        key : "IN",
        label : "In",
        filterName : "PropertyIsIn",
        mcutilsOperator : "contain",
    },
    NOT_IN : {
        key : "NOT_IN",
        label : "Not in",
        filterName : "PropertyIsNotIn",
        mcutilsOperator : "!contain",
    },
    NOT : {
        key : "NOT",
        label : "Not",
        filterName : "Not",
        mcutilsOperator : undefined,
    },
});

const OPERATOR_VALUES = new Set(Object.values(ConditionalOperator).map((operator) => operator.key));
const MCUTILS_OPERATOR_VALUES = new Set([
    "=",
    "!=",
    "<",
    "<=",
    ">=",
    ">",
    "contain",
    "!contain",
    "regexp",
    "!regexp",
]);
const MCUTILS_OPERATOR_TO_OPERATOR_KEY = Object.values(ConditionalOperator).reduce((operatorsByMcutilsOperator, operator) => {
    if (!operator.mcutilsOperator) {
        return operatorsByMcutilsOperator;
    }

    operatorsByMcutilsOperator[operator.mcutilsOperator] = operator.key;
    return operatorsByMcutilsOperator;
}, {});

/**
 * Vérifie qu'une clé correspond à un opérateur conditionnel connu.
 *
 * @param {ConditionalOperatorKey|String} operatorKey Clé d'opérateur à valider.
 * @returns {Boolean} `true` si la clé existe dans la liste des opérateurs, sinon `false`.
 */
export function isConditionalOperator (operatorKey) {
    return OPERATOR_VALUES.has(operatorKey);
}

/**
 * Vérifie qu'une valeur correspond à un opérateur mcutils connu.
 *
 * @param {McutilsOperator|String} mcutilsOperator Valeur d'opérateur mcutils à valider.
 * @returns {Boolean} `true` si la valeur est un opérateur mcutils valide, sinon `false`.
 */
export function isMcutilsOperator (mcutilsOperator) {
    return MCUTILS_OPERATOR_VALUES.has(mcutilsOperator);
}

/**
 * Récupère la définition complète d'un opérateur à partir de sa clé.
 *
 * @param {ConditionalOperatorKey|String} operatorKey Clé de l'opérateur recherché.
 * @returns {ConditionalOperatorDefinition|undefined} Définition de l'opérateur, ou `undefined` s'il n'existe pas.
 */
export function getConditionalOperatorInfo (operatorKey) {
    return Object.values(ConditionalOperator).find((operator) => operator.key === operatorKey);
}

/**
 * Retourne les opérateurs au format options (utilisable dans un select/UI).
 *
 * @returns {Array<ConditionalOperatorOption>} Liste des options d'opérateurs.
 */
export function getConditionalOperatorOptions () {
    return Object.values(ConditionalOperator).map(({ key, label, filterName, mcutilsOperator }) => ({
        key,
        label,
        filterName,
        mcutilsOperator,
    }));
}

/**
 * Convertit un opérateur mcutils vers la clé d'opérateur interne.
 *
 * @param {McutilsOperator|String} mcutilsOperator Valeur d'opérateur issue de mcutils (ex: `=`, `contain`, `regexp`).
 * @returns {ConditionalOperatorKey|undefined} Clé interne correspondante, ou `undefined` si aucun mapping n'existe.
 */
export function fromMcutilsOperator (mcutilsOperator) {
    return MCUTILS_OPERATOR_TO_OPERATOR_KEY[mcutilsOperator];
}

/**
 * Convertit une clé d'opérateur interne vers l'opérateur mcutils associé.
 *
 * @param {ConditionalOperatorKey|String} operatorKey Clé interne de l'opérateur.
 * @returns {McutilsOperator|undefined} Opérateur mcutils correspondant, ou `undefined` si aucun mapping n'est défini.
 */
export function toMcutilsOperator (operatorKey) {
    return getConditionalOperatorInfo(operatorKey)?.mcutilsOperator;
}

export default ConditionalOperator;