/** @import * as Types from "../typings.js"; */

/** @type {(keyof Types.Rule)[]} */
const commonFields = ['column', 'row', 'condition'];

/**
 * @param {Types.Rule} rule
 * @param {(keyof Types.Rule)[]} fields
 * @returns {Types.Rule}
 */
function reduce(rule, fields) {
    /** @type {Types.Rule} */
    const reducedRule = {};
    for (const field of fields) {
        if (field in rule)
            reducedRule[field] = rule[field];
    }
    return reducedRule;
}

/**
 * @param {Types.Rule} rule
 * @returns {boolean}
 */
function hasImpact(rule) {
    const allKeys = Object.keys(rule).length;
    const commonKeys = Object.keys(rule).filter(key => (/** @type {string[]} */ (commonFields)).includes(key)).length;

    return allKeys > commonKeys;
}

/**
 * @param {Types.Rule[]} formatting
 * @param {(keyof Types.Rule)[]} fields
 * @returns {Types.Rule[]}
 */
export default function getReducedFormatting(formatting, fields) {
    const acceptedFields = [...commonFields, ...fields];

    return formatting.map(rule => reduce(rule, acceptedFields)).filter(hasImpact);
}