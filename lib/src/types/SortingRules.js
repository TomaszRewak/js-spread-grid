import RulesLookup from "./RulesLookup.js";

const defaultComparatorAsc = (lhs, rhs) => lhs.value < rhs.value;
const defaultComparatorDesc = (lhs, rhs) => lhs.value > rhs.value;

export default class SortingRules {
    constructor(rules) {
        this.rulesLookup = new RulesLookup();

        for (const rule of rules) {
            const entry = {
                by: stringifyId('by' in rule ? rule.by : 'HEADER'),
                comparatorAsc: rule.comparator || defaultComparatorAsc,
                comparatorDesc: (lhs, rhs) => -rule.comparator(lhs, rhs) || defaultComparatorDesc
            };

            this.rulesLookup.addRule(rule.column, rule.row, entry);
        }
    }

    resolve(column, row, sortByLookup) {
        const rules = this.rulesLookup.getRules(column, row);

        if (rules.length === 0) {
            if (row.type !== 'DATA')
                return null;
            if (column.type !== 'DATA')
                return null;
            if (!sortByLookup.has('"HEADER"'))
                return null;

            return sortByLookup.get('"HEADER"') === 'ASC'
                ? defaultComparatorAsc
                : defaultComparatorDesc;
        }

        if (rules.length > 1)
            throw new Error('Multiple sorting rules for the same cell'); // TODO: add more context

        const rule = rules[0];

        return sortByLookup.get(rule.by) === 'ASC'
            ? rule.comparatorAsc
            : rule.comparatorDesc;
    }
}