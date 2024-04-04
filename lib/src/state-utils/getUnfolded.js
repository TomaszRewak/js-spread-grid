function getDefaultIds(elements) {
    if (!Array.isArray(elements))
        return Object.keys(elements);

    return elements.map((_, index) => index);
}

function getDefaultRowIds(data) {
    return getDefaultIds(data);
}

function getDefaultColumnIds(data) {
    if (Array.isArray(data)) {
        if (data.length > 0)
            return Object.keys(data[0]);
        return [];
    } else {
        const keys = Object.keys(data);
        if (keys.length > 0)
            return getDefaultIds(data[keys[0]]);
        return [];
    }
}

export function getUnfoldedColumns(columns, data) {
    const hasDataBlocks = columns.some(column => column.type === 'DATA-BLOCK');

    if (!hasDataBlocks)
        return columns;

    const unfoldedColumns = [];

    for (const column of columns) {
        if (column.type === 'DATA-BLOCK') {
            const ids = 'selector' in column
                ? column.selector(data)
                : getDefaultColumnIds(data);

            for (const id of ids) {
                unfoldedColumns.push({
                    ...column,
                    id,
                    type: 'DATA'
                });
            }
        } else {
            unfoldedColumns.push(column);
        }
    }

    return unfoldedColumns;
}

export function getUnfoldedRows(rows, data) {
    const hasDataBlocks = rows.some(row => row.type === 'DATA-BLOCK');

    if (!hasDataBlocks)
        return rows;

    const unfoldedRows = [];

    for (const row of rows) {
        if (row.type === 'DATA-BLOCK') {
            const ids = 'selector' in row
                ? row.selector(data)
                : getDefaultRowIds(data);

            for (const id of ids) {
                unfoldedRows.push({
                    ...row,
                    id,
                    type: 'DATA'
                });
            }
        } else {
            unfoldedRows.push(row);
        }
    }

    return unfoldedRows;
}