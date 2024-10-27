import RulesLookup from "./RulesLookup.js";
import stringifyId from "../core-utils/stringifyId.js";

/**
 * @typedef SortingEntry
 * @property {string} by
 * @property {SortingComparator} comparatorAsc
 * @property {SortingComparator} comparatorDesc
 */

/**
 * @param {Cell} lhs
 * @param {Cell} rhs
 * @returns {boolean}
 */
function defaultComparatorAsc(lhs, rhs) {
    if (lhs.value == undefined)
        return false;
    if (rhs.value == undefined)
        return true;
    return lhs.value < rhs.value;
}

/**
 * @param {Cell} lhs
 * @param {Cell} rhs
 * @returns {boolean}
 */
function defaultComparatorDesc(lhs, rhs) {
    if (lhs.value == undefined)
        return false;
    if (rhs.value == undefined)
        return true;
    return lhs.value > rhs.value;
}

export default class SortingRules {
    /**
     * @param {SortingRule[]} rules
     */
    constructor(rules) {
        /** @type {RulesLookup<SortingEntry>} */
        this.rulesLookup = new RulesLookup();

        for (const rule of rules) {
            /** @type {SortingComparator} */
            const comparatorAsc = rule.comparator
                ? (lhs, rhs) => rule.comparator(lhs, rhs)
                : (lhs, rhs) => defaultComparatorAsc(lhs, rhs);
            /** @type {SortingComparator} */
            const comparatorDesc = rule.comparator
                ? (lhs, rhs) => !rule.comparator(lhs, rhs)
                : (lhs, rhs) => defaultComparatorDesc(lhs, rhs);

            const entry = {
                by: stringifyId('by' in rule ? rule.by : 'HEADER'),
                comparatorAsc: comparatorAsc,
                comparatorDesc: comparatorDesc
            };

            this.rulesLookup.addRule(rule.column, rule.row, entry);
        }
    }

    /**
     * @param {ResolvedColumn} column
     * @param {ResolvedRow} row
     * @param {Map<Key, SortDirection>} sortByLookup
     * @returns {SortingComparator}
     */
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

        if (!sortByLookup.has(rule.by))
            return null;

        return sortByLookup.get(rule.by) === 'ASC'
            ? rule.comparatorAsc
            : rule.comparatorDesc;
    }
}