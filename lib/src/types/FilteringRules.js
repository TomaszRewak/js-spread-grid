import stringifyId from "../core-utils/stringifyId.js";
import RulesLookup from "./RulesLookup.js";

function mapFilter(filter) {
    return {
        by: stringifyId(filter.by),
        condition: filter.condition
    };
}

export default class FilteringRules {
    constructor(rules) {
        this.rulesLookup = new RulesLookup();

        for (const rule of rules) {
            const entry = {
                by: stringifyId('by' in rule ? rule.by : 'FILTER'),
                condition: rule.condition
            };

            this.rulesLookup.addRule(rule.column, rule.row, entry);
        }
    }

    resolve(data, rows, columns, row, column, value, text, filterLookup) {
        const rules = this.rulesLookup.getRules(column, row);

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