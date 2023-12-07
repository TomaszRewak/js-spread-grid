import stringifyId from "./stringifyId";

const borderTypes = ['borderTop', 'borderRight', 'borderBottom', 'borderLeft'];

function indexBorders(style, index) {
    const newStyle = { ...style };

    for (const borderType of borderTypes)
        if (borderType in newStyle)
            newStyle[borderType] = { ...newStyle[borderType], index };

    return newStyle;
}

class StyleGroup {
    byKey = new Map();
    byIndex = new Map();
    byMatch = new Map();
};

// TODO: Rename to FormatResolver
// TODO: Optimize by not searching using keys that don't have correlated match rules
// TODO: Accept both a function and an object as a style (where the object is a resolved style)
export default class FormattingResolver {
    constructor(rules) {
        this.columnLookup = new StyleGroup();

        rules.forEach((style, index) => {
            let column = style.column || { match: 'ANY' };
            let row = style.row || { match: 'ANY' };

            if ('id' in column)
                column = { key: stringifyId(column.id) };

            if ('id' in row)
                row = { key: stringifyId(row.id) };

            function addRowRule(lookup, key) {
                if (!lookup.has(key))
                    lookup.set(key, []);

                lookup.get(key).push({
                    index,
                    condition: style.condition,
                    style: style.style
                });
            }

            function addColumnRule(lookup, key) {
                if (!lookup.has(key))
                    lookup.set(key, new StyleGroup());

                if ('key' in row)
                    addRowRule(lookup.get(key).byKey, row.key);
                if ('index' in row)
                    addRowRule(lookup.get(key).byIndex, row.index);
                if ('match' in row)
                    addRowRule(lookup.get(key).byMatch, row.match);
            }

            if ('key' in column)
                addColumnRule(this.columnLookup.byKey, column.key);
            if ('index' in column)
                addColumnRule(this.columnLookup.byIndex, column.index);
            if ('match' in column)
                addColumnRule(this.columnLookup.byMatch, column.match);
        });
    }

    resolve(columnKey, columnIndex, rowKey, rowIndex, value) {
        const columnLookup = this.columnLookup;

        const columnMatch = 'ANY';
        const rowMatch = 'ANY';

        const rules = [];

        function addRules(newRules) {
            for (const rule of newRules) 
                if (rule.condition(value))
                    rules.push(rule);
        }

        function addRowRules(lookup) {
            if (lookup.byKey.has(rowKey))
                addRules(lookup.byKey.get(rowKey));
            if (lookup.byIndex.has(rowIndex))
                addRules(lookup.byIndex.get(rowIndex));
            if (lookup.byMatch.has(rowMatch))
                addRules(lookup.byMatch.get(rowMatch));
        }

        if (columnLookup.byKey.has(columnKey))
            addRowRules(columnLookup.byKey.get(columnKey));
        if (columnLookup.byIndex.has(columnIndex))
            addRowRules(columnLookup.byIndex.get(columnIndex));
        if (columnLookup.byMatch.has(columnMatch))
            addRowRules(columnLookup.byMatch.get(columnMatch));

        const style = rules
            .sort((a, b) => a.index - b.index)
            .map(rule => indexBorders(rule.style(value), rule.index))
            .reduce((acc, style) => ({ ...acc, ...style }), {});

        return style;
    }
}