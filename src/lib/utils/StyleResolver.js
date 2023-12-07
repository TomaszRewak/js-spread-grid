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
export default class StyleResolver {
    constructor(styles) {
        this.columnLookup = new StyleGroup();

        styles.forEach((style, index) => {
            let column = style.column || { match: 'ANY' };
            let row = style.row || { match: 'ANY' };

            if ('id' in column)
                column = { key: stringifyId(column.id) };

            if ('id' in row)
                row = { key: stringifyId(row.id) };

            function addRowStyles(lookup, key) {
                if (!lookup.has(key))
                    lookup.set(key, []);

                lookup.get(key).push({
                    index,
                    condition: style.condition,
                    style: style.style
                });
            }

            function addColumnStyles(lookup, key) {
                if (!lookup.has(key))
                    lookup.set(key, new StyleGroup());

                if ('key' in row)
                    addRowStyles(lookup.get(key).byKey, row.key);
                if ('index' in row)
                    addRowStyles(lookup.get(key).byIndex, row.index);
                if ('match' in row)
                    addRowStyles(lookup.get(key).byMatch, row.match);
            }

            if ('key' in column)
                addColumnStyles(this.columnLookup.byKey, column.key);
            if ('index' in column)
                addColumnStyles(this.columnLookup.byIndex, column.index);
            if ('match' in column)
                addColumnStyles(this.columnLookup.byMatch, column.match);
        });
    }

    resolve(columnKey, columnIndex, rowKey, rowIndex, value) {
        const columnLookup = this.columnLookup;

        const columnMatch = 'ANY';
        const rowMatch = 'ANY';

        const styles = [];

        function addStyles(newStyles) {
            for (const style of newStyles) 
                if (style.condition(value))
                    styles.push(style);
        }

        function addRowStyles(lookup) {
            if (lookup.byKey.has(rowKey))
                addStyles(lookup.byKey.get(rowKey));
            if (lookup.byIndex.has(rowIndex))
                addStyles(lookup.byIndex.get(rowIndex));
            if (lookup.byMatch.has(rowMatch))
                addStyles(lookup.byMatch.get(rowMatch));
        }

        if (columnLookup.byKey.has(columnKey))
            addRowStyles(columnLookup.byKey.get(columnKey));
        if (columnLookup.byIndex.has(columnIndex))
            addRowStyles(columnLookup.byIndex.get(columnIndex));
        if (columnLookup.byMatch.has(columnMatch))
            addRowStyles(columnLookup.byMatch.get(columnMatch));

        const style = styles
            .sort((a, b) => a.index - b.index)
            .map(style => indexBorders(style.style(value), style.index))
            .reduce((acc, style) => ({ ...acc, ...style }), {});

        return style;
    }
}