import stringifyId from "../core-utils/stringifyId.js";

const matchMapping = {
    'HEADER': ['HEADER'],
    'FILTER': ['FILTER'],
    'DATA': ['DATA'],
    'ANY': ['HEADER', 'DATA', 'FILTER'],
    undefined: []
};

class Lookup {
    byKey = new Map();
    byIndex = new Map(); // TODO: Should this be removed?
    byMatch = new Map();
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
            : { match: 'DATA' };
        row = row
            ? 'id' in row
                ? { key: stringifyId(row.id) }
                : row
            : { match: 'DATA' };

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
            for (const match of matchMapping[row.match])
                addRowRule(lookup.get(key).byMatch, match);
        }

        if ('key' in column)
            addColumnRule(this.lookup.byKey, column.key);
        if ('index' in column)
            addColumnRule(this.lookup.byIndex, column.index);
        for (const match of matchMapping[column.match])
            addColumnRule(this.lookup.byMatch, match);
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
            if (lookup.byMatch.has(row.type))
                gatherRules(lookup.byMatch.get(row.type));
        }

        if (this.lookup.byKey.has(column.key))
            gatherRowRules(this.lookup.byKey.get(column.key));
        if (this.lookup.byIndex.has(column.index))
            gatherRowRules(this.lookup.byIndex.get(column.index));
        if (this.lookup.byMatch.has(column.type))
            gatherRowRules(this.lookup.byMatch.get(column.type));

        return rules;
    }
};