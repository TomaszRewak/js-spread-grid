import stringifyKey from "./stringifyKey";

const borderTypes = ['borderTop', 'borderRight', 'borderBottom', 'borderLeft'];

function indexBorders(style, index) {
    const newStyle = { ...style };

    for (const borderType of borderTypes)
        if (borderType in newStyle)
            newStyle[borderType] = { ...newStyle[borderType], index };

    return newStyle;
}

class StyleGroup {
    byId = new Map();
    byIndex = new Map();
    byMatch = new Map();
};

// TODO: Optimize by not searching using keys that don't have correlated match rules
export default class StyleResolver {
    constructor(styles) {
        this.columnLookup = new StyleGroup();

        styles.forEach((style, index) => {
            let column = style.column || { match: 'ANY' };
            let row = style.row || { match: 'ANY' };

            if ('id' in column)
                column = { id: stringifyKey(column.id) };

            if ('id' in row)
                row = { id: stringifyKey(row.id) };

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

                if ('id' in row)
                    addRowStyles(lookup.get(key).byId, row.id);
                if ('index' in row)
                    addRowStyles(lookup.get(key).byIndex, row.index);
                if ('match' in row)
                    addRowStyles(lookup.get(key).byMatch, row.match);
            }

            if ('id' in column)
                addColumnStyles(this.columnLookup.byId, column.id);
            if ('index' in column)
                addColumnStyles(this.columnLookup.byIndex, column.index);
            if ('match' in column)
                addColumnStyles(this.columnLookup.byMatch, column.match);
        });
    }

    resolve(columnId, columnIndex, rowId, rowIndex, value) {
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
            if (lookup.byId.has(rowId))
                addStyles(lookup.byId.get(rowId));
            if (lookup.byIndex.has(rowIndex))
                addStyles(lookup.byIndex.get(rowIndex));
            if (lookup.byMatch.has(rowMatch))
                addStyles(lookup.byMatch.get(rowMatch));
        }

        if (columnLookup.byId.has(columnId))
            addRowStyles(columnLookup.byId.get(columnId));
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