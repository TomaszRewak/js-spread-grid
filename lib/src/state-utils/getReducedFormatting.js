const commonFields = ['column', 'row', 'condition'];

function reduce(rule, fields) {
    const reducedRule = {};
    for (const field of fields) {
        if (field in rule)
            reducedRule[field] = rule[field];
    }
    return reducedRule;
}

function hasImpact(rule) {
    const allKeys = Object.keys(rule).length;
    const commonKeys = Object.keys(rule).filter(key => commonFields.includes(key)).length;

    return allKeys > commonKeys;
}

export default function getReducedFormatting(formatting, fields) {
    const acceptedFields = [...commonFields, ...fields];

    return formatting.map(rule => reduce(rule, acceptedFields)).filter(hasImpact);
}