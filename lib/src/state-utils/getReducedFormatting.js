const commonFields = ['column', 'row', 'condition'];

/**
 * @param {Rule} rule
 * @param {string[]} fields
 * @returns {Rule}
 */
function reduce(rule, fields) {
    const reducedRule = {};
    for (const field of fields) {
        if (field in rule)
            reducedRule[field] = rule[field];
    }
    return reducedRule;
}

/**
 * @param {Rule} rule
 * @returns {boolean}
 */
function hasImpact(rule) {
    const allKeys = Object.keys(rule).length;
    const commonKeys = Object.keys(rule).filter(key => commonFields.includes(key)).length;

    return allKeys > commonKeys;
}

/**
 * @param {Rule[]} formatting
 * @param {string[]} fields
 * @returns {Rule[]}
 */
export default function getReducedFormatting(formatting, fields) {
    const acceptedFields = [...commonFields, ...fields];

    return formatting.map(rule => reduce(rule, acceptedFields)).filter(hasImpact);
}