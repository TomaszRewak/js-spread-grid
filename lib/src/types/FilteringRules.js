import stringifyId from "../core-utils/stringifyId.js";
import RulesLookup from "./RulesLookup.js";

const defaultCondition = (/**@type {{ text: string, expression: string }}*/{ text, expression }) => text.includes(expression);

export default class FilteringRules {
    /**
     * @param {FilteringRule[]} rules
     */
    constructor(rules) {
        /** @type {RulesLookup<FilteringRule>} */
        this.rulesLookup = new RulesLookup();

        for (const rule of rules) {
            const entry = {
                by: stringifyId('by' in rule ? rule.by : 'FILTER'),
                condition: rule.condition || defaultCondition
            };

            this.rulesLookup.addRule(rule.column, rule.row, entry);
        }
    }

    /**
     * @param {Data} data
     * @param {ResolvedRow[]} rows
     * @param {ResolvedColumn[]} columns
     * @param {ResolvedRow} row
     * @param {ResolvedColumn} column
     * @param {Value} value
     * @param {string} text
     * @param {Map<Key, Value>} filterLookup
     * @returns {boolean}
     */
    resolve(data, rows, columns, row, column, value, text, filterLookup) {
        const rules = this.rulesLookup.getRules(column, row);

        if (rules.length === 0) {
            if (row.type !== 'DATA')
                return true;
            if (column.type !== 'DATA')
                return true;
            if (!filterLookup.has('"FILTER"'))
                return true;

            return defaultCondition({ text, expression: filterLookup.get('"FILTER"') });
        }

        let context = { data, rows, columns, row, column, value, text };

        for (const rule of rules) {
            if (!filterLookup.has(rule.by))
                continue;

            const filterContext = { ...context, expression: filterLookup.get(rule.by) };

            if (!rule.condition(filterContext))
                return false;
        }

        return true;
    }
}