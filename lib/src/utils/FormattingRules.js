import stringifyId from "./stringifyId";

const borderTypes = ['borderTop', 'borderRight', 'borderBottom', 'borderLeft'];

// TODO: Don't recreate styles if they haven't changed
function indexBorders(style, index) {
    const newStyle = { ...style };

    if ('border' in newStyle) {
        for (const borderType of borderTypes)
            newStyle[borderType] = newStyle.border;
        delete newStyle.border;
    }

    for (const borderType of borderTypes)
        if (borderType in newStyle)
            newStyle[borderType] = { ...newStyle[borderType], index };

    return newStyle;
}

function mapFilter(filter) {
    return {
        by: {
            type: filter.by.type,
            key: stringifyId(filter.by.id)
        },
        condition: filter.condition
    };
}

class StyleGroup {
    byKey = new Map();
    byIndex = new Map(); // TODO: Should this be removed?
    byMatch = new Map();
};

const matchMapping = {
    'HEADER': ['HEADER'],
    'FILTER': ['FILTER'],
    'DATA': ['DATA'],
    'ANY': ['HEADER', 'DATA', 'FILTER'],
    undefined: []
};

// TODO: Rename to FormatResolver
// TODO: Optimize by not searching using keys that don't have correlated match rules
// TODO: Accept both a function and an object as a style (where the object is a resolved style)
// TODO: Consider removing index from the lookup
export default class FormattingRules {
    constructor(rules) {
        this.columnLookup = new StyleGroup();
        this.rulesCount = 0;

        for (const rule of rules)
            this.addRule(rule);
    }

    addRule(rule) {
        const columnLookup = this.columnLookup;
        const index = this.rulesCount++;

        const column = 'column' in rule
            ? 'id' in rule.column
                ? { key: stringifyId(rule.column.id) }
                : rule.column
            : { match: 'DATA' };
        const row = 'row' in rule
            ? 'id' in rule.row
                ? { key: stringifyId(rule.row.id) }
                : rule.row
            : { match: 'DATA' };

        const entry = {};
        if ('condition' in rule)
            entry.condition = rule.condition;
        if ('style' in rule)
            entry.style = typeof rule.style === 'function' ? rule.style : () => rule.style;
        if ('value' in rule)
            entry.value = typeof rule.value === 'function' ? rule.value : () => rule.value;
        if ('text' in rule)
            entry.text = typeof rule.text === 'function' ? rule.text : () => rule.text;
        if ('edit' in rule)
            entry.edit = rule.edit;
        if ('draw' in rule)
            entry.draw = rule.draw;
        if ('filter' in rule)
            entry.filter = mapFilter(rule.filter);

        function addRowRule(lookup, key) {
            if (!lookup.has(key))
                lookup.set(key, []);

            lookup.get(key).push({
                index: index,
                ...entry
            });
        }

        function addColumnRule(lookup, key) {
            if (!lookup.has(key))
                lookup.set(key, new StyleGroup());

            if ('key' in row)
                addRowRule(lookup.get(key).byKey, row.key);
            if ('index' in row)
                addRowRule(lookup.get(key).byIndex, row.index);
            for (const match of matchMapping[row.match])
                addRowRule(lookup.get(key).byMatch, match);
        }

        if ('key' in column)
            addColumnRule(columnLookup.byKey, column.key);
        if ('index' in column)
            addColumnRule(columnLookup.byIndex, column.index);
        for (const match of matchMapping[column.match])
            addColumnRule(columnLookup.byMatch, match);
    }

    resolve(data, rows, columns, row, column, edition, filtering) {
        const columnLookup = this.columnLookup;

        const rules = [];

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

        if (columnLookup.byKey.has(column.key))
            gatherRowRules(columnLookup.byKey.get(column.key));
        if (columnLookup.byIndex.has(column.index))
            gatherRowRules(columnLookup.byIndex.get(column.index));
        if (columnLookup.byMatch.has(column.type))
            gatherRowRules(columnLookup.byMatch.get(column.type));

        rules.sort((a, b) => a.index - b.index);

        let context = { data, rows, columns, row, column };
        let style = {};
        let draw = undefined;
        let visible = true;

        if (edition.hasValueByKey(row.key, column.key))
            context = { ...context, newValue: edition.getValueByKey(row.key, column.key) };

        for (const rule of rules) {
            if ('condition' in rule && !rule.condition(context))
                continue;

            if ('value' in rule)
                context = { ...context, value: rule.value(context) };
            if ('style' in rule)
                style = { ...style, ...indexBorders(rule.style(context), rule.index) };
            if ('text' in rule)
                context = { ...context, text: rule.text(context) };
            if ('edit' in rule)
                context = { ...context, edit: rule.edit };
            if ('draw' in rule) {
                const currentContext = context;
                draw = (ctx) => rule.draw({ ...currentContext, ctx });
            }
            if ('filter' in rule && filtering.hasValueByKeyAndSelector(row.key, column.key, rule.filter.by)) {
                const filterContext = { ...context, expression: filtering.getValueByKeyAndSelector(row.key, column.key, rule.filter.by) };
                visible = visible && rule.filter.condition(filterContext);
            }

            // TODO: Add StopPropagation
        }

        const result = {
            style,
            visible
        };

        if ('value' in context)
            result.value = context.value;
        if ('edit' in context)
            result.edit = context.edit;
        if (draw !== undefined)
            result.draw = draw;
        if ('text' in context)
            result.text = context.text;

        return result;
    }
}