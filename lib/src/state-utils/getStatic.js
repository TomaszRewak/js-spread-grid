/**
 * @param {ResolvedDimension[]} elements
 */
function hasDynamicBlocks(elements) {
    return elements.some(element => element.type === 'DYNAMIC-BLOCK');
}

/**
 * @param {MeasuredColumn[]} columns
 * @returns {MeasuredColumn[]}
 */
export function getStaticColumns(columns) {
    if (!hasDynamicBlocks(columns))
        return columns;

    const staticColumns = [];

    for (const column of columns) {
        if (column.type === 'DYNAMIC-BLOCK') {
            staticColumns.push({
                ...column,
            });
            staticColumns.push({
                ...column,
                type: /** @type {DimensionType} */('DATA'),
                id: 123,
                key: '123',
                width: column.columnWidth,
            });
            staticColumns.push({
                ...column,
                type: /** @type {DimensionType} */('DATA'),
                id: 456,
                key: '456',
                width: column.columnWidth,
            });
            staticColumns.push({
                ...column,
            });
        } else {
            staticColumns.push(column);
        }
    }

    return staticColumns;
}

/**
 * @param {MeasuredRow[]} rows
 * @returns {MeasuredRow[]}
 */
export function getStaticRows(rows) {
    if (!hasDynamicBlocks(rows))
        return rows;

    const staticRows = [];

    for (const row of rows) {
        if (row.type === 'DYNAMIC-BLOCK') {
            staticRows.push({
                ...row,
            });
            staticRows.push({
                ...row,
                type: /** @type {DimensionType} */('DATA'),
                id: 123,
                key: '123',
                height: row.rowHeight,
            });
            staticRows.push({
                ...row,
                type: /** @type {DimensionType} */('DATA'),
                id: 456,
                key: '456',
                height: row.rowHeight,
            });
            staticRows.push({
                ...row,
            });
        } else {
            staticRows.push(row);
        }
    }

    return staticRows;
}