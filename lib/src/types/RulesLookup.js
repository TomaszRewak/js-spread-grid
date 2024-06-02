import stringifyId from "../core-utils/stringifyId.js";

const typeMapping = {
    'HEADER': ['HEADER'],
    'FILTER': ['FILTER'],
    'DATA': ['DATA'],
    'CUSTOM': ['CUSTOM'],
    'ANY': ['HEADER', 'DATA', 'FILTER', 'CUSTOM'],
    'SPECIAL': ['HEADER', 'FILTER', 'CUSTOM'],
    undefined: []
};

class Lookup {
    byKey = new Map();
    byIndex = new Map(); // TODO: Should this be removed?
    byLabel = new Map();
    byType = new Map();
}

export default class RulesLookup {
    lookup = new Lookup();
    hasRules = false;

    addRule(column, row, rule) {
        this.hasRules = true;

        if (Array.isArray(column)) {
            for (const c of column)
                this.addRule(c, row, rule);
            return;
        }

        if (Array.isArray(row)) {
            for (const r of row)
                this.addRule(column, r, rule);
            return;
        }

        column = column
            ? 'id' in column
                ? { key: stringifyId(column.id) }
                : column
            : { type: 'DATA' };
        row = row
            ? 'id' in row
                ? { key: stringifyId(row.id) }
                : row
            : { type: 'DATA' };

        function addRowRule(lookup, key) {
            if (!lookup.has(key))
                lookup.set(key, []);

            lookup.get(key).push(rule);
        }

        function addColumnRule(lookup, key) {
            if (!lookup.has(key))
                lookup.set(key, new Lookup());

            if ('key' in row)
                addRowRule(lookup.get(key).byKey, row.key);
            if ('index' in row)
                addRowRule(lookup.get(key).byIndex, row.index);
            if ('label' in row)
                addRowRule(lookup.get(key).byLabel, row.label);
            for (const type of typeMapping[row.type])
                addRowRule(lookup.get(key).byType, type);
        }

        if ('key' in column)
            addColumnRule(this.lookup.byKey, column.key);
        if ('index' in column)
            addColumnRule(this.lookup.byIndex, column.index);
        if ('label' in column)
            addColumnRule(this.lookup.byLabel, column.label);
        for (const type of typeMapping[column.type])
            addColumnRule(this.lookup.byType, type);
    }

    getRules(column, row) {
        const rules = [];

        if (!this.hasRules)
            return rules;

        function gatherRules(newRules) {
            for (const rule of newRules)
                rules.push(rule);
        }

        function gatherRowRules(lookup) {
            if (lookup.byKey.has(row.key))
                gatherRules(lookup.byKey.get(row.key));
            if (lookup.byIndex.has(row.index))
                gatherRules(lookup.byIndex.get(row.index));
            if (lookup.byType.has(row.type))
                gatherRules(lookup.byType.get(row.type));
            for (const label of row.labels) {
                if (lookup.byLabel.has(label))
                    gatherRules(lookup.byLabel.get(label));
            }
        }

        if (this.lookup.byKey.has(column.key))
            gatherRowRules(this.lookup.byKey.get(column.key));
        if (this.lookup.byIndex.has(column.index))
            gatherRowRules(this.lookup.byIndex.get(column.index));
        if (this.lookup.byType.has(column.type))
            gatherRowRules(this.lookup.byType.get(column.type));
        for (const label of column.labels) {
            if (this.lookup.byLabel.has(label))
                gatherRowRules(this.lookup.byLabel.get(label));
        }

        return rules;
    }
};