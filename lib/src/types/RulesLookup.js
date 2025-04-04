import stringifyId from "../core-utils/stringifyId.js";

/** @type {Record<(DimensionTypeSelector | "NONE"), DimensionType[]>} */
const typeMapping = {
    'HEADER': ['HEADER'],
    'FILTER': ['FILTER'],
    'DATA': ['DATA'],
    'CUSTOM': ['CUSTOM'],
    'ANY': ['HEADER', 'DATA', 'FILTER', 'CUSTOM'],
    'SPECIAL': ['HEADER', 'FILTER', 'CUSTOM'],
    'NONE': []
};

/**
 * @template T
 */
class Lookup {
    /** @type {Map<Key, T>} */
    byKey = new Map();
    /** @type {Map<number, T>} */
    byIndex = new Map(); // TODO: Should this be removed?
    /** @type {Map<Label, T>} */
    byLabel = new Map();
    /** @type {Map<DimensionType, T>} */
    byType = new Map();
}

/**
 * @template T
 */
export default class RulesLookup {
    /** @type {Lookup<Lookup<T[]>>} */
    lookup = new Lookup();
    hasRules = false;

    /**
     * @param {RuleSelector | RuleSelector[]} column
     * @param {RuleSelector | RuleSelector[]} row
     * @param {T} rule
     */
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

        /** @type {ResolvedRuleSelector} */
        const resolvedColumn = column
            ? 'id' in column
                ? { key: stringifyId(column.id) }
                : column
            : { type: 'DATA' };
        /** @type {ResolvedRuleSelector} */
        const resolvedRow = row
            ? 'id' in row
                ? { key: stringifyId(row.id) }
                : row
            : { type: 'DATA' };

        /**
         * @template K
         * @param {Map<K, T[]>} lookup
         * @param {K} key
         */
        function addRowRule(lookup, key) {
            if (!lookup.has(key))
                lookup.set(key, []);

            lookup.get(key).push(rule);
        }

        /**
         * @template K
         * @param {Map<K, Lookup<T[]>>} lookup
         * @param {K} key
         */
        function addColumnRule(lookup, key) {
            if (!lookup.has(key))
                lookup.set(key, new Lookup());

            if ('key' in resolvedRow)
                addRowRule(lookup.get(key).byKey, resolvedRow.key);
            else if ('index' in resolvedRow)
                addRowRule(lookup.get(key).byIndex, resolvedRow.index);
            else if ('label' in resolvedRow)
                addRowRule(lookup.get(key).byLabel, resolvedRow.label);
            else for (const type of typeMapping[resolvedRow.type || 'NONE'])
                addRowRule(lookup.get(key).byType, type);
        }

        if ('key' in resolvedColumn)
            addColumnRule(this.lookup.byKey, resolvedColumn.key);
        else if ('index' in resolvedColumn)
            addColumnRule(this.lookup.byIndex, resolvedColumn.index);
        else if ('label' in resolvedColumn)
            addColumnRule(this.lookup.byLabel, resolvedColumn.label);
        else for (const type of typeMapping[resolvedColumn.type || 'NONE'])
            addColumnRule(this.lookup.byType, type);
    }

    /**
     * @param {ResolvedColumn} column
     * @param {ResolvedRow} row
     * @returns {T[]}
     */
    getRules(column, row) {
        /** @type {T[]} */
        const rules = [];

        if (!this.hasRules)
            return rules;

        /**
         * @param {T[]} newRules
         */
        function gatherRules(newRules) {
            for (const rule of newRules)
                rules.push(rule);
        }

        /**
         * @param {Lookup<T[]>} lookup
         */
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