import stringifyKey from "./stringifyKey";

const borderTypes = ['borderTop', 'borderRight', 'borderBottom', 'borderLeft'];

function indexBorders(style, index) {
    const newStyle = { ...style };

    for (const borderType of borderTypes) 
        if (borderType in newStyle)
            newStyle[borderType] = { ...newStyle[borderType], index };

    return newStyle;
}

// TODO: Optimize by not searching using keys that don't have correlated match rules
export default class StyleResolver {
    constructor(styles) {
        this.styleLookup = {};

        styles.forEach((style, index) => {
            const column = style.column || { match: 'ANY' };
            const row = style.row || { match: 'ANY' };

            const columnStr = stringifyKey(column);
            const rowStr = stringifyKey(row);
            const cellStr = `${columnStr}:${rowStr}`;

            if (!(cellStr in this.styleLookup))
                this.styleLookup[cellStr] = [];

            this.styleLookup[cellStr].push({
                index,
                condition: style.condition,
                style: style.style
            });
        });
    }

    resolve(columnId, columnIndex, rowId, rowIndex, value) {
        const columnIdStr = stringifyKey({ id: columnId });
        const columnIndexStr = stringifyKey({ index: columnIndex });
        const columnAnyStr = stringifyKey({ match: 'ANY' });
        const columnKeys = [columnIdStr, columnIndexStr, columnAnyStr];

        const rowIdStr = stringifyKey({ id: rowId });
        const rowIndexStr = stringifyKey({ index: rowIndex });
        const rowAnyStr = stringifyKey({ match: 'ANY' });
        const rowKeys = [rowIdStr, rowIndexStr, rowAnyStr];

        const cellKeys = columnKeys.map(columnKey => rowKeys.map(rowKey => `${columnKey}:${rowKey}`)).flat();

        const styles = cellKeys
            .filter(key => key in this.styleLookup)
            .map(key => this.styleLookup[key])
            .flat()
            .filter(style => style.condition(value))
            .sort((a, b) => a.index - b.index)
            .map((style, index) => indexBorders(style.style(value), index));

        const style = styles.reduce((acc, style) => ({ ...acc, ...style }), {});

        return style;
    }
}